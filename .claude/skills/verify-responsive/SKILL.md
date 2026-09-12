---
name: verify-responsive
description: MANDATORY before reporting any visual or layout change as done. Screenshot and measure the change across the full device matrix (small phones, standard phones, large phones, tablet, laptop, desktop) plus toolbar-shrunk heights, and check links actually navigate. Never say a change is verified from a single desktop screenshot.
---

# Verify Across Every Device Before Reporting

The user has repeatedly found layout bugs on phones that a desktop screenshot
did not reveal — clipped headlines, invisible text, dead links, sections not
filling the viewport. Verification is not optional and a single viewport is
never enough.

## The device matrix — run all of these

| Name | CSS px | Notes |
|---|---|---|
| iPhone SE | 375 × 667 | smallest common phone |
| iPhone SE, toolbar | 375 × 553 | Safari chrome eats ~114px |
| iPhone 12/13/14 | 390 × 844 | most common |
| iPhone 14, toolbar | 390 × 734 | |
| iPhone 14/15 Pro Max | 430 × 932 | |
| Pixel 7 | 412 × 915 | Android baseline |
| Galaxy S/A (small) | 360 × 800 | narrowest mainstream Android |
| iPad portrait | 768 × 1024 | tablet breakpoint boundary |
| Laptop | 1366 × 768 | short desktop — pinned sections clip here |
| Desktop | 1440 × 900 | |
| Wide | 1920 × 1080 | |

Always use `deviceScaleFactor: 2` and `isMobile/hasTouch: true` for phones.
The toolbar-shrunk rows are not optional: `svh` bugs and bottom-anchored
content only fail there.

## What to assert, not just eyeball

For every change, measure — do not trust the screenshot alone:

1. **Nothing clipped** — for each key text node, assert
   `rect.right <= innerWidth` and `rect.bottom <= innerHeight` where it is
   meant to be in view.
2. **Nothing invisible** — assert `getComputedStyle(el).opacity === "1"` on
   revealed content. Reveal animations that never trigger are a recurring bug.
3. **Full-viewport sections really fill it** — assert the section's
   `getBoundingClientRect().height` is within a pixel or two of
   `window.innerHeight`, and that no neighbouring section bleeds in.
4. **Links navigate** — click every new/changed link and assert the resulting
   `page.url()` or `window.scrollY` actually changed. An anchor pointing at a
   removed id silently does nothing.
5. **No console errors** — attach `page.on("pageerror")` and report the count.
6. **Touch gestures are not blocked** — for horizontal rails, simulate a
   touch drag and assert `scrollLeft` changed. Invisible fixed overlays with
   pointer-events swallow swipes.

## How

Write a throwaway puppeteer-core script in the site folder, loop the matrix,
print a table of pass/fail per device, screenshot each, then delete the script.
Chrome lives at `C:\Program Files\Google\Chrome\Application\chrome.exe`.
Wait for the preloader to clear before measuring:

```js
await page.waitForSelector('[aria-label="Loading"]', { timeout: 20000 }).catch(() => {});
await page.waitForFunction(() => !document.querySelector('[aria-label="Loading"]'), { timeout: 90000 });
```

## Hard rules

- Read the screenshots. A measurement can pass while the design looks wrong.
- Fix every failure and re-run before telling the user anything is done.
- Report what was checked and on which devices — the user wants the receipts.
- If one device cannot be fixed without a tradeoff, say so explicitly rather
  than quietly shipping it broken.
