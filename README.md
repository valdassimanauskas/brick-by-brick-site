# Brick by Brick Group — website

Sample marketing site for Brick by Brick Group LLC, a general contractor for homes and industrial buildings.

- `site/` — the static site (HTML, CSS, JS, WebP assets). Deployed to GitHub Pages by `.github/workflows/pages.yml`.
- `scripts/` — kie.ai image/video generation helpers (Flux 2 Pro, Seedream 5 Pro, Seedance 2.5) and puppeteer screenshot checks. They need `KIE_API_KEY` in a local `.env.kie` (not committed).
- `BRAND.md` — palette, type, imagery recipe and the one signature interaction.

Run locally:

```
python -m http.server 8787 --directory site
```

Sample data: figures, years, project names, reviews, phone, address and license number are placeholders to be replaced with the client's real information.
