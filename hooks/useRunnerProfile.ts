"use client";

import { create } from "zustand";
import {
  RunnerProfile,
  Archetype,
  FeatureVector,
  Shoe,
} from "@/types";
import {
  classifyArchetype,
  computePreferenceVector,
  computeBlendedWeights,
  getInsights,
  FeatureWeights,
} from "@/utils/archetype";

interface RunnerProfileStore {
  profile: RunnerProfile;
  archetype: Archetype;
  preferenceVector: FeatureVector;
  blendedWeights: FeatureWeights;
  insights: { label: string; value: string; warning?: boolean }[];
  currentShoe: Shoe | null;
  currentShoeFeedback: string;
  setProfile: (updates: Partial<RunnerProfile>) => void;
  setCurrentShoe: (shoe: Shoe | null) => void;
  setCurrentShoeFeedback: (feedback: string) => void;
  reset: () => void;
}

const DEFAULT_PROFILE: RunnerProfile = {
  weeklyMileage: 25,
  pace: 9.0,
  terrain: "road",
  injuries: [],
  comfortSpeed: 50,
  budget: null,
};

function computeDerived(profile: RunnerProfile) {
  const archetype = classifyArchetype(profile);
  const preferenceVector = computePreferenceVector(profile);
  const blendedWeights = computeBlendedWeights(profile);
  const insights = getInsights(profile, archetype, preferenceVector);
  return { archetype, preferenceVector, blendedWeights, insights };
}

const initialDerived = computeDerived(DEFAULT_PROFILE);

export const useRunnerProfile = create<RunnerProfileStore>((set) => ({
  profile: DEFAULT_PROFILE,
  ...initialDerived,
  currentShoe: null,
  currentShoeFeedback: "",
  setProfile: (updates) =>
    set((state) => {
      const newProfile = { ...state.profile, ...updates };
      return { profile: newProfile, ...computeDerived(newProfile) };
    }),
  setCurrentShoe: (shoe) => set({ currentShoe: shoe }),
  setCurrentShoeFeedback: (feedback) => set({ currentShoeFeedback: feedback }),
  reset: () =>
    set({
      profile: DEFAULT_PROFILE,
      ...computeDerived(DEFAULT_PROFILE),
      currentShoe: null,
      currentShoeFeedback: "",
    }),
}));
