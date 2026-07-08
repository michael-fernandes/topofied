"use client";

// Joy Division ↔ Topo background visualization.
//
// Purely generative: invents an elevation field with a few hand-placed peaks
// plus low-amplitude noise, then renders the same field two ways:
//
//   • topo mode — each horizontal scan line bows gently around peaks, so
//     adjacent lines stack into concentric oval iso-curves (a contour map).
//   • joy mode  — each scan line erupts upward where the field is high,
//     with sharp triangular spikes and high-frequency jaggedness in a
//     central active region. Peaks from lower lines paint over the strokes
//     of lines above them, producing the iconic Unknown Pleasures occlusion.
//
// A fixed-position button toggles between modes. flubber interpolates each
// ridge path from one form to the other for a smooth morph. Both modes share
// the same point count per ridge, so the morph is true 1:1.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { interpolate } from "flubber";

const NUM_LINES = 80;
const SAMPLE_STEP = 5;
const PEAK_HEIGHT = 130;
const PEAK_EXPONENT = 1.85;
const JOY_DETAIL = 0.55;
const JOY_QUIET = 0.45;
const ACTIVE_BAND = 0.42;
const TRANSITION_MS = 900;
const SEED = 1337;

type Ridge = {
  topD_topo: string;
  topD_joy: string;
  fillD_topo: string;
  fillD_joy: string;
};

// ── Noise ────────────────────────────────────────────────────────────
function hash2(ix: number, iy: number, seed: number): number {
  let h =
    (ix | 0) * 374761393 +
    (iy | 0) * 668265263 +
    (seed | 0) * 1442695040;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}

function vnoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  return (
    a * (1 - sx) * (1 - sy) +
    b * sx * (1 - sy) +
    c * (1 - sx) * sy +
    d * sx * sy
  );
}

function fbm(x: number, y: number, seed: number, octaves: number): number {
  let amp = 1;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * vnoise(x * freq, y * freq, seed + o * 17);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

// ── Field ────────────────────────────────────────────────────────────
type Peak = { x: number; y: number; h: number; r: number };

function buildPeaks(W: number, H: number): Peak[] {
  const cx = W * 0.5;
  const cy = H * 0.5;
  const R = Math.min(W, H);
  return [
    { x: cx - W * 0.06, y: cy - H * 0.04, h: 1.0, r: R * 0.16 },
    { x: cx + W * 0.09, y: cy + H * 0.05, h: 0.78, r: R * 0.13 },
    { x: cx + W * 0.01, y: cy + H * 0.10, h: 0.62, r: R * 0.11 },
    { x: cx - W * 0.11, y: cy + H * 0.08, h: 0.55, r: R * 0.1 },
    { x: cx + W * 0.04, y: cy - H * 0.10, h: 0.46, r: R * 0.09 },
  ];
}

function elevation(
  x: number,
  y: number,
  peaks: Peak[],
  seed: number,
): number {
  let v = 0;
  for (const p of peaks) {
    const dx = (x - p.x) / p.r;
    const dy = (y - p.y) / p.r;
    v += p.h * Math.exp(-(dx * dx + dy * dy) * 1.6);
  }
  // Gentle ambient relief so even quiet regions have terrain.
  v += 0.03 * (fbm(x / 140, y / 140, seed, 3) - 0.5);
  return v;
}

function activeness(y: number, H: number): number {
  const t = (y - H * 0.5) / (H * ACTIVE_BAND * 0.5);
  return Math.exp(-t * t);
}

// Window-constrained iso-curve trace. For column x, find the y near yBase
// (within ±window) whose field elevation is closest to `level`. Stacked
// across ridges with their own per-ridge level, this yields proper nested
// concentric contour lines around peaks: each ridge traces a different
// iso-elevation, so adjacent rings converge on steep slopes and spread on
// shallow ones — actual topo-map behavior, not a uniform bow.
function traceIso(
  x: number,
  yBase: number,
  level: number,
  peaks: Peak[],
  seed: number,
  window: number,
): number {
  let bestY = yBase;
  let bestDiff = Math.abs(elevation(x, yBase, peaks, seed) - level);
  const step = 2;
  for (let dy = -window; dy <= window; dy += step) {
    if (dy === 0) continue;
    const y = yBase + dy;
    const diff = Math.abs(elevation(x, y, peaks, seed) - level);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestY = y;
    }
  }
  return bestY;
}

// ── Ridge geometry ───────────────────────────────────────────────────
function buildRidges(W: number, H: number, seed: number): Ridge[] {
  const peaks = buildPeaks(W, H);
  const samples = Math.max(2, Math.ceil(W / SAMPLE_STEP) + 1);
  const spacing = H / NUM_LINES;
  const isoWindow = Math.max(spacing * 5, 36);
  const ridges: Ridge[] = [];

  for (let i = 0; i < NUM_LINES; i++) {
    const y0 = spacing * (i + 0.5);
    const act = activeness(y0, H);
    // Each ridge's own iso-elevation level — sampled at the canvas mid-x
    // so peak-region ridges get high levels (small loops near summits) and
    // peripheral ridges get near-zero levels (gentle wandering horizontals).
    const ridgeLevel = elevation(W * 0.5, y0, peaks, seed);

    const topoPts: [number, number][] = new Array(samples);
    const joyPts: [number, number][] = new Array(samples);

    for (let s = 0; s < samples; s++) {
      const x = Math.min(W, s * SAMPLE_STEP);
      const e = elevation(x, y0, peaks, seed);

      const topoY = traceIso(x, y0, ridgeLevel, peaks, seed, isoWindow);
      topoPts[s] = [x, topoY];

      // Joy: big peak amplitude with jagged high-freq detail in active band.
      const peakAmp = Math.pow(Math.max(0, e), PEAK_EXPONENT) * PEAK_HEIGHT;
      const detail =
        (fbm(x * 0.06, y0 * 0.06 + s * 0.013, seed + 91, 4) - 0.5) *
        2 *
        JOY_DETAIL *
        peakAmp;
      const quiet =
        (vnoise(x * 0.024, y0 * 0.024, seed + 211) - 0.5) *
        2 *
        JOY_QUIET *
        (1 - act * 0.7);
      const joyY = y0 - (peakAmp + detail) - quiet;
      joyPts[s] = [x, joyY];
    }

    ridges.push({
      topD_topo: pointsToOpenPath(topoPts),
      topD_joy: pointsToOpenPath(joyPts),
      fillD_topo: pointsToFillPath(topoPts, y0 + spacing * 0.55),
      fillD_joy: pointsToFillPath(joyPts, y0 + spacing * 0.55),
    });
  }
  return ridges;
}

function pointsToOpenPath(pts: [number, number][]): string {
  if (pts.length === 0) return "";
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += `L${pts[i][0].toFixed(2)},${pts[i][1].toFixed(2)}`;
  }
  return d;
}

function pointsToFillPath(
  pts: [number, number][],
  baseline: number,
): string {
  if (pts.length === 0) return "";
  const last = pts[pts.length - 1];
  const first = pts[0];
  let d = `M${first[0].toFixed(2)},${baseline.toFixed(2)}`;
  d += `L${first[0].toFixed(2)},${first[1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += `L${pts[i][0].toFixed(2)},${pts[i][1].toFixed(2)}`;
  }
  d += `L${last[0].toFixed(2)},${baseline.toFixed(2)}Z`;
  return d;
}

// ── Component ────────────────────────────────────────────────────────
type Mode = "topo" | "joy";

export default function JoyDivision() {
  const svgRef = useRef<SVGSVGElement>(null);
  const fillsRef = useRef<SVGPathElement[]>([]);
  const topsRef = useRef<SVGPathElement[]>([]);
  const ridgesRef = useRef<Ridge[]>([]);
  const modeRef = useRef<Mode>("topo");
  const rafRef = useRef(0);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [mode, setMode] = useState<Mode>("topo");

  // Resize observer keeps the field fitted to the viewport.
  useLayoutEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Build/refresh ridges and SVG path nodes whenever size changes.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || size.w === 0 || size.h === 0) return;

    const ridges = buildRidges(size.w, size.h, SEED);
    ridgesRef.current = ridges;

    // Reset the SVG to a known state.
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const fills: SVGPathElement[] = [];
    const tops: SVGPathElement[] = [];
    for (let i = 0; i < ridges.length; i++) {
      // Painter's order: append fill then stroke per ridge, top-to-bottom.
      // Lower (later) ridges' fills overpaint upper ridges' strokes wherever
      // peaks rise — this is the Unknown Pleasures occlusion effect.
      const fill = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      fill.setAttribute("fill", "#1f1a16");
      fill.setAttribute("stroke", "none");
      svg.appendChild(fill);
      fills.push(fill);

      const top = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      top.setAttribute("fill", "none");
      top.setAttribute("stroke", "#ebe2d4");
      top.setAttribute("stroke-width", "0.9");
      top.setAttribute("stroke-linejoin", "round");
      top.setAttribute("stroke-linecap", "round");
      top.setAttribute("vector-effect", "non-scaling-stroke");
      svg.appendChild(top);
      tops.push(top);
    }
    fillsRef.current = fills;
    topsRef.current = tops;

    // Snap to current resting mode without animation.
    paintResting(modeRef.current);
  }, [size.w, size.h]);

  const paintResting = (m: Mode) => {
    const ridges = ridgesRef.current;
    const fills = fillsRef.current;
    const tops = topsRef.current;
    const fillOpacity = m === "joy" ? "1" : "0";
    for (let i = 0; i < ridges.length; i++) {
      fills[i].setAttribute(
        "d",
        m === "joy" ? ridges[i].fillD_joy : ridges[i].fillD_topo,
      );
      fills[i].setAttribute("fill-opacity", fillOpacity);
      tops[i].setAttribute(
        "d",
        m === "joy" ? ridges[i].topD_joy : ridges[i].topD_topo,
      );
    }
  };

  const toggle = () => {
    const ridges = ridgesRef.current;
    const fills = fillsRef.current;
    const tops = topsRef.current;
    if (!ridges.length) return;

    const next: Mode = modeRef.current === "topo" ? "joy" : "topo";
    modeRef.current = next;
    setMode(next);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const interps = ridges.map((r, i) => {
      const fromFill = fills[i].getAttribute("d") || r.fillD_topo;
      const toFill = next === "joy" ? r.fillD_joy : r.fillD_topo;
      const fromTop = tops[i].getAttribute("d") || r.topD_topo;
      const toTop = next === "joy" ? r.topD_joy : r.topD_topo;
      // Open ridge path stroked → flubber treats as ring; that's fine since
      // both endpoints sit on the same baseline x-extents in either mode.
      let fillI: (t: number) => string;
      let topI: (t: number) => string;
      try {
        fillI = interpolate(fromFill, toFill, { maxSegmentLength: 18 });
      } catch {
        fillI = (t) => (t < 0.5 ? fromFill : toFill);
      }
      try {
        topI = interpolate(fromTop, toTop, { maxSegmentLength: 18 });
      } catch {
        topI = (t) => (t < 0.5 ? fromTop : toTop);
      }
      return { fillI, topI };
    });

    const start = performance.now();
    const tick = () => {
      const raw = Math.min(1, (performance.now() - start) / TRANSITION_MS);
      // easeInOutCubic
      const t =
        raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      // Fade fills 0↔1 alongside the path morph: at rest in topo, fills are
      // invisible so contour iso-curves read clearly; in joy, fills are solid
      // so peaks occlude the strokes of upper ridges.
      const targetOpacity = next === "joy" ? t : 1 - t;
      const opStr = targetOpacity.toFixed(3);
      for (let i = 0; i < interps.length; i++) {
        fills[i].setAttribute("d", interps[i].fillI(t));
        fills[i].setAttribute("fill-opacity", opStr);
        tops[i].setAttribute("d", interps[i].topI(t));
      }
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
        paintResting(modeRef.current);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <svg
        ref={svgRef}
        width={size.w}
        height={size.h}
        viewBox={`0 0 ${size.w} ${size.h}`}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-10 right-4 z-30 font-mono px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] border border-[#5a4f43] bg-[#1f1a16]/80 backdrop-blur-sm text-[#a89a86] hover:text-[#ebe2d4] hover:border-[hsl(24_22%_70%)] transition-colors"
      >
        {mode === "topo" ? "Unknown Pleasures" : "Topo Map"}
      </button>
    </>
  );
}
