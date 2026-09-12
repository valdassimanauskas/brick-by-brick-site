import { useEffect } from "react";

/* Runs fn once on mount and on every scroll/resize, throttled to animation frames. */
export function useScroll(fn, deps = []) {
  useEffect(() => {
    let ticking = false;
    const run = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { fn(); ticking = false; });
    };
    fn();
    addEventListener("scroll", run, { passive: true });
    addEventListener("resize", run);
    return () => { removeEventListener("scroll", run); removeEventListener("resize", run); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isPhone = () => innerWidth < 900;
export const isPortraitPhone = () => innerWidth < 900 && innerHeight > innerWidth;
