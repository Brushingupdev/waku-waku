import media from "../data/commerce-media.json";
import { getReferenceId } from "./product-presentation";
import type { Product } from "./product-model";

type ApprovedMedia = {
  referenceId: string;
  image: string;
  presentation: { hero: string | null; side: string | null; lettering: string | null; collection: string | null };
  gallery: { image: string; label: string; provenance: "generated" | "adapted" | null }[];
};
const approved: Record<string, ApprovedMedia> = media as Record<string, ApprovedMedia>;

// Use curated artwork only while the API still points to this reviewed image.
// A later image replacement takes precedence over every editorial resource.
export function approvedCommerceMedia(product: Product) {
  const entry = approved[product.id];
  return entry && entry.referenceId === getReferenceId(product) && entry.image === product.image ? entry : undefined;
}
