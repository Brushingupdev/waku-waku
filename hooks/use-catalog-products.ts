"use client";

import { useEffect, useState } from "react";
import { catalogSnapshotSchema, type CatalogSnapshot } from "../lib/catalog-snapshot";

export function useCatalogProducts(initialCatalog: CatalogSnapshot) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let pending = false;
    const refresh = async () => {
      if (pending || document.hidden) return;
      pending = true;
      try {
        const response = await fetch("/catalog-data", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("No se pudo actualizar el catálogo.");
        const next = catalogSnapshotSchema.parse(await response.json());
        if (!controller.signal.aborted) {
          // A cold server may return the older seed during an outage. Never
          // replace newer data already displayed, including empty catalogs.
          setCatalog(current => next.updatedAt > current.updatedAt ? next : current);
          setError(Date.now() - Date.parse(next.updatedAt) > 5 * 60_000 ? "Mostramos la última copia guardada mientras actualizamos el catálogo." : "");
        }
      } catch {
        if (!controller.signal.aborted) setError("No pudimos actualizar el catálogo. Conservamos la última copia guardada.");
      } finally {
        pending = false;
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 60_000);
    const onVisible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return { ...catalog, error, loading: false };
}
