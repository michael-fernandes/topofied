// Shared presentational kit for the topographic portfolio.
// Server-safe (no hooks) so it can be used directly inside page components.
//
// The map "nod" is kept deliberately quiet: a thin accent rule on eyebrows
// and a small rotated-square survey marker. No elevations, no coordinates.

import type { CSSProperties, ReactNode } from "react";

export const INK = "#ebe2d4";
export const DIM = "#a89a86";
export const FAINT = "#5a4f43";
export const ACCENT = "hsl(24 22% 70%)";
export const ACCENT_DIM = "hsl(24 22% 55%)";

export const CARD_BG = "rgba(235,226,212,0.012)";

/** Small rotated square — reads as a survey / benchmark marker. */
export function Marker({ size = 8, color = ACCENT, style }: { size?: number; color?: string; style?: CSSProperties }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, transform: "rotate(45deg)", background: color, flex: "none", ...style }}
    />
  );
}

/**
 * Per-skill line icons — engraved at contour weight in the same ink as the
 * background index lines, so they read as part of the map rather than dropped
 * on top of it. A small survey diamond recurs across all three as a unifying
 * node. Every path carries `data-draw` (+ a normalized `pathLength`) so the
 * stylesheet can retrace it on card hover — the strokes draw themselves in,
 * echoing the terrain's living contours.
 */
const SKILL_ICONS: Record<string, ReactNode> = {
  // Elevation profile — a plotted ridgeline read off an axis, survey diamond
  // pinned to its summit. Data, surveyed like terrain.
  "data-viz": (
    <>
      <path d="M5 4 V19 H20" pathLength={1} data-draw />
      <polyline points="7 15 12 11 16 8" pathLength={1} data-draw />
      <path d="M16 6.2 L17.4 8 L16 9.8 L14.6 8 Z" pathLength={1} data-draw />
    </>
  ),
  // Two crop-mark corners framing a precise center node — the design canvas
  // meeting engineering exactness, pared back.
  "design-eng": (
    <>
      <path d="M5 9 V5 H9" pathLength={1} data-draw />
      <path d="M19 15 V19 H15" pathLength={1} data-draw />
      <path d="M12 9 L15 12 L12 15 L9 12 Z" pathLength={1} data-draw />
    </>
  ),
  // Magnifier reading a survey node — looking closely, then iterating.
  research: (
    <>
      <circle cx="10.5" cy="10.5" r="6" pathLength={1} data-draw />
      <path d="M15 15 L20 20" pathLength={1} data-draw />
      <path d="M10.5 8.4 L12.6 10.5 L10.5 12.6 L8.4 10.5 Z" pathLength={1} data-draw />
    </>
  ),
};

export function SkillIcon({ name, size = 34, style }: { name: string; size?: number; style?: CSSProperties }) {
  return (
    <svg
      aria-hidden
      className="topo-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: ACCENT_DIM, ...style }}
    >
      {SKILL_ICONS[name]}
    </svg>
  );
}

/** Mono uppercase label with a leading hairline rule. */
export function Eyebrow({
  children,
  color = ACCENT,
  rule = true,
  style,
}: {
  children: ReactNode;
  color?: string;
  rule?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      data-topo-hidden=""
      className="font-mono uppercase flex items-center"
      style={{ fontSize: 10, letterSpacing: "0.32em", color, gap: 14, ...style }}
    >
      {rule && <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />}
      {children}
    </div>
  );
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
  maxTitle = 900,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  maxTitle?: number;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <Eyebrow style={{ marginBottom: 14 }}>{kicker}</Eyebrow>
      <h2
        className="font-medium"
        style={{
          fontSize: "clamp(16px, 1.6vw, 22px)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          margin: 0,
          color: INK,
          maxWidth: maxTitle,
          textWrap: "balance",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, maxWidth: 560, margin: "12px 0 0", textWrap: "pretty" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/** Dashed, hatched placeholder for imagery not yet supplied. */
export function Placeholder({
  height,
  label,
  ratio,
}: {
  height: number | string;
  label: string;
  ratio?: string;
}) {
  return (
    <div
      data-topo-hidden=""
      className="flex items-center justify-center font-mono uppercase relative"
      style={{
        width: "100%",
        height,
        background: "rgba(235,226,212,0.025)",
        border: `1px dashed ${FAINT}`,
        fontSize: 10,
        letterSpacing: "0.22em",
        color: FAINT,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.025) 8px 9px)",
        }}
      />
      <div className="text-center" style={{ lineHeight: 1.6 }}>
        <div style={{ color: DIM }}>{label}</div>
        {ratio && <div style={{ color: FAINT, marginTop: 4, fontSize: 9 }}>{ratio}</div>}
      </div>
    </div>
  );
}

/** Quiet key/value strip used for project "heads-up" metadata. */
export function MetaRow({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${items.length}, minmax(0,1fr))`,
        gap: 1,
        background: FAINT,
        border: `1px solid ${FAINT}`,
        margin: 0,
      }}
    >
      {items.map((it) => (
        <div key={it.k} style={{ background: "#1f1a16", padding: "16px 18px" }}>
          <dt className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: FAINT, marginBottom: 8 }}>
            {it.k}
          </dt>
          <dd className="m-0" style={{ fontSize: 14, color: INK, letterSpacing: "-0.005em" }}>
            {it.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
