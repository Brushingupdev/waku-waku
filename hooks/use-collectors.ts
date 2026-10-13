"use client";

import { useEffect, useState } from "react";
import { getCollectors, type Collector } from "../lib/api/collectors";

export function useCollectors(initialCollectors?: Collector[]) {
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (initialCollectors !== undefined) return;
    const controller = new AbortController();
    getCollectors(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setCollectors(items);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("No pudimos cargar las experiencias de los coleccionistas.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt, initialCollectors]);

  const retry = () => {
    setLoading(true);
    setError("");
    setAttempt(value => value + 1);
  };
  return { collectors: initialCollectors ?? collectors, error, loading: initialCollectors === undefined && loading, retry };
}
