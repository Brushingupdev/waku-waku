import { baseProducts } from "../data/reference-products";
import seriesUrls from "../data/series-supabase-url-updates.json";
import type { Product } from "./models/product";
import type { ReferenceProduct } from "./reference-product-model";

export const commerceReferences: Record<string, { referenceId: string; file: string }> = {
  "e9392956-c405-48ce-ac6a-45e291e80cbe": { referenceId: "Da6q6QukYcK-1", file: "bakugo" },
  "10b1a137-4df9-42db-8d84-c8111b625edc": { referenceId: "DaGveDbnxoS-1", file: "douma" },
  "95b8d9d1-8dae-49a5-9ac8-9d1497cd7761": { referenceId: "DU6btvSARSm-1", file: "gojo" },
  "ead9d117-12fe-4160-8b44-81278d081a90": { referenceId: "DaELkMLHwJw-1", file: "killua" },
  "90f9e03c-83b1-41bc-a506-7fda36129264": { referenceId: "DVKO171kQPy-1", file: "law" },
  "945d96e8-5411-4aa6-90e3-62c42be2fe43": { referenceId: "DQ2tT3EEQoO-1", file: "miku" },
  "2a5e8649-bd0b-46e7-8d6d-6e76a8b9fa1e": { referenceId: "DU1S9PjgWPy-2", file: "rem" },
  "52b5480a-f8b5-4ee9-917e-e8a9697468d8": { referenceId: "DaoZfSFn3XY-1", file: "toga" },
};

export function referenceSpecifications(product: ReferenceProduct) {
  const parts = product.detail.split(" · ");
  const manufacturerLast = product.source.startsWith("PDF") && /^(Taito|SEGA|Ichiban Kuji)$/i.test(parts.at(-1) || "");
  return {
    collection: manufacturerLast ? `${parts.at(-1)} · ${parts[0]}` : parts[0] || null,
    edition: manufacturerLast ? parts[0] : parts.filter((part, index) => index > 0 && !/\bcm\b/i.test(part) && !/Precio por confirmar/i.test(part)).join(" · ") || null,
    height: product.detail.match(/\b\d+(?:[.,]\d+)?\s*cm\b/i)?.[0] || null,
  };
}

export function referenceCatalogProduct(product: ReferenceProduct): Product {
  const known = seriesUrls.find(series => series.name === product.series);
  const slug = product.series.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const series = known ? { id: known.id, name: known.name, slug: known.slug, logo_url: known.logo_url, order: seriesUrls.indexOf(known) } : { id: `reference-series:${slug}`, name: product.series, slug, logo_url: "", order: 0 };
  return { id: product.id, title: product.title, series_id: series.id, series, ...referenceSpecifications(product), price: product.price, status: product.status, quantity: product.quantity, image: product.image, gallery: product.gallery || [], highlights: [], visible: product.visible };
}

export const referenceCatalogProducts = baseProducts.map(referenceCatalogProduct);
export const referenceById = new Map(referenceCatalogProducts.map(product => [product.id, product]));
export const referenceMetadata = new Map(baseProducts.map(product => [product.id, product]));
export const getReferenceId = (product: Product) => commerceReferences[product.id]?.referenceId || product.id;
