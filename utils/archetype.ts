import { Archetype, FeatureVector, FeatureKey, RunnerProfile } from "@/types";

type FeatureWeights = Record<FeatureKey, number>;

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

export function classifyArchetype(profile: RunnerProfile): Archetype {
  const { weeklyMileage, pace, terrain, injuries, comfortSpeed } = profile;

  // Trail dominates if selected
  if (terrain === "trail") return "trail_explorer";

  // Injury guardian if any injuries flagged
  if (injuries.length > 0 && !injuries.includes("none")) return "injury_guardian";

  // Speed demon: fast pace + speed preference
  if (pace < 7.5 && comfortSpeed > 60) return "speed_demon";

  // Cushion chaser: high mileage + comfort preference
  if (weeklyMileage > 40 && comfortSpeed < 40) return "cushion_chaser";

  // Speed-leaning
  if (comfortSpeed > 65) return "speed_demon";

  // Comfort-leaning
  if (comfortSpeed < 35) return "cushion_chaser";

  return "all_rounder";
}

export function getArchetypeWeights(archetype: Archetype): FeatureWeights {
  return ARCHETYPE_WEIGHTS[archetype];
}

export function computePreferenceVector(profile: RunnerProfile): FeatureVector {
  const { weeklyMileage, pace, comfortSpeed, injuries } = profile;

  // Normalize inputs to [0, 1]
  const mileageNorm = Math.min(weeklyMileage / 100, 1);
  const paceNorm = 1 - (pace - 5) / 8; // faster pace = higher value
  const speedPref = comfortSpeed / 100; // 0 = comfort, 1 = speed

  // Compute preference for each feature
  const weight = 0.3 + speedPref * 0.5; // speed lovers want light (high = light after inversion)
  const stack_height = 0.5 + mileageNorm * 0.3 - speedPref * 0.2;
  const drop = 0.5; // neutral default
  const midsole_softness = 0.5 + (1 - speedPref) * 0.3 + mileageNorm * 0.1;
  const flexibility = 0.3 + speedPref * 0.4;
  const width = 0.5;
  const energy_return = 0.4 + speedPref * 0.3 + paceNorm * 0.2;
  const traction = profile.terrain === "trail" ? 0.9 : 0.3;

  const prefs: FeatureVector = {
    weight,
    stack_height,
    drop,
    midsole_softness,
    flexibility,
    width,
    energy_return,
    traction,
  };

  // Injury adjustments
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

  // Clamp all to [0, 1]
  for (const key of Object.keys(prefs) as (keyof FeatureVector)[]) {
    prefs[key] = Math.max(0, Math.min(1, prefs[key]));
  }

  return prefs;
}

export function getInsights(profile: RunnerProfile, archetype: Archetype, prefs: FeatureVector) {
  const insights: { label: string; value: string; warning?: boolean }[] = [];

  // Optimal stack range (denormalize: typical range 20-45mm)
  const stackMin = Math.round(20 + prefs.stack_height * 20);
  const stackMax = Math.min(stackMin + 8, 45);
  insights.push({ label: "Optimal Stack", value: `${stackMin}–${stackMax}mm` });

  // Weight tolerance
  const maxWeight = Math.round(350 - prefs.weight * 150);
  insights.push({ label: "Max Weight", value: `${maxWeight}g` });

  // Drop preference
  const dropPref = prefs.drop > 0.6 ? "High (8–12mm)" : prefs.drop > 0.4 ? "Medium (4–8mm)" : "Low (0–4mm)";
  insights.push({ label: "Drop Preference", value: dropPref });

  // Cushioning level
  const cushion = prefs.midsole_softness > 0.7 ? "Maximum" : prefs.midsole_softness > 0.4 ? "Moderate" : "Minimal";
  insights.push({ label: "Cushioning", value: cushion });

  // Injury warnings
  if (profile.injuries.includes("plantar_fasciitis")) {
    insights.push({ label: "Injury Flag", value: "Avoid minimal cushioning", warning: true });
  }
  if (profile.injuries.includes("shin_splints")) {
    insights.push({ label: "Injury Flag", value: "Prioritize shock absorption", warning: true });
  }
  if (profile.injuries.includes("knee")) {
    insights.push({ label: "Injury Flag", value: "Extra stability recommended", warning: true });
  }

  return insights;
}
