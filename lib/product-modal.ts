import assets from "./modal-product-assets.json";
import additionalViews from "./modal-product-views.json";
import editionLettering from "./modal-edition-lettering.json";
import characterTitles from "./modal-character-titles.json";
import featureIcons from "./modal-feature-icons.json";
import { getReferenceId } from "./product-presentation";
import type { Product } from "./product-model";
import { productSpecifications } from "./product-specifications";
import { usesReferenceArtwork } from "./reference-artwork";
import { approvedCommerceMedia } from "./commerce-media";

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
  const approved = approvedCommerceMedia(product);
  const visualId = getReferenceId(product);
  const asset = referenceArtwork ? visuals[visualId] : undefined;
  const specs = productSpecifications(product);
  const size = specs.height || undefined;
  const collection = specs.collection || "Colección por confirmar";
  const edition = specs.edition || "";
  const kind = /Insignia/i.test(collection) ? "Insignia de colección" : /Set/i.test(collection) ? "Set de colección" : /Ilustración/i.test(collection) ? "Ilustración de referencia" : "Figura de colección";
  const customBakugo = visualId === "Da6q6QukYcK-1" || visualId === "Da6q6QukYcK-2";
  const icons = customBakugo ? ["icon-costume.png", "icon-gauntlet.png", "icon-armor.png"] : ["icon-detail.png", "icon-design.png", "icon-accent.png"];
  const featureStrip = referenceArtwork ? featureArtwork[visualId] : undefined;
  const highlights = (product.highlights?.length ? product.highlights : asset?.highlights || [product.title, collection, product.series?.name || "Sin serie"]).map((text, index) => ({
    text,
    icon:featureStrip || iconRoot + icons[index % icons.length],
    iconSlot:featureStrip ? index : undefined,
    // Exclude the neighboring cape tip from the repaired Eren sheet's second cell.
    iconClip:featureStrip?.endsWith("features-12-v2.png") && index === 1 ? "inset(0 0 0 6%)" : undefined,
  }));
  const hasBackendGallery = Boolean(product.gallery?.length);
  const preserveOriginal = hasBackendGallery || !asset || asset.preserveOriginal || asset.pending;
  const primary: ModalPhoto = { image:asset?.image || product.image || "/illustrations/waku-logo.png", label:preserveOriginal ? "Foto original" : "Vista horizontal adaptada con IA", provenance:!preserveOriginal ? "adapted" : undefined };
  const existingPhotos = referenceArtwork && visualId === "Da6q6QukYcK-2" ? bakugoPhotos : [primary];
  const photos: ModalPhoto[] = product.gallery?.length ? product.gallery.map(photo => {
    const provenance = approved?.gallery.find(item => item.image === photo.image)?.provenance;
    if (provenance) return { ...photo, provenance };
    return referenceArtwork && asset && !asset.preserveOriginal && !asset.pending && photo.image === product.image ? { ...photo, provenance: "adapted" as const } : photo;
  }) : [...existingPhotos, ...(referenceArtwork ? views[visualId] || [] : [])];
  // Preserve source references outside the fixed-ratio main gallery.
  const originals = product.gallery?.length ? product.gallery : [{ image:product.image || "/illustrations/waku-logo.png", label:"Foto original" }];
  return { photos, originals, size, collection, edition, editionImage:lettering[edition || collection], titleImage:nameArtwork[product.title], kind, highlights, preserveOriginal };
}
