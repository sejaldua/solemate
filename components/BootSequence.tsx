"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BOOT_LINES = [
  { text: "SOLEMATE v1.0.0", delay: 0 },
  { text: "────────────────────────────────", delay: 100 },
  { text: "> initializing decision engine...", delay: 400 },
  { text: "> loading shoe database [303 entries]...", delay: 800 },
  { text: "> parsing lab test results...", delay: 1200 },
  { text: "> normalizing feature vectors...", delay: 1600 },
  { text: "> computing UMAP embeddings...", delay: 2000 },
  { text: "> clustering shoe space [k=6]...", delay: 2400 },
  { text: "> initializing scoring model...", delay: 2800 },
  { text: "> calibrating recommendation engine...", delay: 3200 },
  { text: "", delay: 3500 },
  { text: "SYSTEM READY.", delay: 3600 },
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
          if (i === BOOT_LINES.length - 1) {
            setTimeout(() => setShowCTA(true), 400);
          }
        }, line.delay)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-1">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm ${
              line.text === "SYSTEM READY."
                ? "text-neon-green font-bold mt-2"
                : line.text.startsWith(">")
                  ? "text-text-secondary"
                  : line.text.startsWith("─")
                    ? "text-border"
                    : "text-neon-green"
            }`}
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines < BOOT_LINES.length && (
          <span className="text-neon-green animate-pulse">█</span>
        )}
      </div>

      {showCTA && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10"
        >
          <button
            onClick={onComplete}
            className="group border border-neon-green text-neon-green px-8 py-3 text-sm font-medium
                       hover:bg-neon-green/10 transition-all duration-300 rounded
                       flex items-center gap-3"
          >
            <span className="text-text-muted group-hover:text-neon-green transition-colors">&gt;</span>
            ENTER SYSTEM
            <span className="text-text-muted group-hover:text-neon-green transition-colors animate-pulse">_</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
