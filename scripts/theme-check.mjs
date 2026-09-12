import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const p = await b.newPage(); await p.setViewport({ width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await p.goto(process.argv[2] || "http://localhost:4173/", { waitUntil: "networkidle0", timeout: 90000 });
await p.evaluate(() => { document.getElementById("root").style.scrollBehavior = "auto"; });
const read = () => p.evaluate(() => document.querySelector("meta[name=theme-color]").content);
console.log("hero:", await read());
for (const sel of ["#services", "#process", "#about", "#contact"]) {
  await p.evaluate((s) => document.getElementById("root").scrollTo(0, document.querySelector(s).getBoundingClientRect().top + document.getElementById("root").scrollTop + 10), sel); await new Promise((r) => setTimeout(r, 400));
  console.log(sel + ":", await read());
}
console.log("gap hero→promise px:", await p.evaluate(() => { const h = document.querySelector(".hero").getBoundingClientRect(); const n = document.querySelector(".promise").getBoundingClientRect(); return Math.round(n.top - h.bottom); }));
await b.close();
