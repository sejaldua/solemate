"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-text-primary mb-3 tracking-tight">
            SoleMate
          </h1>
          <p className="text-text-secondary text-base mb-2">
            Find the right running shoe for you.
          </p>
          <p className="text-text-muted text-sm mb-10">
            303 shoes, lab-tested across 8 performance features.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push("/input")}
            className="w-full bg-neon-blue text-white py-3 px-6 text-sm font-medium
                       hover:opacity-90 transition-all duration-300 rounded-lg shadow-sm"
          >
            Get Started
          </button>
          <div className="grid grid-cols-3 gap-3 text-xs text-text-muted">
            <div className="border border-border rounded p-3 bg-bg-panel">
              <div className="text-text-primary font-medium mb-1">Profile</div>
              Tell us how you run
            </div>
            <div className="border border-border rounded p-3 bg-bg-panel">
              <div className="text-text-primary font-medium mb-1">Explore</div>
              Map the shoe space
            </div>
            <div className="border border-border rounded p-3 bg-bg-panel">
              <div className="text-text-primary font-medium mb-1">Match</div>
              Find your shoes
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
