"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useRunnerProfile } from "@/hooks/useRunnerProfile";
import { useShoeData } from "@/hooks/useShoeData";
import Panel from "@/components/Panel";
import WarningFlag from "@/components/WarningFlag";
import ShoeSelector from "@/components/ShoeSelector";
import { ARCHETYPE_LABELS, ARCHETYPE_DESCRIPTIONS, FEATURE_LABELS, FeatureKey } from "@/types";
import { INJURY_OPTIONS } from "@/utils/constants";

const FEEDBACK_OPTIONS = [
  { value: "too_heavy", label: "Too heavy" },
  { value: "too_stiff", label: "Too stiff" },
  { value: "not_enough_cushion", label: "Not enough cushion" },
  { value: "too_soft", label: "Too soft/mushy" },
  { value: "too_narrow", label: "Too narrow" },
  { value: "poor_traction", label: "Poor traction" },
  { value: "wore_out_fast", label: "Wore out fast" },
  { value: "love_it", label: "Love it" },
];

export default function InputPage() {
  const router = useRouter();
  const { shoes } = useShoeData();
  const {
    profile,
    archetype,
    insights,
    preferenceVector,
    currentShoe,
    currentShoeFeedback,
    setProfile,
    setCurrentShoe,
    setCurrentShoeFeedback,
  } = useRunnerProfile();

  const formatPace = (val: number) => {
    const min = Math.floor(val);
    const sec = Math.round((val - min) * 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const toggleInjury = (injury: string) => {
    if (injury === "none") {
      setProfile({ injuries: [] });
      return;
    }
    const current = profile.injuries.filter((i) => i !== "none");
    if (current.includes(injury)) {
      setProfile({ injuries: current.filter((i) => i !== injury) });
    } else {
      setProfile({ injuries: [...current, injury] });
    }
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-10">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg text-text-primary mb-6 font-medium"
        >
          Runner Profile
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            <Panel title="Current Shoe">
              <ShoeSelector
                shoes={shoes}
                selectedShoe={currentShoe}
                onSelect={setCurrentShoe}
                placeholder="What are you running in now?"
              />
              {currentShoe && (
                <div className="mt-3">
                  <div className="text-xs text-text-muted mb-2">How do you feel about it?</div>
                  <div className="flex flex-wrap gap-2">
                    {FEEDBACK_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setCurrentShoeFeedback(
                            currentShoeFeedback === opt.value ? "" : opt.value
                          )
                        }
                        className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                          currentShoeFeedback === opt.value
                            ? opt.value === "love_it"
                              ? "border-neon-green text-neon-green bg-neon-green/10"
                              : "border-neon-blue text-neon-blue bg-neon-blue/10"
                            : "border-border text-text-muted hover:border-text-secondary"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Panel>

            <Panel title="Weekly Mileage">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl text-text-primary">{profile.weeklyMileage} mi</span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                value={profile.weeklyMileage}
                onChange={(e) => setProfile({ weeklyMileage: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>5 mi</span>
                <span>100 mi</span>
              </div>
            </Panel>

            <Panel title="Typical Pace">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl text-text-primary">{formatPace(profile.pace)} /mi</span>
              </div>
              <input
                type="range"
                min={5}
                max={13}
                step={0.25}
                value={profile.pace}
                onChange={(e) => setProfile({ pace: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>5:00</span>
                <span>13:00</span>
              </div>
            </Panel>

            <Panel title="Primary Terrain">
              <div className="flex gap-3">
                {(["road", "trail", "mixed"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setProfile({ terrain: t })}
                    className={`flex-1 py-2 px-3 text-sm rounded border transition-colors ${
                      profile.terrain === t
                        ? "border-neon-blue text-neon-blue bg-neon-blue/10"
                        : "border-border text-text-secondary hover:border-text-muted"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Injury History">
              <div className="flex flex-wrap gap-2">
                {INJURY_OPTIONS.map((opt) => {
                  const active =
                    opt.value === "none"
                      ? profile.injuries.length === 0
                      : profile.injuries.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleInjury(opt.value)}
                      className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                        active
                          ? opt.value === "none"
                            ? "border-neon-green text-neon-green bg-neon-green/10"
                            : "border-neon-orange text-neon-orange bg-neon-orange/10"
                          : "border-border text-text-secondary hover:border-text-muted"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel title="Comfort ↔ Speed">
              <div className="flex items-center gap-4">
                <span className="text-xs text-neon-blue">Comfort</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={profile.comfortSpeed}
                  onChange={(e) => setProfile({ comfortSpeed: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs text-neon-orange">Speed</span>
              </div>
            </Panel>
          </motion.div>

          {/* Right: Live Insights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5"
          >
            <Panel title="Runner Archetype">
              <div className="text-xl text-neon-blue mb-2 font-medium">
                {ARCHETYPE_LABELS[archetype]}
              </div>
              <p className="text-sm text-text-secondary">
                {ARCHETYPE_DESCRIPTIONS[archetype]}
              </p>
            </Panel>

            <Panel title="Computed Insights">
              <div className="space-y-3">
                {insights.map((insight, i) =>
                  insight.warning ? (
                    <WarningFlag key={i} message={`${insight.label}: ${insight.value}`} />
                  ) : (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-text-secondary">{insight.label}</span>
                      <span className="text-text-primary font-medium">{insight.value}</span>
                    </div>
                  )
                )}
              </div>
            </Panel>

            <Panel title="Preference Vector">
              <div className="space-y-2">
                {(Object.keys(preferenceVector) as FeatureKey[]).map((key) => (
                  <div key={key} className="flex items-center gap-3 text-xs">
                    <span className="w-28 text-text-secondary">{FEATURE_LABELS[key]}</span>
                    <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neon-blue rounded-full transition-all duration-300"
                        style={{ width: `${preferenceVector[key] * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-text-muted">
                      {(preferenceVector[key] * 100).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            {currentShoe && (
              <Panel title="Current Shoe Profile">
                <div className="space-y-2">
                  {(Object.keys(currentShoe.features) as FeatureKey[]).map((key) => (
                    <div key={key} className="flex items-center gap-3 text-xs">
                      <span className="w-28 text-text-secondary">{FEATURE_LABELS[key]}</span>
                      <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-text-muted rounded-full absolute"
                          style={{ width: `${currentShoe.features[key] * 100}%` }}
                        />
                        <div
                          className="h-full bg-neon-blue rounded-full absolute opacity-60"
                          style={{ width: `${preferenceVector[key] * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-4 mt-2 text-[10px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-text-muted inline-block" /> Current shoe
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-neon-blue inline-block" /> Your preference
                    </span>
                  </div>
                </div>
              </Panel>
            )}

            <button
              onClick={() => router.push("/explore")}
              className="w-full bg-neon-blue text-white py-3 text-sm font-medium
                         hover:opacity-90 transition-all duration-300 rounded-lg shadow-sm
                         flex items-center justify-center gap-2"
            >
              Explore Shoe Space
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
