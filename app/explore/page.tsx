"use client";

import { useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useShoeData } from "@/hooks/useShoeData";
import { useRunnerProfile } from "@/hooks/useRunnerProfile";
import { CLUSTER_COLORS } from "@/utils/constants";
import type { ColorMode } from "@/components/ShoeMap";

const ShoeMap = dynamic(() => import("@/components/ShoeMap"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-text-muted text-sm animate-pulse">Loading map...</div>,
});

// Inline the brand color map so the sidebar doesn't need to import from ShoeMap
const BRAND_COLORS: Record<string, string> = {
  Nike: "#F97316", Adidas: "#2563EB", "New Balance": "#DC2626", ASICS: "#0891B2",
  Hoka: "#7C3AED", Brooks: "#16A34A", Saucony: "#DB2777", On: "#0D9488",
  Puma: "#EA580C", Mizuno: "#4F46E5", Reebok: "#B91C1C", Altra: "#059669",
  Salomon: "#1D4ED8", Merrell: "#92400E", "Under Armour": "#9333EA",
};

export default function ExplorePage() {
  const router = useRouter();
  const { shoes, embeddings, clusters, meta, loading } = useShoeData();
  const { preferenceVector } = useRunnerProfile();
  const [colorMode, setColorMode] = useState<ColorMode>("cluster");
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());

  const brands = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of shoes) {
      counts[s.brand] = (counts[s.brand] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([brand, count]) => ({ brand, count }));
  }, [shoes]);

  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }, []);

  if (loading || !embeddings || !clusters || !meta) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-text-secondary text-sm animate-pulse">Loading shoe space...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-6 pb-10 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-4"
        >
          <h1 className="text-lg text-text-primary font-medium">Shoe Space</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">
              Scroll to zoom &middot; drag to pan
            </span>
            <button
              onClick={() => router.push("/recommendations")}
              className="bg-neon-blue text-white px-4 py-1.5 text-xs font-medium
                         hover:opacity-90 transition-colors rounded-lg"
            >
              View Recommendations
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="flex-1 flex gap-4"
          style={{ minHeight: 500 }}
        >
          {/* Sidebar: color mode + legend/filter */}
          <div className="w-52 flex-shrink-0 border border-border rounded-lg bg-bg-panel p-3 overflow-y-auto text-xs space-y-3">
            {/* Color by toggle */}
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1.5">Color by</div>
              <div className="flex rounded border border-border">
                <button
                  onClick={() => setColorMode("cluster")}
                  className={`flex-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors rounded-l ${
                    colorMode === "cluster"
                      ? "bg-neon-blue text-white"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Cluster
                </button>
                <button
                  onClick={() => setColorMode("brand")}
                  className={`flex-1 px-2.5 py-1.5 text-[11px] font-medium transition-colors rounded-r ${
                    colorMode === "brand"
                      ? "bg-neon-blue text-white"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  Brand
                </button>
              </div>
            </div>

            {/* Your position */}
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-neon-blue" />
              <span className="text-neon-blue text-[10px]">Your position</span>
            </div>

            {/* Legend or brand filter */}
            {colorMode === "cluster" ? (
              <div className="space-y-1.5">
                <div className="text-[10px] text-text-muted uppercase tracking-wider">Clusters</div>
                {Object.entries(clusters.labels).map(([id, label]) => (
                  <div key={id} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: CLUSTER_COLORS[Number(id) % CLUSTER_COLORS.length] }}
                    />
                    <span className="text-text-muted leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-text-muted uppercase tracking-wider">Brands</span>
                  {selectedBrands.size > 0 && (
                    <button
                      onClick={() => setSelectedBrands(new Set())}
                      className="text-[10px] text-neon-blue hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-text-muted/60 leading-snug">
                  Click to filter
                </p>
                {brands.map(({ brand, count }) => {
                  const active = selectedBrands.size === 0 || selectedBrands.has(brand);
                  return (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className={`flex items-center gap-2 w-full text-left py-0.5 transition-opacity ${
                        active ? "opacity-100" : "opacity-30"
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: BRAND_COLORS[brand] || "#6B7280" }}
                      />
                      <span className="text-text-muted flex-1 truncate">{brand}</span>
                      <span className="text-text-muted/50 text-[10px] tabular-nums">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="flex-1 border border-border rounded-lg bg-bg-panel overflow-hidden">
            <ShoeMap
              shoes={shoes}
              embeddings={embeddings}
              clusters={clusters}
              meta={meta}
              preferenceVector={preferenceVector}
              colorMode={colorMode}
              selectedBrands={selectedBrands}
              onShoeClick={(shoe) => {
                router.push(`/recommendations?highlight=${shoe.id}`);
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
