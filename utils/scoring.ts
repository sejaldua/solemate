import {
  Shoe,
  ScoredShoe,
  FeatureVector,
  FeatureKey,
  FEATURE_KEYS,
  FEATURE_LABELS,
} from "@/types";
import { FeatureWeights } from "./archetype";

export function scoreShoe(
  shoe: Shoe,
  prefs: FeatureVector,
  weights: FeatureWeights,
  userTerrain: "road" | "trail" | "mixed",
  budget: number | null = null
): ScoredShoe {
  // 1. Weighted feature similarity (complement of weighted L1)
  let featureScore = 0;
  let totalWeight = 0;
  const featureContributions: { feature: FeatureKey; contribution: number; diff: number }[] = [];

  for (const f of FEATURE_KEYS) {
    const diff = Math.abs(shoe.features[f] - prefs[f]);
    const match = 1 - diff;
    const weighted = weights[f] * match;
    featureScore += weighted;
    totalWeight += weights[f];
    featureContributions.push({ feature: f, contribution: weighted / totalWeight, diff });
  }
  featureScore /= totalWeight;

  // 2. Terrain compatibility
  let terrainMatch = 1.0;
  if (userTerrain === "trail" && shoe.tags.terrain !== "trail") {
    terrainMatch = 0.3;
  } else if (userTerrain === "road" && shoe.tags.terrain !== "road") {
    terrainMatch = 0.4;
  }

  // 3. Price factor
  // When budget is set: smooth penalty that ramps up as price approaches and exceeds budget.
  //   - At budget: ~15% penalty
  //   - At 1.5x budget: ~50% penalty
  //   - Well over budget: asymptotically approaches 0
  // When no budget: gentle 10% cap as before.
  let priceFactor = 0.95; // default for shoes with no listed price
  if (shoe.price != null) {
    if (budget != null && budget > 0) {
      const ratio = shoe.price / budget;
      if (ratio <= 0.8) {
        // Well under budget — no penalty
        priceFactor = 1.0;
      } else {
        // Sigmoid-style ramp: 1 / (1 + e^(4*(ratio-1)))
        // At ratio=1.0 (exactly at budget): priceFactor ≈ 0.85
        // At ratio=1.25: priceFactor ≈ 0.58
        // At ratio=1.5: priceFactor ≈ 0.35
        priceFactor = 1 / (1 + Math.exp(4 * (ratio - 1)));
      }
    } else {
      // No budget set — gentle generic penalty
      priceFactor = 1.0 - 0.1 * Math.min(shoe.price / 300, 1);
    }
  }

  // Final score
  const score = featureScore * terrainMatch * priceFactor;

  // Top contributing factors for explanation
  featureContributions.sort((a, b) => b.contribution - a.contribution);
  const topFactors = featureContributions.slice(0, 3).map(({ feature, contribution, diff }) => {
    const matchPct = Math.round((1 - diff) * 100);
    return {
      feature,
      contribution,
      explanation: `${FEATURE_LABELS[feature]}: ${matchPct}% match with your preference`,
    };
  });

  return {
    ...shoe,
    score,
    breakdown: {
      featureScore,
      terrainMatch,
      priceFactor,
      topFactors,
    },
  };
}

export function rankShoes(
  shoes: Shoe[],
  prefs: FeatureVector,
  weights: FeatureWeights,
  terrain: "road" | "trail" | "mixed",
  budget: number | null = null
): ScoredShoe[] {
  return shoes
    .map((shoe) => scoreShoe(shoe, prefs, weights, terrain, budget))
    .sort((a, b) => b.score - a.score);
}
