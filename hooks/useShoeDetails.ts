"use client";

import { useState, useEffect } from "react";
import { ShoeDetail } from "@/types";
import { BASE_PATH } from "@/utils/constants";

let cachedDetails: Record<string, ShoeDetail> | null = null;

export function useShoeDetails(): {
  details: Record<string, ShoeDetail>;
  loading: boolean;
} {
  const [details, setDetails] = useState<Record<string, ShoeDetail>>(cachedDetails || {});
  const [loading, setLoading] = useState(!cachedDetails);

  useEffect(() => {
    if (cachedDetails) return;

    fetch(`${BASE_PATH}/data/shoes-detail.json`)
      .then((r) => r.json())
      .then((data) => {
        cachedDetails = data;
        setDetails(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { details, loading };
}
