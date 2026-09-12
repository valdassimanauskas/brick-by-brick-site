import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto(process.argv[2], { waitUntil: "networkidle0", timeout: 90000 });
await page.evaluate(() => { document.getElementById("root").style.scrollBehavior = "auto"; document.getElementById("root").scrollTo(0, document.querySelector(".chips").getBoundingClientRect().top + document.getElementById("root").scrollTop - 120); });
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: "shots/m/live-chips.png" });
await browser.close();
