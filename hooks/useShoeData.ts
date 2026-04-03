"use client";

import { useState, useEffect } from "react";
import { Shoe, EmbeddingData, ClusterData, Meta } from "@/types";
import { BASE_PATH } from "@/utils/constants";

interface ShoeData {
  shoes: Shoe[];
  embeddings: EmbeddingData | null;
  clusters: ClusterData | null;
  meta: Meta | null;
  loading: boolean;
  error: string | null;
}

let cachedData: ShoeData | null = null;

export function useShoeData(): ShoeData {
  const [data, setData] = useState<ShoeData>(
    cachedData || {
      shoes: [],
      embeddings: null,
      clusters: null,
      meta: null,
      loading: true,
      error: null,
    }
  );

  useEffect(() => {
    if (cachedData) {
      setData(cachedData);
      return;
    }

    async function load() {
      try {
        const [shoesRes, embRes, clustRes, metaRes] = await Promise.all([
          fetch(`${BASE_PATH}/data/shoes.json`),
          fetch(`${BASE_PATH}/data/embeddings.json`),
          fetch(`${BASE_PATH}/data/clusters.json`),
          fetch(`${BASE_PATH}/data/meta.json`),
        ]);

        const shoes: Shoe[] = (await shoesRes.json()).map((s: Shoe) => ({
          ...s,
          pros: s.pros || [],
          cons: s.cons || [],
        }));
        const embeddings = await embRes.json();
        const clusters = await clustRes.json();
        const meta = await metaRes.json();

        cachedData = { shoes, embeddings, clusters, meta, loading: false, error: null };
        setData(cachedData);
      } catch (err) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load data",
        }));
      }
    }

    load();
  }, []);

  return data;
}
