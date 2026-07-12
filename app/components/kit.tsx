// Shared presentational kit for the topographic portfolio.
// Server-safe (no hooks) so it can be used directly inside page components.
//
// The map "nod" is kept deliberately quiet: a thin accent rule on eyebrows
// and a small rotated-square survey marker. No elevations, no coordinates.

import type { CSSProperties, ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";

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

/**
 * Framed image plate. Wraps a statically-imported image with the kit's hairline
 * border and the same 135° hatch as Placeholder, so real imagery sits in the
 * same visual language as everything else. Feed it duotoned art (see
 * media/uncertainty): inverted "ink on dark" encodings or light screenshots.
 */
export function Plate({
  src,
  alt,
  caption,
  sizes = "100vw",
}: {
  src: StaticImageData;
  alt: string;
  caption?: ReactNode;
  sizes?: string;
}) {
  return (
    <figure style={{ margin: 0 }}>
      <div className="relative" style={{ border: `1px solid ${FAINT}`, background: "#1f1a16", overflow: "hidden" }}>
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          placeholder="blur"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {/* Same hatch as Placeholder — quietly ties real imagery to the kit.
            Kept very faint so it reads as texture, not visible stripes. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.01) 8px 9px)",
          }}
        />
      </div>
      {caption && (
        <figcaption
          className="font-mono uppercase"
          style={{ marginTop: 10, fontSize: 9, letterSpacing: "0.22em", color: FAINT, lineHeight: 1.5 }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Prominent outbound call-to-action — and the hero's terrain summit.
 *
 * It carries data-topo-important with a tall, broad elevation, so the contour
 * rings "max" (crown) around the button rather than the heading; hovering it
 * swells that summit via data-topo-hover-id. Place it as a sibling of the
 * heading block (NOT inside it) so the important heading wrapper doesn't
 * absorb it — otherwise it won't register as its own peak.
 */
export function CtaButton({
  href,
  children,
  topoId = "cta",
  style,
}: {
  href: string;
  children: ReactNode;
  topoId?: string;
  style?: CSSProperties;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-topo-important=""
      data-topo-id={topoId}
      data-topo-hover-id={topoId}
      data-topo-height="120"
      data-topo-falloff="140"
      data-topo-sharpness="1.3"
      className="cta-btn font-mono uppercase inline-flex items-center pt-24"
      style={{
        gap: 12,
        fontSize: 11,
        letterSpacing: "0.22em",
        color: INK,
        textDecoration: "none",
        border: `1px solid ${ACCENT}`,
        background: "rgba(235,226,212,0.03)",
        padding: "13px 22px",
        ...style,
      }}
    >
      {children}
      <span aria-hidden className="cta-btn__arrow" style={{ color: ACCENT }}>
        →
      </span>
    </a>
  );
}

/** Quiet key/value strip used for project "heads-up" metadata. */
export function MetaRow({ items }: { items: { k: string; v: string }[] }) {
  return (
    <dl
      className="grid meta-row"
      style={{
        gap: 1,
        background: FAINT,
        border: `1px solid ${FAINT}`,
        margin: 0,
        ["--meta-row-cols" as string]: items.length,
      }}
    >
      {items.map((it) => (
        <div key={it.k} style={{ background: "#1f1a16", padding: "20px 22px" }}>
          <dt className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.22em", color: FAINT, marginBottom: 10 }}>
            {it.k}
          </dt>
          <dd className="m-0" style={{ fontSize: 16, color: INK, letterSpacing: "-0.005em" }}>
            {it.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
