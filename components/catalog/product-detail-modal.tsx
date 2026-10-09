"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Grid2X2, Package, Ruler, Sparkles, Star, X, ZoomIn } from "lucide-react";
import type { Product } from "../../lib/product-model";
import { seriesImages, modalMangaArtwork } from "../../lib/catalog-presentation";
import { productModal } from "../../lib/product-modal";
import { wa } from "../../lib/product-format";
import { WhatsAppIcon } from "../whatsapp-icon";

export function ProductDetailModal({ selected, onClose }: { selected: Product; onClose: () => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const modalData = productModal(selected);
  const gallery = modalData.photos;
  const selectedPhoto = gallery[photoIndex] || gallery[0];
  const figureSize = modalData.size;
  const productCollection = modalData.collection;
  const productEdition = modalData.edition;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { if (zoom) setZoom(false); else onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, onClose]);

  if (!selectedPhoto) return null;
  return <div className="store-product-backdrop" onClick={() => { onClose(); }}><div className="store-product-modal store-product-manga-modal" style={{ "--modal-background-image": selected.title.includes("Bakugo") ? "url(/illustrations/modal-manga/bakugo-modal-background.png)" : "url(/illustrations/manga-paper.webp)", "--modal-manga-image": modalMangaArtwork(selected.title) ? `url(/illustrations/modal-manga/${modalMangaArtwork(selected.title)}.png)` : "none" } as React.CSSProperties} role="dialog" aria-modal="true" aria-labelledby="store-product-title" tabIndex={-1} ref={dialogRef} onClick={e => e.stopPropagation()} onKeyDown={event => { if (event.key !== "Tab") return; const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href]') || [])].filter(element => element.offsetParent !== null); if (!focusable.length) return; if (event.shiftKey && (document.activeElement === focusable[0] || document.activeElement === dialogRef.current)) { event.preventDefault(); focusable[focusable.length - 1].focus(); } else if (!event.shiftKey && document.activeElement === focusable[focusable.length - 1]) { event.preventDefault(); focusable[0].focus(); } }}>
    <header className="store-manga-header">
      <div className="store-product-identity"><h2 id="store-product-title">{modalData?.titleImage ? <img className="store-product-brush-title" src={modalData.titleImage} alt={selected.title}/> : <><span>{selected.title.split(" ").slice(0,-1).join(" ")}</span>{" "}<em>{selected.title.split(" ").at(-1)}</em></>}</h2>{seriesImages[selected.series] && <img className="store-product-anime-logo" src={`/illustrations/${seriesImages[selected.series]}`} alt={selected.series}/>}</div>
      <button type="button" className="store-product-close" onClick={() => { onClose(); }} aria-label="Cerrar detalle"><X size={24}/></button>
    </header>
    <div className="store-manga-scroll"><div className={`store-product-gallery store-product-gallery-expanded${modalData?.preserveOriginal ? " store-product-gallery-original" : ""}`}>
      <div className="store-product-stage">
        {selectedPhoto.image ? <img className="store-product-stage-image" src={selectedPhoto.image} alt={`${selected.title} — ${selectedPhoto.label}`}/> : <span>Imagen por agregar</span>}
        {selectedPhoto.image && <button type="button" className="store-product-enlarge" title="Ampliar foto" aria-label="Ampliar foto" onClick={() => setZoom(true)}><ZoomIn size={18}/> Ampliar foto</button>}
        {gallery.length > 1 && <><button type="button" className="store-product-photo-prev" onClick={() => setPhotoIndex(i => (i - 1 + gallery.length) % gallery.length)} aria-label="Foto anterior"><ChevronLeft/></button><button type="button" className="store-product-photo-next" onClick={() => setPhotoIndex(i => (i + 1) % gallery.length)} aria-label="Foto siguiente"><ChevronRight/></button></>}
      </div>
      {gallery.length > 1 && <div className="store-product-thumbnails" aria-label="Fotos de la figura">{gallery.map((photo,i) => <button key={`${photo.image}-${i}`} type="button" className={i === photoIndex ? "active" : ""} onClick={() => setPhotoIndex(i)} aria-label={`Mostrar ${photo.label}`} aria-pressed={i === photoIndex}><img src={photo.image} alt=""/></button>)}</div>}
    </div>
    <div className="store-product-details store-product-brand">
      <div className="store-product-tags"><span><Star size={16}/>{modalData?.kind}</span><span><Package size={16}/>{productCollection}</span></div>
      <div className="store-manga-product-heading">
        <h3 className="store-manga-edition">{modalData?.editionImage ? <img className="store-manga-prize-art" src={modalData.editionImage} alt={productEdition || productCollection}/> : productEdition?.startsWith("Premio ") ? <>Premio <em>{productEdition.slice(7)}</em></> : productEdition || productCollection}</h3>
      </div>
      <dl className="store-manga-specs"><div><Package size={25}/><div><dt>Colección</dt><dd>{productCollection}</dd></div></div>{figureSize ? <div><Ruler size={25}/><div><dt>Altura</dt><dd>{figureSize}</dd></div></div> : <div><Sparkles size={25}/><div><dt>Serie</dt><dd>{selected.series}</dd></div></div>}{selected.quantity !== null && <div><Grid2X2 size={25}/><div><dt>Unidades</dt><dd>{selected.quantity}</dd></div></div>}</dl>
      <section className="store-manga-highlights" aria-labelledby="store-highlights-title">
        <h3 id="store-highlights-title">Lo que destaca</h3>
        <ul>
          {modalData?.highlights.map((feature, index) => <li key={`${index}-${feature.text}`}>{feature.iconSlot !== undefined ? <span className="store-manga-feature-icon-frame" aria-hidden="true" style={{ clipPath:feature.iconClip }}><img src={feature.icon} alt="" style={{ transform:`translateX(-${feature.iconSlot * 100 / 3}%)` }}/></span> : <img className="store-manga-feature-icon" src={feature.icon} alt="" width={54} height={54}/>}<span>{feature.text}</span></li>)}
        </ul>
      </section>
    </div>
    </div><footer className="store-manga-footer">
      <div className={`store-manga-price${selected.price === null ? " store-manga-price-unconfirmed" : ""}`}><strong>{selected.price === null ? "Consultar" : <><small>S/</small> {selected.price}</>}</strong></div>
      <p className="store-manga-inquiry"><WhatsAppIcon size={23}/><span>Consulta el estado y qué incluye por WhatsApp.</span></p>
      <a className="store-product-whatsapp" href={wa(selected)} target="_blank" rel="noreferrer"><WhatsAppIcon size={23}/><span>Consultar por WhatsApp</span><ArrowUpRight size={19}/></a>
    </footer>
  </div>{zoom && <div className="store-product-lightbox" onClick={e => e.stopPropagation()}><button type="button" onClick={() => setZoom(false)} aria-label="Cerrar imagen ampliada"><X/></button><img src={selectedPhoto.image} alt={`${selected.title} — ${selectedPhoto.label}, ampliado`}/>{modalData && <p className="store-product-lightbox-source"><span>{selectedPhoto.provenance ? "Referencia visual adaptada con IA" : "Foto original del catálogo"}</span><a href={modalData.originals[0].image} target="_blank" rel="noreferrer">Ver original sin editar<ArrowUpRight size={14}/></a></p>}</div>}</div>;
}
