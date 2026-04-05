"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { scaleLinear } from "d3-scale";
import { zoom as d3Zoom, zoomIdentity } from "d3-zoom";
import { select as d3Select } from "d3-selection";
import { motion, AnimatePresence } from "framer-motion";
import { Shoe, EmbeddingData, ClusterData, Meta, FeatureVector, FEATURE_LABELS, FeatureKey } from "@/types";
import { CLUSTER_COLORS } from "@/utils/constants";
import { projectUserVector } from "@/utils/projector";

interface ShoeMapProps {
  shoes: Shoe[];
  embeddings: EmbeddingData;
  clusters: ClusterData;
  meta: Meta;
  preferenceVector: FeatureVector;
  onShoeClick?: (shoe: Shoe) => void;
}

export default function ShoeMap({
  shoes,
  embeddings,
  clusters,
  meta,
  preferenceVector,
  onShoeClick,
}: ShoeMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredShoe, setHoveredShoe] = useState<Shoe | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [transform, setTransform] = useState(zoomIdentity);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

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

          {/* Cluster centroid labels */}
          {Object.entries(clusters.centroids).map(([clusterId, [cx, cy]]) => (
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
            const clusterId = clusters.assignments[shoe.id];
            const color = CLUSTER_COLORS[clusterId % CLUSTER_COLORS.length];
            const isHovered = hoveredShoe?.id === shoe.id;
            const isNearby = nearbyShoeIds.has(shoe.id);

            return (
              <circle
                key={shoe.id}
                cx={xScale(coord[0])}
                cy={yScale(coord[1])}
                r={isHovered ? 7 : isNearby ? 4.5 : 3}
                fill={color}
                fillOpacity={isNearby ? 0.9 : 0.35}
                stroke={isHovered ? "#fff" : isNearby ? color : "none"}
                strokeWidth={isHovered ? 2 : isNearby ? 1 : 0}
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
            <div
              className="text-xs mt-1.5 px-1.5 py-0.5 rounded inline-block"
              style={{
                color: CLUSTER_COLORS[clusters.assignments[hoveredShoe.id] % CLUSTER_COLORS.length],
                background: CLUSTER_COLORS[clusters.assignments[hoveredShoe.id] % CLUSTER_COLORS.length] + "15",
              }}
            >
              {clusters.labels[String(clusters.assignments[hoveredShoe.id])]}
            </div>
            <div className="mt-2 space-y-1">
              {(["weight", "stack_height", "midsole_softness", "energy_return"] as FeatureKey[]).map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs">
                  <span className="w-24 text-text-muted">{FEATURE_LABELS[f]}</span>
                  <div className="flex-1 h-1 bg-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${hoveredShoe.features[f] * 100}%`,
                        background: CLUSTER_COLORS[clusters.assignments[hoveredShoe.id] % CLUSTER_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {nearbyShoeIds.has(hoveredShoe.id) && (
              <div className="mt-2 text-[10px] text-neon-blue">In your recommendation zone</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-bg-panel/90 border border-border rounded p-3 text-xs space-y-1.5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-blue" />
          <span className="text-neon-blue text-[10px]">Your position</span>
        </div>
        {Object.entries(clusters.labels).map(([id, label]) => (
          <div key={id} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: CLUSTER_COLORS[Number(id) % CLUSTER_COLORS.length] }}
            />
            <span className="text-text-muted">{label}</span>
          </div>
        ))}
      </div>

      {/* Nearby count indicator */}
      <div className="absolute top-4 right-4 bg-bg-panel/90 border border-border rounded px-3 py-2 text-xs">
        <span className="text-neon-blue font-medium">{nearbyShoeIds.size}</span>
        <span className="text-text-muted ml-1">shoes in your zone</span>
      </div>
    </div>
  );
}
