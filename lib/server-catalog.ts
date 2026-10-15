import { unstable_cache } from "next/cache";
import seed from "../data/catalog-snapshot.json";
import { catalogSnapshotSchema, loadCatalogSnapshot } from "./catalog-snapshot";

export const catalogSeed = catalogSnapshotSchema.parse(seed);

const readCachedCatalog = unstable_cache(
  async (base: string) => loadCatalogSnapshot(base),
  ["public-catalog-snapshot-v2-site"],
  { revalidate: 60, tags: ["public-catalog"] },
);

export async function getPublishedCatalog() {
  const base = process.env.API_BASE_URL?.trim() || process.env.NEXT_PUBLIC_COMMERCE_API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!base) return catalogSeed;
  try {
    return await readCachedCatalog(base);
  } catch {
    // A verified public snapshot also covers a cold/evicted cache and builds
    // during an outage. It is never written over a successful cached response.
    return catalogSeed;
  }
}
