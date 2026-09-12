import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { mkdirSync } from "node:fs";
const url = process.argv[2] || "http://localhost:4173/";
mkdirSync("shots/m", { recursive: true });
const devices = [
  ["se", 375, 667, true], ["se-toolbar", 375, 553, true], ["i14", 390, 844, true], ["i14-toolbar", 390, 734, true],
  ["promax", 430, 932, true, 3], ["pixel7", 412, 915, true], ["galaxy", 360, 800, true], ["ipad", 768, 1024, true],
  ["laptop", 1366, 768, false], ["desktop", 1440, 900, false], ["wide", 1920, 1080, false],
];
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const rows = [];
for (const [name, w, h, mobile, dsf] of devices) {
  const page = await browser.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dsf || (mobile ? 2 : 1), isMobile: mobile, hasTouch: mobile });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
  await new Promise((r) => setTimeout(r, 1800));
  const top = await page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight;
    const inView = (el) => { const r = el.getBoundingClientRect(); return r.left >= -1 && r.right <= vw + 1 && r.top >= -1 && r.bottom <= vh + 1; };
    const h1 = document.querySelector("h1"), btn = document.querySelector(".hero-actions .brick-btn"), phase = document.querySelector(".phase");
    return { overflowX: document.documentElement.scrollWidth > vw, h1In: inView(h1), btnIn: inView(btn), phaseIn: inView(phase),
      h1Opacity: [...h1.querySelectorAll(".w > span")].every((s) => getComputedStyle(s).opacity === "1"), canvas: !document.querySelector(".hero canvas").hidden };
  });
  await page.screenshot({ path: `shots/m/${name}-hero.png` });
  await page.evaluate(() => scrollTo(0, 0.5 * (document.querySelector(".hero").offsetHeight - innerHeight)));
  await new Promise((r) => setTimeout(r, 400));
  const mid = await page.evaluate(() => document.querySelector(".phase .step").textContent);
  await page.screenshot({ path: `shots/m/${name}-hero50.png` });
  await page.evaluate(() => scrollTo(0, document.querySelector("#services").getBoundingClientRect().top + scrollY + 300));
  await new Promise((r) => setTimeout(r, 400));
  const svc = await page.evaluate(() => ({ active: document.querySelector(".index-stage img.on")?.dataset.img, stageTop: Math.round(document.querySelector(".index-stage").getBoundingClientRect().top) }));
  await page.screenshot({ path: `shots/m/${name}-services.png` });
  // rail: swipe with a touch drag and confirm the rail moved and the wall counted
  let wall = { railMoved: null, laid: null };
  const railBox = await page.evaluate(() => { const r = document.querySelector(".rail"); if (!r || getComputedStyle(r).display === "none") return null; const b = r.getBoundingClientRect(); return { x: b.left + b.width * 0.8, y: b.top + b.height * 0.5, top: b.top + scrollY }; });
  if (railBox) {
    await page.evaluate((t) => scrollTo(0, t - 120), railBox.top);
    await new Promise((r) => setTimeout(r, 300));
    const b2 = await page.evaluate(() => { const b = document.querySelector(".rail").getBoundingClientRect(); return { x: b.left + b.width * 0.85, y: b.top + b.height * 0.5 }; });
    try {
      await page.touchscreen.touchStart(b2.x, b2.y);
      for (let i = 1; i <= 8; i++) await page.touchscreen.touchMove(b2.x - i * 40, b2.y);
      await page.touchscreen.touchEnd();
    } catch {}
    await new Promise((r) => setTimeout(r, 700));
    wall = await page.evaluate(() => ({ railMoved: document.querySelector(".rail").scrollLeft > 20, laid: document.querySelectorAll(".wall i.laid").length }));
    await page.screenshot({ path: `shots/m/${name}-rail.png` });
  }
  await page.evaluate(() => scrollTo(0, document.querySelector("#contact").getBoundingClientRect().top + scrollY - 60));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `shots/m/${name}-contact.png` });
  // link check
  await page.evaluate(() => { scrollTo(0, 0); document.querySelector('.hero-actions a[href="#projects"]').click(); }); await new Promise((r) => setTimeout(r, 300));
  const linkOk = await page.evaluate(() => Math.abs(document.querySelector("#projects").getBoundingClientRect().top) < 5);
  rows.push({ name, w, h, ...top, mid, svc: svc.active, ...wall, linkOk, errors: errors.length });
  await page.close();
}
console.table(rows);
await browser.close();
