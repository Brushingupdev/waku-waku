"use client";

import { useEffect, useState } from "react";
import { getSeries, type Series } from "../lib/api/series";

export function useSeries() {
  const [series, setSeries] = useState<Series[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_COMMERCE_API_URL?.trim() && !process.env.NEXT_PUBLIC_API_URL?.trim()) return;
    const controller = new AbortController();
    getSeries(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setSeries(items);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "No se pudo cargar la lista de series.");
        }
      });
    return () => controller.abort();
  }, []);

  return { series, error };
}
