import { catalogSnapshotSchema } from "./catalog-snapshot";

export async function requestCatalogSnapshot(signal: AbortSignal, request: typeof fetch = fetch, timeoutMs = 12000) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  signal.addEventListener("abort", cancel, { once: true });
  if (signal.aborted) cancel();
  const timeout = setTimeout(cancel, timeoutMs);
  try {
    const response = await request("/catalog-data", { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error("No se pudo actualizar el catálogo.");
    return catalogSnapshotSchema.parse(await response.json());
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener("abort", cancel);
  }
}
