export interface FeatureVector {
  weight: number;
  stack_height: number;
  drop: number;
  midsole_softness: number;
  flexibility: number;
  width: number;
  energy_return: number;
  traction: number;
}

export type FeatureKey = keyof FeatureVector;

export const FEATURE_KEYS: FeatureKey[] = [
  "weight",
  "stack_height",
  "drop",
  "midsole_softness",
  "flexibility",
  "width",
  "energy_return",
  "traction",
];

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  weight: "Weight",
  stack_height: "Stack Height",
  drop: "Drop",
  midsole_softness: "Cushioning",
  flexibility: "Flexibility",
  width: "Width",
  energy_return: "Energy Return",
  traction: "Traction",
};

export interface Shoe {
  id: string;
  brand: string;
  model: string;
  category: string;
  price: number | null;
  features: FeatureVector;
  tags: {
    terrain: "road" | "trail";
    stability: "neutral" | "stability";
  };
  verdict?: string;
  pros: string[];
  cons: string[];
  image_url: string;
  url?: string;
}

export interface ShoeDetail {
  verdict: string;
  pros: string[];
  cons: string[];
  url: string;
}

export interface ScoreBreakdown {
  featureScore: number;
  terrainMatch: number;
  priceFactor: number;
  topFactors: { feature: FeatureKey; contribution: number; explanation: string }[];
}

export interface ScoredShoe extends Shoe {
  score: number;
  breakdown: ScoreBreakdown;
}

export interface RunnerProfile {
  weeklyMileage: number;
  pace: number; // min/mile (e.g., 8.5 = 8:30)
  terrain: "road" | "trail" | "mixed";
  injuries: string[];
  comfortSpeed: number; // 0 = max comfort, 100 = max speed
}

export type Archetype =
  | "cushion_chaser"
  | "speed_demon"
  | "injury_guardian"
  | "trail_explorer"
  | "all_rounder";

export const ARCHETYPE_LABELS: Record<Archetype, string> = {
  cushion_chaser: "Cushion Chaser",
  speed_demon: "Speed Demon",
  injury_guardian: "Injury Guardian",
  trail_explorer: "Trail Explorer",
  all_rounder: "All-Rounder",
};

export const ARCHETYPE_DESCRIPTIONS: Record<Archetype, string> = {
  cushion_chaser: "You prioritize maximum cushioning and comfort for high-mileage running.",
  speed_demon: "You want lightweight, responsive shoes that help you go fast.",
  injury_guardian: "Your shoe choice is guided by injury prevention and stability needs.",
  trail_explorer: "You need grip, durability, and protection for off-road terrain.",
  all_rounder: "You want a versatile shoe that handles a variety of runs well.",
};

export interface ShoeRole {
  primary: "daily_trainer" | "long_run" | "speed_work" | "recovery" | "trail";
  confidence: number;
}

export interface EmbeddingData {
  method: string;
  coordinates: Record<string, [number, number]>;
}

export interface ClusterData {
  k: number;
  labels: Record<string, string>;
  assignments: Record<string, number>;
  centroids: Record<string, [number, number]>;
}

export interface Meta {
  shoe_count: number;
  feature_names: string[];
  feature_ranges: Record<string, { min: number; max: number; unit: string }>;
  embedding_bounds: { x: [number, number]; y: [number, number] };
}
