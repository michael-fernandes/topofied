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
// Two reveal techniques, picked per shape so the disclosure stays clean:
//   data-draw  → open paths, stroked on with stroke-dashoffset (a line drawing
//                itself end to end).
//   data-fade  → closed shapes (contour loops, survey diamonds), faded + scaled
//                in. Stroke-drawing a closed loop renders as an ugly growing
//                arc, so those bloom in instead.
const SKILL_ICONS: Record<string, ReactNode> = {
  // Exaggerated topo map — irregular nested contours around an off-center
  // summit. The site's own terrain, distilled to a glyph; outer ring reveals
  // first, working inward to the summit node.
  "data-viz": (
    <>
      <path
        d="M2.8 13.4 C2.4 9 5.6 5 10.4 4 C14.6 3.1 19.6 4.4 20.6 8.4 C21.3 11.2 19.4 14.2 16 15.8 C12.6 17.4 7.8 17.6 5 15.6 C3.6 14.6 3 14 2.8 13.4 Z"
        pathLength={1}
        data-fade
      />
      <path
        d="M6.4 12.8 C6 9.8 8.4 6.8 12 6.4 C15.2 6 18.8 7.6 18.6 10.6 C18.4 13 15.8 14.8 12.6 14.8 C9.8 14.8 7 14 6.4 12.8 Z"
        pathLength={1}
        data-fade
      />
      <path
        d="M9.8 11.8 C9.6 9.8 11.4 8.2 13.4 8.6 C15.2 9 16.4 10.6 15.6 12.2 C14.9 13.6 12.8 14 11.2 13.2 C10.2 12.7 9.9 12.6 9.8 11.8 Z"
        pathLength={1}
        data-fade
      />
      <path d="M13 9.8 L14.3 11 L13.1 12.3 L11.8 11.1 Z" pathLength={1} data-fade />
    </>
  ),
  // Converging to a point — a fan of lines sweeping left → right onto a single
  // node. After a beat, the convergence point lands.
  "design-eng": (
    <>
      <path d="M4 4.5 L17 11.5" pathLength={1} data-draw />
      <path d="M4 9.2 L17 11.5" pathLength={1} data-draw />
      <path d="M4 13.8 L17 11.5" pathLength={1} data-draw />
      <path d="M4 18.5 L17 11.5" pathLength={1} data-draw />
      <path d="M17 10.1 L18.4 11.5 L17 12.9 L15.6 11.5 Z" pathLength={1} data-fade />
    </>
  ),
  // Finding a path through — a winding route from an origin, traced across the
  // field like a trail over terrain, to the found point.
  research: (
    <>
      <circle cx="4.6" cy="19" r="1.5" pathLength={1} data-fade />
      <path d="M5.6 18 C9 16 8 12 12 11.5 C16 11 15.5 7.5 18.6 6.4" pathLength={1} data-draw />
      <path d="M17.4 6.8 L18.6 5 L20 6.5 L18.7 8.2 Z" pathLength={1} data-fade />
    </>
  ),
};

export function SkillIcon({ name, size = 42, style }: { name: string; size?: number; style?: CSSProperties }) {
  return (
    <svg
      aria-hidden
      className={`topo-icon topo-icon--${name}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.9}
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
