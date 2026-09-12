import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(process.argv[2] || "http://localhost:4173/", { waitUntil: "networkidle0", timeout: 90000 });
for (const sel of [".promise", "#services", "#projects", "#process", "#about", "#reviews", "#contact"]) {
  await page.evaluate((s) => { document.documentElement.style.scrollBehavior = "auto"; const y = document.querySelector(s).getBoundingClientRect().top + scrollY; scrollTo(0, y + 10); }, sel);
  await new Promise((r) => setTimeout(r, 500));
  console.log(sel.padEnd(18), await page.evaluate(() => document.querySelector(".nav").className));
}
await browser.close();
