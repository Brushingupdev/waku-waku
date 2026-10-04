import assets from "./modal-product-assets.json";
import additionalViews from "./modal-product-views.json";
import editionLettering from "./modal-edition-lettering.json";
import characterTitles from "./modal-character-titles.json";
import featureIcons from "./modal-feature-icons.json";
import type { Product } from "./product-model";
import { usesReferenceArtwork } from "./reference-artwork";

export type ModalPhoto = {
  image: string;
  label: string;
  provenance?: "generated" | "adapted";
};
type ModalAsset = {
  image: string;
  source: string;
  highlights: string[];
  preserveOriginal: boolean;
  pending: boolean;
};
const visuals: Record<string, ModalAsset> = assets;
const views: Record<string, ModalPhoto[]> = additionalViews as Record<string, ModalPhoto[]>;
const lettering: Record<string, string> = editionLettering;
const nameArtwork: Record<string, string> = characterTitles;
const featureArtwork: Record<string, string> = featureIcons;
const iconRoot = "/illustrations/modal-products/";
const bakugoPhotos: ModalPhoto[] = [
  { image:`${iconRoot}bakugo-front-horizontal.png`, label:"Frontal · IA", provenance:"generated" },
  { image:`${iconRoot}bakugo-original-landscape.png`, label:"Foto adaptada con IA", provenance:"adapted" },
  { image:`${iconRoot}bakugo-side-view.png`, label:"Lateral · IA", provenance:"generated" },
  { image:`${iconRoot}bakugo-rear-view.png`, label:"Posterior · IA", provenance:"generated" },
];

export function productModal(product: Product) {
  const referenceArtwork = usesReferenceArtwork(product);
  const asset = referenceArtwork ? visuals[product.id] : undefined;
  const parts = product.detail.split(" · ");
  const size = product.detail.match(/\b\d+(?:[.,]\d+)?\s*cm\b/i)?.[0];
  const manufacturerLast = product.source.startsWith("PDF") && /^(Taito|SEGA|Ichiban Kuji)$/i.test(parts.at(-1) || "");
  const collection = manufacturerLast ? `${parts.at(-1)} · ${parts[0]}` : parts[0];
  const edition = manufacturerLast ? parts[0] : parts.filter((part, index) => index > 0 && !/\bcm\b/i.test(part) && !/Precio por confirmar/i.test(part)).join(" · ");
  const kind = /Insignia/i.test(product.detail) ? "Insignia de colección" : /Set/i.test(product.detail) ? "Set de colección" : /Ilustración/i.test(product.detail) ? "Ilustración de referencia" : "Figura de colección";
  const customBakugo = product.id === "Da6q6QukYcK-1" || product.id === "Da6q6QukYcK-2";
  const icons = customBakugo ? ["icon-costume.png", "icon-gauntlet.png", "icon-armor.png"] : ["icon-detail.png", "icon-design.png", "icon-accent.png"];
  const featureStrip = referenceArtwork ? featureArtwork[product.id] : undefined;
  const highlights = (asset?.highlights || [product.title, collection, product.series]).map((text, index) => ({
    text,
    icon:featureStrip || iconRoot + icons[index % icons.length],
    iconSlot:featureStrip ? index : undefined,
    // Exclude the neighboring cape tip from the repaired Eren sheet's second cell.
    iconClip:featureStrip?.endsWith("features-12-v2.png") && index === 1 ? "inset(0 0 0 6%)" : undefined,
  }));
  const hasBackendGallery = Boolean(product.gallery?.length);
  const preserveOriginal = hasBackendGallery || !asset || asset.preserveOriginal || asset.pending;
  const primary: ModalPhoto = { image:asset?.image || product.image, label:preserveOriginal ? "Foto original" : "Vista horizontal adaptada con IA", provenance:!preserveOriginal ? "adapted" : undefined };
  const existingPhotos = referenceArtwork && product.id === "Da6q6QukYcK-2" ? bakugoPhotos : [primary];
  const photos: ModalPhoto[] = product.gallery?.length ? product.gallery : [...existingPhotos, ...(referenceArtwork ? views[product.id] || [] : [])];
  // Preserve source references outside the fixed-ratio main gallery.
  const originals = product.gallery?.length ? product.gallery : [{ image:product.image, label:"Foto original" }];
  return { photos, originals, size, collection, edition, editionImage:lettering[edition || collection], titleImage:nameArtwork[product.title], kind, highlights, preserveOriginal };
}
