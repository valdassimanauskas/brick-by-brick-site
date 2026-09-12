# Brick by Brick Group LLC — brand system (approved 2026-09-12)

Company: Brick by Brick Group LLC — general contractor, homes and industrial buildings.
Tone: engineered, warm, confident. Craft over hype. The name is the story: things get built one course at a time.

## Palette (narrow — one ground, one ink, one accent)
| Token | Hex | Use |
|---|---|---|
| --ground | #161412 | warm near-black page ground (never #000) |
| --raise  | #1f1c19 | elevated surfaces, cards |
| --ink    | #ece7df | limestone off-white text on dark |
| --mute   | #8d867c | secondary text |
| --line   | rgba(236,231,223,.14) | mortar hairlines |
| --brick  | #8f3a24 | THE accent: deep oxidised brick red. Small doses. |
| --brick-hi | #b0492d | hover / highlight of the accent |
Built decision (12 Sep): the page ground is LIGHT limestone (#e9e4db, second course #ddd6ca) so the photography leads; dark dusk (#15120f) is reserved for the hero, the build sequence and contact. Alternate by section.
Avoid: construction yellow, trust-blue, the AI-default orange-terracotta (#D97757).

## Type
- Display: heavy condensed uppercase grotesque — "Bricolage Grotesque" (wght 800, wdth 75–90) from Google Fonts. Tight tracking (-0.02em), clamp() fluid sizes.
- Body: "Instrument Sans", 1.55 line-height, 60–72ch measure.
- Utility: "JetBrains Mono" for course numbers, specs, dates, eyebrows (wide tracking, small caps feel).

## Motifs
- Sections are numbered as brick COURSES: "COURSE 01 — FOUNDATION". Only content that is genuinely a sequence gets numbers.
- Mortar hairlines (--line) as section rules; running-bond offset grid as a subtle background texture (very low contrast).
- Hard edges. No border-radius anywhere. Components feel like laid masonry: stacked, offset, precise.
- Logo: stacked brick pyramid (3/2/1) in --brick + condensed wordmark. SVG in assets/logo.svg.

## Signature move (the ONE bold thing)
A scroll-scrubbed build sequence: a locked-off camera watches a building rise from foundation slab to finished shell, driven by scroll, in three pinned chapters (Foundation / Structure / Finish). Everything else stays disciplined.

## Imagery (revised 12 Sep after the first pass was rejected as "too AI")
Photography must read as real documentary photos, not renders. Model: **Flux 2 Pro** on kie.ai (`flux-2/pro-text-to-image`, scripts/gen-batch.mjs) for stills; Seedream 5 Pro image-to-image (`scripts/kie-i2i.mjs`) only for deriving same-camera states (it removes/rebuilds whole buildings reliably; Flux i2i is too conservative). Video: Seedance 2.5 first+last frame, `aspect_ratio: "adaptive"`, audio off.

Prompt recipe (30–90 words): subject in a plausible American setting → flat overcast light, no hard shadows → real-site mess (dumpster, work truck, mud, pallets, utility lines) → one camera contract ("35mm colour negative film, 28mm lens, f/8, fine grain, slight vignetting, muted realistic colours") → explicit avoid list: "avoid golden hour, avoid HDR, avoid 3D render, avoid CGI, avoid airbrushed polish, avoid text". Never use "cinematic", "8K", "masterpiece", golden hour, or dramatic skies. People only small and from behind.

## Interactions
Native scroll (no scroll-jacking), CSS/JS scroll-driven canvas for the build sequence, staggered reveals, hover-to-brick on links. Motion timing 300–600ms, ease-out.
