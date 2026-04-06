"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useShoeData } from "@/hooks/useShoeData";
import { useShoeDetails } from "@/hooks/useShoeDetails";
import { Shoe, ScoredShoe } from "@/types";
import Panel from "@/components/Panel";
import ConfidenceBar from "@/components/ConfidenceBar";

function ShoeCard({
  shoe,
  rank,
  isSelected,
  onClick,
}: {
  shoe: ScoredShoe;
  rank: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded border transition-colors ${
        isSelected
          ? "border-neon-blue bg-neon-blue/5"
          : "border-border hover:border-text-muted bg-bg-panel"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-xs w-6 ${isSelected ? "text-neon-blue" : "text-text-muted"}`}>
          #{rank}
        </span>
        {shoe.image_url && (
          <img
            src={shoe.image_url}
            alt=""
            className="w-8 h-8 rounded object-cover bg-bg flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-text-primary truncate">{shoe.model}</div>
          <div className="text-xs text-text-secondary">{shoe.brand}</div>
        </div>
        <span className={`text-sm font-medium ${isSelected ? "text-neon-blue" : "text-text-primary"}`}>
          {(shoe.score * 100).toFixed(0)}
        </span>
      </div>
    </button>
  );
}

function TopPickCard({ shoe, rank }: { shoe: ScoredShoe; rank: number }) {
  return (
    <Panel className="relative overflow-hidden">
      <div className="absolute top-3 right-3 text-xs text-neon-blue bg-neon-blue/10 px-2 py-1 rounded">
        #{rank}
      </div>

      <div className="flex gap-4 mb-4">
        {shoe.image_url && (
          <img
            src={shoe.image_url}
            alt={shoe.model}
            className="w-20 h-20 rounded-lg object-cover bg-bg flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <div>
          <h2 className="text-xl text-text-primary font-medium mb-0.5">{shoe.model}</h2>
          <div className="text-sm text-text-secondary">{shoe.brand}</div>
          {shoe.price && (
            <div className="text-sm text-text-muted mt-1">${shoe.price}</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-3xl text-neon-blue font-bold">
          {(shoe.score * 100).toFixed(0)}
        </div>
        <div className="text-xs text-text-muted">Match<br />Score</div>
      </div>

      <ConfidenceBar value={shoe.score} label="Overall Match" color="bg-neon-blue" />

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-text-muted mb-0.5">Category</div>
          <div className="text-text-primary capitalize">{shoe.category.replace("_", " ")}</div>
        </div>
        <div>
          <div className="text-xs text-text-muted mb-0.5">Terrain</div>
          <div className="text-text-primary capitalize">{shoe.tags.terrain}</div>
        </div>
        <div>
          <div className="text-xs text-text-muted mb-0.5">Stability</div>
          <div className="text-text-primary capitalize">{shoe.tags.stability}</div>
        </div>
        <div>
          <div className="text-xs text-text-muted mb-0.5">Terrain Match</div>
          <div className="text-text-primary">{(shoe.breakdown.terrainMatch * 100).toFixed(0)}%</div>
        </div>
      </div>

      {shoe.verdict && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-text-muted mb-1">Expert Verdict</div>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-4">{shoe.verdict}</p>
        </div>
      )}
    </Panel>
  );
}

function WhyThisWorks({ shoe }: { shoe: ScoredShoe }) {
  return (
    <Panel title="Why This Works">
      <div className="space-y-4">
        {shoe.breakdown.topFactors.map((factor, i) => (
          <div key={factor.feature}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-neon-blue text-xs font-bold">{i + 1}.</span>
              <span className="text-sm text-text-primary">{factor.explanation}</span>
            </div>
            <ConfidenceBar
              value={factor.contribution}
              color={i === 0 ? "bg-neon-blue" : i === 1 ? "bg-neon-green" : "bg-neon-purple"}
            />
          </div>
        ))}
      </div>

      {shoe.pros.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="text-xs text-text-muted mb-2">Strengths</div>
          <ul className="space-y-1">
            {shoe.pros.slice(0, 4).map((pro, i) => (
              <li key={i} className="text-xs text-text-secondary flex gap-2">
                <span className="text-neon-green">+</span>{pro}
              </li>
            ))}
          </ul>
        </div>
      )}

      {shoe.cons.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-text-muted mb-2">Trade-offs</div>
          <ul className="space-y-1">
            {shoe.cons.slice(0, 3).map((con, i) => (
              <li key={i} className="text-xs text-text-secondary flex gap-2">
                <span className="text-neon-orange">-</span>{con}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

function SimilarShoes({
  shoe,
  graph,
  shoes,
  onSelect,
}: {
  shoe: ScoredShoe;
  graph: Record<string, { id: string; distance: number }[]> | null;
  shoes: Shoe[];
  onSelect: (id: string) => void;
}) {
  if (!graph || !graph[shoe.id]) return null;

  const neighbors = graph[shoe.id];
  const shoeMap = new Map(shoes.map((s) => [s.id, s]));

  return (
    <Panel title="Similar Shoes">
      <p className="text-[10px] text-text-muted mb-3">
        Nearest neighbors in feature space (biomechanically similar)
      </p>
      <div className="space-y-2">
        {neighbors.map((n) => {
          const s = shoeMap.get(n.id);
          if (!s) return null;
          const similarity = Math.max(0, Math.round((1 - n.distance / 2) * 100));
          return (
            <button
              key={n.id}
              onClick={() => onSelect(n.id)}
              className="w-full flex items-center gap-2.5 p-2 rounded border border-border/50
                         hover:border-text-muted bg-bg-panel transition-colors text-left"
            >
              {s.image_url && (
                <img
                  src={s.image_url}
                  alt=""
                  className="w-8 h-8 rounded object-cover bg-bg flex-shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-text-primary truncate">{s.model}</div>
                <div className="text-[10px] text-text-muted">{s.brand}</div>
              </div>
              <div className="text-[10px] text-text-muted tabular-nums">{similarity}%</div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

export default function RecommendationsPage() {
  const router = useRouter();
  const { recommendations, loading } = useRecommendations();
  const { shoes, graph } = useShoeData();
  const { details } = useShoeDetails();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Merge detail fields into selected shoe
  const mergeDetail = (shoe: ScoredShoe): ScoredShoe => {
    const d = details[shoe.id];
    if (!d) return shoe;
    return { ...shoe, verdict: d.verdict, pros: d.pros, cons: d.cons };
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-text-secondary text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  const rawSelected = recommendations[selectedIndex];
  if (!rawSelected) return null;
  const selected = mergeDetail(rawSelected);

  return (
    <div className="min-h-screen pt-20 px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg text-text-primary font-medium">Recommendations</h1>
            <button
              onClick={() => router.push("/rotation")}
              className="bg-neon-blue text-white px-4 py-1.5 text-xs font-medium
                         hover:opacity-90 transition-colors rounded-lg"
            >
              Build Rotation
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Ranked list */}
            <div className="lg:col-span-3 space-y-2 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
              {recommendations.slice(0, 20).map((shoe, i) => (
                <ShoeCard
                  key={shoe.id}
                  shoe={shoe}
                  rank={i + 1}
                  isSelected={i === selectedIndex}
                  onClick={() => setSelectedIndex(i)}
                />
              ))}
            </div>

            {/* Center: Selected shoe */}
            <div className="lg:col-span-5">
              <TopPickCard shoe={selected} rank={selectedIndex + 1} />
            </div>

            {/* Right: Why this works + Similar shoes */}
            <div className="lg:col-span-4 space-y-5">
              <WhyThisWorks shoe={selected} />
              <SimilarShoes
                shoe={selected}
                graph={graph}
                shoes={shoes}
                onSelect={(id) => {
                  const idx = recommendations.findIndex((s) => s.id === id);
                  if (idx >= 0) setSelectedIndex(idx);
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
