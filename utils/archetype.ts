import { Archetype, FeatureVector, FeatureKey, FEATURE_KEYS, RunnerProfile } from "@/types";

export type FeatureWeights = Record<FeatureKey, number>;

const ARCHETYPE_WEIGHTS: Record<Archetype, FeatureWeights> = {
  cushion_chaser: {
    weight: 1,
    stack_height: 3,
    drop: 1,
    midsole_softness: 3,
    flexibility: 1,
    width: 1,
    energy_return: 2,
    traction: 1,
  },
  speed_demon: {
    weight: 3,
    stack_height: 1,
    drop: 1,
    midsole_softness: 1,
    flexibility: 2,
    width: 1,
    energy_return: 3,
    traction: 1,
  },
  injury_guardian: {
    weight: 1,
    stack_height: 2,
    drop: 2,
    midsole_softness: 2,
    flexibility: 1,
    width: 2,
    energy_return: 1,
    traction: 1,
  },
  trail_explorer: {
    weight: 1,
    stack_height: 1,
    drop: 1,
    midsole_softness: 1,
    flexibility: 1,
    width: 2,
    energy_return: 1,
    traction: 3,
  },
  all_rounder: {
    weight: 1,
    stack_height: 1,
    drop: 1,
    midsole_softness: 1,
    flexibility: 1,
    width: 1,
    energy_return: 1,
    traction: 1,
  },
};

function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Compute continuous affinity to each archetype.
 * Returns a Record<Archetype, number> that sums to 1.
 *
 * Instead of hard if/else boundaries, each archetype gets a [0, 1] affinity
 * based on sigmoid-smoothed profile signals. A runner at pace 7.4 gets ~55%
 * speed demon affinity instead of flipping from 0% to 100% at the threshold.
 */
export function computeArchetypeAffinities(profile: RunnerProfile): Record<Archetype, number> {
  const { weeklyMileage, pace, terrain, injuries, comfortSpeed } = profile;

  const hasInjuries = injuries.length > 0 && !injuries.includes("none");

  const affinities: Record<Archetype, number> = {
    // High mileage + comfort preference → cushion chaser
    cushion_chaser: sigmoid((weeklyMileage - 40) / 15) * sigmoid((50 - comfortSpeed) / 20),
    // Fast pace + speed preference → speed demon
    speed_demon: sigmoid((7.5 - pace) / 1.5) * sigmoid((comfortSpeed - 50) / 20),
    // Injuries → injury guardian
    injury_guardian: hasInjuries ? 0.8 : 0.0,
    // Trail terrain → trail explorer
    trail_explorer: terrain === "trail" ? 1.0 : terrain === "mixed" ? 0.3 : 0.0,
    // Baseline — everyone has a little all-rounder
    all_rounder: 0.2,
  };

  // Normalize to sum to 1
  const total = Object.values(affinities).reduce((a, b) => a + b, 0);
  if (total > 0) {
    for (const key of Object.keys(affinities) as Archetype[]) {
      affinities[key] /= total;
    }
  }

  return affinities;
}

/**
 * Blend archetype weight vectors according to continuous affinities.
 * This is the scoring function's actual weight vector.
 */
export function computeBlendedWeights(profile: RunnerProfile): FeatureWeights {
  const affinities = computeArchetypeAffinities(profile);

  const blended: FeatureWeights = {
    weight: 0, stack_height: 0, drop: 0, midsole_softness: 0,
    flexibility: 0, width: 0, energy_return: 0, traction: 0,
  };

  for (const arch of Object.keys(affinities) as Archetype[]) {
    const w = ARCHETYPE_WEIGHTS[arch];
    const a = affinities[arch];
    for (const f of FEATURE_KEYS) {
      blended[f] += w[f] * a;
    }
  }

  return blended;
}

/**
 * Classify the dominant archetype (for display purposes).
 * The actual scoring uses the blended weights, but the UI shows a label.
 */
export function classifyArchetype(profile: RunnerProfile): Archetype {
  const affinities = computeArchetypeAffinities(profile);
  let best: Archetype = "all_rounder";
  let bestVal = -1;
  for (const [arch, val] of Object.entries(affinities) as [Archetype, number][]) {
    if (val > bestVal) {
      bestVal = val;
      best = arch;
    }
  }
  return best;
}

/**
 * Get raw archetype weights (for reference / evaluation).
 */
export function getArchetypeWeights(archetype: Archetype): FeatureWeights {
  return ARCHETYPE_WEIGHTS[archetype];
}

export function computePreferenceVector(profile: RunnerProfile): FeatureVector {
  const { weeklyMileage, pace, comfortSpeed, injuries } = profile;

  const mileageNorm = Math.min(weeklyMileage / 100, 1);
  const paceNorm = 1 - (pace - 5) / 8;
  const speedPref = comfortSpeed / 100;

  const weight = 0.3 + speedPref * 0.5;
  const stack_height = 0.5 + mileageNorm * 0.3 - speedPref * 0.2;
  const drop = 0.5;
  const midsole_softness = 0.5 + (1 - speedPref) * 0.3 + mileageNorm * 0.1;
  const flexibility = 0.3 + speedPref * 0.4;
  const width = 0.5;
  const energy_return = 0.4 + speedPref * 0.3 + paceNorm * 0.2;
  const traction = profile.terrain === "trail" ? 0.9 : 0.3;

  const prefs: FeatureVector = {
    weight, stack_height, drop, midsole_softness,
    flexibility, width, energy_return, traction,
  };

  if (injuries.includes("plantar_fasciitis")) {
    prefs.stack_height = Math.min(prefs.stack_height + 0.2, 1);
    prefs.midsole_softness = Math.min(prefs.midsole_softness + 0.15, 1);
  }
  if (injuries.includes("shin_splints")) {
    prefs.midsole_softness = Math.min(prefs.midsole_softness + 0.2, 1);
    prefs.drop = Math.min(prefs.drop + 0.15, 1);
  }
  if (injuries.includes("knee")) {
    prefs.stack_height = Math.min(prefs.stack_height + 0.15, 1);
    prefs.flexibility = Math.max(prefs.flexibility - 0.1, 0);
  }
  if (injuries.includes("achilles")) {
    prefs.drop = Math.min(prefs.drop + 0.2, 1);
    prefs.midsole_softness = Math.min(prefs.midsole_softness + 0.1, 1);
  }

  for (const key of Object.keys(prefs) as (keyof FeatureVector)[]) {
    prefs[key] = Math.max(0, Math.min(1, prefs[key]));
  }

  return prefs;
}

export function getInsights(profile: RunnerProfile, archetype: Archetype, prefs: FeatureVector) {
  const insights: { label: string; value: string; warning?: boolean }[] = [];

  const stackMin = Math.round(20 + prefs.stack_height * 20);
  const stackMax = Math.min(stackMin + 8, 45);
  insights.push({ label: "Optimal Stack", value: `${stackMin}–${stackMax}mm` });

  const maxWeight = Math.round(350 - prefs.weight * 150);
  insights.push({ label: "Max Weight", value: `${maxWeight}g` });

  const dropPref = prefs.drop > 0.6 ? "High (8–12mm)" : prefs.drop > 0.4 ? "Medium (4–8mm)" : "Low (0–4mm)";
  insights.push({ label: "Drop Preference", value: dropPref });

  const cushion = prefs.midsole_softness > 0.7 ? "Maximum" : prefs.midsole_softness > 0.4 ? "Moderate" : "Minimal";
  insights.push({ label: "Cushioning", value: cushion });

  if (profile.injuries.includes("plantar_fasciitis")) {
    insights.push({ label: "Injury Flag", value: "Avoid minimal cushioning", warning: true });
  }
  if (profile.injuries.includes("shin_splints")) {
    insights.push({ label: "Injury Flag", value: "Prioritize shock absorption", warning: true });
  }
  if (profile.injuries.includes("knee")) {
    insights.push({ label: "Injury Flag", value: "Extra stability recommended", warning: true });
  }

  if (profile.budget != null) {
    insights.push({ label: "Budget", value: `≤ $${profile.budget}` });
  }

  return insights;
}
