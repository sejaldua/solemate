import {
  Shoe,
  ScoredShoe,
  FeatureVector,
  FeatureKey,
  FEATURE_KEYS,
  FEATURE_LABELS,
  Archetype,
} from "@/types";
import { getArchetypeWeights } from "./archetype";

export function scoreShoe(
  shoe: Shoe,
  prefs: FeatureVector,
  archetype: Archetype,
  userTerrain: "road" | "trail" | "mixed"
): ScoredShoe {
  const weights = getArchetypeWeights(archetype);

  // 1. Weighted feature similarity
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
  // "mixed" accepts both

  // 3. Price factor (gentle — max 10% penalty for expensive shoes)
  const priceFactor = shoe.price ? 1.0 - 0.1 * Math.min(shoe.price / 300, 1) : 0.95;

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
  archetype: Archetype,
  terrain: "road" | "trail" | "mixed"
): ScoredShoe[] {
  return shoes
    .map((shoe) => scoreShoe(shoe, prefs, archetype, terrain))
    .sort((a, b) => b.score - a.score);
}
