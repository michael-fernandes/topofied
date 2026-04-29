Contour map canvas: marching squares over an elevation field built from DOM element peaks + multi-octave noise. Keep terrain organic — no rectangular artifacts.

Ideally we use the contour lines to form almost containers on a page. For example, most pages will use rectangular cards to encapsulate items on the page that fit together (links to other pages, products you can by, services offered). Instead of using cards we need to leverage the contour lines to show both importance and organization of the page. This is a hard task so be aware and on your toes.

---

# Topo contour system — agent guide

The contour-line background is rendered by `topo-density.tsx` +
`lib/topo-engine.ts`. The system is small but has several non-obvious
invariants. Read this before editing either file.

## Architecture in one paragraph

`TopoDensity` is a single client component mounted once in `PageShell`. It
renders one absolutely-positioned, full-document SVG. Every animation frame
where something is changing, it: (1) scans the DOM for "peak" elements, (2)
builds a 2D elevation field from those peaks plus value noise, (3) extracts
contour lines via marching squares, (4) updates a pool of `<path>` elements
imperatively. React owns nothing inside the SVG.

## Files

- `app/topo-density.tsx` — the React component. Owns DOM scanning, hover
  state, and the rAF loop. Knows nothing about marching squares or noise.
- `app/lib/topo-engine.ts` — pure TS, no DOM, no React. Owns the field, the
  marching-squares contour extractor, the level/style builder, and a pooled
  SVG renderer factory.

Keep this split. Don't pull DOM logic into the engine; don't pull math into
the component.

## Peak discovery rules — DO NOT change casually

The scanner (`scanDocument` in `topo-density.tsx`) runs three passes. Each
exists for a reason:

1. **Hidden/important filter** — `data-topo-hidden` excludes a subtree;
   `data-topo-important` re-includes a specific descendant. This is the
   public API for chrome (nav, footers) — don't break it.
2. **Parent-claim absorption** — non-container elements claim their
   descendants so an `<article>` containing an `<h1>` and a `<p>` doesn't
   stack three peaks at the same coords. Containers (`SECTION`, `ARTICLE`,
   `MAIN`, `HEADER`, `FOOTER`, `NAV`, `FIGURE`, or `data-topo-container`) do
   NOT claim — they exist to be wide bases under their children.
3. **Peak spec building** — reads `data-topo-height` / `data-topo-falloff` /
   `data-topo-sharpness` overrides; falls back to the `PEAK_HEIGHTS` table
   keyed by tag.

If you add a new tag to `PEAK_HEIGHTS`, decide whether it should be a
container too. Adding it ONLY to `PEAK_HEIGHTS` makes it claim its
children, which is usually wrong for layout-ish tags.

Coordinates are document-absolute (`r.left + scrollX`, `r.top + scrollY`).
Don't change to viewport-relative — the SVG is sized to
`document.documentElement.scrollWidth/scrollHeight`.

## The `baseHeight` invariant — critical

In `topo-density.tsx`, before passing peaks to `buildField`, every peak gets:

```ts
{ ...p, baseHeight: p.height, height: p.height + boost }
```

`buildField` uses `baseHeight` (not `height`) to compute the normalization
range. This is what keeps contours stable when hover boosts a peak — only
the local mountain rises, the rest of the map doesn't ripple.

**If you ever pass peaks to `buildField` without setting `baseHeight`**,
hover will cause every contour line on the page to shift on every frame.
This looks subtly wrong and is hard to debug. Always set `baseHeight` to
the un-boosted value.

## The rAF loop — don't make it always-on

The hover animation loop (`kick` in `topo-density.tsx`) self-terminates when
no peak's boost is more than 0.25 away from its target. That's why hovering
nothing costs zero CPU. Two ways people break this:

- Removing the `moving` check and unconditionally re-scheduling — burns CPU
  forever.
- Calling `measureRef.current?.()` outside the rAF tick at high frequency
  (e.g. on every mousemove) — same problem, plus janky.

If you need to trigger a re-measure from elsewhere, route it through
`kick()` so the existing throttling applies, OR rely on the
`MutationObserver` already wired up in the layout effect.

## React anti-patterns to avoid

- **Don't put peak boosts in `useState`.** They update 60×/sec — would cause
  a render storm. They live in `animRef.current.current` (a plain object),
  mutated in place.
- **Don't make the SVG paths React elements.** The renderer in
  `topo-engine.ts` (`createRenderer`) appends and updates `<path>` nodes
  imperatively. React reconciliation across 28 paths × 60fps would tank
  perf. The `svgRef` is the only React-owned node inside the SVG.
- **Don't move `measure` into a `useCallback` with the wrong deps.** The
  current setup uses a `measureRef` so the rAF loop can call back into the
  latest measure function without recreating effects. If you "clean this
  up" with `useCallback`, double-check that the rAF cleanup still cancels
  correctly and that `seedNum` changes still re-wire observers.

## The MutationObserver attribute filter

The observer in the layout effect only watches a specific attribute list
(`data-topo-hidden`, `data-topo-important`, `data-topo-height`,
`data-topo-falloff`, `data-topo-sharpness`). If you add a new
`data-topo-*` attribute that should re-trigger measurement when it changes,
add it to that filter. Otherwise the change won't be observed.

`childList: true, subtree: true` is already on, so adding/removing elements
just works.

## Engine internals worth knowing

- **Marching squares** in `contourPathData` produces a flat string of
  disjoint `M…L…M…L…` segments concatenated into one path per level.
  They're NOT closed loops — you can't fill them, can't compute their
  length, can't stroke-dash-animate along them. If you need closed contours
  (e.g. for hypsometric tinting), you need a different algorithm. Filled
  hypsometric tinting was tried and rejected previously.
- **Field normalization** maps to 0..100. Threshold for level `l` of
  `numLevels` is `(l / numLevels) * 100`. Don't change the 0..100 range
  without auditing every call site that computes thresholds.
- **`res`** is grid pixel-resolution. Smaller = sharper contours but
  quadratically more cells to march. Default 6 is a perf compromise; the
  handoff design used 4. Don't lower without measuring.

## Color/theme knobs

`buildLevels` accepts `accentHue` / `accentSat` for index-line color and a
`theme: "dark" | "paper"` flag. The current call in `topo-density.tsx`
passes `accentHue: 0, accentSat: 0` which neutralizes the accent — every
contour is gray. To reintroduce cool-blue index lines, drop those overrides
and let defaults (200 / 55) apply, or pipe per-page values through.

## Hover ID conventions

- `data-topo-id` — stable id for this element's peak. Used both as the
  hover key AND, if no `data-topo-hover-id` exists, as the trigger.
- `data-topo-hover-id` — id to activate when this element is hovered.
  Lets you decouple a visible trigger (a button) from an invisible peak
  anchor (a 1×1 div) so the peak shape doesn't follow the trigger's bbox.

Currently only nav links carry these. Buttons and anchors elsewhere produce
peaks but don't participate in hover. If you broaden the system to
auto-assign ids in the scanner, also broaden the hover listener's
`closest()` selector to match.

## What lives where (don't shuffle)

- DOM-specific defaults (`PEAK_HEIGHTS`, `CONTAINER_TAGS`, `SELECTOR`) →
  `topo-density.tsx`. The engine must stay DOM-free so it could be reused
  for non-DOM peaks (a future canvas overlay, a static SSR'd snapshot).
- Math constants (noise frequencies/amplitudes, normalization bounds) →
  `topo-engine.ts`.
- Layout/render constants (`RES`, `NUM_LEVELS`, `INDEX_EVERY`, `SEED`,
  `HOVER_BOOST`) → `topo-density.tsx` (they're per-mount tuning, not engine
  defaults).

## When you change something, eyeball-test these

- A page with no hover should look identical before/after.
- Hovering a nav link should raise that one mountain smoothly; the rest of
  the map should not ripple.
- Resizing the window should re-fit contours to the new size without
  flicker.
- Navigating between routes should not leak rAF handles or listeners.
