import { useRef, useState } from "react";
import { services, asset } from "../data.js";
import { useScroll } from "../hooks/useScroll.js";

/* Desktop: an index list with a sticky photo that follows hover/focus.
   Phones: each service is a brick card that slides in and settles on the last,
   with a small wall in the corner that gains a brick per card. */
export default function Services() {
  const [active, setActive] = useState(services[0].key);
  const listRef = useRef(null), stackRef = useRef(null);
  const [laid, setLaid] = useState(0);
  const [under, setUnder] = useState({});
  const [showWall, setShowWall] = useState(false);
  const landed = useRef(new Set());
  const [landing, setLanding] = useState({});

  useScroll(() => {
    const hoverable = matchMedia("(hover: hover)").matches;
    const list = listRef.current, stack = stackRef.current;
    if (!hoverable && list && getComputedStyle(list).display !== "none") {
      const mid = innerHeight * 0.62;
      let best = null, bestD = Infinity;
      list.querySelectorAll("a").forEach((r) => { const b = r.getBoundingClientRect(); const d = Math.abs((b.top + b.bottom) / 2 - mid); if (d < bestD) { bestD = d; best = r; } });
      if (best) setActive(best.dataset.img);
    }
    if (stack && getComputedStyle(stack).display !== "none") {
      const cards = [...stack.querySelectorAll(".brick-card")];
      let count = 0; const u = {}; const l = {};
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const settled = r.top <= 64 + i * 12 + 1;
        if (settled) count++;
        u[i] = !!(settled && cards[i + 1] && cards[i + 1].getBoundingClientRect().top < r.top + r.height * 0.5);
        if (settled && !landed.current.has(i)) { landed.current.add(i); l[i] = true; setTimeout(() => setLanding((s) => ({ ...s, [i]: false })), 380); }
      });
      setLaid(count); setUnder(u);
      if (Object.keys(l).length) setLanding((s) => ({ ...s, ...l }));
      const sr = stack.getBoundingClientRect();
      setShowWall(sr.top < innerHeight * 0.6 && sr.bottom > innerHeight * 0.4);
    }
  });

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

        <div className="stack" ref={stackRef}>
          {services.map((s, i) => (
            <article key={s.key} className={`brick-card${under[i] ? " under" : ""}${landing[i] ? " landing" : ""}`} style={{ "--i": i }}>
              <img src={asset(`svc-${s.key}.webp`)} alt="" loading="lazy" />
              <div className="bc-txt"><span className="n">{String(i + 1).padStart(2, "0")}</span><h3>{s.title}</h3><p>{s.desc}</p></div>
            </article>
          ))}
        </div>
        <div className={`wall${showWall ? " show" : ""}`} aria-hidden="true">
          {[2, 3, 4].map((n, row) => {
            const start = row === 0 ? 0 : row === 1 ? 2 : 5;
            return <div className="row" key={row}>{Array.from({ length: n }, (_, i) => <i key={i} className={start + i < laid ? "laid" : ""} />)}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
