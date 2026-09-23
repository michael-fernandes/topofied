"use client";

// Schematic West Coast chart with the Cascade volcanoes as survey stations.
// Fluid width; the viewBox scales markers and labels together.

import { type CSSProperties } from "react";
import { ACCENT, ACCENT_DIM, BG, DIM, FAINT, INK } from "../kit";
import { ft, MAP, MAP_W, project, VOLCANOES } from "../../lib/volcanoes";

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
  [40.44, -124.41], [40.25, -124.35], [40.03, -124.07], [39.9, -123.95],
];
// Vancouver Island's eastern half, bounding the Georgia and Juan de Fuca
// straits. Both ends land on the map's left edge, so the polygon self-closes.
const ISLAND: [number, number][] = [
  [50.1, -125.3], [50.02, -125.24], [49.67, -124.93], [49.32, -124.3], [49.17, -123.94],
  [48.95, -123.6], [48.78, -123.5], [48.68, -123.42], [48.44, -123.33],
  [48.37, -123.45], [48.33, -123.65], [48.37, -124.0], [48.45, -124.45], [48.57, -124.9], [48.68, -125.3],
];
// WA/OR border = the Columbia's actual course, drawn like the coastline:
// down past Longview, the Portland bend, then east through the gorge.
const COLUMBIA: [number, number][] = [
  [46.25, -124.0], [46.19, -123.75], [46.15, -123.35], [46.1, -122.96], [45.9, -122.8],
  [45.72, -122.76], [45.63, -122.6], [45.6, -122.25], [45.65, -121.9], [45.71, -121.5],
  [45.61, -121.15], [45.68, -120.65], [45.75, -120.2], [45.95, -119.7],
];
// The straight borders really are straight — the 49th and 42nd parallels.
const BORDERS: [number, number, number][] = [
  [49.0, -122.86, -119.7], // Canada
  [42.0, -124.21, -119.7], // OR / CA
];
const PLACE_LABELS: [string, number, number][] = [
  ["B.C.", 49.75, -120.5],
  ["Wash.", 47.9, -120.55],
  ["Ore.", 43.6, -120.45],
  ["Calif.", 40.85, -120.6],
];

const pt = ([lat, lon]: [number, number]) => {
  const { x, y } = project(lat, lon);
  return `${x.toFixed(1)},${y.toFixed(1)}`;
};

export default function ArcMap({
  selected,
  onPick,
  style,
}: {
  /** Station to highlight, or null for a bare chart. */
  selected: number | null;
  onPick: (i: number) => void;
  style?: CSSProperties;
}) {
  const coast = COAST.map(pt).join(" ");
  // Land fill closes along the map edges (bottom-right, top-right corners);
  // COAST already starts on the top edge, so the polygon self-closes there.
  const land = [...COAST, [39.9, -119.7], [50.3, -119.7]]
    .map((p) => pt(p as [number, number]))
    .join(" ");
  const island = ISLAND.map(pt).join(" ");
  const columbia = COLUMBIA.map(pt).join(" ");
  const arc = VOLCANOES.map((v) => pt([v.lat, v.lon])).join(" ");
  const a = selected != null ? project(VOLCANOES[selected].lat, VOLCANOES[selected].lon) : null;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${MAP_W} ${MAP.h}`}
      style={{ overflow: "visible", display: "block", width: "100%", height: "auto", ...style }}
    >
      <polygon points={land} fill="rgba(244,236,224,0.022)" />
      <polygon points={island} fill="rgba(244,236,224,0.022)" />
      <polyline points={coast} fill="none" stroke={FAINT} strokeWidth={1} strokeLinejoin="round" opacity={0.85} />
      <polyline points={island} fill="none" stroke={FAINT} strokeWidth={1} strokeLinejoin="round" opacity={0.85} />
      <polyline points={columbia} fill="none" stroke={FAINT} strokeWidth={1} strokeLinejoin="round" opacity={0.85} />
      {BORDERS.map(([lat, a1, a2]) => {
        const p1 = project(lat, a1);
        const p2 = project(lat, a2);
        return (
          <line
            key={lat}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={FAINT} strokeWidth={0.75} strokeDasharray="2 3.5" opacity={0.5}
          />
        );
      })}
      {PLACE_LABELS.map(([label, lat, lon]) => {
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
      <text
        transform="rotate(90 15 330)"
        x={15} y={330}
        textAnchor="middle"
        className="font-mono"
        style={{ fontSize: 7, letterSpacing: "0.5em", textTransform: "uppercase" }}
        fill={FAINT} opacity={0.55}
      >
        Pacific
      </text>

      {/* The arc itself, then its stations */}
      <polyline points={arc} fill="none" stroke={ACCENT_DIM} strokeWidth={0.75} strokeDasharray="1 4" opacity={0.4} />
      {VOLCANOES.map((v, i) => {
        const p = project(v.lat, v.lon);
        const on = i === selected;
        const s = on ? 3.4 : 2.7;
        return (
          <g
            key={v.slug}
            data-station={i}
            transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`}
            style={{ cursor: "pointer" }}
            onClick={() => onPick(i)}
          >
            <circle r={9} fill="transparent" />
            {on && (
              <>
                <circle r={7} fill="none" stroke={ACCENT_DIM} strokeWidth={0.8} opacity={0.55} />
                <circle r={11} fill="none" stroke={ACCENT_DIM} strokeWidth={0.8} opacity={0.28} />
              </>
            )}
            <rect
              x={-s} y={-s} width={s * 2} height={s * 2}
              transform="rotate(45)"
              fill={v.skied ? ACCENT : BG}
              stroke={on ? ACCENT : ACCENT_DIM}
              strokeWidth={1}
            />
          </g>
        );
      })}

      {/* Station label, set out in the ocean with a leader line */}
      {selected != null && a && (
      <g style={{ pointerEvents: "none" }}>
        <line x1={a.x - 26} y1={a.y} x2={a.x - 9} y2={a.y} stroke={ACCENT_DIM} strokeWidth={0.8} />
        <text
          x={a.x - 31} y={a.y + 2.5}
          textAnchor="end"
          className="font-mono"
          style={{ fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", paintOrder: "stroke" }}
          fill={INK} stroke={BG} strokeWidth={3}
        >
          {VOLCANOES[selected].name}
        </text>
        <text
          x={a.x - 31} y={a.y + 12.5}
          textAnchor="end"
          className="font-mono"
          style={{ fontSize: 7, letterSpacing: "0.14em", paintOrder: "stroke" }}
          fill={DIM} stroke={BG} strokeWidth={3}
        >
          {ft(VOLCANOES[selected].feet)} ft
        </text>
      </g>
      )}
    </svg>
  );
}
