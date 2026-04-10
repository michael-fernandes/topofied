"use client";

import { useEffect, useRef } from "react";

const BASE_IMPORTANCE = 11;
const MULTIPLIERS: Record<string, number> = {
  BUTTON: 1.5,
  H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1,
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

      // ── Select elements, containers absorb their children ──
      // Query all interactive/content elements. For each one, if
      // an ancestor was already selected, skip it — the parent
      // "owns" the terrain for that region.

      const selector =
        "h1,h2,h3,h4,h5,h6,p,button,a,img,video,input,textarea,select," +
        "article,blockquote,pre,figure,table,label,li";

      const candidates = document.querySelectorAll(selector);
      const claimed = new Set<Element>();
      const selected: { el: Element; rect: DOMRect }[] = [];

      candidates.forEach((el) => {
        if (el === canvas) return;
        const rect = el.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 8) return;

        // If any ancestor is already claimed, skip this element
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          if (claimed.has(parent)) return;
          parent = parent.parentElement;
        }

        // Select this element and claim it so children are skipped
        claimed.add(el);
        selected.push({ el, rect });
      });

      // ── Distance field: elevation = distance to nearest element ──
      // Elements sit at elevation 0 (no contour lines on content).
      // Space between elements rises with distance, so contour
      // lines flow AROUND content like water between islands.

      const MAX_DIST = 400;
      field.fill(MAX_DIST);

      for (const { el, rect } of selected) {
        const elLeft   = rect.left + window.scrollX;
        const elTop    = rect.top  + window.scrollY;
        const elRight  = elLeft + rect.width;
        const elBottom = elTop  + rect.height;

        // More important elements pull contour lines tighter
        const importance = elementImportance(el);
        const weight = 0.7 + (importance - BASE_IMPORTANCE) * 0.06;

        const gxMin = Math.max(0, Math.floor((elLeft  - MAX_DIST) / RES));
        const gxMax = Math.min(cols - 1, Math.ceil((elRight  + MAX_DIST) / RES));
        const gyMin = Math.max(0, Math.floor((elTop   - MAX_DIST) / RES));
        const gyMax = Math.min(rows - 1, Math.ceil((elBottom + MAX_DIST) / RES));

        for (let gy = gyMin; gy <= gyMax; gy++) {
          const py = gy * RES;
          const sdY = Math.max(elTop - py, py - elBottom);

          for (let gx = gxMin; gx <= gxMax; gx++) {
            const px = gx * RES;
            const sdX = Math.max(elLeft - px, px - elRight);

            let dist: number;
            if (sdX <= 0 && sdY <= 0) {
              dist = 0; // inside element — no contour lines here
            } else if (sdX > 0 && sdY > 0) {
              dist = Math.sqrt(sdX * sdX + sdY * sdY);
            } else {
              dist = Math.max(sdX, sdY);
            }

            // Weight: important elements compress distance → denser contours nearby
            const weighted = dist * weight;

            const idx = gy * cols + gx;
            if (weighted < field[idx]) field[idx] = weighted;
          }
        }
      }

      // Normalize to 0–100
      let maxVal = 0;
      for (let i = 0; i < field.length; i++) {
        if (field[i] > maxVal) maxVal = field[i];
      }
      if (maxVal < 1) return;
      const invMax = 100 / maxVal;
      for (let i = 0; i < field.length; i++) field[i] *= invMax;

      // Draw contour lines — brightest near content, fading outward
      const NUM_LEVELS = 28;
      for (let l = 1; l < NUM_LEVELS; l++) {
        const t = l / NUM_LEVELS; // 0→1, near content→far from content

        // Invert: lines closest to content are brightest
        const nearness = 1 - t;
        const lit = 14 + nearness * 46;
        const alpha = 0.08 + nearness * 0.62;

        // Every 4th line is an "index contour" — thicker
        ctx.lineWidth = l % 4 === 0 ? 1.6 : 0.7;
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
