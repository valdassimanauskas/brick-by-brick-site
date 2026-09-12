import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { mkdirSync } from "node:fs";
mkdirSync("shots", { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:8787/index.html", { waitUntil: "networkidle0", timeout: 90000 });
await page.evaluate(() => document.fonts.ready);
const info = await page.evaluate(() => { const b = document.querySelector(".build"); const r = b.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height, canvasHidden: document.querySelector(".build canvas").hidden }; });
console.log(info);
for (const f of [0, 0.25, 0.5, 0.75, 1]) {
  await page.evaluate((y) => scrollTo(0, y), info.top + f * (info.h - 900));
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `shots/build-${Math.round(f * 100)}.png` });
}
console.log("pageerrors:", errors);
await browser.close();
