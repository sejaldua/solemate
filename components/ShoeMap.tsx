"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { scaleLinear } from "d3-scale";
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom";
import { select as d3Select } from "d3-selection";
import { motion, AnimatePresence } from "framer-motion";
import { Shoe, EmbeddingData, ClusterData, Meta, FeatureVector, FEATURE_LABELS, FeatureKey } from "@/types";
import { CLUSTER_COLORS } from "@/utils/constants";
import { projectUserVector } from "@/utils/projector";

// Deterministic brand color palette (visually distinct, works on light bg)
const BRAND_COLORS: Record<string, string> = {
  Nike: "#F97316",
  Adidas: "#2563EB",
  "New Balance": "#DC2626",
  ASICS: "#0891B2",
  Hoka: "#7C3AED",
  Brooks: "#16A34A",
  Saucony: "#DB2777",
  On: "#0D9488",
  Puma: "#EA580C",
  Mizuno: "#4F46E5",
  Reebok: "#B91C1C",
  Altra: "#059669",
  Salomon: "#1D4ED8",
  Merrell: "#92400E",
  "Under Armour": "#9333EA",
};
const FALLBACK_BRAND_COLOR = "#6B7280";

function getBrandColor(brand: string): string {
  return BRAND_COLORS[brand] || FALLBACK_BRAND_COLOR;
}

export type ColorMode = "cluster" | "brand";

export { getBrandColor, BRAND_COLORS };

interface ShoeMapProps {
  shoes: Shoe[];
  embeddings: EmbeddingData;
  clusters: ClusterData;
  meta: Meta;
  preferenceVector: FeatureVector;
  colorMode?: ColorMode;
  selectedBrands?: Set<string>;
  onShoeClick?: (shoe: Shoe) => void;
}

export default function ShoeMap({
  shoes,
  embeddings,
  clusters,
  meta,
  preferenceVector,
  colorMode = "cluster",
  selectedBrands = new Set(),
  onShoeClick,
}: ShoeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredShoe, setHoveredShoe] = useState<Shoe | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState(zoomIdentity);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Whether a shoe passes the brand filter
  const isBrandVisible = useCallback(
    (shoe: Shoe) => selectedBrands.size === 0 || selectedBrands.has(shoe.brand),
    [selectedBrands]
  );

  // Compute user position
  const userPos = useMemo(
    () => projectUserVector(preferenceVector, shoes, embeddings),
    [preferenceVector, shoes, embeddings]
  );

  // Find the K nearest shoes for the highlight zone
  const nearbyShoeIds = useMemo(() => {
    const withDist = shoes
      .map((s) => {
        const coord = embeddings.coordinates[s.id];
        if (!coord) return null;
        const dx = coord[0] - userPos[0];
        const dy = coord[1] - userPos[1];
        return { id: s.id, dist: Math.sqrt(dx * dx + dy * dy) };
      })
      .filter(Boolean) as { id: string; dist: number }[];
    withDist.sort((a, b) => a.dist - b.dist);
    return new Set(withDist.slice(0, 15).map((d) => d.id));
  }, [shoes, embeddings, userPos]);

  // Compute recommendation zone radius (covers the 15 nearest)
  const zoneRadius = useMemo(() => {
    let maxDist = 0;
    for (const shoe of shoes) {
      if (!nearbyShoeIds.has(shoe.id)) continue;
      const coord = embeddings.coordinates[shoe.id];
      if (!coord) continue;
      const dx = coord[0] - userPos[0];
      const dy = coord[1] - userPos[1];
      maxDist = Math.max(maxDist, Math.sqrt(dx * dx + dy * dy));
    }
    return maxDist * 1.15;
  }, [shoes, embeddings, userPos, nearbyShoeIds]);

  // D3 scales
  const xScale = useMemo(
    () =>
      scaleLinear().domain(meta.embedding_bounds.x).range([50, dimensions.width - 50]),
    [meta, dimensions]
  );

  const yScale = useMemo(
    () =>
      scaleLinear().domain(meta.embedding_bounds.y).range([dimensions.height - 50, 50]),
    [meta, dimensions]
  );

  // Resize observer
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const parent = svg.parentElement;
    if (!parent) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);

  // Zoom behavior
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const zoomBehavior = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        setTransform(event.transform);
      });

    d3Select(svg).call(zoomBehavior);
    return () => { d3Select(svg).on(".zoom", null); };
  }, []);

  const handleMouseEnter = useCallback((shoe: Shoe, event: React.MouseEvent) => {
    setHoveredShoe(shoe);
    setTooltipPos({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltipPos({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredShoe(null);
  }, []);

  // Get dot color based on current mode
  const getDotColor = useCallback(
    (shoe: Shoe) => {
      if (colorMode === "brand") {
        return getBrandColor(shoe.brand);
      }
      const clusterId = clusters.assignments[shoe.id];
      return CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
    },
    [colorMode, clusters]
  );

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        {/* Glow filter definitions */}
        <defs>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="zone-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.10" />
            <stop offset="70%" stopColor="#2563EB" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          {/* Recommendation zone — glowing area around user position */}
          <ellipse
            cx={xScale(userPos[0])}
            cy={yScale(userPos[1])}
            rx={Math.abs(xScale(userPos[0] + zoneRadius) - xScale(userPos[0]))}
            ry={Math.abs(yScale(userPos[1] + zoneRadius) - yScale(userPos[1]))}
            fill="url(#zone-gradient)"
            stroke="#2563EB"
            strokeWidth={0.5}
            strokeOpacity={0.2}
            strokeDasharray="4 4"
          />

          {/* Cluster centroid labels (only in cluster mode) */}
          {colorMode === "cluster" &&
            Object.entries(clusters.centroids).map(([clusterId, [cx, cy]]) => (
              <text
                key={`label-${clusterId}`}
                x={xScale(cx)}
                y={yScale(cy) - 18}
                textAnchor="middle"
                fill="#6B7280"
                fontSize={8}
                fontFamily="Lexend"
                fontWeight={500}
              >
                {clusters.labels[clusterId]}
              </text>
            ))}

          {/* Connection lines from user to nearby shoes */}
          {shoes.map((shoe) => {
            if (!nearbyShoeIds.has(shoe.id)) return null;
            if (!isBrandVisible(shoe)) return null;
            const coord = embeddings.coordinates[shoe.id];
            if (!coord) return null;
            return (
              <line
                key={`line-${shoe.id}`}
                x1={xScale(userPos[0])}
                y1={yScale(userPos[1])}
                x2={xScale(coord[0])}
                y2={yScale(coord[1])}
                stroke="#2563EB"
                strokeWidth={0.3}
                strokeOpacity={0.15}
              />
            );
          })}

          {/* Shoe dots */}
          {shoes.map((shoe) => {
            const coord = embeddings.coordinates[shoe.id];
            if (!coord) return null;
            const color = getDotColor(shoe);
            const isHovered = hoveredShoe?.id === shoe.id;
            const isNearby = nearbyShoeIds.has(shoe.id);
            const visible = isBrandVisible(shoe);

            return (
              <circle
                key={shoe.id}
                cx={xScale(coord[0])}
                cy={yScale(coord[1])}
                r={isHovered ? 7 : isNearby && visible ? 4.5 : 3}
                fill={color}
                fillOpacity={!visible ? 0.06 : isNearby ? 0.9 : 0.45}
                stroke={isHovered ? "#fff" : isNearby && visible ? color : "none"}
                strokeWidth={isHovered ? 2 : isNearby && visible ? 1 : 0}
                filter={isHovered ? "url(#glow-soft)" : undefined}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => handleMouseEnter(shoe, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => onShoeClick?.(shoe)}
              />
            );
          })}

          {/* YOU ARE HERE marker */}
          <g transform={`translate(${xScale(userPos[0])}, ${yScale(userPos[1])})`} filter="url(#glow-green)">
            <circle r={20} fill="none" stroke="#2563EB" strokeWidth={1} opacity={0.15}>
              <animate attributeName="r" values="12;25;12" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle r={14} fill="none" stroke="#2563EB" strokeWidth={0.8} opacity={0.25}>
              <animate attributeName="r" values="8;18;8" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle r={6} fill="#2563EB" stroke="#FFFFFF" strokeWidth={2} />
            <text
              y={-16}
              textAnchor="middle"
              fill="#2563EB"
              fontSize="8"
              fontFamily="Lexend"
              fontWeight="600"
            >
              YOU
            </text>
          </g>
        </g>
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredShoe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none bg-bg-panel border border-border rounded-lg p-3 shadow-2xl max-w-xs"
            style={{
              left: tooltipPos.x + 15,
              top: tooltipPos.y - 10,
            }}
          >
            <div className="flex items-start gap-3">
              {hoveredShoe.image_url && (
                <img
                  src={hoveredShoe.image_url}
                  alt=""
                  className="w-10 h-10 rounded object-cover bg-bg flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div>
                <div className="text-sm font-medium text-text-primary">{hoveredShoe.model}</div>
                <div className="text-xs text-text-secondary">{hoveredShoe.brand}</div>
              </div>
            </div>
            {/* Primary + secondary cluster badges */}
            {(() => {
              const probs = clusters.probabilities?.[hoveredShoe.id];
              const primaryId = clusters.assignments[hoveredShoe.id];
              const primaryColor = CLUSTER_COLORS[primaryId % CLUSTER_COLORS.length];

              let secondaryId: number | null = null;
              let secondaryProb = 0;
              if (probs) {
                probs.forEach((p, i) => {
                  if (i !== primaryId && p > secondaryProb) {
                    secondaryProb = p;
                    secondaryId = i;
                  }
                });
              }

              return (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <div
                    className="text-xs px-1.5 py-0.5 rounded inline-flex items-center gap-1"
                    style={{ color: primaryColor, background: primaryColor + "15" }}
                  >
                    {clusters.labels[String(primaryId)]}
                    {probs && (
                      <span className="opacity-60">{Math.round(probs[primaryId] * 100)}%</span>
                    )}
                  </div>
                  {secondaryId !== null && secondaryProb > 0.15 && (
                    <div
                      className="text-[10px] px-1.5 py-0.5 rounded inline-flex items-center gap-1 opacity-70"
                      style={{
                        color: CLUSTER_COLORS[secondaryId % CLUSTER_COLORS.length],
                        background: CLUSTER_COLORS[secondaryId % CLUSTER_COLORS.length] + "10",
                      }}
                    >
                      {clusters.labels[String(secondaryId)]}
                      <span className="opacity-60">{Math.round(secondaryProb * 100)}%</span>
                    </div>
                  )}
                </div>
              );
            })()}
            <div className="mt-2 space-y-1">
              {(["weight", "stack_height", "midsole_softness", "energy_return"] as FeatureKey[]).map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs">
                  <span className="w-24 text-text-muted">{FEATURE_LABELS[f]}</span>
                  <div className="flex-1 h-1 bg-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${hoveredShoe.features[f] * 100}%`,
                        background: getDotColor(hoveredShoe),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {hoveredShoe.price != null && (
              <div className="mt-1.5 text-[10px] text-text-muted">${hoveredShoe.price}</div>
            )}
            {nearbyShoeIds.has(hoveredShoe.id) && (
              <div className="mt-1 text-[10px] text-neon-blue">In your recommendation zone</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nearby count indicator */}
      <div className="absolute top-4 right-4 bg-bg-panel/90 border border-border rounded px-3 py-2 text-xs">
        <span className="text-neon-blue font-medium">{nearbyShoeIds.size}</span>
        <span className="text-text-muted ml-1">shoes in your zone</span>
      </div>
    </div>
  );
}
