"use client";

// Schematic West Coast chart with the Cascade volcanoes as survey stations.
// Fluid width; `view` crops the shared chart (tall on desktop, a camera on
// mobile that springs between views). One halo glides between stations.

import { useId, useRef, useState, type MouseEvent } from "react";
import { animated, to, useSpring } from "react-spring";
import { ACCENT, ACCENT_DIM, BG, DIM, FAINT, INK } from "../kit";
import { ft, nearestStation, project, VOLCANOES, type MapView } from "../../lib/volcanoes";

// Tap radius in screen px; taps snap to the nearest station within it.
const TAP_PX = 24;

// Schematic but recognizably shaped coastline (lat, lon), clipped by the map
// edges. Mainland runs BC → Salish Sea → Olympic Peninsula → outer coast to
// Mendocino, with the Grays Harbor / Willapa / Humboldt notches sketched in.
const COAST: [number, number][] = [
  [50.3, -124.95], [50.05, -124.75], [49.85, -124.5], [49.62, -124.0], [49.45, -123.65], // Sunshine Coast down from Desolation Sound
  [49.38, -123.3], [49.3, -123.14], [49.26, -122.9], [49.0, -122.88], [48.95, -122.78],
  [48.73, -122.5], [48.5, -122.45], [48.35, -122.48], [48.18, -122.36], [47.98, -122.2],
  [47.8, -122.38], [47.6, -122.33], [47.4, -122.32], [47.27, -122.42], [47.12, -122.78], [47.05, -122.9], // east shore down to Olympia
  [47.2, -122.83], [47.45, -122.62], [47.6, -122.55], [47.78, -122.62], [48.1, -122.77], // Kitsap shore back up to Port Townsend
  [48.14, -122.92], [48.17, -123.12], [48.12, -123.44], [48.23, -124.0], [48.33, -124.45], [48.39, -124.72], // the strait out to Cape Flattery
  [48.3, -124.68], [47.91, -124.63], [47.55, -124.4], [47.3, -124.28], [47.0, -124.17],
  [46.94, -123.9], [46.88, -124.1], // Grays Harbor
  [46.7, -124.05], [46.55, -123.88], [46.4, -124.04], // Willapa Bay
  [46.26, -124.07], [46.25, -124.0], [46.15, -123.94], // Columbia mouth
  [45.95, -123.97], [45.55, -123.95], [45.3, -124.0], [45.05, -124.02], [44.62, -124.07],
  [44.13, -124.12], [43.67, -124.2], [43.35, -124.32], [43.3, -124.4], [43.12, -124.43],
  [42.84, -124.56], [42.74, -124.5], [42.4, -124.42], [42.05, -124.28], [41.99, -124.21],
  [41.75, -124.2], [41.55, -124.08], [41.06, -124.14], [40.8, -124.18], [40.64, -124.3],
  [40.44, -124.41], [40.25, -124.35], [40.03, -124.07], [39.9, -123.95], [39.5, -123.78],
];
// Vancouver Island: east shore down the Georgia Strait, then up the west
// coast past Tofino. It closes north of every view, so no seam shows.
const ISLAND: [number, number][] = [
  [50.1, -125.3], [50.02, -125.24], [49.67, -124.93], [49.32, -124.3], [49.17, -123.94],
  [48.95, -123.6], [48.78, -123.5], [48.68, -123.42], [48.44, -123.33],
  [48.37, -123.45], [48.33, -123.65], [48.37, -124.0], [48.45, -124.45], [48.57, -124.9], [48.68, -125.3], [48.83, -125.14],
  [48.94, -125.55], [49.15, -125.9], [49.38, -126.55], [49.6, -127.2], [50.3, -127.4],
];
// WA/OR border = the Columbia's actual course, drawn like the coastline:
// down past Longview, the Portland bend, then east through the gorge.
const COLUMBIA: [number, number][] = [
  [46.25, -124.0], [46.19, -123.75], [46.15, -123.35], [46.1, -122.96], [45.9, -122.8],
  [45.72, -122.76], [45.63, -122.6], [45.6, -122.25], [45.65, -121.9], [45.71, -121.5],
  [45.61, -121.15], [45.68, -120.65], [45.75, -120.2], [45.95, -119.7], [46.0, -119.3], [46.06, -118.95],
];
// Inland state lines, seen only in the wide view: Idaho (straight, then the
// Snake River) and the California / Nevada line.
const STATE_LINES: [number, number][][] = [
  [[49.0, -116.05], [47.98, -116.05], [47.6, -115.75], [47.3, -115.3], [46.9, -114.9], [46.6, -114.5]],
  [[49.0, -117.04], [46.42, -117.04], [46.0, -116.92], [45.6, -116.47], [45.0, -116.85], [44.45, -117.2], [44.0, -116.95], [43.8, -117.03], [42.0, -117.03]],
  [[42.0, -120.0], [39.5, -120.0]],
];
// The straight borders really are straight — the 49th and 42nd parallels.
const BORDERS: [number, number, number][] = [
  [49.0, -122.86, -113], // Canada
  [46.0, -118.95, -116.92], // WA / OR east of the Columbia
  [42.0, -124.21, -113], // OR / CA / NV
];
// [label, lat, lon, wide view only]
const PLACE_LABELS: [string, number, number, boolean][] = [
  ["B.C.", 49.17, -120.6, false],
  ["Wash.", 47.9, -120.55, false],
  ["Ore.", 43.6, -120.45, false],
  ["Calif.", 40.85, -120.6, false],
  ["Nev.", 40.85, -117.6, true],
  ["Idaho", 44.6, -115.6, true],
];

const pt = ([lat, lon]: [number, number]) => {
  const { x, y } = project(lat, lon);
  return `${x.toFixed(1)},${y.toFixed(1)}`;
};

const COAST_PTS = COAST.map(pt).join(" ");
// Land closes far east of every view.
const LAND_PTS = [...COAST, [39.5, -113], [51, -113]].map((p) => pt(p as [number, number])).join(" ");
const ISLAND_PTS = ISLAND.map(pt).join(" ");
const COLUMBIA_PTS = COLUMBIA.map(pt).join(" ");
const STATE_PTS = STATE_LINES.map((l) => l.map(pt).join(" "));
const STATIONS = VOLCANOES.map((v) => project(v.lat, v.lon));
const ARC_PTS = STATIONS.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

const line = { fill: "none", stroke: FAINT, strokeWidth: 1, strokeLinejoin: "round" as const, opacity: 0.85 };
const dashed = { stroke: FAINT, strokeWidth: 0.75, strokeDasharray: "2 3.5", opacity: 0.5 };

export default function ArcMap({
  view,
  selected,
  onPick,
  className,
}: {
  view: MapView;
  /** Station to highlight, or null for a bare chart. */
  selected: number | null;
  onPick: (i: number) => void;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const clip = useId();
  // The halo parks at the last station while it fades out.
  const [last, setLast] = useState(selected ?? 0);
  if (selected != null && selected !== last) setLast(selected);
  const a = STATIONS[last];
  const m = view.mark;
  const cam = useSpring({
    x: view.x, y: view.y, w: view.w, h: view.h,
    config: { tension: 150, friction: 26 },
    immediate: typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  });

  const onClick = (e: MouseEvent<SVGSVGElement>) => {
    const svg = ref.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const i = nearestStation(p, STATIONS, (TAP_PX * view.w) / svg.clientWidth);
    if (i >= 0) onPick(i);
  };

  return (
    <animated.svg
      ref={ref}
      aria-hidden
      className={className}
      viewBox={to([cam.x, cam.y, cam.w, cam.h], (x, y, w, h) => `${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}`)}
      onClick={onClick}
      // Mobile bleeds to the screen edge, so it clips; desktop lets the label spill.
      style={{ overflow: view.wide ? "hidden" : "visible", height: "auto" }}
    >
      <clipPath id={clip}>
        <animated.rect x={cam.x} y={cam.y} width={cam.w} height={cam.h} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
      <polygon points={LAND_PTS} fill="rgba(244,236,224,0.022)" />
      <polygon points={ISLAND_PTS} fill="rgba(244,236,224,0.022)" />
      <polyline points={COAST_PTS} {...line} />
      <polyline points={ISLAND_PTS} {...line} />
      <polyline points={COLUMBIA_PTS} {...line} />
      {view.wide && STATE_PTS.map((pts) => (
        <polyline key={pts} points={pts} fill="none" {...dashed} />
      ))}
      {BORDERS.map(([lat, a1, a2]) => {
        const p1 = project(lat, a1);
        const p2 = project(lat, a2);
        return <line key={`${lat}${a1}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} {...dashed} />;
      })}
      {PLACE_LABELS.filter(([, , , wide]) => !wide || view.wide).map(([label, lat, lon]) => {
        const p = project(lat, lon);
        return (
          <text
            key={label}
            x={p.x} y={p.y}
            textAnchor="middle"
            className="font-mono"
            style={{ fontSize: 7, letterSpacing: "0.3em", textTransform: "uppercase" }}
            fill={FAINT} opacity={0.8}
          >
            {label}
          </text>
        );
      })}
      </g>
      <Pacific view={view} dim={view.wide && selected != null} />

      {/* The arc, then its stations */}
      <polyline points={ARC_PTS} fill="none" stroke={ACCENT_DIM} strokeWidth={0.75} strokeDasharray="1 4" opacity={0.4} />
      {VOLCANOES.map((v, i) => {
        const p = STATIONS[i];
        const on = i === selected;
        return (
          <g key={v.slug} data-station={i} transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`} style={{ cursor: "pointer" }}>
            <rect
              className="map-station"
              x={-2.7} y={-2.7} width={5.4} height={5.4}
              fill={v.skied ? ACCENT : BG}
              stroke={on ? ACCENT : ACCENT_DIM}
              strokeWidth={1 / m}
              style={{ transform: `rotate(45deg) scale(${(on ? 1.3 : 1) * m})` }}
            />
          </g>
        );
      })}

      {/* One halo + label that glides from station to station */}
      <g
        className="map-halo"
        style={{ transform: `translate(${a.x}px, ${a.y}px)`, opacity: selected == null ? 0 : 1, pointerEvents: "none" }}
      >
        <circle r={7 * m} fill="none" stroke={ACCENT_DIM} strokeWidth={0.8} opacity={0.55} />
        <circle r={11 * m} fill="none" stroke={ACCENT_DIM} strokeWidth={0.8} opacity={0.28} />
        <line x1={-26 - 11 * m} y1={0} x2={-9 * m} y2={0} stroke={ACCENT_DIM} strokeWidth={0.8} />
        <text
          x={-31 - 11 * m} y={2.5}
          textAnchor="end"
          className="font-mono"
          style={{ fontSize: 8 * Math.sqrt(m), letterSpacing: "0.14em", textTransform: "uppercase", paintOrder: "stroke" }}
          fill={INK} stroke={BG} strokeWidth={3}
        >
          {view.wide ? VOLCANOES[last].short : VOLCANOES[last].name}
        </text>
        <text
          x={-31 - 11 * m} y={12.5 * Math.sqrt(m)}
          textAnchor="end"
          className="font-mono"
          style={{ fontSize: 7 * Math.sqrt(m), letterSpacing: "0.14em", paintOrder: "stroke" }}
          fill={DIM} stroke={BG} strokeWidth={3}
        >
          {ft(VOLCANOES[last].feet)} ft
        </text>
      </g>
    </animated.svg>
  );
}

/** "Pacific", set vertically off the coast (fixed at sea when the camera moves). */
function Pacific({ view, dim }: { view: MapView; dim: boolean }) {
  const sea = project(44.9, -124.85);
  const x = view.wide ? sea.x : view.x + 15;
  const y = view.wide ? sea.y : view.y + view.h * 0.53;
  return (
    <text
      transform={`rotate(90 ${x} ${y})`}
      x={x} y={y}
      textAnchor="middle"
      className="font-mono"
      fill={FAINT}
      opacity={dim ? 0 : 0.55}
      style={{ fontSize: 7, letterSpacing: "0.5em", textTransform: "uppercase", transition: "opacity 300ms ease" }}
    >
      {view.wide ? "Pacific Ocean" : "Pacific"}
    </text>
  );
}
