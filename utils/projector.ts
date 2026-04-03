import { Shoe, FeatureVector, FeatureKey, FEATURE_KEYS, EmbeddingData } from "@/types";

function featureDistance(a: FeatureVector, b: FeatureVector): number {
  let sum = 0;
  for (const k of FEATURE_KEYS) {
    sum += (a[k] - b[k]) ** 2;
  }
  return Math.sqrt(sum);
}

/**
 * Project a user preference vector onto the 2D embedding space
 * by taking the weighted average of K nearest neighbors' positions.
 */
export function projectUserVector(
  prefs: FeatureVector,
  shoes: Shoe[],
  embeddings: EmbeddingData,
  k: number = 5
): [number, number] {
  // Find K nearest shoes in feature space
  const distances = shoes
    .map((shoe) => ({
      id: shoe.id,
      dist: featureDistance(prefs, shoe.features),
    }))
    .filter((d) => embeddings.coordinates[d.id])
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k);

  if (distances.length === 0) return [0, 0];

  // Inverse distance weighting
  const weights = distances.map((d) => 1 / (d.dist + 0.001));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let x = 0;
  let y = 0;
  for (let i = 0; i < distances.length; i++) {
    const coord = embeddings.coordinates[distances[i].id];
    const w = weights[i] / totalWeight;
    x += coord[0] * w;
    y += coord[1] * w;
  }

  return [x, y];
}
