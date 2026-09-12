---
name: design-research
description: MANDATORY before designing or adding anything visual — new sections, components, widgets, pages, layouts, animations, imagery, or restyling existing UI. Trigger on any request like "design", "add a section", "add content", "make it look better", "rework", "build a page/component/widget", or aesthetic complaints ("doesn't look clean/professional/modern"). Research the current best real-world work first (Reddit, Google, and actual award-winning sites on awwwards.com — visiting the winner URLs themselves), then design from evidence, never from memory alone.
---

# Design Research First

Never design from memory or first instinct. Every visual decision must be grounded in what the best current sites actually do. The user has corrected work twice for skipping this step — treat research as a hard prerequisite, not an optional enhancement.

## Workflow (all steps, in order)

### 1. Name the design problem
One sentence: "horizontal card rail for services", "floating contact launcher", "pricing tier cards", "scroll-driven section transition". Research the *pattern*, not the vague vibe.

### 2. Research at least three source types

**a. Awwwards — SEARCH IT for the pattern, then go INTO the sites.**
Do not just open the generic winners list and grab whatever is on top. Search
awwwards for the thing being designed, then study real examples of it:
- Search the pattern directly:
  `https://www.awwwards.com/websites/?text=<pattern keywords>`
  (e.g. `?text=fitness`, `?text=architecture`, `?text=editorial`,
  `?text=typography`)
- Or use the tag/category routes when one fits:
  `https://www.awwwards.com/websites/<category>/`
  (fitness, health, architecture, photography, portfolio…)
- Also worth searching via Google when awwwards' own search is thin:
  `site:awwwards.com <pattern> site of the day`
- Then WebFetch 2–3 of the ACTUAL live winner URLs and ask specifically: how is
  THIS pattern structured, sized, typeset, animated, and placed? What repeats
  across their sections? Many winners are JS-only or block fetching — when one
  returns 403 or empty, note it and move to the next. Never stop at a listing
  page; at least one real site must be opened.

**b. Reddit + community discussion** via WebSearch — what practitioners say
works and what reads as dated (e.g. `site:reddit.com web design <pattern> 2026`,
r/web_design, r/UI_Design). Prioritize the last 3–6 months.

**c. Google / specialist articles — RESTRICT TO THE PAST YEAR.**
Always scope the query to recent results; design metas rot fast and stale
advice is worse than none. Put the current or previous year in the query
itself (e.g. `<pattern> best practice 2026`, `<pattern> trends past year`) and
discard anything written more than ~12 months ago unless it is a standards
document (WCAG, Material spec, NN/g) where the guidance is stable.
Pattern-specific sources: Material specs, NN/g, Mobbin glossaries, current-year
trend roundups. For AI-generated imagery: re-check the current best model AND
the current prompting technique every single time — both change monthly.

### 3. Distill findings into concrete rules
Write down (in the reply, briefly) the 3–6 specific, measurable choices the
evidence supports: sizes, placement, motion timing, reveal patterns, typography
scale, what to avoid. Cite which site/source each came from. If the sources
disagree, say which one wins and why.

### 4. Filter through the Brick by Brick brand system
Adopt patterns, never wholesale styles. Everything must pass through the
approved brand system in `BRAND.md` at the project root (read it first):
- Palette: ground `#161412` / ink `#ece7df` / ONE accent, oxidised brick red
  `#8f3a24`, used sparingly; dark/light section alternation
- Hard edges, no border-radius; components feel like laid masonry
- Type: Bricolage Grotesque condensed uppercase display, Instrument Sans body,
  JetBrains Mono utility labels
- Motifs: sections numbered as brick "courses", mortar hairlines, subtle
  running-bond grid texture
- Signature: the scroll-scrubbed build sequence is the one bold move; keep
  everything else disciplined (no trend-stacking)

### 5. Implement, then verify like a user
Build it, screenshot desktop (1440×900) AND mobile (390×844 @2x, plus a
toolbar-shrunk height when bottom-anchored), check overlap with existing fixed
elements (nav, contact widget, scroll cues), and confirm pointer-events don't
block page gestures. Fix before presenting.

## Hard rules
- No visual work ships without step 2 having actually fetched at least one
  real award-winning site's live URL.
- Present the borrowed patterns honestly: "X from igloo.inc, Y from Material
  spec" — the user wants to see the receipts.
- Recency matters: prefer sources from the current or previous quarter;
  design metas rot fast.
- If research contradicts the user's suggestion, say so with the evidence and
  offer the better option — the user has explicitly asked for educated
  decisions over compliance.
