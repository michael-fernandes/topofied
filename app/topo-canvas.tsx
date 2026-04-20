"use client";

import { useEffect, useRef } from "react";
import { buildElevationField } from "./lib/topo-field";

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

      const topX = edgeLerp(x0, x1, tl, tr, threshold);
      const rightY = edgeLerp(y0, y1, tr, br, threshold);
      const bottomX = edgeLerp(x0, x1, bl, br, threshold);
      const leftY = edgeLerp(y0, y1, tl, bl, threshold);

      switch (c) {
        case 1: ctx.moveTo(x0, leftY); ctx.lineTo(bottomX, y1); break;
        case 2: ctx.moveTo(bottomX, y1); ctx.lineTo(x1, rightY); break;
        case 3: ctx.moveTo(x0, leftY); ctx.lineTo(x1, rightY); break;
        case 4: ctx.moveTo(topX, y0); ctx.lineTo(x1, rightY); break;
        case 5:  // saddle
          ctx.moveTo(topX, y0); ctx.lineTo(x1, rightY);
          ctx.moveTo(x0, leftY); ctx.lineTo(bottomX, y1);
          break;
        case 6: ctx.moveTo(topX, y0); ctx.lineTo(bottomX, y1); break;
        case 7: ctx.moveTo(topX, y0); ctx.lineTo(x0, leftY); break;
        case 8: ctx.moveTo(topX, y0); ctx.lineTo(x0, leftY); break;
        case 9: ctx.moveTo(topX, y0); ctx.lineTo(bottomX, y1); break;
        case 10: // saddle
          ctx.moveTo(topX, y0); ctx.lineTo(x0, leftY);
          ctx.moveTo(bottomX, y1); ctx.lineTo(x1, rightY);
          break;
        case 11: ctx.moveTo(topX, y0); ctx.lineTo(x1, rightY); break;
        case 12: ctx.moveTo(x0, leftY); ctx.lineTo(x1, rightY); break;
        case 13: ctx.moveTo(bottomX, y1); ctx.lineTo(x1, rightY); break;
        case 14: ctx.moveTo(x0, leftY); ctx.lineTo(bottomX, y1); break;
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
      const fr = buildElevationField();
      if (!fr) return;

      canvas.width = fr.width;
      canvas.height = fr.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, fr.width, fr.height);

      // ── Draw contour lines ──
      // High thresholds hug the peaks → brightest, thickest.
      // Low thresholds trace valley curves in open space.
      const NUM_LEVELS = 32;
      const INDEX_EVERY = 5;
      for (let l = 1; l < NUM_LEVELS; l++) {
        const t = l / NUM_LEVELS;
        const isIndex = l % INDEX_EVERY === 0;

        const lit = isIndex ? 70 : 38 + t * 32;
        const alpha = isIndex ? 0.75 : 0.35 + t * 0.3;

        ctx.lineWidth = isIndex ? 1.8 : 0.7;
        ctx.strokeStyle = `hsla(0, 0%, ${lit}%, ${alpha})`;

        const threshold = t * 100;
        ctx.beginPath();
        drawContourLevel(ctx, fr.field, fr.cols, fr.rows, fr.res, threshold);
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
