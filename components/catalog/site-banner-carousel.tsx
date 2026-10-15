"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { bannerHref, type SiteBanner } from "../../lib/site-content";
import { LoadingImage } from "../loading-image";

export function SiteBannerCarousel({ banners }: { banners: SiteBanner[] }) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(0);
  const count = banners.length;
  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(i => (i + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [count]);
  if (!count) return null;
  const move = (step: number) => setIndex(i => (i + step + count) % count);
  return <div className="store-featured-wrap site-banner-carousel">
    <div className="store-featured" onTouchStart={event => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={event => {
      const delta = event.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1);
    }}>
      {(count > 1 ? [-1,0,1] : [0]).map(offset => {
        const banner = banners[((index % count) + offset + count) % count];
        const href = bannerHref(banner.link_url);
        const image = <LoadingImage src={banner.image_url!} alt={banner.title} loading="eager" fetchPriority={offset === 0 ? "high" : "low"}/>;
        return <article key={`${banner.id}-${offset}`} data-site-banner={banner.id} className={`store-feature-card store-showcase-card ${offset === 0 ? "center" : "side"}`}>
          {href ? <a className="store-feature-photo" href={href} aria-label={banner.title}>{image}</a> : <div className="store-feature-photo">{image}</div>}
        </article>;
      })}
    </div>
    {count > 1 && <div className="store-feature-controls">
      <button type="button" onClick={() => move(-1)} aria-label="Destacados anteriores"><ChevronLeft/></button>
      <span>{banners.map((banner,i) => <button type="button" key={banner.id} className={index % count === i ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Ver destacado ${i + 1}`} aria-pressed={index % count === i}/>)}</span>
      <button type="button" onClick={() => move(1)} aria-label="Destacados siguientes"><ChevronRight/></button>
    </div>}
  </div>;
}
