"use client";

import { useState } from "react";
import { animeFilterLogos, seriesImages } from "../../lib/catalog-presentation";

type Props = { name: string; logoUrl?: string; className?: string; decorative?: boolean };

export function SeriesLogo(props: Props) {
  return <LogoImage key={`${props.name}:${props.logoUrl || ""}`} {...props}/>;
}

function LogoImage({ name, logoUrl, className, decorative = false }: Props) {
  const [unavailable, setUnavailable] = useState(false);
  const fallback = animeFilterLogos[name] || (seriesImages[name] ? `/illustrations/${seriesImages[name]}` : "");
  const src = logoUrl?.trim() || fallback;
  if (!src || unavailable) return <span className={className}>{name}</span>;
  return <img className={className} src={src} alt={decorative ? "" : name} loading="eager" draggable={false} onError={event => {
    if (fallback && event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback;
    else setUnavailable(true);
  }}/>;
}
