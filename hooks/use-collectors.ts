"use client";

import { useEffect, useState } from "react";
import { getCollectors, type Collector } from "../lib/api/collectors";

export function useCollectors() {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    getCollectors(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setCollectors(items);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "No se pudo cargar la lista de coleccionistas.");
        }
      });
    return () => controller.abort();
  }, []);

  return { collectors, error };
}
