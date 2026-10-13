import { getReferenceId, referenceMetadata } from "../../lib/product-presentation";
import { ProductSpecifications } from "./product-specifications";
import { ShoppingCart } from "lucide-react";
import { type Product, statusLabels } from "../../lib/product-model";
import { money } from "../../lib/product-format";
import { photoCrops, focalPositions, illustratedCollectionPhotos, collectionPhotos } from "../../lib/catalog-presentation";
import { usesReferenceArtwork } from "../../lib/reference-artwork";
import { approvedCommerceMedia } from "../../lib/commerce-media";
import { LoadingImage } from "../loading-image";

export function ProductPhoto({ product }: { product: Product }) {
  const crop = usesReferenceArtwork(product) && referenceMetadata.get(getReferenceId(product))?.source.startsWith("PDF") ? photoCrops[product.id] : undefined;
  return crop ? <span className="store-pdf-crop" role="img" aria-label={product.title} style={{ backgroundImage: `url("${product.image}")`, backgroundSize: `${crop[0]} auto`, backgroundPosition: crop[1] }}><LoadingImage className="skeleton-crop-probe" src={product.image!} alt="" aria-hidden="true" loading="lazy"/></span> : <LoadingImage src={product.image || "/illustrations/waku-logo.webp"} alt={product.title} loading="lazy" style={{ objectPosition: focalPositions[product.id] || "50% 0%" }}/>;
}

export function Figure({ product, onOpen, compact = false }: { product: Product; onOpen: (product: Product) => void; compact?: boolean }) {
  return <article data-product-id={product.id} className={`store-figure ${compact ? "compact" : ""}`}>
    <button className="store-figure-image" type="button" onClick={() => onOpen(product)} aria-label={`Ver detalles de ${product.title}`}>
      {product.image ? <ProductPhoto product={product}/> : <span>Imagen por agregar</span>}
    </button>
    <div className="store-figure-copy">
      <div className="store-figure-heading"><h3>{product.title}</h3>{compact ? <ProductSpecifications product={product}/> : <p>{product.series?.name || "Sin serie"}</p>}</div>
      <div className="store-figure-bottom"><strong>{money(product.price)}</strong><small className={`store-status status-${product.status}`}>{statusLabels[product.status]}</small><button type="button" onClick={() => onOpen(product)} aria-label={`Ver detalles de ${product.title}`}><ShoppingCart size={17}/></button></div>
    </div>
  </article>;
}

export function CollectionPhoto({product}:{product:Product}) {
  if (!usesReferenceArtwork(product)) return <ProductPhoto product={product}/>;
  const cloudImage = approvedCommerceMedia(product)?.presentation.collection;
  if (cloudImage) return <span className="store-collection-art"><LoadingImage className="store-collection-art-figure" src={cloudImage} alt={product.title} loading="lazy"/></span>;
  const visualId = getReferenceId(product);
  if(illustratedCollectionPhotos[visualId]) return <span className="store-collection-art"><LoadingImage className="store-collection-art-figure" src={illustratedCollectionPhotos[visualId]} alt={product.title} loading="lazy"/></span>;
  return collectionPhotos[visualId] ? <LoadingImage src={`https://tzhzafvmqyanagzrsqlz.supabase.co/storage/v1/object/public/catalog-images/presentation/729f468e1e7e38c0/illustrations/series-showcase/${collectionPhotos[visualId]}.webp`} alt={product.title} loading="lazy"/> : <ProductPhoto product={product}/>;
}
