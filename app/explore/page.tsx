"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useShoeData } from "@/hooks/useShoeData";
import { useRunnerProfile } from "@/hooks/useRunnerProfile";

const ShoeMap = dynamic(() => import("@/components/ShoeMap"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-text-muted text-sm animate-pulse">Loading map...</div>,
});

export default function ExplorePage() {
  const router = useRouter();
  const { shoes, embeddings, clusters, meta, loading } = useShoeData();
  const { preferenceVector } = useRunnerProfile();

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
          className="flex-1 border border-border rounded-lg bg-bg-panel overflow-hidden"
          style={{ minHeight: 500 }}
        >
          <ShoeMap
            shoes={shoes}
            embeddings={embeddings}
            clusters={clusters}
            meta={meta}
            preferenceVector={preferenceVector}
            onShoeClick={(shoe) => {
              router.push(`/recommendations?highlight=${shoe.id}`);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
