import { useEffect, useRef } from "react";
import Logo from "./Logo.jsx";
import { company } from "../data.js";

const links = [["#services", "Services"], ["#projects", "Projects"], ["#process", "Process"], ["#about", "About"], ["#reviews", "Reviews"], ["#contact", "Contact"]];

/* Transparent over the hero, solid afterwards, and dark over dark sections. */
export default function Nav() {
  const ref = useRef(null);
  useEffect(() => {
    const nav = ref.current;
    const hero = document.querySelector(".hero");
    // Safari and Chrome tint their browser chrome from theme-color; keep it matching the section under the nav
    const meta = document.querySelector('meta[name="theme-color"]');
    const tint = (dark) => {
      const c = dark ? "#15120f" : "#e9e4db";
      if (meta) meta.setAttribute("content", c);
      document.documentElement.style.setProperty("--tint-top", c);
      document.documentElement.style.setProperty("--tint-bottom", c);
    };
    const heroTint = () => { document.documentElement.style.setProperty("--tint-top", "#dfdfe2"); document.documentElement.style.setProperty("--tint-bottom", "#949c98"); };
    const solid = new IntersectionObserver(([e]) => { nav.classList.toggle("solid", !e.isIntersecting); if (e.isIntersecting) heroTint(); }, { rootMargin: "-80px 0px 0px 0px" });
    if (hero) solid.observe(hero);
    const theme = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { const dark = e.target.dataset.theme === "dark"; nav.classList.toggle("dark", dark); if (e.target.classList.contains("hero")) heroTint(); else tint(dark); } });
    }, { rootMargin: "-10px 0px -86% 0px" });
    document.querySelectorAll("[data-theme]").forEach((s) => theme.observe(s));
    return () => { solid.disconnect(); theme.disconnect(); };
  }, []);
  return (
    <nav className="nav" ref={ref} aria-label="Main">
      <a className="brand" href="#top" aria-label="Brick by Brick Group, home"><Logo /><span>Brick by Brick</span></a>
      <ul>{links.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
      <a className="brick-btn" href={company.phoneHref}>Call {company.phone}</a>
    </nav>
  );
}
