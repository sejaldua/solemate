"""
SoleMate Data Pipeline
Transforms raw RunRepeat scraped data into normalized, embedded, clustered JSON files
for the frontend recommendation engine.

Upgrades over v1:
  - QuantileTransformer (uniform) instead of MinMaxScaler
  - Polynomial interaction features for UMAP input (8D → 36D)
  - HDBSCAN for natural cluster discovery (optional, falls back to silhouette search)
  - Silhouette analysis to validate cluster count
  - Gaussian Mixture Model for soft cluster membership probabilities
  - k-NN similarity graph export

Usage:
    cd pipeline
    python prepare_data.py
"""

import json
import re
import os
import numpy as np
import pandas as pd
from sklearn.preprocessing import QuantileTransformer, PolynomialFeatures
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score
from sklearn.neighbors import NearestNeighbors
from umap import UMAP

try:
    from hdbscan import HDBSCAN

    HAS_HDBSCAN = True
except ImportError:
    HAS_HDBSCAN = False

# ──────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────

RAW_FILE = "../shoes.json"
OUTPUT_DIR = "../public/data"
UMAP_NEIGHBORS = 15
UMAP_MIN_DIST = 0.1
RANDOM_STATE = 42
SIMILARITY_K = 6  # neighbors per shoe in similarity graph
HDBSCAN_MIN_CLUSTER = 15
HDBSCAN_MIN_SAMPLES = 5
SILHOUETTE_SEARCH_MIN = 3
SILHOUETTE_SEARCH_MAX = 12

FEATURE_COLS = [
    "weight",
    "stack_height",
    "drop",
    "midsole_softness",
    "flexibility",
    "width",
    "energy_return",
    "traction",
]

# Features where lower raw value = "more" of the quality
# (lower HA = softer, lower N = more flexible)
INVERT_FEATURES = ["midsole_softness", "flexibility"]

# ──────────────────────────────────────────────
# Parsing helpers
# ──────────────────────────────────────────────


def parse_weight_grams(val: str) -> float | None:
    """Parse weight like '8.8 oz (249g)' → 249.0"""
    if not val:
        return None
    m = re.search(r"\((\d+\.?\d*)g\)", val)
    if m:
        return float(m.group(1))
    m = re.search(r"([\d.]+)\s*oz", val)
    if m:
        return float(m.group(1)) * 28.3495
    m = re.search(r"([\d.]+)\s*g", val)
    if m:
        return float(m.group(1))
    return None


def parse_mm(val: str) -> float | None:
    """Parse mm value like '32.7 mm' → 32.7"""
    if not val:
        return None
    m = re.search(r"([\d.]+)\s*mm", val)
    return float(m.group(1)) if m else None


def parse_ha(val: str) -> float | None:
    """Parse hardness like '20.4 HA' → 20.4"""
    if not val:
        return None
    m = re.search(r"([\d.]+)\s*HA", val)
    return float(m.group(1)) if m else None


def parse_newtons(val: str) -> float | None:
    """Parse stiffness like '17.7N' → 17.7"""
    if not val:
        return None
    m = re.search(r"([\d.]+)\s*N", val)
    return float(m.group(1)) if m else None


def parse_percent(val: str) -> float | None:
    """Parse percentage like '53.0%' → 53.0"""
    if not val:
        return None
    m = re.search(r"([\d.]+)\s*%", val)
    return float(m.group(1)) if m else None


def parse_float(val: str) -> float | None:
    """Parse a bare float like '0.33' → 0.33"""
    if not val:
        return None
    m = re.search(r"([\d.]+)", val)
    return float(m.group(1)) if m else None


def parse_price(val: str) -> float | None:
    """Parse price like '$160' → 160.0"""
    if not val:
        return None
    m = re.search(r"[\$]?([\d,.]+)", val)
    if m:
        return float(m.group(1).replace(",", ""))
    return None


def slugify(name: str) -> str:
    """Convert shoe name to URL-safe slug."""
    s = name.lower().strip()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


# ──────────────────────────────────────────────
# Extract features from a single shoe
# ──────────────────────────────────────────────


def extract_features(shoe: dict) -> dict | None:
    """Extract numeric features from raw shoe data. Returns None if insufficient data."""
    lab = shoe.get("lab_results", {})

    weight = parse_weight_grams(lab.get("Weight", ""))
    stack_height = parse_mm(lab.get("Heel stack", ""))
    drop = parse_mm(lab.get("Drop", ""))
    midsole_softness = parse_ha(lab.get("Midsole softness", ""))
    flexibility = parse_newtons(lab.get("Flexibility / Stiffness (new method)", ""))
    width = parse_mm(lab.get("Width / Fit (new method)", ""))
    energy_return = parse_percent(lab.get("Energy return heel", ""))
    traction = parse_float(lab.get("Forefoot traction", ""))
    price = parse_price(lab.get("Price", ""))

    # Require at least the core 5 features
    required = [weight, stack_height, drop, midsole_softness, flexibility]
    if any(v is None for v in required):
        return None

    return {
        "weight": weight,
        "stack_height": stack_height,
        "drop": drop,
        "midsole_softness": midsole_softness,
        "flexibility": flexibility,
        "width": width,
        "energy_return": energy_return,
        "traction": traction,
        "price": price,
    }


def derive_tags(shoe: dict) -> dict:
    """Derive terrain and stability tags from metadata."""
    terrain = (shoe.get("terrain") or "road").lower()
    if terrain not in ("road", "trail"):
        terrain = "road"

    pronation = (shoe.get("pronation") or "").lower()
    arch = (shoe.get("arch_support") or "").lower()
    stability = "neutral"
    if "stability" in pronation or "overpronation" in pronation:
        stability = "stability"
    elif "stability" in arch:
        stability = "stability"

    return {"terrain": terrain, "stability": stability}


def derive_category(shoe: dict) -> str:
    """Derive shoe category from use/features metadata."""
    use = (shoe.get("use") or "").lower()
    features = (shoe.get("features") or "").lower()
    terrain = (shoe.get("terrain") or "").lower()

    if terrain == "trail":
        return "trail"
    if "triathlon" in use or "carbon" in features:
        return "racing"
    if "treadmill" in use and "jogging" in use:
        return "daily_trainer"
    if "walking" in use or "all-day" in use:
        return "daily_trainer"
    return "daily_trainer"


# ──────────────────────────────────────────────
# Cluster labeling
# ──────────────────────────────────────────────


def label_clusters(centroids: np.ndarray, feature_names: list[str]) -> dict[str, str]:
    """Assign unique human-readable labels based on each cluster's most distinctive trait."""
    candidate_labels = [
        lambda p: p["traction"] > 0.6 and p["width"] > 0.5, "Trail Grip Specialists",
        lambda p: p["weight"] > 0.7 and p["energy_return"] > 0.55, "Lightweight Racers",
        lambda p: p["stack_height"] > 0.7 and p["midsole_softness"] > 0.6, "Max Cushion",
        lambda p: p["energy_return"] > 0.6 and p["flexibility"] > 0.5, "Energy Returners",
        lambda p: p["midsole_softness"] > 0.6 and p["stack_height"] < 0.5, "Plush Low-Profile",
        lambda p: p["weight"] > 0.55 and p["flexibility"] > 0.55, "Speed Trainers",
        lambda p: p["drop"] > 0.6 and p["midsole_softness"] > 0.5, "High-Drop Cushioned",
        lambda p: p["width"] > 0.6, "Wide-Fit Workhorses",
        lambda p: p["stack_height"] > 0.55 and p["midsole_softness"] > 0.45, "Cushioned Daily Trainers",
        lambda p: p["flexibility"] > 0.5 and p["weight"] > 0.45, "Responsive Tempo",
        lambda p: p["drop"] < 0.35, "Low-Drop Natural",
        lambda p: True, "Versatile All-Rounders",
    ]

    rules = []
    for i in range(0, len(candidate_labels), 2):
        rules.append((candidate_labels[i], candidate_labels[i + 1]))

    labels = {}
    used = set()
    for i, centroid in enumerate(centroids):
        profile = dict(zip(feature_names, centroid))
        assigned = False
        for condition_fn, label in rules:
            if label not in used and condition_fn(profile):
                labels[str(i)] = label
                used.add(label)
                assigned = True
                break
        if not assigned:
            best_feat = max(feature_names, key=lambda f: abs(profile[f] - 0.5))
            fallback = f"{best_feat.replace('_', ' ').title()} Focused"
            labels[str(i)] = fallback

    return labels


# ──────────────────────────────────────────────
# Main pipeline
# ──────────────────────────────────────────────


def main():
    print("=" * 60)
    print("SoleMate Data Pipeline v2")
    print("=" * 60)

    # ── Load ──
    print("\n> Loading raw shoe data...")
    with open(RAW_FILE, "r") as f:
        raw = json.load(f)
    print(f"  Loaded {len(raw)} shoes")

    # ── Extract features ──
    print("> Extracting features...")
    shoes = []
    for name, shoe in raw.items():
        feats = extract_features(shoe)
        if feats is None:
            continue
        shoes.append(
            {
                "id": slugify(name),
                "name": name,
                "brand": shoe.get("brand", "Unknown"),
                "model": name,
                "category": derive_category(shoe),
                "price": feats.pop("price"),
                "raw_features": feats,
                "tags": derive_tags(shoe),
                "verdict": shoe.get("verdict", ""),
                "pros": shoe.get("pros", []),
                "cons": shoe.get("cons", []),
                "image_url": shoe.get("main_image", ""),
                "url": shoe.get("url", ""),
            }
        )
    print(f"  {len(shoes)} shoes with sufficient lab data")

    # ── Build feature matrix ──
    print("> Building feature matrix...")
    feature_matrix_raw = []
    for shoe in shoes:
        row = []
        for col in FEATURE_COLS:
            val = shoe["raw_features"].get(col)
            row.append(val if val is not None else np.nan)
        feature_matrix_raw.append(row)

    df_features = pd.DataFrame(feature_matrix_raw, columns=FEATURE_COLS)

    # Fill missing optional features with median
    for col in FEATURE_COLS:
        median = df_features[col].median()
        df_features[col] = df_features[col].fillna(median)

    # Store raw ranges before normalization
    feature_ranges = {}
    units = {
        "weight": "g",
        "stack_height": "mm",
        "drop": "mm",
        "midsole_softness": "HA",
        "flexibility": "N",
        "width": "mm",
        "energy_return": "%",
        "traction": "score",
    }
    for col in FEATURE_COLS:
        feature_ranges[col] = {
            "min": round(float(df_features[col].min()), 1),
            "max": round(float(df_features[col].max()), 1),
            "unit": units.get(col, ""),
        }

    # ── UPGRADE 1: QuantileTransformer ──
    # Forces uniform distribution across [0, 1] regardless of original shape.
    # A 0.1 difference now means the same percentile gap on every feature axis.
    print("> Normalizing features (QuantileTransformer, uniform)...")
    scaler = QuantileTransformer(
        output_distribution="uniform", random_state=RANDOM_STATE
    )
    normalized = scaler.fit_transform(df_features.values)
    df_norm = pd.DataFrame(normalized, columns=FEATURE_COLS)

    # Invert features where lower raw value = "more" of the quality
    for col in INVERT_FEATURES:
        df_norm[col] = 1.0 - df_norm[col]

    # Attach normalized features to shoes
    for i, shoe in enumerate(shoes):
        shoe["features"] = {
            col: round(float(df_norm.iloc[i][col]), 4) for col in FEATURE_COLS
        }
        del shoe["raw_features"]

    # ── UPGRADE 10: Polynomial interaction features for UMAP ──
    # 8 base features → 36D (8 originals + 28 pairwise interactions)
    # Captures non-linear relationships (heavy+soft = recovery, light+stiff = racer)
    print("> Computing polynomial interaction features for UMAP...")
    poly = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
    features_expanded = poly.fit_transform(df_norm.values)
    print(
        f"  Expanded {len(FEATURE_COLS)} features → {features_expanded.shape[1]}D "
        f"(+{features_expanded.shape[1] - len(FEATURE_COLS)} pairwise interactions)"
    )

    # ── UMAP on expanded features ──
    print("> Computing UMAP embeddings (on interaction features)...")
    reducer = UMAP(
        n_components=2,
        n_neighbors=UMAP_NEIGHBORS,
        min_dist=UMAP_MIN_DIST,
        random_state=RANDOM_STATE,
        metric="euclidean",
    )
    embeddings_2d = reducer.fit_transform(features_expanded)

    coordinates = {}
    for i, shoe in enumerate(shoes):
        coordinates[shoe["id"]] = [
            round(float(embeddings_2d[i, 0]), 4),
            round(float(embeddings_2d[i, 1]), 4),
        ]

    # ── UPGRADE 9: HDBSCAN for natural cluster discovery ──
    n_natural = 6  # fallback
    if HAS_HDBSCAN:
        print("> Discovering natural cluster structure (HDBSCAN)...")
        hdb = HDBSCAN(
            min_cluster_size=HDBSCAN_MIN_CLUSTER,
            min_samples=HDBSCAN_MIN_SAMPLES,
            metric="euclidean",
        )
        hdb_labels = hdb.fit_predict(df_norm.values)
        n_natural = len(set(hdb_labels)) - (1 if -1 in hdb_labels else 0)
        n_noise = int((hdb_labels == -1).sum())
        print(f"  HDBSCAN found {n_natural} natural clusters, {n_noise} noise points")
    else:
        print(
            "> HDBSCAN not installed (pip install hdbscan), "
            "defaulting to silhouette-only search"
        )

    # ── UPGRADE 3: Silhouette validation ──
    # Search around HDBSCAN's estimate to find the best k
    print("> Validating cluster count with silhouette analysis...")
    search_lo = max(SILHOUETTE_SEARCH_MIN, n_natural - 2)
    search_hi = min(SILHOUETTE_SEARCH_MAX, n_natural + 4)
    sil_scores = []
    for k in range(search_lo, search_hi + 1):
        km = KMeans(n_clusters=k, n_init=10, random_state=RANDOM_STATE)
        labs = km.fit_predict(df_norm.values)
        sil = silhouette_score(df_norm.values, labs)
        sil_scores.append((k, round(float(sil), 4)))
        print(f"  k={k}: silhouette={sil:.4f}")

    best_k, best_sil = max(sil_scores, key=lambda x: x[1])
    print(f"  → Best k={best_k} (silhouette={best_sil})")

    N_CLUSTERS = best_k

    # ── UPGRADE 6: Gaussian Mixture Model for soft cluster membership ──
    # GMM gives P(cluster | shoe) instead of hard assignments.
    # "This shoe is 65% Max Cushion, 25% Daily Trainer" > a single label.
    print(f"> Fitting Gaussian Mixture Model (k={N_CLUSTERS})...")
    gmm = GaussianMixture(
        n_components=N_CLUSTERS,
        covariance_type="full",
        n_init=5,
        random_state=RANDOM_STATE,
    )
    gmm.fit(df_norm.values)
    cluster_labels = gmm.predict(df_norm.values)
    cluster_probs = gmm.predict_proba(df_norm.values)

    # GMM component means serve as interpretable centroids for labeling
    gmm_centers = gmm.means_

    # Project cluster centers into 2D embedding space
    centroid_coords = {}
    for c in range(N_CLUSTERS):
        mask = cluster_labels == c
        if mask.sum() == 0:
            continue
        cluster_embeddings = embeddings_2d[mask]
        center = cluster_embeddings.mean(axis=0)
        centroid_coords[str(c)] = [
            round(float(center[0]), 4),
            round(float(center[1]), 4),
        ]

    assignments = {}
    probabilities = {}
    for i, shoe in enumerate(shoes):
        assignments[shoe["id"]] = int(cluster_labels[i])
        probabilities[shoe["id"]] = [round(float(p), 4) for p in cluster_probs[i]]

    # Label clusters using GMM component means
    cluster_label_names = label_clusters(gmm_centers, FEATURE_COLS)

    # ── UPGRADE 8: k-NN similarity graph ──
    print(f"> Building similarity graph (k={SIMILARITY_K})...")
    nn = NearestNeighbors(n_neighbors=SIMILARITY_K + 1, metric="euclidean")
    nn.fit(df_norm.values)
    nn_distances, nn_indices = nn.kneighbors()

    similarity_graph = {}
    for i, shoe in enumerate(shoes):
        neighbors = []
        for j in range(1, SIMILARITY_K + 1):  # skip self at index 0
            neighbor_shoe = shoes[nn_indices[i][j]]
            neighbors.append(
                {
                    "id": neighbor_shoe["id"],
                    "distance": round(float(nn_distances[i][j]), 4),
                }
            )
        similarity_graph[shoe["id"]] = neighbors

    # Compute embedding bounds
    x_vals = [c[0] for c in coordinates.values()]
    y_vals = [c[1] for c in coordinates.values()]
    embedding_bounds = {
        "x": [round(min(x_vals) - 1, 2), round(max(x_vals) + 1, 2)],
        "y": [round(min(y_vals) - 1, 2), round(max(y_vals) + 1, 2)],
    }

    # ──────────────────────────────────────────
    # Export
    # ──────────────────────────────────────────
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # shoes.json (slim — loaded on every page)
    shoes_out = []
    details_out = {}
    for shoe in shoes:
        shoes_out.append(
            {
                "id": shoe["id"],
                "brand": shoe["brand"],
                "model": shoe["model"],
                "category": shoe["category"],
                "price": shoe["price"],
                "features": shoe["features"],
                "tags": shoe["tags"],
                "image_url": shoe["image_url"],
            }
        )
        details_out[shoe["id"]] = {
            "verdict": shoe["verdict"],
            "pros": shoe["pros"],
            "cons": shoe["cons"],
            "url": shoe["url"],
        }

    shoes_path = os.path.join(OUTPUT_DIR, "shoes.json")
    with open(shoes_path, "w") as f:
        json.dump(shoes_out, f)
    print(f"\n  Wrote {len(shoes_out)} shoes → {shoes_path}")

    # shoes-detail.json (verdict/pros/cons — lazy-loaded)
    detail_path = os.path.join(OUTPUT_DIR, "shoes-detail.json")
    with open(detail_path, "w") as f:
        json.dump(details_out, f)
    print(f"  Wrote details → {detail_path}")

    # embeddings.json
    embeddings_out = {
        "method": "umap",
        "input_dim": int(features_expanded.shape[1]),
        "coordinates": coordinates,
    }
    emb_path = os.path.join(OUTPUT_DIR, "embeddings.json")
    with open(emb_path, "w") as f:
        json.dump(embeddings_out, f)
    print(f"  Wrote embeddings → {emb_path}")

    # clusters.json — now includes GMM probabilities
    clusters_out = {
        "k": N_CLUSTERS,
        "method": "gmm",
        "silhouette_score": best_sil,
        "silhouette_scores": sil_scores,
        "hdbscan_natural_k": n_natural if HAS_HDBSCAN else None,
        "labels": cluster_label_names,
        "assignments": assignments,
        "probabilities": probabilities,
        "centroids": centroid_coords,
    }
    clusters_path = os.path.join(OUTPUT_DIR, "clusters.json")
    with open(clusters_path, "w") as f:
        json.dump(clusters_out, f)
    print(f"  Wrote clusters → {clusters_path}")

    # graph.json — k-NN similarity graph
    graph_path = os.path.join(OUTPUT_DIR, "graph.json")
    with open(graph_path, "w") as f:
        json.dump(similarity_graph, f)
    print(f"  Wrote similarity graph → {graph_path}")

    # meta.json — enriched with pipeline metadata
    meta_out = {
        "shoe_count": len(shoes_out),
        "feature_names": FEATURE_COLS,
        "feature_ranges": feature_ranges,
        "embedding_bounds": embedding_bounds,
        "clustering": {
            "method": "gmm",
            "k": N_CLUSTERS,
            "silhouette_score": best_sil,
            "hdbscan_natural_k": n_natural if HAS_HDBSCAN else None,
        },
        "embedding": {
            "method": "umap",
            "input_dim": int(features_expanded.shape[1]),
            "interaction_features": True,
        },
        "normalization": {
            "method": "quantile_uniform",
            "inverted_features": INVERT_FEATURES,
        },
    }
    meta_path = os.path.join(OUTPUT_DIR, "meta.json")
    with open(meta_path, "w") as f:
        json.dump(meta_out, f)
    print(f"  Wrote meta → {meta_path}")

    # ── Summary ──
    print(f"\n{'=' * 60}")
    print(f"Pipeline complete. {len(shoes_out)} shoes processed.")
    print(f"{'=' * 60}")
    print(f"  Normalization: QuantileTransformer (uniform)")
    print(f"  UMAP input: {features_expanded.shape[1]}D (8 base + {features_expanded.shape[1]-8} interactions)")
    if HAS_HDBSCAN:
        print(f"  HDBSCAN natural clusters: {n_natural}")
    print(f"  Final k: {N_CLUSTERS} (silhouette={best_sil})")
    print(f"  Clustering: GMM (full covariance)")
    print(f"  Similarity graph: {SIMILARITY_K}-NN")
    print()
    for c in range(N_CLUSTERS):
        count = sum(1 for v in assignments.values() if v == c)
        label = cluster_label_names.get(str(c), "?")
        print(f"  Cluster {c} ({label}): {count} shoes")


if __name__ == "__main__":
    main()
