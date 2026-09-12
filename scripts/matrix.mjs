import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { mkdirSync } from "node:fs";
const url = process.argv[2] || "http://localhost:4173/";
mkdirSync("shots/m", { recursive: true });
const devices = [
  ["se", 375, 667, true], ["se-toolbar", 375, 553, true], ["i14", 390, 844, true], ["i14-toolbar", 390, 734, true],
  ["promax", 430, 932, true], ["pixel7", 412, 915, true], ["galaxy", 360, 800, true], ["ipad", 768, 1024, true],
  ["laptop", 1366, 768, false], ["desktop", 1440, 900, false], ["wide", 1920, 1080, false],
];
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const rows = [];
for (const [name, w, h, mobile] of devices) {
  const page = await browser.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
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
  await page.evaluate(() => { const st = document.querySelector(".stack"); if (st && getComputedStyle(st).display !== "none") scrollTo(0, st.getBoundingClientRect().top + scrollY + st.offsetHeight * 0.55); });
  await new Promise((r) => setTimeout(r, 400));
  const wall = await page.evaluate(() => ({ wallShown: !!document.querySelector(".wall.show"), laid: document.querySelectorAll(".wall i.laid").length, under: document.querySelectorAll(".brick-card.under").length }));
  await page.screenshot({ path: `shots/m/${name}-stack.png` });
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
