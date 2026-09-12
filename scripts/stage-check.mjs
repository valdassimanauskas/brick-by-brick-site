import puppeteer from "../../Rev/site/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
const b = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const p = await b.newPage(); await p.setViewport({ width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await p.goto(process.argv[2] || "http://localhost:4173/", { waitUntil: "networkidle0", timeout: 90000 });
await new Promise((r) => setTimeout(r, 1500));
console.log(await p.evaluate(() => {
  const q = (x) => document.querySelector(x); const root = q("#root"), stage = q(".hero .stage"), btn = q(".hero-actions .brick-btn"); if (!root || !stage || !btn) return { missing: { root: !root, stage: !stage, btn: !btn } };
  return { innerHeight, rootHeight: root.clientHeight, stageHeight: stage.getBoundingClientRect().height, stageBottom: Math.round(stage.getBoundingClientRect().bottom), buttonBottom: Math.round(btn.getBoundingClientRect().bottom), docScrolls: document.documentElement.scrollHeight > innerHeight, rootScrolls: root.scrollHeight > root.clientHeight };
}));
await b.close();
