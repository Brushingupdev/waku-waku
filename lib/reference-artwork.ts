import { referenceById, commerceReferences, getReferenceId } from "./product-presentation";
import type { Product } from "./product-model";

import { approvedCommerceMedia } from "./commerce-media";
import { productSpecifications } from "./product-specifications";

// Keep the approved local design for reference products. Backend images take
// precedence as soon as their image, identity or gallery changes.
export function usesReferenceArtwork(product: Product) {
  const reference = referenceById.get(getReferenceId(product));
  const association = commerceReferences[product.id];
  if (association && association.referenceId === getReferenceId(product)) {
    // These are the reviewed placeholder paths. New images must take precedence.
    return reference?.title === product.title && (Boolean(approvedCommerceMedia(product)) || product.image === `http://127.0.0.1:8000/uploads/carousel/${association.file}.png`);
  }
  return !product.gallery?.length && reference?.image === product.image && reference.title === product.title;
}

export function usesReferencePoster(product: Product) {
  if (getReferenceId(product) === "Da6q6QukYcK-1") return false; // This variant has no approved hero poster.
  const reference = referenceById.get(getReferenceId(product));
  const normalize = (value: string) => value.replace(/α/g, "");
  if (!reference) return false;
  const expected = productSpecifications(reference);
  const actual = productSpecifications(product);
  const matchingSpecs = (Object.keys(expected) as (keyof typeof expected)[]).every(key => normalize(expected[key] || "") === normalize(actual[key] || ""));
  return usesReferenceArtwork(product) && reference.price === product.price && reference.status === product.status && matchingSpecs && reference.series_id === product.series_id;
}
