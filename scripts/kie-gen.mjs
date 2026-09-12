/* kie.ai Seedream 5.0 Pro text-to-image.
   Usage: node scripts/kie-gen.mjs "<prompt>" <out.png> [aspect=16:9] [quality=high]
   Reads KIE_API_KEY from .env.kie in the project root. */
import { readFileSync, writeFileSync } from "node:fs";

const [, , prompt, outPath, aspect = "16:9", quality = "high"] = process.argv;
if (!prompt || !outPath) {
  console.error('usage: node scripts/kie-gen.mjs "<prompt>" <out.png> [aspect] [quality]');
  process.exit(1);
}
let key = process.env.KIE_API_KEY;
for (const f of [".env.kie", "../.env.kie"]) {
  if (key) break;
  try { key = /KIE_API_KEY\s*=\s*(\S+)/.exec(readFileSync(f, "utf8"))?.[1]; } catch {}
}
if (!key) { console.error("KIE_API_KEY not found"); process.exit(1); }

const created = await (await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "seedream/5-pro-text-to-image",
    input: { prompt, aspect_ratio: aspect, quality, output_format: "png", nsfw_checker: false },
  }),
})).json();
const taskId = created?.data?.taskId;
if (!taskId) { console.error("createTask failed:", JSON.stringify(created)); process.exit(1); }
console.log("task", taskId);

let url = null;
for (let i = 0; i < 90; i++) {
  await new Promise((r) => setTimeout(r, 5000));
  const info = await (await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, {
    headers: { Authorization: `Bearer ${key}` },
  })).json();
  const state = info?.data?.state;
  process.stdout.write(`${state} `);
  if (state === "success") { url = JSON.parse(info.data.resultJson ?? "{}")?.resultUrls?.[0]; break; }
  if (state === "fail") { console.error("\nfailed:", info?.data?.failMsg); process.exit(1); }
}
if (!url) { console.error("\ntimed out"); process.exit(1); }
writeFileSync(outPath, Buffer.from(await (await fetch(url)).arrayBuffer()));
console.log(`\nsaved ${outPath}\n${url}`);
