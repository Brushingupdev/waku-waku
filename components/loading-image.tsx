"use client";

import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string };

export function LoadingImage(props: Props) {
  // A changed URL starts a fresh loading state, including carousel changes.
  return <ImageState key={props.src} {...props}/>;
}

function ImageState({ className = "", alt = "", onLoad, onError, src, ...props }: Props) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  const retry = () => {
    if (timer.current !== null) return;
    if (attempt >= 2) { setState("error"); return; }
    timer.current = setTimeout(() => {
      timer.current = null;
      setAttempt(value => value + 1);
    }, 800 * (attempt + 1));
  };
  const hashAt = src.indexOf("#");
  const path = hashAt < 0 ? src : src.slice(0, hashAt);
  const hash = hashAt < 0 ? "" : src.slice(hashAt);
  const imageSrc = attempt ? `${path}${path.includes("?") ? "&" : "?"}waku_retry=${attempt}${hash}` : src;
  return <>
    {/* Existing image classes preserve sizing, cropping and composition. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img key={attempt} {...props} src={imageSrc} alt={alt} className={`${className} loading-image loading-image-${state}`} ref={image => {
      if (image?.complete && image.naturalWidth > 0) setState("ready");
      else if (image?.complete && image.naturalWidth === 0) retry();
    }} onLoad={event => {
      if (timer.current !== null) { clearTimeout(timer.current); timer.current = null; }
      setState("ready"); onLoad?.(event);
    }} onError={event => { retry(); if (attempt >= 2) onError?.(event); }}/>
    {state === "loading" && <span className="image-loading-overlay skeleton-block" aria-hidden="true"><span className="skeleton-silhouette skeleton-silhouette-flow"/></span>}
    {state === "error" && <span className="image-error-overlay" role="img" aria-label={`Imagen no disponible: ${alt}`}><span>Imagen no disponible</span></span>}
  </>;
}
