import { ScoredShoe, FeatureKey, FEATURE_KEYS } from "@/types";

type Role = "daily_trainer" | "long_run" | "speed_work" | "recovery" | "trail";

const ROLE_LABELS: Record<Role, string> = {
  daily_trainer: "Daily Trainer",
  long_run: "Long Run",
  speed_work: "Speed Work",
  recovery: "Recovery",
  trail: "Trail",
};

function euclideanDistance(a: Record<FeatureKey, number>, b: Record<FeatureKey, number>): number {
  let sum = 0;
  for (const k of FEATURE_KEYS) {
    sum += (a[k] - b[k]) ** 2;
  }
  return Math.sqrt(sum);
}

export function classifyRole(shoe: ScoredShoe): { primary: Role; label: string } {
  const f = shoe.features;

  if (shoe.tags.terrain === "trail") {
    return { primary: "trail", label: ROLE_LABELS.trail };
  }

  // Speed work: light + flexible + high energy return
  if (f.weight > 0.7 && f.flexibility > 0.6 && f.energy_return > 0.6) {
    return { primary: "speed_work", label: ROLE_LABELS.speed_work };
  }

  // Recovery: very soft + high stack
  if (f.midsole_softness > 0.7 && f.stack_height > 0.7) {
    return { primary: "recovery", label: ROLE_LABELS.recovery };
  }

  // Long run: good cushion + durability (approximated by moderate weight)
  if (f.stack_height > 0.55 && f.midsole_softness > 0.5 && f.weight < 0.6) {
    return { primary: "long_run", label: ROLE_LABELS.long_run };
  }

  return { primary: "daily_trainer", label: ROLE_LABELS.daily_trainer };
}

export function optimizeRotation(
  candidates: ScoredShoe[],
  slots: number = 3
): { shoes: ScoredShoe[]; coverage: number; redundancy: number } {
  const selected: ScoredShoe[] = [];
  const coveredRoles = new Set<Role>();
  const allRoles: Role[] = ["daily_trainer", "long_run", "speed_work", "recovery", "trail"];

  for (let i = 0; i < slots; i++) {
    let bestCandidate: ScoredShoe | null = null;
    let bestValue = -Infinity;

    for (const shoe of candidates) {
      if (selected.some((s) => s.id === shoe.id)) continue;

      const role = classifyRole(shoe);
      const novelty = coveredRoles.has(role.primary) ? 0 : 1;

      const diversity =
        selected.length === 0
          ? 1
          : selected.reduce((sum, s) => sum + euclideanDistance(s.features, shoe.features), 0) /
            selected.length;

      const quality = shoe.score;
      const value = novelty * 2.0 + diversity * 1.0 + quality * 0.5;

      if (value > bestValue) {
        bestValue = value;
        bestCandidate = shoe;
      }
    }

    if (bestCandidate) {
      selected.push(bestCandidate);
      coveredRoles.add(classifyRole(bestCandidate).primary);
    }
  }

  // Compute coverage: fraction of useful roles covered
  const coverage = coveredRoles.size / Math.min(slots + 1, allRoles.length);

  // Compute redundancy: average pairwise similarity (lower = less redundant)
  let redundancy = 0;
  let pairs = 0;
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      redundancy += 1 - euclideanDistance(selected[i].features, selected[j].features);
      pairs++;
    }
  }
  redundancy = pairs > 0 ? redundancy / pairs : 0;

  return { shoes: selected, coverage, redundancy };
}

export { ROLE_LABELS };
export type { Role };
