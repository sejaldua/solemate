"use client";

import { useMemo } from "react";
import { FeatureKey, FEATURE_LABELS } from "@/types";

interface SpiderChartProps {
  data: { label: string; values: Record<FeatureKey, number>; color: string }[];
  features: FeatureKey[];
  size?: number;
}

export default function SpiderChart({ data, features, size = 300 }: SpiderChartProps) {
  const center = size / 2;
  const radius = size * 0.38;
  const levels = 4;

  const angleSlice = (Math.PI * 2) / features.length;

  const getPoint = (featureIndex: number, value: number): [number, number] => {
    const angle = angleSlice * featureIndex - Math.PI / 2;
    return [
      center + Math.cos(angle) * radius * value,
      center + Math.sin(angle) * radius * value,
    ];
  };

  const gridRings = useMemo(() => {
    return Array.from({ length: levels }, (_, i) => {
      const r = (radius * (i + 1)) / levels;
      const points = features
        .map((_, fi) => {
          const angle = angleSlice * fi - Math.PI / 2;
          return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
        })
        .join(" ");
      return points;
    });
  }, [features, radius, levels, angleSlice, center]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {gridRings.map((points, i) => (
          <polygon
            key={`ring-${i}`}
            points={points}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={0.5}
          />
        ))}

        {/* Axis lines */}
        {features.map((_, i) => {
          const [x, y] = getPoint(i, 1);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Data polygons */}
        {data.map((d, di) => {
          const points = features
            .map((f, fi) => getPoint(fi, d.values[f]).join(","))
            .join(" ");
          return (
            <g key={di}>
              <polygon
                points={points}
                fill={d.color}
                fillOpacity={0.12}
                stroke={d.color}
                strokeWidth={1.5}
              />
              {features.map((f, fi) => {
                const [x, y] = getPoint(fi, d.values[f]);
                return (
                  <circle
                    key={fi}
                    cx={x}
                    cy={y}
                    r={3}
                    fill={d.color}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Labels */}
        {features.map((f, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const labelRadius = radius + 24;
          const x = center + Math.cos(angle) * labelRadius;
          const y = center + Math.sin(angle) * labelRadius;
          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-text-secondary"
              fontSize={9}
              fontFamily="Lexend"
            >
              {FEATURE_LABELS[f]}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm" style={{ background: d.color }} />
            <span className="text-text-secondary truncate max-w-[120px]">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
