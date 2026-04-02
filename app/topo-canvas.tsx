"use client";

import { useEffect, useRef } from "react";

const BASE_IMPORTANCE = 10;
const MULTIPLIERS: Record<string, number> = {
  BUTTON: 3,
  H1: 2, H2: 2, H3: 2, H4: 2, H5: 2, H6: 2,
};

function elementImportance(el: Element): number {
  const multiplier = MULTIPLIERS[el.tagName] ?? 1;
  return BASE_IMPORTANCE * multiplier;
}

// Linear interpolation along an edge for marching squares
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

      // Bitmask: TL=8, TR=4, BR=2, BL=1
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

      // Interpolated crossing coordinates on each edge
      const topX = edgeLerp(x0, x1, tl, tr, threshold); // top edge:    (topX, y0)
      const rightY = edgeLerp(y0, y1, tr, br, threshold); // right edge:  (x1, rightY)
      const bottomX = edgeLerp(x0, x1, bl, br, threshold); // bottom edge: (bottomX, y1)
      const leftY = edgeLerp(y0, y1, tl, bl, threshold); // left edge:   (x0, leftY)

      switch (c) {
        case 1:
          ctx.moveTo(x0, leftY);
          ctx.lineTo(bottomX, y1);
          break;
        case 2:
          ctx.moveTo(bottomX, y1);
          ctx.lineTo(x1, rightY);
          break;
        case 3:
          ctx.moveTo(x0, leftY);
          ctx.lineTo(x1, rightY);
          break;
        case 4:
          ctx.moveTo(topX, y0);
          ctx.lineTo(x1, rightY);
          break;
        case 5: // saddle: TR + BL
          ctx.moveTo(topX, y0);
          ctx.lineTo(x1, rightY);
          ctx.moveTo(x0, leftY);
          ctx.lineTo(bottomX, y1);
          break;
        case 6:
          ctx.moveTo(topX, y0);
          ctx.lineTo(bottomX, y1);
          break;
        case 7:
          ctx.moveTo(topX, y0);
          ctx.lineTo(x0, leftY);
          break;
        case 8:
          ctx.moveTo(topX, y0);
          ctx.lineTo(x0, leftY);
          break;
        case 9:
          ctx.moveTo(topX, y0);
          ctx.lineTo(bottomX, y1);
          break;
        case 10: // saddle: TL + BR
          ctx.moveTo(topX, y0);
          ctx.lineTo(x0, leftY);
          ctx.moveTo(bottomX, y1);
          ctx.lineTo(x1, rightY);
          break;
        case 11:
          ctx.moveTo(topX, y0);
          ctx.lineTo(x1, rightY);
          break;
        case 12:
          ctx.moveTo(x0, leftY);
          ctx.lineTo(x1, rightY);
          break;
        case 13:
          ctx.moveTo(bottomX, y1);
          ctx.lineTo(x1, rightY);
          break;
        case 14:
          ctx.moveTo(x0, leftY);
          ctx.lineTo(bottomX, y1);
          break;
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
      const docWidth = document.documentElement.scrollWidth;
      const docHeight = document.documentElement.scrollHeight;

      canvas.width = docWidth;
      canvas.height = docHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, docWidth, docHeight);

      // Grid resolution in pixels per cell — smaller = finer detail
      const RES = 3;
      const cols = Math.ceil(docWidth / RES) + 1;
      const rows = Math.ceil(docHeight / RES) + 1;
      const field = new Float32Array(cols * rows);

      // ── Base terrain: multi-octave value noise ──
      // Covers every cell so contour lines fill the whole canvas.
      // Base amplitude is calibrated so empty areas show ~8 contour rings.
      // Element Gaussian hills are added on top, compressing rings locally.

      // Deterministic per-cell hash → smooth value noise
      const hash = (xi: number, yi: number) => {
        let n = xi * 1619 + yi * 31337;
        n = (n ^ (n >> 8)) * 0x6c50b47c;
        n = (n ^ (n >> 8)) * 0xb82f1e52;
        n = n ^ (n >> 8);
        return (n & 0x7fffffff) / 0x7fffffff;
      };

      const valueNoise = (px: number, py: number, scale: number) => {
        const x = px / scale;
        const y = py / scale;
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        const fx = x - xi;
        const fy = y - yi;
        // Hermite smoothstep
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);
        const a = hash(xi,     yi);
        const b = hash(xi + 1, yi);
        const c = hash(xi,     yi + 1);
        const d = hash(xi + 1, yi + 1);
        return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
      };

      // 3 octaves: rolling hills + mid detail + fine texture
      // Scales at 500/220/90px give good coverage at any viewport size.
      // BASE_AMP=58 → after normalization, empty areas span ~30% of range
      // → ~7 visible contour lines from the 24 total.
      const BASE_AMP = 58;
      for (let row = 0; row < rows; row++) {
        const py = row * RES;
        for (let col = 0; col < cols; col++) {
          const px = col * RES;
          const v =
            0.50 * valueNoise(px, py, 500) +
            0.32 * valueNoise(px, py, 220) +
            0.18 * valueNoise(px, py, 90);
          field[row * cols + col] = v * BASE_AMP;
        }
      }

      // Measure all meaningful elements and add Gaussian hills
      const selector =
        "h1,h2,h3,h4,h5,h6,p,button,a,img,video,input,textarea,select," +
        "nav,header,footer,main,section,article,form,blockquote,pre,figure,table,label";

      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => {
        if (el === canvas) return;
        const rect = el.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) return;

        // Absolute document coordinates
        const cx = rect.left + window.scrollX + rect.width / 2;
        const cy = rect.top + window.scrollY + rect.height / 2;

        const importance = elementImportance(el);
        const elementRadius = Math.sqrt(rect.width * rect.height) * 0.5;

        // Tight sigma so each element creates a distinct, localised peak.
        // Importance adds a small bonus so headings radiate a bit further.
        const sigma = elementRadius * 0.65 + importance * 0.55;
        const twoSigmaSq = 2 * sigma * sigma;
        const amplitude = importance;
        const spread = sigma * 3.5;

        const gxMin = Math.max(0, Math.floor((cx - spread) / RES));
        const gxMax = Math.min(cols - 1, Math.ceil((cx + spread) / RES));
        const gyMin = Math.max(0, Math.floor((cy - spread) / RES));
        const gyMax = Math.min(rows - 1, Math.ceil((cy + spread) / RES));

        for (let gy = gyMin; gy <= gyMax; gy++) {
          const py = gy * RES;
          const dy = py - cy;
          const dy2 = dy * dy;
          for (let gx = gxMin; gx <= gxMax; gx++) {
            const px = gx * RES;
            const dx = px - cx;
            field[gy * cols + gx] +=
              amplitude * Math.exp(-(dx * dx + dy2) / twoSigmaSq);
          }
        }
      });

      // Normalize to 0–100
      let maxVal = 0;
      for (let i = 0; i < field.length; i++) {
        if (field[i] > maxVal) maxVal = field[i];
      }
      if (maxVal < 1) return;
      const invMax = 100 / maxVal;
      for (let i = 0; i < field.length; i++) field[i] *= invMax;

      // Draw contour lines — warm topo palette on dark background.
      const NUM_LEVELS = 28;
      for (let l = 1; l < NUM_LEVELS; l++) {
        const t = l / NUM_LEVELS; // 0→1 low→high elevation
        const threshold = t * 100;

        // Hue: deep teal (180) → olive/amber (55) as elevation rises
        const hue = 180 - t * 125;
        const sat = 50 + t * 25;
        const lit = 18 + t * 38;
        const alpha = 0.1 + t * 0.55;

        // Every 4th line is an "index contour" — thicker
        ctx.lineWidth = l % 4 === 0 ? 1.6 : 0.7;
        ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${lit}%, ${alpha})`;

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
