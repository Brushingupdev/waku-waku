import { baseProducts } from "../data/reference-products";
import type { Product } from "./product-model";
import { commerceReferences } from "./commerce-products";
import { approvedCommerceMedia } from "./commerce-media";

const referenceById = new Map(baseProducts.map((product) => [product.id, product]));

// Keep the approved local design for reference products. Backend images take
// precedence as soon as their image, identity or gallery changes.
export function usesReferenceArtwork(product: Product) {
  const reference = referenceById.get(product.referenceId || product.id);
  const association = commerceReferences[product.id];
  if (association && association.referenceId === product.referenceId) {
    // These are the reviewed placeholder paths. New images must take precedence.
    return reference?.title === product.title && (Boolean(approvedCommerceMedia(product)) || product.image === `http://127.0.0.1:8000/uploads/carousel/${association.file}.png`);
  }
  return !product.gallery?.length && reference?.image === product.image && reference.title === product.title;
}

export function usesReferencePoster(product: Product) {
  if (product.referenceId === "Da6q6QukYcK-1") return false; // This variant has no approved hero poster.
  const reference = referenceById.get(product.referenceId || product.id);
  const normalize = (value: string) => value.replace(/α/g, "");
  return usesReferenceArtwork(product) && reference?.price === product.price && reference.status === product.status && normalize(reference.detail) === normalize(product.detail) && reference.series === product.series;
}
