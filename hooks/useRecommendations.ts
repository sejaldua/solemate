"use client";

import { useMemo } from "react";
import { ScoredShoe } from "@/types";
import { useShoeData } from "./useShoeData";
import { useRunnerProfile } from "./useRunnerProfile";
import { rankShoes } from "@/utils/scoring";

export function useRecommendations(): {
  recommendations: ScoredShoe[];
  loading: boolean;
} {
  const { shoes, loading } = useShoeData();
  const { preferenceVector, blendedWeights, profile } = useRunnerProfile();

  const recommendations = useMemo(() => {
    if (shoes.length === 0) return [];
    return rankShoes(shoes, preferenceVector, blendedWeights, profile.terrain, profile.budget);
  }, [shoes, preferenceVector, blendedWeights, profile.terrain, profile.budget]);

  return { recommendations, loading };
}
