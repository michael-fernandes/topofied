// Authoring aid for the app icons — app/icon.svg and app/favicon.ico are
// generated output, not hand-edited. Run this, not the SVG.
//
//   node scripts/gen-favicon.mjs app/icon.svg M     ← what ships as icon.svg
//   node scripts/gen-favicon.mjs /tmp/small.svg MS  ← the 16px .ico entry
//   node scripts/gen-favicon.mjs /tmp/alt.svg B     ← superseded alternates
//
// Variants:
//   M  — monogram summit: MF ringed by contours that break at the letters
//   MS — the same, redrawn for 16px: two rings instead of five
//   B  — joy ridge stack: the site's "Unknown Pleasures" mode, occluded stack
//   S  — B redrawn coarse for 16px
//   A  — topo summit: nested closed contours, center drifting to the peak
//
// Every variant pairs a full drawing with a 16px cut. Whatever ships, the
// smallest .ico frame needs its own version — at 16 device px a five-ring
// field averages to gray, so the small cut drops detail rather than scaling it.
//
// The .ico is assembled from headless-Chrome rasters (ImageMagick's built-in
// SVG renderer mangles the clip-path, so don't feed it the SVG directly):
//   chrome --headless=new --default-background-color=00000000 \
//     --force-device-scale-factor=1 --window-size=N,N --screenshot=rN.png <page>
//   magick s16.png r32.png r48.png r64.png app/favicon.ico
import { writeFileSync } from "node:fs";

const r2 = (n) => Math.round(n * 100) / 100;

// Palette — app/components/kit.tsx + joy-division.tsx
const GROUND = "#1f1a16";
const FAINT = "#5a4f43";
const DIM = "#8d8071";
const INK = "#ebe2d4";
const ACCENT = "#c2a892"; // hsl(24 22% 70%) resolved — no CSS vars in an SVG file

const head = (body) =>
  // viewBox only, no width/height — a fixed intrinsic size would make large
  // surfaces (bookmark bar, install prompts) treat 32px as the natural size
  // instead of scaling the vector.
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6.5" fill="${GROUND}"/>
  <clipPath id="c"><rect width="32" height="32" rx="6.5"/></clipPath>
  <g clip-path="url(#c)">
${body}
  </g>
</svg>
`;

// ── A: nested contours ──────────────────────────────────────────────
const shape = (t) => 1 + 0.15 * Math.sin(2 * t + 0.6) + 0.08 * Math.cos(3 * t - 0.4);

function contour(R, cx, cy, steps = 40) {
  const pts = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const rr = R * shape(t);
    pts.push([cx + rr * Math.cos(t), cy + rr * Math.sin(t) * 0.92]);
  }
  let d = `M${r2(pts[0][0])} ${r2(pts[0][1])}`;
  for (let i = 0; i < steps; i++) {
    const p0 = pts[(i - 1 + steps) % steps];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % steps];
    const p3 = pts[(i + 2) % steps];
    d +=
      ` C${r2(p1[0] + (p2[0] - p0[0]) / 6)} ${r2(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${r2(p2[0] - (p3[0] - p1[0]) / 6)} ${r2(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${r2(p2[0])} ${r2(p2[1])}`;
  }
  return d + "Z";
}

function variantA() {
  // Levels march inward; the outermost bleeds past the frame so the icon reads
  // as a window onto a larger survey, not a floating blob.
  const L = [
    { R: 19.5, c: [14.2, 19.6], s: FAINT, w: 1.1 },
    { R: 13.6, c: [15, 18.2], s: DIM, w: 1.1 },
    { R: 8.4, c: [15.8, 16.6], s: DIM, w: 1.15 },
    { R: 4.2, c: [16.5, 14.9], s: INK, w: 1.25 },
  ];
  const body = L.map(
    (l) =>
      `    <path d="${contour(l.R, l.c[0], l.c[1])}" fill="none" stroke="${l.s}" stroke-width="${l.w}"/>`
  ).join("\n");
  return head(
    `${body}
    <circle cx="16.8" cy="14.1" r="2.6" fill="${GROUND}"/>
    <circle cx="16.8" cy="14.1" r="1.5" fill="${ACCENT}"/>`
  );
}

// ── B: joy ridge stack ──────────────────────────────────────────────
function variantB() {
  const N = 6;
  const TOP = 8.2;
  const GAP = 3.9;
  const rows = [];
  for (let i = 0; i < N; i++) {
    const y = TOP + i * GAP;
    // Eruption envelope: tallest in the middle rows, tapering top and bottom.
    const k = (i - (N - 1) * 0.42) / (N * 0.4);
    const env = Math.exp(-k * k);
    const amp = 13.4 * env;
    const pts = [];
    for (let x = -3; x <= 35; x += 1.6) {
      const u = (x - 15.2) / 6.6;
      // smooth hump + low-frequency harmonics: enough jag to read as a trace,
      // coarse enough to survive the 16px downsample instead of turning to noise
      const hump = Math.exp(-u * u);
      const jag =
        hump * (0.28 * Math.sin(x * 1.05 + i * 2.1) + 0.13 * Math.sin(x * 2.1 - i * 1.3));
      pts.push([x, y - amp * (hump + jag) * 0.92]);
    }
    const d = pts.map((p, j) => `${j ? "L" : "M"}${r2(p[0])} ${r2(p[1])}`).join(" ");
    const bright = env > 0.55;
    rows.push(
      `    <path d="${d} L35 34 L-3 34Z" fill="${GROUND}"/>\n` +
        `    <path d="${d}" fill="none" stroke="${bright ? INK : DIM}" stroke-width="1.3" ` +
        `stroke-linejoin="round" opacity="${r2(0.4 + 0.6 * env)}"/>`
    );
  }
  return head(rows.join("\n"));
}

// ── S: the same ridge stack, redrawn for 16px ───────────────────────
// The full art averages to gray once it's downsampled to 16 device px, so the
// .ico's smallest entry gets its own drawing: four ridges, fat strokes, one
// unambiguous summit. Same motif, coarser grid.
function variantS() {
  const N = 4;
  const TOP = 10.5;
  const GAP = 5.4;
  const rows = [];
  for (let i = 0; i < N; i++) {
    const y = TOP + i * GAP;
    const k = (i - 0.9) / 2.1;
    const env = Math.exp(-k * k);
    const amp = 13 * env;
    const pts = [];
    for (let x = -3; x <= 35; x += 2.2) {
      const u = (x - 15.5) / 6.2;
      const hump = Math.exp(-u * u);
      const jag = hump * 0.2 * Math.sin(x * 0.85 + i * 2.4);
      pts.push([x, y - amp * (hump + jag)]);
    }
    const d = pts.map((p, j) => `${j ? "L" : "M"}${r2(p[0])} ${r2(p[1])}`).join(" ");
    rows.push(
      `    <path d="${d} L35 34 L-3 34Z" fill="${GROUND}"/>\n` +
        `    <path d="${d}" fill="none" stroke="${env > 0.5 ? INK : DIM}" stroke-width="2" ` +
        `stroke-linejoin="round" opacity="${r2(0.55 + 0.45 * env)}"/>`
    );
  }
  return head(rows.join("\n"));
}

// ── M: monogram summit ──────────────────────────────────────────────
// The initials ARE the peak: contours ring them, and the letters interrupt the
// lines the way an elevation label breaks a contour on a real survey sheet.
// The break is a mask — the same letter paths stroked fat and black — so the
// clearance follows the letterforms exactly instead of being a blunt box.

// MF as stroked polylines, not a font: a favicon can't count on a webfont, and
// tracing outlines would be far more path data than two letters are worth.
// The M's middle vertex runs most of the way to the baseline. Stopping it at
// the midline — the tidier-looking choice — makes the letter read as an H once
// it's downsampled to 16px, because the notch fills in.
const CAP_TOP = 10.6;
const CAP_BOT = 21.6;
const MONOGRAM = [
  `M7.3 ${CAP_BOT} L7.3 ${CAP_TOP} L11.4 19.4 L15.5 ${CAP_TOP} L15.5 ${CAP_BOT}`, // M
  `M18.9 ${CAP_BOT} L18.9 ${CAP_TOP} L24.5 ${CAP_TOP}`, // F stem + arm
  `M18.9 15.8 L23.4 15.8`, // F crossbar
];

function monogram({ letterWidth, halo, levels }) {
  const cut = MONOGRAM.map(
    (d) =>
      `      <path d="${d}" stroke="#000" stroke-width="${halo}" fill="none" ` +
      `stroke-linejoin="round" stroke-linecap="round"/>`
  ).join("\n");
  const rings = levels
    .map(
      (l) =>
        `      <path d="${contour(l.R, l.c[0], l.c[1])}" fill="none" stroke="${l.s}" stroke-width="${l.w}"/>`
    )
    .join("\n");
  const letters = MONOGRAM.map(
    (d) =>
      // Butt caps and mitered joins so the monogram reads as drafted rather
      // than rounded off — but miterlimit 1.8 bevels the M's acute vertices,
      // which at a full miter shoot spikes well past the cap height.
      `    <path d="${d}" stroke="${INK}" stroke-width="${letterWidth}" fill="none" ` +
      `stroke-linejoin="miter" stroke-miterlimit="1.8" stroke-linecap="butt"/>`
  ).join("\n");
  return head(
    `    <mask id="label">
      <rect width="32" height="32" fill="#fff"/>
${cut}
    </mask>
    <g mask="url(#label)">
${rings}
    </g>
${letters}`
  );
}

function variantM() {
  return monogram({
    letterWidth: 2.3,
    halo: 5.6,
    levels: [
      { R: 23.5, c: [15.2, 17], s: FAINT, w: 1 },
      { R: 19.6, c: [15.5, 16.7], s: FAINT, w: 1 },
      { R: 16, c: [15.8, 16.3], s: DIM, w: 1.05 },
      { R: 12.6, c: [16.1, 16], s: DIM, w: 1.05 },
      { R: 9.6, c: [16.4, 15.7], s: ACCENT, w: 1.05 },
    ],
  });
}

// The 16px cut of the monogram: fatter letters, two rings instead of four, so
// the initials stay the only thing competing for those pixels.
function variantMS() {
  return monogram({
    letterWidth: 2.6,
    halo: 6.4,
    levels: [
      { R: 21.5, c: [15.5, 16.8], s: DIM, w: 1.7 },
      { R: 16, c: [16, 16], s: DIM, w: 1.7 },
    ],
  });
}

const which = process.argv[3] || "A";
const build = { A: variantA, B: variantB, S: variantS, M: variantM, MS: variantMS }[which];
writeFileSync(process.argv[2], build());
console.log(which, "written");
