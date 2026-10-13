"use client";

import { useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string };

export function LoadingImage(props: Props) {
  // A changed URL starts a fresh loading state, including carousel changes.
  return <ImageState key={props.src} {...props}/>;
}

function ImageState({ className = "", alt = "", onLoad, onError, ...props }: Props) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  return <>
    {/* Existing image classes preserve sizing, cropping and composition. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img {...props} alt={alt} className={`${className} loading-image loading-image-${state}`} ref={image => {
      if (image?.complete && image.naturalWidth > 0) setState("ready");
    }} onLoad={event => { setState("ready"); onLoad?.(event); }} onError={event => { setState("error"); onError?.(event); }}/>
    {state === "loading" && <span className="image-loading-overlay skeleton-block" aria-hidden="true"><span className="skeleton-silhouette skeleton-silhouette-flow"/></span>}
    {state === "error" && <span className="image-error-overlay" role="img" aria-label={`Imagen no disponible: ${alt}`}><span>Imagen no disponible</span></span>}
  </>;
}
