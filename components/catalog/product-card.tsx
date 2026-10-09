import { ShoppingCart } from "lucide-react";
import { type Product, statusLabels } from "../../lib/product-model";
import { money } from "../../lib/product-format";
import { photoCrops, focalPositions, illustratedCollectionPhotos, collectionPhotos } from "../../lib/catalog-presentation";
import { usesReferenceArtwork } from "../../lib/reference-artwork";
import { approvedCommerceMedia } from "../../lib/commerce-media";

export function ProductPhoto({ product }: { product: Product }) {
  const crop = usesReferenceArtwork(product) && product.source.startsWith("PDF") ? photoCrops[product.id] : undefined;
  return crop ? <span className="store-pdf-crop" role="img" aria-label={product.title} style={{ backgroundImage: `url("${product.image}")`, backgroundSize: `${crop[0]} auto`, backgroundPosition: crop[1] }} /> : <img src={product.image} alt={product.title} loading="lazy" style={{ objectPosition: focalPositions[product.id] || "50% 0%" }}/>;
}

export function Figure({ product, onOpen, compact = false }: { product: Product; onOpen: (product: Product) => void; compact?: boolean }) {
  return <article className={`store-figure ${compact ? "compact" : ""}`}>
    <button className="store-figure-image" type="button" onClick={() => onOpen(product)} aria-label={`Ver detalles de ${product.title}`}>
      {product.image ? <ProductPhoto product={product}/> : <span>Imagen por agregar</span>}
    </button>
    <div className="store-figure-copy">
      <div className="store-figure-heading"><h3>{product.title}</h3><p>{compact ? product.detail : product.series}</p></div>
      <div className="store-figure-bottom"><strong>{money(product.price)}</strong><small className={`store-status status-${product.status}`}>{statusLabels[product.status]}</small><button type="button" onClick={() => onOpen(product)} aria-label={`Ver detalles de ${product.title}`}><ShoppingCart size={17}/></button></div>
    </div>
  </article>;
}

export function CollectionPhoto({product}:{product:Product}) {
  if (!usesReferenceArtwork(product)) return <ProductPhoto product={product}/>;
  const cloudImage = approvedCommerceMedia(product)?.presentation.collection;
  if (cloudImage) return <span className="store-collection-art"><img className="store-collection-art-figure" src={cloudImage} alt={product.title} loading="lazy"/></span>;
  const visualId = product.referenceId || product.id;
  if(illustratedCollectionPhotos[visualId]) return <span className="store-collection-art"><img className="store-collection-art-figure" src={illustratedCollectionPhotos[visualId]} alt={product.title} loading="lazy"/></span>;
  return collectionPhotos[visualId] ? <img src={`/illustrations/series-showcase/${collectionPhotos[visualId]}.webp`} alt={product.title} loading="lazy"/> : <ProductPhoto product={product}/>;
}
