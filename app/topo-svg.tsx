"use client";

import { useEffect, useRef, useState } from "react";
import { buildElevationField, type FieldResult } from "./lib/topo-field";

// ── Marching squares → SVG path data ──────────────────────────

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

function contourPathData(
  field: Float32Array,
  cols: number,
  rows: number,
  res: number,
  threshold: number
): string {
  const parts: string[] = [];

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
        case 1: parts.push(`M${x0},${leftY}L${bottomX},${y1}`); break;
        case 2: parts.push(`M${bottomX},${y1}L${x1},${rightY}`); break;
        case 3: parts.push(`M${x0},${leftY}L${x1},${rightY}`); break;
        case 4: parts.push(`M${topX},${y0}L${x1},${rightY}`); break;
        case 5:
          parts.push(`M${topX},${y0}L${x1},${rightY}`);
          parts.push(`M${x0},${leftY}L${bottomX},${y1}`);
          break;
        case 6: parts.push(`M${topX},${y0}L${bottomX},${y1}`); break;
        case 7: parts.push(`M${topX},${y0}L${x0},${leftY}`); break;
        case 8: parts.push(`M${topX},${y0}L${x0},${leftY}`); break;
        case 9: parts.push(`M${topX},${y0}L${bottomX},${y1}`); break;
        case 10:
          parts.push(`M${topX},${y0}L${x0},${leftY}`);
          parts.push(`M${bottomX},${y1}L${x1},${rightY}`);
          break;
        case 11: parts.push(`M${topX},${y0}L${x1},${rightY}`); break;
        case 12: parts.push(`M${x0},${leftY}L${x1},${rightY}`); break;
        case 13: parts.push(`M${bottomX},${y1}L${x1},${rightY}`); break;
        case 14: parts.push(`M${x0},${leftY}L${bottomX},${y1}`); break;
      }
    }
  }

  return parts.join("");
}

// ── Contour levels ───────────────────────────────────────────

type ContourLevel = {
  d: string;
  stroke: string;
  strokeWidth: number;
  level: number;
  isIndex: boolean;
};

const NUM_LEVELS = 28;
const INDEX_EVERY = 7;

function buildLevels(fr: FieldResult): ContourLevel[] {
  const levels: ContourLevel[] = [];

  for (let l = 1; l < NUM_LEVELS; l++) {
    const t = l / NUM_LEVELS;
    const isIndex = l % INDEX_EVERY === 0;

    const lit = isIndex ? 78 : 25 + t * 50;
    const alpha = isIndex ? 0.85 : 0.12 + t * 0.58;
    const strokeWidth = isIndex ? 2.2 : 0.4 + t * 0.6;
    const stroke = `hsla(0,0%,${lit}%,${alpha})`;

    const threshold = t * 100;
    const d = contourPathData(fr.field, fr.cols, fr.rows, fr.res, threshold);
    if (d) {
      levels.push({ d, stroke, strokeWidth, level: l, isIndex });
    }
  }

  return levels;
}

// ── Ripple wave ──────────────────────────────────────────────

const NUM_ANGLES = 120;
const RIPPLE_SPEED = 350;   // px per second
const RING_WIDTH = 70;      // annulus width in px
const PEAK_THRESHOLD = 65;  // elevation (0-100) that blocks the wave

type ActiveRipple = {
  ox: number;
  oy: number;
  startTime: number;
  maxRadii: Float32Array;
  el: SVGPathElement;
  glowEl: SVGPathElement;
};

function computeMaxRadii(
  fr: FieldResult,
  ox: number,
  oy: number
): Float32Array {
  const raw = new Float32Array(NUM_ANGLES);
  const maxDim = Math.hypot(fr.width, fr.height);

  for (let a = 0; a < NUM_ANGLES; a++) {
    const angle = (a / NUM_ANGLES) * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let r = 0;
    while (r < maxDim) {
      r += fr.res;
      const gx = Math.floor((ox + dx * r) / fr.res);
      const gy = Math.floor((oy + dy * r) / fr.res);
      if (gx < 0 || gx >= fr.cols || gy < 0 || gy >= fr.rows) break;
      if (fr.field[gy * fr.cols + gx] > PEAK_THRESHOLD) break;
    }
    raw[a] = r;
  }

  // Smooth with weighted moving average for organic shape
  const smoothed = new Float32Array(NUM_ANGLES);
  for (let a = 0; a < NUM_ANGLES; a++) {
    const p2 = raw[(a - 2 + NUM_ANGLES) % NUM_ANGLES];
    const p1 = raw[(a - 1 + NUM_ANGLES) % NUM_ANGLES];
    const c = raw[a];
    const n1 = raw[(a + 1) % NUM_ANGLES];
    const n2 = raw[(a + 2) % NUM_ANGLES];
    smoothed[a] = (p2 + p1 * 2 + c * 4 + n1 * 2 + n2) / 10;
  }

  return smoothed;
}

function buildRingPath(
  ox: number,
  oy: number,
  currentRadius: number,
  maxRadii: Float32Array
): string {
  const outer: string[] = [];
  const inner: string[] = [];

  for (let a = 0; a < NUM_ANGLES; a++) {
    const angle = (a / NUM_ANGLES) * Math.PI * 2;
    const maxR = maxRadii[a];
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const outerR = Math.min(currentRadius, maxR);
    const innerR = Math.max(0, Math.min(currentRadius - RING_WIDTH, maxR));

    outer.push(
      `${(ox + cosA * outerR).toFixed(1)},${(oy + sinA * outerR).toFixed(1)}`
    );
    inner.unshift(
      `${(ox + cosA * innerR).toFixed(1)},${(oy + sinA * innerR).toFixed(1)}`
    );
  }

  return `M${outer.join("L")}Z M${inner.join("L")}Z`;
}

// ── Component ─────────────────────────────────────────────────

export type TopoVariant = "classic" | "relief" | "engraving";

const SVG_NS = "http://www.w3.org/2000/svg";

export default function TopoSvg({
  variant: _variant = "classic",
}: { variant?: TopoVariant } = {}) {
  const [levels, setLevels] = useState<ContourLevel[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const fieldRef = useRef<FieldResult | null>(null);
  const rippleGroupRef = useRef<SVGGElement>(null);
  const ripplesRef = useRef<ActiveRipple[]>([]);
  const animRef = useRef<number>(0);
  const tickRef = useRef<(now: number) => void>(null);

  useEffect(() => {
    const render = () => {
      const fr = buildElevationField();
      if (!fr) return;
      fieldRef.current = fr;
      setSize({ w: fr.width, h: fr.height });
      setLevels(buildLevels(fr));
    };

    render();

    const observer = new ResizeObserver(render);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  // ── Animation loop (runs only when ripples are active) ──
  tickRef.current = (now: number) => {
    const ripples = ripplesRef.current;
    const group = rippleGroupRef.current;
    if (!group) return;

    let anyAlive = false;

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rip = ripples[i];
      const elapsed = now - rip.startTime;
      const currentRadius = (elapsed / 1000) * RIPPLE_SPEED;

      // Check how much of the ring is still visible
      let visibleAngles = 0;
      for (let a = 0; a < NUM_ANGLES; a++) {
        const maxR = rip.maxRadii[a];
        const outerR = Math.min(currentRadius, maxR);
        const innerR = Math.max(0, Math.min(currentRadius - RING_WIDTH, maxR));
        if (outerR - innerR > 1) visibleAngles++;
      }

      if (visibleAngles === 0) {
        // Ripple fully absorbed — remove
        group.removeChild(rip.glowEl);
        group.removeChild(rip.el);
        ripples.splice(i, 1);
        continue;
      }

      anyAlive = true;

      const d = buildRingPath(rip.ox, rip.oy, currentRadius, rip.maxRadii);
      const opacity = Math.min(1, visibleAngles / NUM_ANGLES + 0.15);

      rip.el.setAttribute("d", d);
      rip.el.setAttribute("opacity", opacity.toFixed(2));
      rip.glowEl.setAttribute("d", d);
      rip.glowEl.setAttribute("opacity", (opacity * 0.5).toFixed(2));
    }

    if (anyAlive) {
      animRef.current = requestAnimationFrame((t) => tickRef.current?.(t));
    }
  };

  // ── Click handler on document (SVG stays pointer-events:none) ──
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Don't trigger on interactive elements
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, label")) return;

      const fr = fieldRef.current;
      const group = rippleGroupRef.current;
      if (!fr || !group) return;

      const ox = e.pageX;
      const oy = e.pageY;

      const maxRadii = computeMaxRadii(fr, ox, oy);

      // Create glow element (blurred, behind)
      const glowEl = document.createElementNS(SVG_NS, "path");
      glowEl.setAttribute("fill", "hsla(200,60%,72%,0.25)");
      glowEl.setAttribute("fill-rule", "evenodd");
      glowEl.setAttribute("filter", "url(#ripple-blur)");
      glowEl.setAttribute("opacity", "0");

      // Create sharp ring element
      const el = document.createElementNS(SVG_NS, "path");
      el.setAttribute("fill", "hsla(200,50%,78%,0.18)");
      el.setAttribute("fill-rule", "evenodd");
      el.setAttribute("stroke", "hsla(200,60%,82%,0.4)");
      el.setAttribute("stroke-width", "1.2");
      el.setAttribute("opacity", "0");

      group.appendChild(glowEl);
      group.appendChild(el);

      const ripple: ActiveRipple = {
        ox,
        oy,
        startTime: performance.now(),
        maxRadii,
        el,
        glowEl,
      };
      ripplesRef.current.push(ripple);

      // Start animation loop if not already running
      cancelAnimationFrame(animRef.current);
      animRef.current = requestAnimationFrame((t) => tickRef.current?.(t));
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      fill="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <defs>
        <filter id="ripple-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {levels.map((lvl) => (
        <path
          key={lvl.level}
          d={lvl.d}
          stroke={lvl.stroke}
          strokeWidth={lvl.strokeWidth}
          fill="none"
          data-level={lvl.level}
          data-index={lvl.isIndex || undefined}
        />
      ))}

      <g ref={rippleGroupRef} />
    </svg>
  );
}
