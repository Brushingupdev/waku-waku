import { baseProducts } from "../data/reference-products";
import type { Product } from "./product-model";

const referenceById = new Map(baseProducts.map((product) => [product.id, product]));

// Keep the approved local design for reference products. Backend images take
// precedence as soon as their image, identity or gallery changes.
export function usesReferenceArtwork(product: Product) {
  const reference = referenceById.get(product.id);
  return !product.gallery?.length && reference?.image === product.image && reference.title === product.title;
}

export function usesReferencePoster(product: Product) {
  const reference = referenceById.get(product.id);
  return usesReferenceArtwork(product) && reference?.price === product.price && reference.status === product.status && reference.detail === product.detail && reference.series === product.series;
}
