"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useRunnerProfile } from "@/hooks/useRunnerProfile";
import { useShoeDetails } from "@/hooks/useShoeDetails";
import { FEATURE_KEYS, FEATURE_LABELS, FeatureKey } from "@/types";
import Panel from "@/components/Panel";
import SpiderChart from "@/components/SpiderChart";

const COMPARE_COLORS = ["#2563EB", "#16A34A", "#F59E0B"];

export default function ComparePage() {
  const { recommendations, loading } = useRecommendations();
  const { preferenceVector } = useRunnerProfile();
  const { details } = useShoeDetails();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const compareShoes = useMemo(() => {
    if (selectedIds.length >= 2) {
      return recommendations.filter((s) => selectedIds.includes(s.id));
    }
    return recommendations.slice(0, 3);
  }, [recommendations, selectedIds]);

  const toggleShoe = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-text-secondary text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  // Spider chart data: shoes + user preference overlay
  const spiderData = [
    ...compareShoes.map((shoe, i) => ({
      label: shoe.model.split(" ").slice(-2).join(" "),
      values: shoe.features,
      color: COMPARE_COLORS[i % COMPARE_COLORS.length],
    })),
    {
      label: "Your Preference",
      values: preferenceVector,
      color: "#7C3AED",
    },
  ];

  // Find biggest difference per feature
  const featureDeltas = FEATURE_KEYS.map((f) => {
    const vals = compareShoes.map((s) => s.features[f]);
    return { feature: f, delta: Math.max(...vals) - Math.min(...vals) };
  }).sort((a, b) => b.delta - a.delta);

  // Best-in-class per feature
  const bestInClass = (f: FeatureKey) => {
    let best = compareShoes[0];
    for (const s of compareShoes) {
      if (s.features[f] > best.features[f]) best = s;
    }
    return best;
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-lg text-text-primary mb-6 font-medium">Comparison Dashboard</h1>

          {/* Shoe selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recommendations.slice(0, 12).map((shoe) => {
              const idx = compareShoes.findIndex((s) => s.id === shoe.id);
              const active = idx !== -1;
              return (
                <button
                  key={shoe.id}
                  onClick={() => toggleShoe(shoe.id)}
                  className={`px-3 py-1.5 text-xs rounded border transition-all ${
                    active
                      ? "text-bg font-medium"
                      : "border-border text-text-secondary hover:border-text-muted"
                  }`}
                  style={
                    active
                      ? {
                          borderColor: COMPARE_COLORS[idx % COMPARE_COLORS.length],
                          background: COMPARE_COLORS[idx % COMPARE_COLORS.length],
                        }
                      : undefined
                  }
                >
                  {shoe.model}
                </button>
              );
            })}
          </div>

          {/* Top row: shoe cards + spider chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
            {/* Shoe cards column */}
            <div className="lg:col-span-5 space-y-4">
              {compareShoes.map((shoe, i) => (
                <motion.div
                  key={shoe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="border border-border bg-bg-panel rounded-lg p-4 flex gap-4">
                    <div
                      className="w-1.5 rounded-full flex-shrink-0 self-stretch"
                      style={{ background: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                    />
                    {shoe.image_url && (
                      <img
                        src={shoe.image_url}
                        alt={shoe.model}
                        className="w-16 h-16 rounded-lg object-cover bg-bg flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium text-text-primary truncate">
                            {shoe.model}
                          </div>
                          <div className="text-xs text-text-secondary">{shoe.brand}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div
                            className="text-2xl font-bold leading-tight"
                            style={{ color: COMPARE_COLORS[i % COMPARE_COLORS.length] }}
                          >
                            {(shoe.score * 100).toFixed(0)}
                          </div>
                          <div className="text-[10px] text-text-muted">Match</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2 text-[11px] text-text-muted">
                        <span className="capitalize">{shoe.category.replace("_", " ")}</span>
                        <span>&middot;</span>
                        <span className="capitalize">{shoe.tags.terrain}</span>
                        {shoe.price && (
                          <>
                            <span>&middot;</span>
                            <span>${shoe.price}</span>
                          </>
                        )}
                      </div>
                      {(details[shoe.id]?.pros || shoe.pros)?.length > 0 && (
                        <p className="text-[11px] text-text-muted mt-2 leading-relaxed line-clamp-2">
                          {(details[shoe.id]?.pros || shoe.pros)[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Spider chart */}
            <div className="lg:col-span-7">
              <Panel className="flex flex-col items-center justify-center h-full">
                <SpiderChart data={spiderData} features={FEATURE_KEYS} size={380} />
              </Panel>
            </div>
          </div>

          {/* Bottom row: feature grid + insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Feature tiles */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FEATURE_KEYS.map((f) => {
                  const best = bestInClass(f);
                  const bestIdx = compareShoes.findIndex((s) => s.id === best.id);
                  const delta = featureDeltas.find((d) => d.feature === f)!;
                  const isHighDelta = delta.delta > 0.15;

                  return (
                    <div
                      key={f}
                      className={`border rounded-lg p-3 bg-bg-panel transition-colors ${
                        isHighDelta ? "border-border" : "border-border/50"
                      }`}
                    >
                      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
                        {FEATURE_LABELS[f]}
                      </div>
                      <div className="space-y-1.5">
                        {compareShoes.map((shoe, i) => {
                          const val = shoe.features[f];
                          const isBest = shoe.id === best.id && isHighDelta;
                          return (
                            <div key={shoe.id} className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${val * 100}%` }}
                                  transition={{ duration: 0.6, delay: 0.05 * i }}
                                  className="h-full rounded-full"
                                  style={{
                                    background: COMPARE_COLORS[i % COMPARE_COLORS.length],
                                    opacity: isBest ? 1 : 0.4,
                                  }}
                                />
                              </div>
                              <span
                                className="text-[11px] w-7 text-right tabular-nums"
                                style={{
                                  color: isBest
                                    ? COMPARE_COLORS[i % COMPARE_COLORS.length]
                                    : "#9CA3AF",
                                }}
                              >
                                {(val * 100).toFixed(0)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {isHighDelta && (
                        <div className="mt-2 text-[10px] text-text-muted">
                          <span
                            style={{ color: COMPARE_COLORS[bestIdx % COMPARE_COLORS.length] }}
                          >
                            {best.model.split(" ").pop()}
                          </span>{" "}
                          leads by {(delta.delta * 100).toFixed(0)}pts
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key differences */}
            <div className="lg:col-span-4 space-y-4">
              <Panel title="Biggest Differences">
                {featureDeltas.slice(0, 4).map((d) => {
                  const best = bestInClass(d.feature);
                  const bestIdx = compareShoes.findIndex((s) => s.id === best.id);
                  return (
                    <div key={d.feature} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                      <div>
                        <div className="text-xs text-text-primary">{FEATURE_LABELS[d.feature]}</div>
                        <div className="text-[10px] text-text-muted">
                          Gap: {(d.delta * 100).toFixed(0)}pts
                        </div>
                      </div>
                      <div
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{
                          color: COMPARE_COLORS[bestIdx % COMPARE_COLORS.length],
                          background: COMPARE_COLORS[bestIdx % COMPARE_COLORS.length] + "15",
                        }}
                      >
                        {best.model.split(" ").slice(-2).join(" ")}
                      </div>
                    </div>
                  );
                })}
              </Panel>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
