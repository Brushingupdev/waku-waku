"use client";

import { useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getReferenceId } from "../../lib/product-presentation";
import type { Product } from "../../lib/product-model";
import { seriesImages, seriesSpotlights } from "../../lib/catalog-presentation";
import { CollectionPhoto } from "./product-card";

export function SeriesCarousel({ name, items, onOpen, onSeeAll }: { name:string; items:Product[]; onOpen:(p:Product)=>void; onSeeAll:()=>void }) {
  const spotlight = seriesSpotlights[name];
  const priority = name==="My Hero Academia" ? [spotlight.id,"DaoZfSFn3XY-1","DaoZfSFn3XY-2","Da6q6QukYcK-1"] : name==="Vocaloid" ? [spotlight.id,"pdf-5-snow-miku","pdf-5-miku-fashion","pdf-5-miku-figurizm"] : spotlight ? [spotlight.id] : [];
  const ordered = [...priority.map(id=>items.find(p=>(getReferenceId(p))===id)).filter((p):p is Product=>!!p), ...items.filter(p=>!priority.includes(getReferenceId(p)))];
  const [slide, setSlide] = useState(0);
  const index = slide % ordered.length;
  const main = ordered[index];
  const supporting = Array.from({length:Math.min(3,ordered.length-1)},(_,i)=>ordered[(index+i+1)%ordered.length]);
  const move = (step:number) => setSlide(i=>(i+step+ordered.length)%ordered.length);
  if (!main) return null;
  return <section className="store-series-section store-collection-carousel" aria-label={`Carrusel de ${name}`} aria-roledescription="carrusel">
    <div className="store-section-heading"><div>{seriesImages[name] ? <img className="store-series-logo" src={`/illustrations/${seriesImages[name]}`} alt=""/> : <p className="series-gallery-name">{name}</p>}<h2 className="sr-only">{name}</h2><p className="store-series-count"><strong>{String(items.length).padStart(2,"0")}</strong><span>figuras</span></p></div><button className="store-collection-see" type="button" onClick={onSeeAll}>Ver toda la serie <ArrowUpRight size={17}/></button></div>
    <div className="store-collection-stage">
      <article className="store-collection-featured"><button className="store-collection-photo" type="button" onClick={()=>onOpen(main)} aria-label={`Ver figura ${main.title}`}>
        <CollectionPhoto product={main}/>
      </button><div className="store-collection-featured-copy"><div><h3>{main.title}</h3><strong className="store-collection-price">{main.price === null ? <small>Consultar</small> : <><span>S/</span> {main.price}</>}</strong></div><button type="button" onClick={()=>onOpen(main)}>Ver figura <ArrowUpRight size={17}/></button></div></article>
      <div className={`store-collection-support count-${supporting.length}`}>{supporting.map(p=><article className="store-collection-small" key={p.id}><button className="store-collection-photo" type="button" onClick={()=>onOpen(p)} aria-label={`Ver figura ${p.title}`}><CollectionPhoto product={p}/></button><div className="store-collection-small-copy"><div><h3>{p.title}</h3><strong className="store-collection-price">{p.price === null ? <small>Consultar</small> : <><span>S/</span> {p.price}</>}</strong></div><button type="button" onClick={()=>onOpen(p)} aria-label={`Ver detalle de ${p.title}`}>Ver figura <ArrowUpRight size={17}/></button></div></article>)}</div>
      {items.length>1 && <><button className="store-collection-arrow prev" type="button" onClick={()=>move(-1)} aria-label={`Anterior en ${name}`}><ChevronLeft/></button><button className="store-collection-arrow next" type="button" onClick={()=>move(1)} aria-label={`Siguiente en ${name}`}><ChevronRight/></button></>}
    </div>
    <div className="store-collection-dots">{ordered.map((p,i)=><button key={p.id} type="button" aria-label={`Mostrar figura ${i+1} de ${name}`} aria-pressed={index===i} onClick={()=>setSlide(i)}/>)}</div><p className="sr-only" aria-live="polite">{main.title}, {index+1} de {items.length}</p>
  </section>;
}
