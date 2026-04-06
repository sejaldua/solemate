"""
SoleMate Evaluation Framework

Offline evaluation of the recommendation system using:
  1. Leave-one-out test: Does a user who perfectly wants shoe X get X ranked #1?
  2. Synthetic ground truth: Mine expert verdicts for use-case labels, measure NDCG.
  3. Diversity & coverage metrics.

Usage:
    cd pipeline
    python evaluate.py
"""

import json
import math
import re
import numpy as np
from collections import Counter

# ──────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────

DATA_DIR = "../public/data"

FEATURE_KEYS = [
    "weight", "stack_height", "drop", "midsole_softness",
    "flexibility", "width", "energy_return", "traction",
]

# Archetype weight vectors (mirrors archetype.ts)
ARCHETYPE_WEIGHTS = {
    "cushion_chaser": {"weight": 1, "stack_height": 3, "drop": 1, "midsole_softness": 3,
                       "flexibility": 1, "width": 1, "energy_return": 2, "traction": 1},
    "speed_demon":    {"weight": 3, "stack_height": 1, "drop": 1, "midsole_softness": 1,
                       "flexibility": 2, "width": 1, "energy_return": 3, "traction": 1},
    "injury_guardian": {"weight": 1, "stack_height": 2, "drop": 2, "midsole_softness": 2,
                        "flexibility": 1, "width": 2, "energy_return": 1, "traction": 1},
    "trail_explorer":  {"weight": 1, "stack_height": 1, "drop": 1, "midsole_softness": 1,
                        "flexibility": 1, "width": 2, "energy_return": 1, "traction": 3},
    "all_rounder":     {"weight": 1, "stack_height": 1, "drop": 1, "midsole_softness": 1,
                        "flexibility": 1, "width": 1, "energy_return": 1, "traction": 1},
}

# Use-case keyword patterns for synthetic ground truth
USE_CASE_PATTERNS = {
    "speed":    ["speed", "fast", "race", "racing", "tempo", "pr ", "lightweight racer", "carbon"],
    "cushion":  ["cushion", "plush", "soft", "comfort", "padding", "cloud"],
    "long_run": ["marathon", "long run", "long distance", "long-distance", "endurance", "ultra"],
    "daily":    ["daily", "everyday", "versatile", "all-around", "workhorse", "daily trainer"],
    "trail":    ["trail", "grip", "off-road", "terrain", "mud", "traction"],
    "stability":["stability", "support", "overpronation", "motion control", "structured"],
}


# ──────────────────────────────────────────────
# Scoring (Python mirror of scoring.ts)
# ──────────────────────────────────────────────


def score_shoe(shoe_features, pref_features, weights, shoe_terrain, user_terrain):
    """Score a single shoe. Returns float in [0, 1]."""
    # Weighted feature similarity
    feature_score = 0.0
    total_weight = 0.0
    for f in FEATURE_KEYS:
        diff = abs(shoe_features[f] - pref_features[f])
        match = 1.0 - diff
        w = weights[f]
        feature_score += w * match
        total_weight += w
    feature_score /= total_weight

    # Terrain gate
    terrain_match = 1.0
    if user_terrain == "trail" and shoe_terrain != "trail":
        terrain_match = 0.3
    elif user_terrain == "road" and shoe_terrain != "road":
        terrain_match = 0.4

    # Price factor (not used in evaluation — treat all equally)
    return feature_score * terrain_match


def rank_shoes(shoes, pref_features, weights, user_terrain):
    """Score and rank all shoes. Returns list of (shoe, score) sorted desc."""
    scored = []
    for shoe in shoes:
        s = score_shoe(
            shoe["features"], pref_features, weights,
            shoe["tags"]["terrain"], user_terrain,
        )
        scored.append((shoe, s))
    scored.sort(key=lambda x: -x[1])
    return scored


# ──────────────────────────────────────────────
# Synthetic ground truth
# ──────────────────────────────────────────────


def extract_use_case_labels(details):
    """Parse verdicts + pros to extract use-case relevance labels per shoe."""
    labels = {}
    for shoe_id, d in details.items():
        text = (d.get("verdict", "") + " " + " ".join(d.get("pros", []))).lower()
        shoe_labels = []
        for use_case, keywords in USE_CASE_PATTERNS.items():
            if any(kw in text for kw in keywords):
                shoe_labels.append(use_case)
        labels[shoe_id] = shoe_labels
    return labels


def use_case_to_archetype(use_case):
    """Map a use-case label to the most relevant archetype."""
    mapping = {
        "speed": "speed_demon",
        "cushion": "cushion_chaser",
        "long_run": "cushion_chaser",
        "daily": "all_rounder",
        "trail": "trail_explorer",
        "stability": "injury_guardian",
    }
    return mapping.get(use_case, "all_rounder")


# ──────────────────────────────────────────────
# Metrics
# ──────────────────────────────────────────────


def ndcg_at_k(relevance_scores, k):
    """Compute NDCG@k given a list of binary relevance scores."""
    dcg = sum(rel / math.log2(i + 2) for i, rel in enumerate(relevance_scores[:k]))
    ideal = sorted(relevance_scores, reverse=True)
    idcg = sum(rel / math.log2(i + 2) for i, rel in enumerate(ideal[:k]))
    return dcg / idcg if idcg > 0 else 0.0


def intra_list_diversity(ranked_shoes, k):
    """Mean pairwise Euclidean distance in feature space among top-k."""
    top_k = ranked_shoes[:k]
    if len(top_k) < 2:
        return 0.0
    distances = []
    for i in range(len(top_k)):
        for j in range(i + 1, len(top_k)):
            d = sum(
                (top_k[i]["features"][f] - top_k[j]["features"][f]) ** 2
                for f in FEATURE_KEYS
            )
            distances.append(math.sqrt(d))
    return sum(distances) / len(distances)


def cluster_coverage(ranked_shoes, assignments, k):
    """Fraction of distinct clusters represented in top-k."""
    top_ids = [s["id"] for s in ranked_shoes[:k]]
    clusters_seen = set(assignments[sid] for sid in top_ids if sid in assignments)
    total_clusters = len(set(assignments.values()))
    return len(clusters_seen) / total_clusters if total_clusters > 0 else 0.0


# ──────────────────────────────────────────────
# Evaluation routines
# ──────────────────────────────────────────────


def leave_one_out_test(shoes, archetype="all_rounder"):
    """
    For each shoe, create a synthetic user whose preference = that shoe's features.
    The system should rank that shoe #1 (or near it).
    """
    weights = ARCHETYPE_WEIGHTS[archetype]
    ranks = []
    for target in shoes:
        fake_prefs = target["features"]
        terrain = target["tags"]["terrain"]
        ranked = rank_shoes(shoes, fake_prefs, weights, terrain)
        rank = next(i for i, (s, _) in enumerate(ranked) if s["id"] == target["id"])
        ranks.append(rank)

    ranks = np.array(ranks)
    return {
        "mean_rank": round(float(ranks.mean()), 2),
        "median_rank": int(np.median(ranks)),
        "hit_rate@1": round(float((ranks == 0).mean()), 4),
        "hit_rate@3": round(float((ranks < 3).mean()), 4),
        "hit_rate@5": round(float((ranks < 5).mean()), 4),
        "hit_rate@10": round(float((ranks < 10).mean()), 4),
        "worst_rank": int(ranks.max()),
    }


def synthetic_ground_truth_test(shoes, details, assignments):
    """
    For each use-case archetype, rank shoes and measure NDCG against
    expert-verdict-derived relevance labels.
    """
    use_case_labels = extract_use_case_labels(details)

    # Count label distribution
    all_labels = [l for labels in use_case_labels.values() for l in labels]
    label_counts = Counter(all_labels)
    print(f"\n  Use-case label distribution:")
    for uc, count in label_counts.most_common():
        print(f"    {uc}: {count} shoes")

    results = {}
    for use_case in USE_CASE_PATTERNS:
        archetype = use_case_to_archetype(use_case)
        weights = ARCHETYPE_WEIGHTS[archetype]

        # Build a preference vector that strongly wants this use-case
        # Use the centroid of all shoes labeled with this use-case
        labeled_shoes = [
            s for s in shoes if use_case in use_case_labels.get(s["id"], [])
        ]
        if len(labeled_shoes) < 5:
            results[use_case] = {"skipped": True, "reason": f"only {len(labeled_shoes)} labeled shoes"}
            continue

        # Average features of labeled shoes = synthetic preference
        pref = {}
        for f in FEATURE_KEYS:
            pref[f] = sum(s["features"][f] for s in labeled_shoes) / len(labeled_shoes)

        # Determine terrain
        terrain_counts = Counter(s["tags"]["terrain"] for s in labeled_shoes)
        user_terrain = terrain_counts.most_common(1)[0][0] if use_case == "trail" else "road"

        # Rank all shoes
        ranked = rank_shoes(shoes, pref, weights, user_terrain)
        ranked_shoes_only = [s for s, _ in ranked]
        ranked_ids = [s["id"] for s in ranked_shoes_only]

        # Binary relevance: 1 if shoe has this use-case label
        relevance = [1 if use_case in use_case_labels.get(sid, []) else 0 for sid in ranked_ids]

        results[use_case] = {
            "n_relevant": len(labeled_shoes),
            "ndcg@10": round(ndcg_at_k(relevance, 10), 4),
            "ndcg@20": round(ndcg_at_k(relevance, 20), 4),
            "precision@10": round(sum(relevance[:10]) / 10, 4),
            "precision@20": round(sum(relevance[:20]) / 20, 4),
            "diversity@10": round(intra_list_diversity(ranked_shoes_only, 10), 4),
            "coverage@20": round(cluster_coverage(ranked_shoes_only, assignments, 20), 4),
        }

    return results


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────


def main():
    print("=" * 60)
    print("SoleMate Evaluation Framework")
    print("=" * 60)

    # Load processed data
    print("\n> Loading processed data...")
    with open(f"{DATA_DIR}/shoes.json") as f:
        shoes = json.load(f)
    with open(f"{DATA_DIR}/shoes-detail.json") as f:
        details = json.load(f)
    with open(f"{DATA_DIR}/clusters.json") as f:
        clusters = json.load(f)
    print(f"  {len(shoes)} shoes, {clusters['k']} clusters")

    # ── Test 1: Leave-one-out ──
    print("\n> Running leave-one-out test (all_rounder weights)...")
    loo_results = leave_one_out_test(shoes, "all_rounder")
    print(f"\n  Leave-One-Out Results:")
    for key, val in loo_results.items():
        print(f"    {key}: {val}")

    # Run LOO for each archetype
    print("\n> Leave-one-out by archetype:")
    for arch in ARCHETYPE_WEIGHTS:
        r = leave_one_out_test(shoes, arch)
        print(f"  {arch:20s}  hit@1={r['hit_rate@1']:.2%}  hit@5={r['hit_rate@5']:.2%}  mean_rank={r['mean_rank']}")

    # ── Test 2: Synthetic ground truth ──
    print("\n> Running synthetic ground truth test (NDCG from expert verdicts)...")
    sgt_results = synthetic_ground_truth_test(shoes, details, clusters["assignments"])
    print(f"\n  Synthetic Ground Truth Results:")
    for use_case, metrics in sgt_results.items():
        if metrics.get("skipped"):
            print(f"    {use_case:12s}  SKIPPED ({metrics['reason']})")
        else:
            print(
                f"    {use_case:12s}  "
                f"ndcg@10={metrics['ndcg@10']:.3f}  "
                f"ndcg@20={metrics['ndcg@20']:.3f}  "
                f"p@10={metrics['precision@10']:.3f}  "
                f"div@10={metrics['diversity@10']:.3f}  "
                f"cov@20={metrics['coverage@20']:.1%}"
            )

    # ── Save results ──
    results_out = {
        "leave_one_out": {
            "all_rounder": loo_results,
            "by_archetype": {
                arch: leave_one_out_test(shoes, arch)
                for arch in ARCHETYPE_WEIGHTS
            },
        },
        "synthetic_ground_truth": sgt_results,
    }
    out_path = f"{DATA_DIR}/../eval_results.json"
    with open(out_path, "w") as f:
        json.dump(results_out, f, indent=2)
    print(f"\n  Saved full results → {out_path}")

    print(f"\n{'=' * 60}")
    print("Evaluation complete.")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
