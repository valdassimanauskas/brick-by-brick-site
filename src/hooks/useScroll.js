import { useEffect } from "react";

/* The page scrolls inside #root (a fixed full-viewport scroller), not the document.
   Everything that reacts to scroll listens there. */
export const scroller = () => document.getElementById("root");

/* Runs fn once on mount and on every scroll/resize, throttled to animation frames. */
export function useScroll(fn, deps = []) {
  useEffect(() => {
    const el = scroller();
    let ticking = false;
    const run = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { fn(); ticking = false; });
    };
    fn();
    el?.addEventListener("scroll", run, { passive: true });
    addEventListener("scroll", run, { passive: true });
    addEventListener("resize", run);
    return () => { el?.removeEventListener("scroll", run); removeEventListener("scroll", run); removeEventListener("resize", run); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isPhone = () => innerWidth < 900;
export const isPortraitPhone = () => innerWidth < 900 && innerHeight > innerWidth;
