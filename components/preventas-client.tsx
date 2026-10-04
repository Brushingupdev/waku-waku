"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, Download, ExternalLink, FileText, Maximize, Minus, Plus, X, ZoomIn } from "lucide-react";
import StorefrontShell from "./storefront-shell";
import { WhatsAppIcon } from "./whatsapp-icon";
import { pdfGroups } from "../data/preorder-catalogs";

const monthCovers = ["setiembre", "octubre", "noviembre", "enero"];

const image = (n: number) => `/catalogo/pdf/pagina-${String(n).padStart(2, "0")}.jpg`;

export default function PreventasClient() {
  const [groupIndex, setGroupIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const zoomViewport = useRef<HTMLDivElement>(null);
  const zoomPanel = useRef<HTMLDivElement>(null);
  const group = pdfGroups[groupIndex];
  const page = group.pages[pageIndex];
  const centerZoom = useCallback(() => {
    const viewport = zoomViewport.current;
    if (!viewport) return;
    viewport.scrollTo({
      left: (viewport.scrollWidth - viewport.clientWidth) / 2,
      top: (viewport.scrollHeight - viewport.clientHeight) / 2,
    });
  }, []);
  const openZoom = () => {
    const mobileScale = Math.min(4, Math.max(2.5, Math.round((((window.innerHeight - 108) * 16 / 9) / window.innerWidth) * 4) / 4));
    setZoomScale(window.innerWidth <= 720 ? mobileScale : 1);
    setZoom(true);
  };
  const message = `Hola, vi el catálogo de preventas de ${group.month} en Waku Waku. ¿Me confirman el precio y la disponibilidad?`;

  useEffect(() => {
    if (!zoom) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    zoomPanel.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoom(false);
      if (event.key !== "Tab") return;
      const buttons = Array.from(zoomPanel.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") || []);
      if (!buttons.length) return;
      if (event.shiftKey && (document.activeElement === buttons[0] || document.activeElement === zoomPanel.current)) { event.preventDefault(); buttons.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0].focus(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previousOverflow; previousFocus?.focus(); };
  }, [zoom]);

  useEffect(() => {
    if (!zoom || window.innerWidth > 720) return;
    const frame = requestAnimationFrame(centerZoom);
    return () => cancelAnimationFrame(frame);
  }, [zoom, centerZoom]);

  return <StorefrontShell active="preventas">
    <main className="preorder-library">
      <section className="preorder-library-hero" aria-labelledby="preorder-library-title"><div className="preorder-library-hero-copy">
        <p className="preorder-library-eyebrow">PREVENTAS WAKU WAKU</p>
        <h1 id="preorder-library-title">Tu próxima<span>figura te espera</span></h1>
        <p className="preorder-library-intro">Explora nuestro catálogo de preventas por mes.<br />Consulta precio y disponibilidad antes de separar.</p>
      </div></section>
      <div className="preorder-library-content">
        <div className="preorder-library-months" role="tablist" aria-label="Mes de preventa">{pdfGroups.map((month, index) => <button type="button" role="tab" aria-selected={index === groupIndex} aria-controls="preorder-month-panel" id={`preorder-month-${index}`} className={`preorder-library-month ${index === groupIndex ? "active" : ""}`} key={month.month} onClick={() => { setGroupIndex(index); setPageIndex(0); }}>
          <img src={`/illustrations/preventas-library/${monthCovers[index]}.png`} alt="" width={900} height={760}/>
          <span className="preorder-library-month-caption"><span><strong>{month.month}</strong><small>{month.pages.length} páginas</small></span><span className="preorder-library-month-arrow"><ChevronRight size={24}/></span></span>
        </button>)}</div>
        <section className="preorder-month-gallery" id="preorder-month-panel" role="tabpanel" aria-labelledby={`preorder-month-${groupIndex}`}>
          <header className="preorder-month-gallery-header">
            <div><h2>{group.month}</h2><p>Explora las {group.pages.length} páginas del mes.</p></div>
            <div className="preorder-month-gallery-tools">
              <a href="/catalogo/Waku-Preventas.pdf" target="_blank" rel="noreferrer"><FileText size={21} aria-hidden="true"/><span>Ver catálogo PDF</span><ExternalLink size={16} aria-hidden="true"/></a>
              <a href="/catalogo/Waku-Preventas.pdf" download="Waku-Waku-catalogo-preventas.pdf"><Download size={21} aria-hidden="true"/><span>Descargar catálogo completo</span></a>
            </div>
          </header>
          <div className="preorder-month-gallery-pages">{group.pages.map((item,index) => {
            const remaining = group.pages.length - 2;
            const lastRowClass = index >= 2 && remaining % 3 === 2 && index >= group.pages.length - 2 ? " paired" : index >= 2 && remaining % 3 === 1 && index === group.pages.length - 1 ? " centered" : "";
            return <button key={item} className={`preorder-month-gallery-page${index < 2 ? " featured" : ""}${lastRowClass}`} type="button" onClick={() => { setPageIndex(index); openZoom(); }} aria-label={`Ampliar página ${index+1} de ${group.month}`}>
              <img src={image(item)} alt={`Catálogo de ${group.month}, página ${index+1}`} width={1600} height={900} loading={index < 2 ? "eager" : "lazy"}/>
              <span><ZoomIn size={20} aria-hidden="true"/>Página {index+1}</span>
            </button>;
          })}</div>
          <a className="preorder-month-gallery-whatsapp" href={`https://wa.me/51937809466?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"><WhatsAppIcon/><span>Consultar por WhatsApp</span><ChevronRight size={22} aria-hidden="true"/></a>
        </section>
      </div>
    </main>
    {zoom && <div className="store-pdf-zoom" role="dialog" aria-modal="true" aria-label={`Página ${pageIndex+1} de ${group.month} ampliada`} onClick={() => setZoom(false)}><div className="store-pdf-zoom-panel" ref={zoomPanel} tabIndex={-1} onClick={(event) => event.stopPropagation()}><header><div><strong>{group.month}</strong><span>Página {pageIndex + 1} de {group.pages.length}</span></div><div className="store-pdf-zoom-actions"><button type="button" onClick={() => setZoomScale((value) => Math.max(1, value - .25))} disabled={zoomScale === 1} aria-label="Reducir zoom"><Minus /></button><span>{Math.round(zoomScale * 100)}%</span><button type="button" onClick={() => setZoomScale((value) => Math.min(4, value + .25))} disabled={zoomScale === 4} aria-label="Aumentar zoom"><Plus /></button><button className="fit" type="button" onClick={() => setZoomScale(1)} disabled={zoomScale === 1} aria-label="Ver página completa" title="Ver página completa"><Maximize /></button><button type="button" onClick={() => setZoom(false)} aria-label="Cerrar"><X /></button></div></header><p className="store-pdf-zoom-hint">Desliza para recorrer la página · Usa − y + para ajustar el tamaño</p><div className="store-pdf-zoom-scroll" ref={zoomViewport}><img src={image(page)} alt={`Catálogo ${group.month}, página ${page}`} style={{ width: `${zoomScale * 100}%` }} onLoad={() => { if (window.innerWidth <= 720) centerZoom(); }} /></div></div></div>}
  </StorefrontShell>;
}
