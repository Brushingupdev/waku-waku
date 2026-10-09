import type { Product } from "./product-model";
import { featuredIds, mainSeries } from "./catalog-presentation";
import { usesReferencePoster } from "./reference-artwork";

export function selectFeaturedProducts(products: Product[]) {
  const byId = new Map(products.map((product) => [product.referenceId || product.id, product]));
  // Existing banners contain text inside their image, so they are editorial
  // assets rather than a generic template for arbitrary backend products.
  return featuredIds.map((id) => byId.get(id === "Da6q6QukYcK-2" && byId.get("Da6q6QukYcK-1")?.referenceId ? "Da6q6QukYcK-1" : id)).filter((product): product is Product => Boolean(product && (product.referenceId || usesReferencePoster(product))));
}

export function selectHomeSeries(series: string[]) {
  const curated = mainSeries.filter((name) => series.includes(name));
  return curated.length ? curated : series;
}
