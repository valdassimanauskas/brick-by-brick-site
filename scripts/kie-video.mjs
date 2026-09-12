/* kie.ai Seedance 2.5 first+last frame video.
   Usage: node scripts/kie-video.mjs "<prompt>" <firstUrl> <lastUrl> <out.mp4> [duration=10] [res=1080p] [aspect=16:9] */
import { readFileSync, writeFileSync } from "node:fs";
const [, , prompt, first, last, outPath, duration = "10", resolution = "1080p", aspect = "16:9"] = process.argv;
if (!prompt || !first || !last || !outPath) { console.error("usage: kie-video.mjs <prompt> <firstUrl> <lastUrl> <out.mp4> [dur] [res] [aspect]"); process.exit(1); }
let key = process.env.KIE_API_KEY;
for (const f of [".env.kie", "../.env.kie"]) { if (key) break; try { key = /KIE_API_KEY\s*=\s*(\S+)/.exec(readFileSync(f, "utf8"))?.[1]; } catch {} }
if (!key) { console.error("KIE_API_KEY not found"); process.exit(1); }
const created = await (await fetch("https://api.kie.ai/api/v1/jobs/createTask", {
  method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "bytedance/seedance-2-5",
    input: { prompt, first_frame_url: first, last_frame_url: last, duration: Number(duration), resolution, aspect_ratio: aspect, generate_audio: false, output_format: "mp4", nsfw_checker: false } }),
})).json();
const taskId = created?.data?.taskId;
if (!taskId) { console.error("createTask failed:", JSON.stringify(created)); process.exit(1); }
console.log("task", taskId);
let url = null;
for (let i = 0; i < 240; i++) {
  await new Promise((r) => setTimeout(r, 10000));
  const info = await (await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, { headers: { Authorization: `Bearer ${key}` } })).json();
  const state = info?.data?.state; process.stdout.write(`${state} `);
  if (state === "success") { url = JSON.parse(info.data.resultJson ?? "{}")?.resultUrls?.[0]; break; }
  if (state === "fail") { console.error("\nfailed:", info?.data?.failMsg, JSON.stringify(info?.data)); process.exit(1); }
}
if (!url) { console.error("\ntimed out"); process.exit(1); }
writeFileSync(outPath, Buffer.from(await (await fetch(url)).arrayBuffer()));
console.log(`\nsaved ${outPath}\n${url}`);
