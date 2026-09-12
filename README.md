# Brick by Brick Group — website

Sample marketing site for Brick by Brick Group LLC, a general contractor for homes and industrial buildings. Vite + React, no backend.

- `src/` — React app. `components/` per section, `data.js` for all copy, `styles.css` for the whole design system.
- `public/assets/` — WebP photography, logo SVGs, and the scroll-scrubbed build sequence frames (`seq/` desktop 16:9, `seq-m/` small landscape, `seq-v/` portrait phones).
- `scripts/` — kie.ai image/video generation helpers (Flux 2 Pro, Seedream 5 Pro, Seedance 2.5) and puppeteer device-matrix checks. They need `KIE_API_KEY` in a local `.env.kie` (not committed).
- `BRAND.md` — palette, type, imagery recipe and the one signature interaction.

## Run

```
npm install
npm run dev          # http://localhost:5173
npm run build && npm run preview   # production build on http://localhost:4173
```

## Deploy

- **Vercel**: connected to `main`. `vercel.json` sets framework Vite, output `dist`. Push to deploy.
- **GitHub Pages**: `npm run deploy:pages` builds with the `/brick-by-brick-site/` base path and pushes `dist` to the `gh-pages` branch.

## Sample data

Figures, years, project names, reviews, phone, address and license number are placeholders to be replaced with the client's real information. All of it lives in `src/data.js` and the `About`/`Promise` sections.
