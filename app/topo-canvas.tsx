"use client";

import { useEffect, useRef } from "react";

// Peak elevation per tag — a mountain's "height" is its semantic weight.
// Nearby peaks naturally form saddles where their falloff cones overlap,
// the same way Guyot Flat bridges Mt Guyot to its neighbors.
const PEAK_HEIGHTS: Record<string, number> = {
  H1: 100, H2: 68, H3: 46, H4: 34, H5: 28, H6: 25,
  BUTTON: 58,
  IMG: 72, VIDEO: 72,
  ARTICLE: 40, BLOCKQUOTE: 36, PRE: 36, FIGURE: 40, TABLE: 40,
  P: 24,
  INPUT: 30, TEXTAREA: 30, SELECT: 30,
  LABEL: 18, LI: 18,
  A: 14,
};

function elementPeak(el: Element): number {
  return PEAK_HEIGHTS[el.tagName] ?? 20;
}

// ─────────────────────────────────────────────────────────────
// Value noise — deterministic, C1-continuous, no deps
// ─────────────────────────────────────────────────────────────
function hash2(ix: number, iy: number, seed: number): number {
  let h = (ix | 0) * 374761393 + (iy | 0) * 668265263 + (seed | 0) * 1442695040;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  // smoothstep for C1 continuity
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix,     iy,     seed);
  const b = hash2(ix + 1, iy,     seed);
  const c = hash2(ix,     iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  const ab = a + (b - a) * sx;
  const cd = c + (d - c) * sx;
  return ab + (cd - ab) * sy; // 0..1
}

// Linear interpolation along a marching-squares cell edge
function edgeLerp(
  a: number,
  b: number,
  va: number,
  vb: number,
  threshold: number
): number {
  const dv = vb - va;
  if (Math.abs(dv) < 1e-6) return (a + b) / 2;
  return a + (b - a) * ((threshold - va) / dv);
}

function drawContourLevel(
  ctx: CanvasRenderingContext2D,
  field: Float32Array,
  cols: number,
  rows: number,
  res: number,
  threshold: number
) {
  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const tl = field[row * cols + col];
      const tr = field[row * cols + col + 1];
      const br = field[(row + 1) * cols + col + 1];
      const bl = field[(row + 1) * cols + col];

      const c =
        (tl >= threshold ? 8 : 0) |
        (tr >= threshold ? 4 : 0) |
        (br >= threshold ? 2 : 0) |
        (bl >= threshold ? 1 : 0);

      if (c === 0 || c === 15) continue;

      const x0 = col * res;
      const y0 = row * res;
      const x1 = x0 + res;
      const y1 = y0 + res;

      const topX    = edgeLerp(x0, x1, tl, tr, threshold);
      const rightY  = edgeLerp(y0, y1, tr, br, threshold);
      const bottomX = edgeLerp(x0, x1, bl, br, threshold);
      const leftY   = edgeLerp(y0, y1, tl, bl, threshold);

      switch (c) {
        case 1:  ctx.moveTo(x0, leftY);   ctx.lineTo(bottomX, y1); break;
        case 2:  ctx.moveTo(bottomX, y1); ctx.lineTo(x1, rightY);  break;
        case 3:  ctx.moveTo(x0, leftY);   ctx.lineTo(x1, rightY);  break;
        case 4:  ctx.moveTo(topX, y0);    ctx.lineTo(x1, rightY);  break;
        case 5:  // saddle
          ctx.moveTo(topX, y0);  ctx.lineTo(x1, rightY);
          ctx.moveTo(x0, leftY); ctx.lineTo(bottomX, y1);
          break;
        case 6:  ctx.moveTo(topX, y0);    ctx.lineTo(bottomX, y1); break;
        case 7:  ctx.moveTo(topX, y0);    ctx.lineTo(x0, leftY);   break;
        case 8:  ctx.moveTo(topX, y0);    ctx.lineTo(x0, leftY);   break;
        case 9:  ctx.moveTo(topX, y0);    ctx.lineTo(bottomX, y1); break;
        case 10: // saddle
          ctx.moveTo(topX, y0);    ctx.lineTo(x0, leftY);
          ctx.moveTo(bottomX, y1); ctx.lineTo(x1, rightY);
          break;
        case 11: ctx.moveTo(topX, y0);    ctx.lineTo(x1, rightY);  break;
        case 12: ctx.moveTo(x0, leftY);   ctx.lineTo(x1, rightY);  break;
        case 13: ctx.moveTo(bottomX, y1); ctx.lineTo(x1, rightY);  break;
        case 14: ctx.moveTo(x0, leftY);   ctx.lineTo(bottomX, y1); break;
      }
    }
  }
}

export default function TopoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const render = () => {
      const docWidth  = document.documentElement.scrollWidth;
      const docHeight = document.documentElement.scrollHeight;

      canvas.width  = docWidth;
      canvas.height = docHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, docWidth, docHeight);

      const RES  = 3;
      const cols = Math.ceil(docWidth  / RES) + 1;
      const rows = Math.ceil(docHeight / RES) + 1;
      const field = new Float32Array(cols * rows);

      // ── Seed noise from page text so each page has a stable terrain ──
      let seed = 2166136261;
      const seedText = (document.body.innerText || "").slice(0, 400);
      for (let i = 0; i < seedText.length; i++) {
        seed = Math.imul(seed ^ seedText.charCodeAt(i), 16777619);
      }

      // ── Select elements, containers absorb their children ──
      const selector =
        "h1,h2,h3,h4,h5,h6,p,button,a,img,video,input,textarea,select," +
        "article,blockquote,pre,figure,table,label,li";

      const candidates = document.querySelectorAll(selector);
      const claimed = new Set<Element>();
      const selected: { rect: DOMRect; peak: number; falloff: number }[] = [];

      candidates.forEach((el) => {
        if (el === canvas) return;
        const rect = el.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 8) return;

        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          if (claimed.has(parent)) return;
          parent = parent.parentElement;
        }
        claimed.add(el);

        const peak = elementPeak(el);
        // Taller peaks have longer skirts — h1 reaches ~380px, p reaches ~120px.
        // This is what lets nearby elements' cones overlap into saddles.
        const falloff = 70 + peak * 3.1;
        selected.push({ rect, peak, falloff });
      });

      // ── Build elevation field: peaks + multi-octave noise ──
      // peak contribution uses exp(-dist/falloff) so contributions add
      // smoothly in the overlap zone — that overlap IS the saddle.
      // Noise warps every cell at three scales: big bulges, mid knolls,
      // fine flow. All C1 continuous → marching squares stays smooth.

      const NS1 = 1 / 540, AMP1 = 30;  // big asymmetric ridges
      const NS2 = 1 / 190, AMP2 = 12;  // shoulders, knolls
      const NS3 = 1 / 68,  AMP3 = 4;   // gentle line flow

      // First pass: fill with noise only (valleys)
      for (let gy = 0; gy < rows; gy++) {
        const wy = gy * RES;
        for (let gx = 0; gx < cols; gx++) {
          const wx = gx * RES;
          const n =
            (valueNoise(wx * NS1, wy * NS1, seed)     - 0.5) * 2 * AMP1 +
            (valueNoise(wx * NS2, wy * NS2, seed + 1) - 0.5) * 2 * AMP2 +
            (valueNoise(wx * NS3, wy * NS3, seed + 2) - 0.5) * 2 * AMP3;
          field[gy * cols + gx] = n;
        }
      }

      // Second pass: add peak contributions on top of the noise field
      for (const { rect, peak, falloff } of selected) {
        const elLeft   = rect.left + window.scrollX;
        const elTop    = rect.top  + window.scrollY;
        const elRight  = elLeft + rect.width;
        const elBottom = elTop  + rect.height;

        // 4.5× falloff → exp(-4.5) ≈ 0.011, residual ~1% of peak. Fine.
        const reach = falloff * 4.5;
        const gxMin = Math.max(0, Math.floor((elLeft   - reach) / RES));
        const gxMax = Math.min(cols - 1, Math.ceil((elRight  + reach) / RES));
        const gyMin = Math.max(0, Math.floor((elTop    - reach) / RES));
        const gyMax = Math.min(rows - 1, Math.ceil((elBottom + reach) / RES));

        const invFalloff = 1 / falloff;

        for (let gy = gyMin; gy <= gyMax; gy++) {
          const py = gy * RES;
          const sdY = Math.max(elTop - py, py - elBottom);

          for (let gx = gxMin; gx <= gxMax; gx++) {
            const px = gx * RES;
            const sdX = Math.max(elLeft - px, px - elRight);

            let dist: number;
            if (sdX <= 0 && sdY <= 0) {
              dist = 0;
            } else if (sdX > 0 && sdY > 0) {
              dist = Math.sqrt(sdX * sdX + sdY * sdY);
            } else {
              dist = Math.max(sdX, sdY);
            }

            const contribution = peak * Math.exp(-dist * invFalloff);
            const idx = gy * cols + gx;
            // Add, don't max — overlapping contributions raise the saddle
            // between nearby peaks, which is exactly the effect we want.
            field[idx] += contribution;
          }
        }
      }

      // ── Normalize to 0..100 ──
      let minVal = Infinity;
      let maxVal = -Infinity;
      for (let i = 0; i < field.length; i++) {
        const v = field[i];
        if (v < minVal) minVal = v;
        if (v > maxVal) maxVal = v;
      }
      const range = maxVal - minVal;
      if (range < 1) return;
      const scale = 100 / range;
      for (let i = 0; i < field.length; i++) {
        field[i] = (field[i] - minVal) * scale;
      }

      // ── Draw contour lines ──
      // High thresholds hug the peaks → brightest, thickest.
      // Low thresholds trace valley curves in open space.
      const NUM_LEVELS = 32;
      for (let l = 1; l < NUM_LEVELS; l++) {
        const t = l / NUM_LEVELS; // 0 = valley, 1 = summit

        // Bias toward summit lines being bolder
        const lit = 20 + t * 62;
        const alpha = 0.14 + t * 0.6;

        ctx.lineWidth = l % 5 === 0 ? 1.6 : 0.75;
        ctx.strokeStyle = `hsla(0, 0%, ${lit}%, ${alpha})`;

        const threshold = t * 100;
        ctx.beginPath();
        drawContourLevel(ctx, field, cols, rows, RES, threshold);
        ctx.stroke();
      }
    };

    render();

    const observer = new ResizeObserver(render);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
