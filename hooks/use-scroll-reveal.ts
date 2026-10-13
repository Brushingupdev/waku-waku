"use client";

import { useEffect } from "react";

// Content stays visible without JavaScript or when reduced motion is requested.
export function useScrollReveal(loading: boolean) {
  useEffect(() => {
    const root = document.querySelector(".store-catalog-page");
    if (!root || loading || !window.IntersectionObserver) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const targets = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.remove("scroll-reveal-pending");
        entry.target.classList.add("scroll-reveal-visible");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    const discover = () => {
      root.querySelectorAll(".store-collection-photo, .store-figure-image, .collector-story").forEach(target => {
        if (targets.has(target)) return;
        targets.add(target);
        if (target.getBoundingClientRect().top < window.innerHeight) return;
        target.classList.add("scroll-reveal-pending");
        observer.observe(target);
      });
    };
    const showAll = () => {
      if (motion.matches) {
        observer.disconnect();
        targets.forEach(target => target.classList.remove("scroll-reveal-pending", "scroll-reveal-visible"));
      }
    };
    discover();
    const mutations = new MutationObserver(discover);
    mutations.observe(root, { childList: true, subtree: true });
    motion.addEventListener("change", showAll);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      motion.removeEventListener("change", showAll);
      targets.forEach(target => target.classList.remove("scroll-reveal-pending", "scroll-reveal-visible"));
    };
  }, [loading]);
}
