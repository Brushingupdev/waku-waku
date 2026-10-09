"use client";

import { useEffect, useRef } from "react";
import { animeFilterLogos } from "../../lib/catalog-presentation";

export function AnimeLogoMarquee({ names, logos, selected, onSelect }: { names:string[]; logos:Record<string,string>; selected:string|null; onSelect:(name:string|null)=>void }) {
  const track = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const idleUntil = useRef(0);
  const drag = useRef<{ x:number; scroll:number; moved:boolean; mouse:boolean } | null>(null);
  const suppressClick = useRef(false);
  useEffect(() => {
    const el=track.current;
    if(!el || !names.length) return;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const width=()=>el.scrollWidth/3;
    const initialize=()=>{el.scrollLeft=width();};
    initialize();
    const resize=new ResizeObserver(initialize);resize.observe(el);
    let frame=0, previous=0, remainder=0;
    const animate=(now:number)=>{
      const span=width();
      if(span>0){
        if(el.scrollLeft<span*.5) el.scrollLeft+=span;
        else if(el.scrollLeft>=span*2.5) el.scrollLeft-=span;
        if(previous && !reduced.matches && !paused.current && !el.querySelector(":focus-visible") && !drag.current && now>idleUntil.current) { remainder+=Math.min(now-previous,40)*.032;const pixels=Math.floor(remainder);if(pixels){el.scrollLeft-=pixels;remainder-=pixels;} } else remainder=0;
      }
      previous=now;frame=requestAnimationFrame(animate);
    };
    frame=requestAnimationFrame(animate);
    return()=>{cancelAnimationFrame(frame);resize.disconnect();};
  },[names.join("|")]);
  const finish=()=>{ if(drag.current?.moved) suppressClick.current=true;drag.current=null;idleUntil.current=performance.now()+2200; };
  return <nav className="store-anime-picker" aria-label="Filtrar por anime"><h2 className="sr-only">Filtrar por anime</h2><div className="store-anime-logo-list store-anime-marquee" ref={track}
    onMouseEnter={()=>{paused.current=true;}} onMouseLeave={()=>{paused.current=false;}}
    onFocusCapture={()=>{paused.current=true;}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))paused.current=false;}}
    onWheel={()=>{idleUntil.current=performance.now()+2200;}}
    onPointerDown={e=>{suppressClick.current=false;drag.current={x:e.clientX,scroll:e.currentTarget.scrollLeft,moved:false,mouse:e.pointerType==="mouse"};}}
    onPointerMove={e=>{const d=drag.current;if(!d)return;const distance=e.clientX-d.x;if(Math.abs(distance)>6)d.moved=true;if(d.mouse&&d.moved){e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.scrollLeft=d.scroll-distance;}}}
    onPointerUp={finish} onPointerCancel={finish}
    onClickCapture={e=>{if(suppressClick.current){e.preventDefault();e.stopPropagation();suppressClick.current=false;}}}>
    {[0,1,2].map(copy=><div className="store-anime-marquee-group" key={copy} aria-hidden={copy !== 1}>{names.map(name=><button type="button" key={name} tabIndex={copy===1?0:-1} aria-label={"Filtrar por "+name} aria-pressed={selected===name} onClick={()=>onSelect(selected===name?null:name)}>{logos[name] ? <img src={logos[name]} alt={name} loading="eager" draggable={false} onError={event => { const fallback = animeFilterLogos[name]; if (fallback && event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback; }}/> : <span>{name}</span>}</button>)}</div>)}
  </div></nav>;
}
