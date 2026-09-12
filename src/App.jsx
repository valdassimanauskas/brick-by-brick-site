import { useEffect } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Services from "./components/Services.jsx";
import { Promise as PromiseSection, Projects, Process, About, Reviews } from "./components/Sections.jsx";
import { Contact, Footer } from "./components/Contact.jsx";

export default function App() {
  // Measure the true visible height with a fixed probe (three.js forum technique) and expose it as --vvh.
  // CSS viewport units disagree with what the phone actually shows while browser bars move; a measured pixel value does not.
  useEffect(() => {
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    Object.assign(probe.style, { position: "fixed", left: "0", right: "0", bottom: "0", height: "1px", visibility: "hidden", pointerEvents: "none" });
    document.body.appendChild(probe);
    let last = 0, raf = 0;
    const tick = () => {
      const h = Math.round(probe.getBoundingClientRect().bottom);
      if (h > 0 && h !== last) { last = h; document.documentElement.style.setProperty("--vvh", h + "px"); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); probe.remove(); };
  }, []);
  // Bleed mode on iOS phones (see styles.css). ?nobleed turns it off for comparison.
  useEffect(() => {
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (!ios || innerWidth >= 900 || location.search.includes("nobleed")) return;
    const html = document.documentElement;
    html.dataset.bleed = "1";
    // no pre-scroll: Safari only collapses its bars on a real user scroll, and a forced offset causes a snap on the way back up
    return () => { delete html.dataset.bleed; };
  }, []);
  // one restrained reveal per section heading
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <>
      <Nav />
      <Hero />
      <PromiseSection />
      <Services />
      <Projects />
      <Process />
      <About />
      <Reviews />
      <Contact />
      <Footer />
    </>
  );
}
