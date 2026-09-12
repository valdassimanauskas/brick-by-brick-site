import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { mkdirSync } from "node:fs";
const url = process.argv[2] || "http://localhost:8787/index.html";
const out = process.argv[3] || "shots";
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 90000 });
await page.evaluate(() => { document.fonts.ready; document.documentElement.style.scrollBehavior = "auto"; });
console.log("page height", await page.evaluate(() => document.documentElement.scrollHeight));
const stops = [["hero", 0], ["promise", ".promise"], ["services", "#services"], ["projects", "#projects"], ["process", "#process"], ["about", "#about"], ["reviews", "#reviews"], ["contact", "#contact"]];
for (const [name, target] of stops) {
  const y = typeof target === "number" ? target : await page.evaluate((sel) => document.querySelector(sel).getBoundingClientRect().top + scrollY - (sel.startsWith(".chapter") ? 0 : 70), target);
  await page.evaluate((y) => scrollTo(0, y), y);
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log("shot", name, Math.round(y));
}
// services hover state: hover row 5 (industrial)
await page.evaluate(() => scrollTo(0, document.querySelector("#services").getBoundingClientRect().top + scrollY - 70));
await new Promise((r) => setTimeout(r, 400));
await page.hover(".index-list li:nth-child(5) a");
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${out}/services-hover.png` });
console.log("active shot:", await page.evaluate(() => document.querySelector(".index-stage img.on")?.dataset.img));
console.log("pageerrors:", errors.length, errors.slice(0, 3));
await browser.close();
