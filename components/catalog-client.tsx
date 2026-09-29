"use client";

import { useEffect, useMemo, useState } from "react";
import { baseProducts, pdfGroups } from "../lib/catalog";
import { type Product, type ProductStatus, statusLabels } from "../lib/product-model";

function SiteHeader({ showPdf }: { showPdf: () => void }) {
  return <header className="site-header">
    <a className="brand" href="/" aria-label="Waku Waku, inicio"><span className="brand-mark">わく<br/>わく</span><span className="brand-name">waku waku<span>store</span></span></a>
    <nav className="site-nav" aria-label="Principal"><a className="active" href="/">Catálogo</a><button type="button" onClick={showPdf}>Preventas</button><a href="/admin">Gestionar</a></nav>
    <a className="header-contact" href="https://wa.me/51937809466" target="_blank" rel="noreferrer">Escríbenos ↗</a>
  </header>;
}

function whatsAppUrl(product: Product) {
  const message = `Hola, vi ${product.title} (${product.detail}) en el catálogo Waku Waku. ¿Me confirman su disponibilidad y precio?`;
  return `https://wa.me/51937809466?text=${encodeURIComponent(message)}`;
}

export default function CatalogClient() {
  const [products, setProducts] = useState<Product[]>(baseProducts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todos" | ProductStatus>("todos");
  const [view, setView] = useState<"figuras" | "pdf">("figuras");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudieron cargar los cambios.");
      setProducts(data.products);
    }).catch(() => setNotice("No se pudieron cargar las actualizaciones. Se muestra el catálogo de referencia."));
  }, []);

  const visible = useMemo(() => products.filter((product) => product.visible && (filter === "todos" || product.status === filter) && `${product.title} ${product.detail} ${product.series}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es").trim())), [products, filter, query]);

  return <main className="shell">
    <SiteHeader showPdf={() => { setView("pdf"); document.getElementById("catalog-title")?.scrollIntoView({ behavior: "smooth" }); }} />
    <section className="catalog-heading"><div><div className="eyebrow"><span className="sparkle">✳</span> FIGURAS, PREVENTAS Y MÁS</div><h1>Encuentra tu próxima <em>pieza favorita.</em></h1><p>Explora las figuras de Waku Waku y consulta cada producto por WhatsApp.</p></div><div className="heading-illustration" aria-hidden="true"><span>W</span><span className="orbit orbit-a">✦</span><span className="orbit orbit-b">✳</span></div></section>
    <section className="catalog-section" aria-labelledby="catalog-title">
      <div className="section-top"><div><span className="eyebrow">COLECCIÓN WAKU</span><h2 id="catalog-title">Explora el catálogo <span>↘</span></h2></div><p>Precios de las publicaciones originales. Confirma precio y disponibilidad antes de reservar.</p></div>
      <div className="view-tabs" role="tablist" aria-label="Tipo de catálogo"><button type="button" role="tab" aria-selected={view === "figuras"} className={view === "figuras" ? "selected" : ""} onClick={() => setView("figuras")}>Figuras individuales</button><button type="button" role="tab" aria-selected={view === "pdf"} className={view === "pdf" ? "selected" : ""} onClick={() => setView("pdf")}>Catálogo de preventas · PDF</button></div>
      {notice && <p className="notice" role="status">{notice}</p>}
      {view === "figuras" ? <>
        <div className="catalog-toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar personaje, serie o figura" aria-label="Buscar productos" /></label><div className="chips" aria-label="Filtrar por estado">{(["todos", "disponible", "preventa", "separado", "agotado", "por_confirmar"] as const).map((item) => <button type="button" key={item} className={`chip ${filter === item ? "selected" : ""}`} onClick={() => setFilter(item)}>{item === "todos" ? "Todos" : statusLabels[item]}</button>)}</div></div>
        <p className="result-count">{visible.length} {visible.length === 1 ? "figura" : "figuras"}</p>
        {visible.length ? <div className="product-grid">{visible.map((product) => <article className="product-card" key={product.id}><div className="product-image">{product.image ? <img src={product.image} alt={product.title} loading="lazy" /> : <div className="image-empty">Waku Waku</div>}<span className={`status-pill status-${product.status}`}>{statusLabels[product.status]}</span></div><div className="product-copy"><div><p className="product-series">{product.series}</p><h3>{product.title}</h3><p>{product.detail}</p></div><div className="product-bottom"><div><strong>{product.price === null ? "Consultar" : `S/ ${product.price}`}</strong>{product.quantity !== null && <small>{product.quantity} {product.quantity === 1 ? "unidad" : "unidades"}</small>}</div><a href={whatsAppUrl(product)} target="_blank" rel="noreferrer" aria-label={`Consultar ${product.title} por WhatsApp`}>Consultar ↗</a></div></div></article>)}</div> : <div className="empty-state">No encontramos figuras con esos filtros.</div>}
      </> : <div id="preventas" className="pdf-catalog"><p className="pdf-intro">Estas son las páginas del PDF original. Los precios y marcas de «Separado» se ven en cada imagen; el estado actual se gestiona en las fichas individuales.</p>{pdfGroups.map((group) => <section className="pdf-group" key={group.month}><h3>{group.month}</h3><div className="pdf-grid">{group.pages.map((page) => <a href={`/catalogo/pdf/pagina-${String(page).padStart(2, "0")}.jpg`} target="_blank" rel="noreferrer" key={page}><img src={`/catalogo/pdf/pagina-${String(page).padStart(2, "0")}.jpg`} alt={`Catálogo ${group.month}, página ${page}`} loading="lazy"/><span>Ver página {page} ↗</span></a>)}</div></section>)}</div>}
    </section>
    <footer className="site-footer"><span>waku waku store</span><p>Figuras y coleccionables · Perú</p><a href="https://www.instagram.com/wakuwaku.pe/" target="_blank" rel="noreferrer">Instagram ↗</a></footer>
  </main>;
}
