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
// A fixed-position button toggles between modes. Rather than morphing one
// ridge path into the other, the two modes are two separate, always-present
// SVG groups (topo strokes vs. joy fill+stroke stacks); switching crossfades
// them sequentially — topo fades out, then the joy stack fades/rises in with
// a top-to-bottom stagger (and the reverse coming back) — since a direct
// path morph between a marching-squares-style contour and the spiky joy
// ridge line never read as clean.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  buildField,
  buildLevels,
  type Peak as EnginePeak,
} from "../lib/topo-engine";

const NUM_LINES = 80;
const SAMPLE_STEP = 5;
const PEAK_HEIGHT = 130;
const PEAK_EXPONENT = 1.85;
const JOY_DETAIL = 0.55;
const JOY_QUIET = 0.45;
const ACTIVE_BAND = 0.42;
const SEED = 1337;

// ── Transition timing ───────────────────────────────────────────────
// The mode switch is sequential, not a crossfade: the outgoing mode fully
// fades out first, then the incoming mode fades/rises in with a per-ridge
// stagger (top ridge first, working down) so the joy stack visibly "builds".
const FADE_OUT_MS = 420;
const FADE_IN_MS = 620;
const JOY_STAGGER_MS = 5;
const JOY_ENTRANCE_OFFSET = 16;

// ── Topo-mode styling — matches TerrainShell's own TopoScene call exactly
// (numLevels/indexEvery left at TopoScene's defaults; accentHue/accentSat
// copied from terrain-shell.tsx) so the resting state IS the site's real
// contour engine output, not an approximation of it.
const ACCENT_HUE = 24;
const ACCENT_SAT = 22;
const TOPO_NUM_LEVELS = 28;
const TOPO_INDEX_EVERY = 4;

// Joy-mode stroke: uniform ink, full opacity (the Unknown Pleasures look).
const JOY_STROKE = "#ebe2d4";
const JOY_WIDTH = 0.9;
// Scroll thresholds (hysteresis): morph to joy once the page is scrolled past
// ENTER, morph back to topo only when returning above EXIT. The gap prevents
// flip-flopping when the user hovers around a single boundary.
const SCROLL_ENTER_JOY = 140;
const SCROLL_EXIT_JOY = 60;

type Ridge = {
  topD_joy: string;
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
    { x: cx - W * 0.06, y: cy - H * 0.04, h: 0.62, r: R * 0.18 },
    { x: cx + W * 0.09, y: cy + H * 0.05, h: 0.58, r: R * 0.15 },
    { x: cx + W * 0.01, y: cy + H * 0.10, h: 0.5, r: R * 0.13 },
    { x: cx - W * 0.11, y: cy + H * 0.08, h: 0.46, r: R * 0.12 },
    { x: cx + W * 0.04, y: cy - H * 0.10, h: 0.4, r: R * 0.11 },
  ];
}

// Domain warp (same recipe as the site's topo engine): perturb (x,y) before
// the peak-distance lookup so contour rings read as organic terrain — ridges,
// spurs, saddles — instead of clean concentric ovals. Two octaves: a
// large-scale bend plus a smaller-scale crinkle.
const WARP_S1 = 1 / 280;
const WARP_A1 = 24;
const WARP_S2 = 1 / 110;
const WARP_A2 = 8;

function elevation(
  x: number,
  y: number,
  peaks: Peak[],
  seed: number,
): number {
  const wx =
    x +
    (vnoise(x * WARP_S1, y * WARP_S1, seed + 7) - 0.5) * 2 * WARP_A1 +
    (vnoise(x * WARP_S2, y * WARP_S2, seed + 9) - 0.5) * 2 * WARP_A2;
  const wy =
    y +
    (vnoise(x * WARP_S1, y * WARP_S1, seed + 8) - 0.5) * 2 * WARP_A1 +
    (vnoise(x * WARP_S2, y * WARP_S2, seed + 11) - 0.5) * 2 * WARP_A2;
  let v = 0;
  for (const p of peaks) {
    const dx = (wx - p.x) / p.r;
    const dy = (wy - p.y) / p.r;
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

// Translates the joy field's hand-placed gaussian peaks into the real topo
// engine's rectangular-footprint Peak format (bbox + falloff + sharpness),
// so topo mode can run through the site's actual buildField/buildLevels
// marching-squares pipeline instead of approximating it — a hand-rolled
// per-scanline "nearest matching elevation" trace can't guarantee lines stay
// smooth or non-crossing the way a real isocontour does, which is why that
// approach read as chaotic instead of like the home page's contours.
function buildEnginePeaks(peaks: Peak[]): EnginePeak[] {
  return peaks.map((p) => ({
    x: p.x - p.r,
    y: p.y - p.r,
    w: p.r * 2,
    h: p.r * 2,
    height: p.h * 100,
    falloff: p.r * 0.55,
    sharpness: 1.6,
  }));
}

// ── Ridge geometry (joy mode only — topo mode goes through the real engine) ─
function buildRidges(W: number, H: number, seed: number): Ridge[] {
  const peaks = buildPeaks(W, H);
  const samples = Math.max(2, Math.ceil(W / SAMPLE_STEP) + 1);
  const spacing = H / NUM_LINES;
  const ridges: Ridge[] = [];

  for (let i = 0; i < NUM_LINES; i++) {
    const y0 = spacing * (i + 0.5);
    const act = activeness(y0, H);

    const joyPts: [number, number][] = new Array(samples);

    for (let s = 0; s < samples; s++) {
      const x = Math.min(W, s * SAMPLE_STEP);
      const e = elevation(x, y0, peaks, seed);

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
      topD_joy: pointsToOpenPath(joyPts),
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
  const topoGroupRef = useRef<SVGGElement | null>(null);
  const joyGroupRef = useRef<SVGGElement | null>(null);
  const joyRidgeGroupsRef = useRef<SVGGElement[]>([]);
  const ridgesRef = useRef<Ridge[]>([]);
  const modeRef = useRef<Mode>("topo");
  const fadeTimeoutRef = useRef<number | undefined>(undefined);

  const [size, setSize] = useState({ w: 0, h: 0 });
  const [mode, setMode] = useState<Mode>("topo");
  // This component is portaled to document.body (see the return below) so its
  // negative z-index actually escapes below the site's persistent background
  // instead of being confined to TerrainShell's own `relative z-10` stacking
  // context, which is where it's mounted in the tree. Portalling only after
  // mount avoids touching `document` during SSR.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Resize observer keeps the field fitted to the viewport.
  useLayoutEffect(() => {
    // If the page loads already scrolled (reload mid-page, back-nav), start
    // in joy so the first paint matches the scroll-driven mode.
    if (window.scrollY > SCROLL_ENTER_JOY) {
      modeRef.current = "joy";
      setMode("joy");
    }
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Build/refresh ridges and SVG nodes whenever size changes. Topo and joy
  // are two separate always-present groups (not one path morphing into the
  // other) so the mode switch can crossfade/stagger them independently.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || size.w === 0 || size.h === 0) return;
    const svgNS = "http://www.w3.org/2000/svg";

    const ridges = buildRidges(size.w, size.h, SEED);
    ridgesRef.current = ridges;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Topo mode: the real engine, same params TerrainShell uses for the
    // site's persistent background, so this reads as the same contour map.
    const enginePeaks = buildEnginePeaks(buildPeaks(size.w, size.h));
    const fr = buildField({
      width: size.w,
      height: size.h,
      peaks: enginePeaks,
      seed: SEED,
      res: 5,
    });
    const levels = fr
      ? buildLevels(fr, {
          numLevels: TOPO_NUM_LEVELS,
          indexEvery: TOPO_INDEX_EVERY,
          accentHue: ACCENT_HUE,
          accentSat: ACCENT_SAT,
          theme: "dark",
        })
      : [];

    const topoGroup = document.createElementNS(svgNS, "g");
    svg.appendChild(topoGroup);
    for (const lvl of levels) {
      const p = document.createElementNS(svgNS, "path");
      p.setAttribute("fill", "none");
      p.setAttribute("d", lvl.d);
      p.setAttribute("stroke", lvl.stroke);
      p.setAttribute("stroke-width", String(lvl.strokeWidth));
      topoGroup.appendChild(p);
    }

    const joyGroup = document.createElementNS(svgNS, "g");
    svg.appendChild(joyGroup);
    const joyRidgeGroups: SVGGElement[] = [];
    for (const r of ridges) {
      // Each ridge's fill+stroke share one <g> so the entrance stagger moves
      // them as a unit. Painter's order (fill then stroke, top-to-bottom)
      // keeps the Unknown Pleasures occlusion: lower ridges' fills overpaint
      // the strokes of ridges above them.
      const ridgeG = document.createElementNS(svgNS, "g");
      const fill = document.createElementNS(svgNS, "path");
      fill.setAttribute("fill", "#1f1a16");
      fill.setAttribute("stroke", "none");
      fill.setAttribute("d", r.fillD_joy);
      ridgeG.appendChild(fill);

      const top = document.createElementNS(svgNS, "path");
      top.setAttribute("fill", "none");
      top.setAttribute("stroke-linejoin", "round");
      top.setAttribute("stroke-linecap", "round");
      top.setAttribute("vector-effect", "non-scaling-stroke");
      top.setAttribute("d", r.topD_joy);
      top.setAttribute("stroke", JOY_STROKE);
      top.setAttribute("stroke-width", String(JOY_WIDTH));
      ridgeG.appendChild(top);

      joyGroup.appendChild(ridgeG);
      joyRidgeGroups.push(ridgeG);
    }

    topoGroupRef.current = topoGroup;
    joyGroupRef.current = joyGroup;
    joyRidgeGroupsRef.current = joyRidgeGroups;

    // Snap to current resting mode without animation.
    paintResting(modeRef.current);
  }, [size.w, size.h]);

  const paintResting = (m: Mode) => {
    const topoGroup = topoGroupRef.current;
    const joyGroup = joyGroupRef.current;
    const joyRidgeGroups = joyRidgeGroupsRef.current;
    if (!topoGroup || !joyGroup) return;
    topoGroup.style.transition = "none";
    joyGroup.style.transition = "none";
    topoGroup.style.opacity = m === "topo" ? "1" : "0";
    joyGroup.style.opacity = m === "joy" ? "1" : "0";
    for (const g of joyRidgeGroups) {
      g.style.transition = "none";
      g.style.opacity = "1";
      g.style.transform = "translateY(0px)";
    }
  };

  // Sequential fade: the outgoing mode fades out fully, then the incoming
  // mode fades/rises in with a per-ridge stagger (a top-to-bottom sweep for
  // joy's entrance; the reverse, bottom-to-top, when it recedes back to topo).
  const morphTo = (next: Mode) => {
    if (!topoGroupRef.current || !joyGroupRef.current) return;
    if (modeRef.current === next) return;
    modeRef.current = next;
    setMode(next);

    if (fadeTimeoutRef.current !== undefined) {
      window.clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = undefined;
    }

    const topoGroup = topoGroupRef.current;
    const joyGroup = joyGroupRef.current;
    const joyRidgeGroups = joyRidgeGroupsRef.current;

    if (next === "joy") {
      topoGroup.style.transition = `opacity ${FADE_OUT_MS}ms ease`;
      topoGroup.style.opacity = "0";
      fadeTimeoutRef.current = window.setTimeout(() => {
        for (const g of joyRidgeGroups) {
          g.style.transition = "none";
          g.style.opacity = "0";
          g.style.transform = `translateY(${JOY_ENTRANCE_OFFSET}px)`;
        }
        joyGroup.style.transition = "none";
        joyGroup.style.opacity = "1";
        // Force a reflow so the pre-entrance styles commit before the
        // staggered transition below is applied.
        void joyGroup.getBoundingClientRect();
        requestAnimationFrame(() => {
          joyRidgeGroups.forEach((g, i) => {
            const delay = i * JOY_STAGGER_MS;
            g.style.transition = `opacity ${FADE_IN_MS}ms ease ${delay}ms, transform ${FADE_IN_MS}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
            g.style.opacity = "1";
            g.style.transform = "translateY(0px)";
          });
        });
      }, FADE_OUT_MS);
    } else {
      joyRidgeGroups.forEach((g, i) => {
        const delay = (joyRidgeGroups.length - 1 - i) * JOY_STAGGER_MS;
        g.style.transition = `opacity ${FADE_OUT_MS}ms ease ${delay}ms, transform ${FADE_OUT_MS}ms ease ${delay}ms`;
        g.style.opacity = "0";
        g.style.transform = `translateY(${-JOY_ENTRANCE_OFFSET}px)`;
      });
      const joyExitMs = FADE_OUT_MS + joyRidgeGroups.length * JOY_STAGGER_MS;
      fadeTimeoutRef.current = window.setTimeout(() => {
        joyGroup.style.transition = "none";
        joyGroup.style.opacity = "0";
        topoGroup.style.transition = `opacity ${FADE_IN_MS}ms ease`;
        topoGroup.style.opacity = "1";
      }, joyExitMs);
    }
  };

  const toggle = () => {
    morphTo(modeRef.current === "topo" ? "joy" : "topo");
  };

  // Scroll drives the mode: topo at the top of the page, joy once scrolled.
  // Zone changes (with hysteresis) trigger the morph, so a manual button
  // toggle isn't fought until the user actually crosses a boundary again.
  useEffect(() => {
    let zone: "top" | "scrolled" =
      window.scrollY > SCROLL_ENTER_JOY ? "scrolled" : "top";
    const onScroll = () => {
      const y = window.scrollY;
      const nextZone: "top" | "scrolled" =
        zone === "scrolled"
          ? y < SCROLL_EXIT_JOY
            ? "top"
            : "scrolled"
          : y > SCROLL_ENTER_JOY
            ? "scrolled"
            : "top";
      if (nextZone !== zone) {
        zone = nextZone;
        morphTo(zone === "scrolled" ? "joy" : "topo");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // morphTo only touches refs, so the mount-time closure stays valid.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current !== undefined) {
        window.clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Opaque base backdrop — masks the app's persistent terrain background
          (TopoScene's own SVG, which has an explicit z-index:0). A negative
          z-index does NOT paint behind that: per CSS stacking rules,
          z-index:0 content always paints after (in front of) negative
          z-index siblings, regardless of DOM nesting. So this needs
          z-index:1 — just above TopoScene's 0 — to actually mask it, while
          staying safely below TerrainShell's own `relative z-10` box (which
          this is portaled OUT of, to document.body, so it no longer competes
          with the page's own text/content inside that box). */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#1f1a16",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
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
          zIndex: 1,
        }}
      />
      <button
        type="button"
        onClick={toggle}
        className="fixed bottom-10 right-4 z-30 font-mono px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] border border-[#5a4f43] bg-[#1f1a16]/80 backdrop-blur-sm text-[#a89a86] hover:text-[#ebe2d4] hover:border-[hsl(24_22%_70%)] transition-colors"
      >
        {mode === "topo" ? "Unknown Pleasures" : "Topo Map"}
      </button>
    </>,
    document.body,
  );
}
