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
  const { preferenceVector, archetype, profile } = useRunnerProfile();

  const recommendations = useMemo(() => {
    if (shoes.length === 0) return [];
    return rankShoes(shoes, preferenceVector, archetype, profile.terrain);
  }, [shoes, preferenceVector, archetype, profile.terrain]);

  return { recommendations, loading };
}
