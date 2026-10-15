import { z } from "zod";
import { productSchema } from "./models/product";
import { siteSettingsSchema, siteBannerSchema } from "./site-content";
import { seriesSchema } from "./models/series";
import { collectorSchema } from "./models/collector";

export const catalogSnapshotSchema = z.object({
  products: z.array(productSchema),
  series: z.array(seriesSchema),
  collectors: z.array(collectorSchema),
  settings: siteSettingsSchema.optional(),
  banners: z.array(siteBannerSchema).default([]),
  updatedAt: z.string().datetime(),
});
export type CatalogSnapshot = z.infer<typeof catalogSnapshotSchema>;

export function formatCatalogTimestamp(updatedAt: string) {
  // Peru uses UTC-5. Explicit fields avoid ICU punctuation differences between
  // Node and browsers, which would otherwise cause hydration mismatches.
  const local = new Date(Date.parse(updatedAt) - 5 * 60 * 60_000).toISOString();
  return `${local.slice(8, 10)}/${local.slice(5, 7)}/${local.slice(0, 4)} ${local.slice(11, 16)} (hora Perú)`;
}

// Only a fully validated response is allowed into the shared cache. Throwing on
// failure lets Next retain its last successful entry during revalidation.
export async function loadCatalogSnapshot(base: string, request: typeof fetch = fetch): Promise<CatalogSnapshot> {
  const origin = base.replace(/\/+$/, "").replace(/\/api$/, "");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const read = async (path: string) => {
    const response = await request(`${origin}/api/${path}`, { cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new Error(`No se pudo actualizar ${path} (HTTP ${response.status}).`);
    return response.json();
  };
  try {
    const bundle = z.object({
      settings: siteSettingsSchema,
      banners: z.array(siteBannerSchema),
      products: z.array(productSchema),
      series: z.array(seriesSchema.extend({ is_active: z.boolean().default(true) })),
      collectors: z.array(collectorSchema),
    }).parse(await read("site"));
    return {
      products: bundle.products.filter(p => p.visible),
      series: bundle.series.filter(s => s.is_active).sort((a, b) => a.order - b.order),
      collectors: bundle.collectors.filter(c => c.is_active).sort((a, b) => a.order - b.order),
      settings: bundle.settings,
      banners: bundle.banners.filter(b => b.is_active).sort((a,b) => a.order - b.order),
      updatedAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
    controller.abort();
  }
}
