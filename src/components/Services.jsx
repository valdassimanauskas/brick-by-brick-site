import { useEffect, useRef, useState } from "react";
import { services, asset } from "../data.js";
import { useScroll } from "../hooks/useScroll.js";

/* Desktop: an index list with a sticky photo that follows hover/focus.
   Phones: a native swipe rail. Each service is a brick; the small wall under the
   rail gains a brick for every card you have swiped to. */
export default function Services() {
  const [active, setActive] = useState(services[0].key);
  const listRef = useRef(null), railRef = useRef(null);
  const [laid, setLaid] = useState(1);

  // desktop without hover (touch laptops): the row nearest the photo becomes active
  useScroll(() => {
    const list = listRef.current;
    if (matchMedia("(hover: hover)").matches || !list || getComputedStyle(list).display === "none") return;
    const mid = innerHeight * 0.62;
    let best = null, bestD = Infinity;
    list.querySelectorAll("a").forEach((r) => { const b = r.getBoundingClientRect(); const d = Math.abs((b.top + b.bottom) / 2 - mid); if (d < bestD) { bestD = d; best = r; } });
    if (best) setActive(best.dataset.img);
  });

  // rail: count how many cards have been swiped past
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const card = rail.querySelector(".brick-card");
        const step = card ? card.offsetWidth + 12 : 1;
        setLaid(Math.min(services.length, Math.round(rail.scrollLeft / step) + 1));
        ticking = false;
      });
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="services" id="services" data-theme="light">
      <div className="wrap">
        <header className="sec-head">
          <h2 className="reveal">What we build</h2>
          <p>Residential and commercial work, side by side, with the same crews and the same standard. Pick a service to see it.</p>
        </header>

        <div className="index">
          <ol className="index-list" ref={listRef}>
            {services.map((s, i) => (
              <li key={s.key}>
                <a href="#contact" data-img={s.key} className={active === s.key ? "on" : ""} onMouseEnter={() => setActive(s.key)} onFocus={() => setActive(s.key)}>
                  <span className="n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t">{s.title}</span>
                  <span className="d">{s.desc}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="index-stage" aria-hidden="true">
            {services.map((s, i) => <img key={s.key} src={asset(`svc-${s.key}.webp`)} alt="" data-img={s.key} className={active === s.key ? "on" : ""} loading={i ? "lazy" : undefined} />)}
          </div>
        </div>

        <div className="rail" ref={railRef} aria-label="Services, swipe to browse">
          {services.map((s, i) => (
            <article key={s.key} className="brick-card">
              <img src={asset(`svc-${s.key}.webp`)} alt="" loading="lazy" />
              <div className="bc-txt"><span className="n">{String(i + 1).padStart(2, "0")}</span><h3>{s.title}</h3><p>{s.desc}</p></div>
            </article>
          ))}
        </div>
        <div className="wall-row">
          <span>{laid} of {services.length} · swipe</span>
          <div className="wall" aria-hidden="true">
            {[2, 3, 4].map((n, row) => {
              const start = row === 0 ? 0 : row === 1 ? 2 : 5;
              return <div className="row" key={row}>{Array.from({ length: n }, (_, i) => <i key={i} className={start + i < laid ? "laid" : ""} />)}</div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
