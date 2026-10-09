"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Package, Search, X } from "lucide-react";
import { type Product, type ProductStatus, statusLabels } from "../lib/product-model";
import { sidebarSeries, showcaseArt, showcaseImage, sideCaptionImage, seriesImages } from "../lib/catalog-presentation";
import { selectFeaturedProducts, selectHomeSeries } from "../lib/catalog-selectors";
import { wa, money } from "../lib/product-format";
import { useCatalogProducts } from "../hooks/use-catalog-products";
import { useSeries } from "../hooks/use-series";
import StorefrontShell from "./storefront-shell";
import CollectorCommunity from "./collector-community";
import { WhatsAppIcon } from "./whatsapp-icon";
import { ProductDetailModal } from "./catalog/product-detail-modal";
import { Figure } from "./catalog/product-card";
import { SeriesGallery } from "./catalog/series-gallery";
import { SeriesCarousel } from "./catalog/series-carousel";
import { AnimeLogoMarquee } from "./catalog/anime-logo-marquee";

export default function CatalogClient() {
  const { products, error: loadError } = useCatalogProducts();
  const { series: apiSeries, error: seriesError } = useSeries();
  useEffect(() => {
    if (seriesError) console.error("No se pudo cargar /api/series:", seriesError);
  }, [seriesError]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const initialQuery = new URLSearchParams(window.location.search).get("q");
    // Read browser-only search params after hydration so the server and first client render agree.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialQuery) setQuery(initialQuery);
  }, []);
  const [status, setStatus] = useState<"todos" | ProductStatus>("todos");
  const [series, setSeries] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(1);
  const [selected, setSelected] = useState<Product | null>(null);
  const notice = loadError ? "Mostramos el catálogo de referencia. Consulta las actualizaciones por WhatsApp." : "";
  const touchStart = useRef(0);

  const visible = useMemo(() => products.filter(p => p.visible), [products]);
  const allSeries = useMemo(() => [...new Set(visible.map(p => p.series))].sort((a,b) => a.localeCompare(b,"es")), [visible]);
  const localOrderedSeries = [...sidebarSeries.filter(name => allSeries.includes(name)), ...allSeries.filter(name => !sidebarSeries.includes(name))];
  const orderedSidebarSeries = apiSeries.length ? apiSeries.map(s => s.name) : localOrderedSeries;
  const marqueeLogos = Object.fromEntries(apiSeries.map(s => [s.name, s.logo_url]));
  const featured = selectFeaturedProducts(visible);
  const matches = visible.filter(p => (series === null || p.series === series) && (status === "todos" || p.status === status) && `${p.title} ${p.series} ${p.detail}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es").trim()));
  const filtered = !!query.trim() || status !== "todos" || series !== null;
  useEffect(() => {
    if (featured.length < 2 || selected) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setHeroIndex(index => (index + 1) % featured.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [featured.length, heroIndex, selected]);
  const moveHero = (step: number) => setHeroIndex(i => (i + step + featured.length) % featured.length);
  const heroAt = (offset: number) => featured[(heroIndex + offset + featured.length) % featured.length];
  const clear = () => { setQuery(""); setStatus("todos"); setSeries(null); };
  const selectSeries = (name: string | null) => { setSeries(name); setStatus("todos"); };

  return <StorefrontShell active="catalogo" search={<label className="store-catalog-search" id="buscar"><Search size={20}/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar personaje, serie o figura..." aria-label="Buscar figuras"/>{query && <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><X size={16}/></button>}</label>}><main className="store-catalog-page">
    <h1 className="sr-only">Catálogo de figuras Waku Waku</h1>
    {notice && <p className="store-load-notice" role="status">{notice}</p>}
    <div className="store-catalog-layout">
    <div className="store-catalog-content">
    {!series && <section className="store-catalog-top">
      {featured.length > 1 && <div className="store-featured-wrap"><div className="store-featured" onTouchStart={e => { touchStart.current = e.touches[0].clientX; }} onTouchEnd={e => { const delta = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(delta) > 50) moveHero(delta < 0 ? 1 : -1); }}>
        {([-1,0,1] as const).map(offset => { const p = heroAt(offset); return <article key={`${p.id}-${offset}`} style={{ "--manga-accent": showcaseArt[p.id]?.accent } as React.CSSProperties} className={`store-feature-card store-showcase-card ${offset === 0 ? "center" : "side"} showcase-theme-${(heroIndex + offset + featured.length) % featured.length % 4}`}><button type="button" className="store-feature-photo" onClick={() => setSelected(p)} aria-label={`Ver detalle de ${p.title}`}><img src={showcaseImage(p, offset === 0)} alt={offset === 0 ? `${p.title}, ${money(p.price)}, ${statusLabels[p.status]}, ${p.detail}` : p.title}/></button><img className="store-showcase-brand" src="/illustrations/waku-logo.png" alt="Waku Waku"/><div className="store-feature-copy">{offset !== 0 && sideCaptionImage(p) && <img className="store-side-lettering" src={sideCaptionImage(p)} alt="" aria-hidden="true" width={900} height={450}/ >}{offset === 0 && seriesImages[p.series] && <img className="store-feature-series-logo" src={`/illustrations/${seriesImages[p.series]}`} alt=""/>}<h2>{p.title}</h2><div className="store-feature-price"><strong>{p.price === null ? "Consultar" : <><span>S/</span> {p.price}</>}</strong><small className={`store-status status-${p.status}`}>{statusLabels[p.status]}</small></div>{offset === 0 && <><div className="store-feature-actions"><a href={wa(p)} aria-label={`Consultar por WhatsApp sobre ${p.title}`} target="_blank" rel="noreferrer"><WhatsAppIcon size={19}/>Consultar por WhatsApp<ArrowUpRight className="store-hero-cta-arrow" size={21}/></a></div><p><Package size={17}/>{p.detail}</p></>}</div></article>; })}
      </div><div className="store-feature-controls"><button type="button" onClick={() => moveHero(-1)} aria-label="Destacados anteriores"><ChevronLeft/></button><span>{featured.map((p,i) => <button type="button" key={p.id} className={heroIndex === i ? "active" : ""} onClick={() => setHeroIndex(i)} aria-label={`Ver destacado ${i+1}`} aria-pressed={heroIndex === i}/>)}</span><button type="button" onClick={() => moveHero(1)} aria-label="Destacados siguientes"><ChevronRight/></button></div></div>}

    </section>}
    {!series && apiSeries.length > 0 && <AnimeLogoMarquee names={orderedSidebarSeries} logos={marqueeLogos} selected={series} onSelect={selectSeries}/>}
    {series ? <SeriesGallery name={series} items={matches} onOpen={setSelected} onBack={clear}/> : filtered ? <section className="store-results"><div className="store-section-heading"><div><span className="store-kicker">EXPLORA WAKU WAKU</span><h1>{series || "Resultados"}</h1><p>{matches.length} {matches.length === 1 ? "figura" : "figuras"}</p></div><button type="button" onClick={clear}>Mostrar todo ×</button></div>{matches.length ? <div className="store-results-grid">{matches.map(p => <Figure key={p.id} product={p} onOpen={setSelected}/>)}</div> : <div className="store-no-results"><h2>No encontramos figuras</h2><p>Prueba con otra serie, personaje o estado.</p><button type="button" onClick={clear}>Ver todo el catálogo</button></div>}</section> : <div className="store-home-content">
      {selectHomeSeries(allSeries).map(name => <SeriesCarousel key={name} name={name} items={visible.filter(p => p.series === name)} onOpen={setSelected} onSeeAll={() => { setSeries(name); window.scrollTo({top:0,behavior:"smooth"}); }}/>) }
      <CollectorCommunity whatsappIcon={<WhatsAppIcon size={29}/>}/>
    </div>}
    </div>
    </div>
    <p className="store-fineprint">Confirma precio y disponibilidad actual por WhatsApp antes de separar una figura.</p>
  </main>{selected && <ProductDetailModal key={selected.id} selected={selected} onClose={() => setSelected(null)}/>}</StorefrontShell>;
}
