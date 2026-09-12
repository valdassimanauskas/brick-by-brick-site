import { Fragment, useEffect, useRef, useState } from "react";
import { asset } from "../data.js";
import { useScroll, reducedMotion, isPhone, isPortraitPhone } from "../hooks/useScroll.js";

const line1 = "General contractor for homes and industrial buildings.".split(" ");
const line2 = "Designed, built and delivered on time and on budget.".split(" ");
const phases = [
  "Foundation. Slab poured level and square.",
  "Structure. Framing, roof and windows on one schedule.",
  "Finish. Brick, porch, driveway, keys.",
];

/* A pinned stage. Scrolling through the hero scrubs the build sequence
   (frames from public/assets/seq*, else three stills) behind the headline. */
export default function Hero() {
  const heroRef = useRef(null), stageRef = useRef(null), canvasRef = useRef(null);
  const framesRef = useRef(null);
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("stills"); // "stills" | "frames"
  const portrait = typeof window !== "undefined" && isPortraitPhone();
  const stills = portrait
    ? [asset("seqv-01.webp"), asset("seqv-01.webp"), asset("hero-v.webp")]
    : [asset("seq-01.webp"), asset("seq-02.webp"), asset("seq-03.webp")];

  const sizeCanvas = () => {
    const c = canvasRef.current, s = stageRef.current;
    if (!c || !s) return;
    const dpr = Math.min(devicePixelRatio || 1, 3);
    c.width = Math.round(s.clientWidth * dpr);
    c.height = Math.round(s.clientHeight * dpr);
  };

  const draw = (p) => {
    const frames = framesRef.current, c = canvasRef.current;
    if (!frames || !c) return;
    const fi = Math.min(frames.length - 1, Math.round(p * (frames.length - 1)));
    const img = frames[fi];
    if (!img || !img.complete || !img.naturalWidth) return;
    c.dataset.frame = fi;
    const ctx = c.getContext("2d");
    const cw = c.width, ch = c.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2 - h * 0.05, w, h);
    sampleEdges(ctx, cw, ch);
  };

  // average colour of the top and bottom rows of the drawn frame -> --tint-top / --tint-bottom
  const sampleEdges = (ctx, cw, ch) => {
    const avg = (y) => { const d = ctx.getImageData(0, y, cw, 4).data; let r = 0, g = 0, b = 0, n = 0; for (let i = 0; i < d.length; i += 16) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; } return `rgb(${(r / n) | 0},${(g / n) | 0},${(b / n) | 0})`; };
    try {
      document.documentElement.style.setProperty("--tint-top", avg(2));
      document.documentElement.style.setProperty("--tint-bottom", avg(ch - 6));
    } catch { /* tainted canvas etc. */ }
  };

  useEffect(() => {
    if (reducedMotion()) { setProgress(1); setPhase(2); return; }
    let cancelled = false;
    (async () => {
      try {
        const prefs = isPortraitPhone() ? ["seq-v", "seq-m"] : isPhone() ? ["seq-m"] : ["seq"];
        let dir = null, m = null;
        for (const d of prefs) { const r = await fetch(asset(`${d}/manifest.json`)); if (r.ok) { dir = d; m = await r.json(); break; } }
        if (!m) return;
        const list = Array.from({ length: m.count }, (_, i) => { const im = new Image(); im.src = asset(`${dir}/${m.prefix}${String(i + 1).padStart(3, "0")}.${m.ext}`); return im; });
        await Promise.all(list.slice(0, 8).map((im) => im.decode().catch(() => {})));
        if (cancelled) return;
        framesRef.current = list; setMode("frames"); sizeCanvas();
      } catch { /* stay on stills */ }
    })();
    addEventListener("resize", sizeCanvas);
    return () => { cancelled = true; removeEventListener("resize", sizeCanvas); };
  }, []);

  useScroll(() => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = reducedMotion() ? 1 : Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    setProgress(p);
    setPhase(p < 0.34 ? 0 : p < 0.72 ? 1 : 2);
    draw(p);
  });

  useEffect(() => { if (mode === "frames") draw(progress); }, [mode]); // first paint after frames arrive

  const stillIdx = progress < 1 / 3 ? 0 : progress < 2 / 3 ? 1 : 2;
  const laid = Math.round(progress * 6);
  const bricks = [1, 2, 3].flatMap((n, row) => Array.from({ length: n }, (_, i) => ({ id: `${row}-${i}`, row })));
  let idx = 0;

  return (
    <header className="hero" id="top" ref={heroRef} data-theme="dark" aria-label="Brick by Brick Group. Scroll to watch a home go up brick by brick.">
      <div className="stage" ref={stageRef}>
        {stills.map((src, i) => (
          <img key={src + i} src={src} alt={i === 2 ? "A newly completed two-storey brick home with a freshly poured driveway." : ""} className={mode === "stills" && i === stillIdx ? "on" : ""} hidden={mode === "frames"} fetchPriority={i === 0 ? "high" : undefined} />
        ))}
        <canvas ref={canvasRef} hidden={mode !== "frames"} />
        <div className="wrap hero-copy">
          <div className="phase" aria-live="polite">
            <span className="step">Step {phase + 1} of 3</span>
            <span className="phase-name">{phases.map((t, i) => <span key={t} className={i === phase ? "on" : ""}>{t}</span>)}</span>
          </div>
          <h1 className="lay">
            {line1.map((w, i) => <Fragment key={"a" + i}><span className="w"><span style={{ "--i": idx++ }}>{w}</span></span>{" "}</Fragment>)}
            <br />
            <em>{line2.map((w, i) => <Fragment key={"b" + i}><span className="w"><span style={{ "--i": idx++ }}>{w}</span></span>{" "}</Fragment>)}</em>
          </h1>
          <div className="hero-foot">
            <p className="lede">Brick by Brick Group is a family-run, licensed and insured general contractor serving Lemont, Illinois and the southwest suburbs of Chicago. One team from the first drawing to the final walkthrough.</p>
            <div className="hero-actions">
              <a className="brick-btn" href="#contact">Request a quote</a>
              <a className="brick-btn ghost" href="#projects">See our work</a>
            </div>
          </div>
        </div>
        <div className="courses" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div className="row" key={row}>{bricks.filter((b) => b.row === row).map((b) => <i key={b.id} className={6 - bricks.indexOf(b) <= laid ? "laid" : ""} />)}</div>
          ))}
        </div>
        <a className={`cue${progress > 0.04 ? " gone" : ""}`} href="#promise" aria-label="Scroll to watch the house go up">
          <span className="cue-bricks"><i /><i /><i /></span><span>Scroll to build</span>
        </a>
      </div>
    </header>
  );
}
