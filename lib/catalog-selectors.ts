import type { Product } from "./product-model";
import { featuredIds, mainSeries } from "./catalog-presentation";
import { usesReferencePoster } from "./reference-artwork";

export function selectFeaturedProducts(products: Product[]) {
  const byId = new Map(products.map((product) => [product.id, product]));
  // Existing banners contain text inside their image, so they are editorial
  // assets rather than a generic template for arbitrary backend products.
  return featuredIds.map((id) => byId.get(id)).filter((product): product is Product => Boolean(product && usesReferencePoster(product)));
}

export function selectHomeSeries(series: string[]) {
  const curated = mainSeries.filter((name) => series.includes(name));
  return curated.length ? curated : series;
}
