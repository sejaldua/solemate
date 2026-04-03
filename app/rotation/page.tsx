"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useRecommendations } from "@/hooks/useRecommendations";
import { optimizeRotation, classifyRole, Role } from "@/utils/rotation";
import { ScoredShoe, FEATURE_LABELS, FEATURE_KEYS } from "@/types";
import Panel from "@/components/Panel";
import ConfidenceBar from "@/components/ConfidenceBar";

function RotationSlot({
  shoe,
  role,
  slotLabel,
  onSwap,
}: {
  shoe: ScoredShoe;
  role: { primary: Role; label: string };
  slotLabel: string;
  onSwap?: () => void;
}) {
  return (
    <Panel className="relative">
      <div className="absolute top-3 right-3 text-xs text-neon-blue bg-neon-blue/10 px-2 py-1 rounded">
        {slotLabel}
      </div>
      <div className="text-xs text-text-muted mb-1">{role.label}</div>
      <h3 className="text-lg text-text-primary font-medium">{shoe.model}</h3>
      <div className="text-sm text-text-secondary mb-3">{shoe.brand}</div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl text-neon-green font-bold">
          {(shoe.score * 100).toFixed(0)}
        </span>
        <span className="text-xs text-text-muted">Match</span>
        {shoe.price && (
          <span className="ml-auto text-sm text-text-secondary">${shoe.price}</span>
        )}
      </div>

      <div className="space-y-2">
        {FEATURE_KEYS.slice(0, 5).map((f) => (
          <div key={f} className="flex items-center gap-2 text-xs">
            <span className="w-24 text-text-muted">{FEATURE_LABELS[f]}</span>
            <div className="flex-1 h-1 bg-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-neon-blue rounded-full"
                style={{ width: `${shoe.features[f] * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {onSwap && (
        <button
          onClick={onSwap}
          className="mt-3 text-xs text-text-muted hover:text-text-primary transition-colors"
        >
          Swap
        </button>
      )}
    </Panel>
  );
}

export default function RotationPage() {
  const router = useRouter();
  const { recommendations, loading } = useRecommendations();
  const [slots, setSlots] = useState(3);

  const rotation = useMemo(() => {
    if (recommendations.length === 0) return null;
    return optimizeRotation(recommendations.slice(0, 15), slots);
  }, [recommendations, slots]);

  if (loading || !rotation) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-text-secondary text-sm animate-pulse">Optimizing rotation...</div>
      </div>
    );
  }

  const slotLabels = ["Daily", "Speed", "Long Run", "Recovery", "Trail"];

  return (
    <div className="min-h-screen pt-20 px-6 pb-10">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg text-text-primary font-medium">Rotation Builder</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-text-secondary">Shoes:</span>
                {[2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSlots(n)}
                    className={`px-2 py-1 rounded border text-xs ${
                      slots === n
                        ? "border-neon-green text-neon-green"
                        : "border-border text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                onClick={() => router.push("/compare")}
                className="bg-neon-green text-white px-4 py-1.5 text-xs font-medium
                           hover:opacity-90 transition-colors rounded-lg"
              >
                Compare
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Panel>
              <div className="text-xs text-text-muted mb-1">Coverage Score</div>
              <div className="text-2xl text-neon-green font-bold mb-2">
                {(rotation.coverage * 100).toFixed(0)}%
              </div>
              <ConfidenceBar value={rotation.coverage} label="Role coverage" />
            </Panel>
            <Panel>
              <div className="text-xs text-text-muted mb-1">Redundancy</div>
              <div className="text-2xl text-neon-orange font-bold mb-2">
                {(rotation.redundancy * 100).toFixed(0)}%
              </div>
              <ConfidenceBar
                value={rotation.redundancy}
                label="Overlap penalty"
                color="bg-neon-orange"
              />
              <p className="text-xs text-text-muted mt-2">Lower is better</p>
            </Panel>
          </div>

          {/* Rotation slots */}
          <div className={`grid gap-6 ${slots === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
            {rotation.shoes.map((shoe, i) => (
              <motion.div
                key={shoe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <RotationSlot
                  shoe={shoe}
                  role={classifyRole(shoe)}
                  slotLabel={slotLabels[i] || `SLOT ${i + 1}`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
