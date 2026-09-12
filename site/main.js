/* Brick by Brick Group — page behaviour
   1. Hero: a pinned stage. Scroll progress through the hero scrubs the build
      sequence (frames from assets/seq/ if present, else three stills), lays the
      progress bricks, and swaps the phase label.
   2. Nav turns solid past the hero and matches the section under it.
   3. Services index: hovering / focusing / scrolling a row swaps the sticky photo.
   4. One restrained reveal per section heading. */

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const nav = document.querySelector(".nav");
const hero = document.querySelector(".hero");
const stage = hero.querySelector(".stage");
const stills = [...stage.querySelectorAll(":scope > img")];
const canvas = stage.querySelector("canvas");
const bricks = [...hero.querySelectorAll(".courses i")];
const phaseStep = hero.querySelector(".phase .step");
const phaseNames = [...hero.querySelectorAll(".phase-name span")];
const cue = hero.querySelector(".cue");

/* ---- nav ---- */
new IntersectionObserver(([e]) => nav.classList.toggle("solid", !e.isIntersecting), { rootMargin: "-80px 0px 0px 0px" }).observe(hero);
const themeIO = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) nav.classList.toggle("dark", e.target.dataset.theme === "dark"); });
}, { rootMargin: "-10px 0px -86% 0px" });
document.querySelectorAll("[data-theme]").forEach((s) => themeIO.observe(s));

/* ---- hero build ---- */
document.querySelectorAll(".lay .w > span").forEach((w, i) => w.style.setProperty("--i", i));
let frames = null, frameCount = 0, lastPhase = -1;

function progress() {
  if (reduced) return 1;
  const r = hero.getBoundingClientRect();
  return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
}
function drawFrame(p) {
  const img = frames[Math.min(frameCount - 1, Math.round(p * (frameCount - 1)))];
  if (!img || !img.complete || !img.naturalWidth) return;
  const ctx = canvas.getContext("2d");
  const cw = canvas.width, ch = canvas.height;
  const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
  const w = img.naturalWidth * s, h = img.naturalHeight * s;
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2 - h * 0.05, w, h);
}
function renderHero() {
  const p = progress();
  if (frames) drawFrame(p);
  else { const idx = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2; stills.forEach((s, i) => s.classList.toggle("on", i === idx)); }
  const laid = Math.round(p * bricks.length);
  bricks.forEach((b, i) => b.classList.toggle("laid", bricks.length - i <= laid));
  const phase = p < 0.34 ? 0 : p < 0.72 ? 1 : 2;
  if (phase !== lastPhase) {
    lastPhase = phase;
    phaseStep.textContent = `Step ${phase + 1} of 3`;
    phaseNames.forEach((n, i) => n.classList.toggle("on", i === phase));
  }
  cue.classList.toggle("gone", p > 0.04);
}
function sizeCanvas() {
  canvas.width = Math.round(stage.clientWidth * Math.min(devicePixelRatio, 2));
  canvas.height = Math.round(stage.clientHeight * Math.min(devicePixelRatio, 2));
  if (frames) drawFrame(progress());
}
async function loadFrames() {
  try {
    const m = await (await fetch("assets/seq/manifest.json")).json();
    frameCount = m.count;
    const list = Array.from({ length: frameCount }, (_, i) => { const img = new Image(); img.src = `assets/seq/${m.prefix}${String(i + 1).padStart(3, "0")}.${m.ext}`; return img; });
    await Promise.all(list.slice(0, 8).map((im) => im.decode().catch(() => {})));
    frames = list; stills.forEach((s) => (s.hidden = true)); canvas.hidden = false; sizeCanvas();
  } catch { canvas.hidden = true; }
}
if (!reduced) loadFrames(); else { canvas.hidden = true; stills.forEach((s, i) => s.classList.toggle("on", i === 2)); }

/* ---- services index ---- */
const rows = [...document.querySelectorAll(".index-list a")];
const shots = [...document.querySelectorAll(".index-stage img")];
let activeKey = rows[0]?.dataset.img;
function activate(key) {
  if (!key || key === activeKey) return;
  activeKey = key;
  rows.forEach((r) => r.classList.toggle("on", r.dataset.img === key));
  shots.forEach((s) => s.classList.toggle("on", s.dataset.img === key));
}
rows[0]?.classList.add("on");
rows.forEach((r) => { r.addEventListener("mouseenter", () => activate(r.dataset.img)); r.addEventListener("focus", () => activate(r.dataset.img)); });
const hoverable = matchMedia("(hover: hover)").matches;
function renderIndex() {
  if (hoverable) return;
  const mid = innerHeight * 0.45;
  let best = null, bestD = Infinity;
  rows.forEach((r) => { const b = r.getBoundingClientRect(); const d = Math.abs((b.top + b.bottom) / 2 - mid); if (d < bestD) { bestD = d; best = r; } });
  if (best) activate(best.dataset.img);
}

/* ---- scroll loop ---- */
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => { renderHero(); renderIndex(); ticking = false; });
}, { passive: true });
addEventListener("resize", sizeCanvas);
renderHero();

/* ---- reveals ---- */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---- form (no backend yet) ---- */
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.target.querySelector(".brick-btn");
  btn.textContent = "Sent. We reply within one business day.";
  btn.disabled = true;
});
