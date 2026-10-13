import { ArrowUpRight, ChevronLeft } from "lucide-react";
import { type Product, statusLabels } from "../../lib/product-model";
import { seriesImages } from "../../lib/catalog-presentation";
import { WhatsAppIcon } from "../whatsapp-icon";
import { CollectionPhoto } from "./product-card";

export function SeriesGallery({ name, items, onOpen, onBack }: { name:string; items:Product[]; onOpen:(product:Product)=>void; onBack:()=>void }) {
  return <section className="store-series-gallery" aria-label={`Toda la colección de ${name}`}>
    <header className="series-gallery-heading">
      {seriesImages[name] ? <img className="series-gallery-logo" src={`/illustrations/${seriesImages[name]}`} alt={name}/> : <p className="series-gallery-name">{name}</p>}
      <h2><img src="/illustrations/series-gallery/collection-title.png" alt="Toda la colección"/></h2>
      <p className="series-gallery-count"><strong>{String(items.length).padStart(2,"0")}</strong> figuras</p>
      <button type="button" className="series-gallery-back" onClick={onBack}><ChevronLeft size={18}/>Volver al catálogo</button>
    </header>
    {items.length ? <div className={`series-gallery-grid ${items.length === 7 ? "seven-items" : ""}`}>
      {items.map(product => <article className="series-gallery-card" key={product.id} data-product-id={product.id}>
        <button type="button" className="series-gallery-photo" onClick={()=>onOpen(product)} aria-label={`Ver detalles de ${product.title}`}><CollectionPhoto product={product}/></button>
        <div className="series-gallery-caption">
          <h3>{product.title}</h3>
          {product.status !== "por_confirmar" && <p className="series-gallery-status">{statusLabels[product.status]}</p>}
          <div className="series-gallery-bottom"><strong>{product.price === null ? "Consultar" : <><span>S/</span> {product.price}</>}</strong><button type="button" onClick={()=>onOpen(product)} aria-label={`Ver figura ${product.title}`}>Ver figura<ArrowUpRight size={16}/></button></div>
        </div>
      </article>)}
    </div> : <div className="store-no-results"><h3>No encontramos figuras</h3><p>Prueba con otro personaje.</p></div>}
    <a className="series-gallery-help" href={`https://wa.me/51937809466?text=${encodeURIComponent(`Hola, tengo una consulta sobre la colección de ${name}.`)}`} target="_blank" rel="noreferrer"><WhatsAppIcon size={38}/><strong>¿Tienes alguna consulta?</strong><span>Escríbenos por WhatsApp y te ayudamos</span><ArrowUpRight size={32}/></a>
  </section>;
}
