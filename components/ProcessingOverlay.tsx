"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROCESSING_LINES = [
  "Loading shoe database...",
  "Analyzing features...",
  "Scoring matches...",
  "Ranking results...",
  "Done!",
];

export default function ProcessingOverlay({
  active,
  onComplete,
  lines = PROCESSING_LINES,
  duration = 1200,
}: {
  active: boolean;
  onComplete: () => void;
  lines?: string[];
  duration?: number;
}) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!active) {
      setVisibleLines(0);
      return;
    }

    const interval = duration / lines.length;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setVisibleLines(count);
      if (count >= lines.length) {
        clearInterval(timer);
        setTimeout(onComplete, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [active, lines.length, duration, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-bg/95 flex items-center justify-center"
        >
          <div className="text-sm space-y-1">
            {lines.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${
                  i === lines.length - 1 ? "text-neon-green" : "text-text-secondary"
                }`}
              >
                {line}
              </motion.div>
            ))}
            {visibleLines < lines.length && (
              <span className="text-neon-green animate-pulse">...</span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
