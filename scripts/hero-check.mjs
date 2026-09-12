import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:8787/index.html", { waitUntil: "networkidle0", timeout: 90000 });
await page.evaluate(() => { document.documentElement.style.scrollBehavior = "auto"; });
await new Promise((r) => setTimeout(r, 2000));
const h = await page.evaluate(() => ({ heroH: document.querySelector(".hero").offsetHeight, canvasHidden: document.querySelector(".hero canvas").hidden, words: [...document.querySelectorAll(".lay .w > span")].every((s) => getComputedStyle(s).opacity === "1") }));
console.log(h);
for (const f of [0, 0.2, 0.5, 0.8, 1]) {
  await page.evaluate((f) => scrollTo(0, f * (document.querySelector(".hero").offsetHeight - innerHeight)), f);
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: `shots/hero-${Math.round(f * 100)}.png` });
  console.log(f, await page.evaluate(() => [document.querySelector(".phase .step").textContent, document.querySelector(".phase-name span.on")?.textContent.slice(0, 12), document.querySelectorAll(".courses i.laid").length, document.querySelector(".cue").classList.contains("gone")]));
}
console.log("pageerrors:", errors);
await browser.close();
