"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-text-primary mb-4 tracking-tight">
            SoleMate
          </h1>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed max-w-lg mx-auto">
            Answer a few questions about how you run, and we&rsquo;ll match you
            with the best shoes from a dataset of 303 lab-tested models.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-6"
        >
          <button
            onClick={() => router.push("/input")}
            className="w-full max-w-xs mx-auto block bg-neon-blue text-white py-3.5 px-8 text-sm font-semibold
                       hover:opacity-90 transition-all duration-300 rounded-lg shadow-sm"
          >
            Get Started
          </button>

          <div className="grid grid-cols-3 gap-4 text-sm text-text-muted max-w-lg mx-auto">
            <div className="border border-border rounded-xl p-4 bg-bg-panel shadow-sm">
              <div className="text-2xl mb-2">🏃</div>
              <div className="text-text-primary font-semibold mb-1">Profile</div>
              <div className="text-xs leading-relaxed">Tell us your mileage, pace, terrain, and injury history.</div>
            </div>
            <div className="border border-border rounded-xl p-4 bg-bg-panel shadow-sm">
              <div className="text-2xl mb-2">🗺️</div>
              <div className="text-text-primary font-semibold mb-1">Explore</div>
              <div className="text-xs leading-relaxed">Browse an interactive map of 303 shoes clustered by features.</div>
            </div>
            <div className="border border-border rounded-xl p-4 bg-bg-panel shadow-sm">
              <div className="text-2xl mb-2">👟</div>
              <div className="text-text-primary font-semibold mb-1">Match</div>
              <div className="text-xs leading-relaxed">Get ranked picks, build a rotation, and compare side by side.</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-text-muted pt-2">
            <span>8 lab-tested features</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>6 shoe clusters</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Personalized scoring</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
