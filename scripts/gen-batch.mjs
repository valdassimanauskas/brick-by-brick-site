/* Batch text-to-image on kie.ai. Usage: node scripts/gen-batch.mjs <jobs.json> [model]
   jobs.json: [{ "out": "generated/x.png", "prompt": "...", "aspect": "3:2" }, ...]
   Runs jobs sequentially; each job polls until done. */
import { readFileSync, writeFileSync } from "node:fs";
const [, , jobsFile, model = "flux-2/pro-text-to-image"] = process.argv;
const jobs = JSON.parse(readFileSync(jobsFile, "utf8"));
let key = process.env.KIE_API_KEY;
for (const f of [".env.kie", "../.env.kie"]) { if (key) break; try { key = /KIE_API_KEY\s*=\s*(\S+)/.exec(readFileSync(f, "utf8"))?.[1]; } catch {} }
if (!key) { console.error("KIE_API_KEY not found"); process.exit(1); }
const H = { Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

function inputFor(job) {
  if (model.startsWith("flux-2")) return { prompt: job.prompt, aspect_ratio: job.aspect || "3:2", resolution: "2K", nsfw_checker: false };
  if (model.startsWith("seedream")) return { prompt: job.prompt, aspect_ratio: job.aspect || "3:2", quality: "high", output_format: "png", nsfw_checker: false };
  return { prompt: job.prompt, aspect_ratio: job.aspect || "3:2", resolution: "2K", output_format: "png" };
}

for (const job of jobs) {
  const created = await (await fetch("https://api.kie.ai/api/v1/jobs/createTask", { method: "POST", headers: H, body: JSON.stringify({ model, input: inputFor(job) }) })).json();
  const taskId = created?.data?.taskId;
  if (!taskId) { console.error(job.out, "createTask failed:", JSON.stringify(created)); continue; }
  let url = null;
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const info = await (await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`, { headers: H })).json();
    const state = info?.data?.state;
    if (state === "success") { url = JSON.parse(info.data.resultJson ?? "{}")?.resultUrls?.[0]; break; }
    if (state === "fail") { console.error(job.out, "failed:", info?.data?.failMsg); break; }
  }
  if (!url) { console.error(job.out, "no result"); continue; }
  writeFileSync(job.out, Buffer.from(await (await fetch(url)).arrayBuffer()));
  writeFileSync(job.out.replace(/\.png$/, ".url"), url);
  console.log("saved", job.out);
}
