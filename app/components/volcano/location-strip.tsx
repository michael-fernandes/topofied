"use client";

// Location strip: an "All" chip, then one card per peak. Tapping selects;
// the selected card is scrolled into view (horizontally only).

import { useEffect, useRef } from "react";
import { ACCENT, ACCENT_DIM, CARD_BG, DIM, FAINT, INK } from "../kit";
import { ft, nn, VOLCANOES, type Volcano } from "../../lib/volcanoes";

export default function LocationStrip({
  selected,
  onPick,
}: {
  selected: number | null;
  /** null = All. */
  onPick: (i: number | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    // Child 0 is "All"; peak i is child i + 1.
    const card = el?.children[selected == null ? 0 : selected + 1] as HTMLElement | undefined;
    if (!el || !card) return;
    const first = el.children[0] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - first.offsetLeft, behavior: "smooth" });
  }, [selected]);

  return (
    <div ref={ref} className="scroll-strip strip-always" aria-label="Volcanoes">
      <Chip on={selected == null} onClick={() => onPick(null)} width={84}>
        <div className="font-medium" style={{ fontSize: 12.5, color: selected == null ? INK : DIM }}>
          All
        </div>
        <div className="font-mono uppercase" style={{ ...metaStyle, whiteSpace: "nowrap" }}>
          {VOLCANOES.length} peaks
        </div>
      </Chip>
      {VOLCANOES.map((v, i) => (
        <StripCard key={v.slug} v={v} index={i} on={i === selected} onClick={() => onPick(i)} />
      ))}
    </div>
  );
}

const metaStyle = { fontSize: 8.5, letterSpacing: "0.16em", color: FAINT, marginTop: 6 };

function Chip({
  on,
  onClick,
  width,
  children,
}: {
  on: boolean;
  onClick: () => void;
  width: number | string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      style={{
        // Overrides .scroll-strip's card width.
        width,
        textAlign: "left",
        cursor: "pointer",
        border: `1px solid ${on ? ACCENT_DIM : FAINT}`,
        background: CARD_BG,
        padding: "10px 12px 11px",
        transition: "border-color 250ms ease",
      }}
    >
      {children}
    </button>
  );
}

export function StripCard({
  v,
  index,
  on,
  onClick,
}: {
  v: Volcano;
  index: number;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <Chip on={on} onClick={onClick} width="clamp(148px, 42vw, 176px)">
      <div
        className="font-medium"
        style={{ fontSize: 12.5, color: on ? INK : DIM, letterSpacing: "-0.005em", whiteSpace: "nowrap", transition: "color 250ms ease" }}
      >
        <span className="font-mono" style={{ fontSize: 9, color: on ? ACCENT : FAINT, marginRight: 8 }}>
          {nn(index)}
        </span>
        {v.short}
      </div>
      <div className="font-mono uppercase" style={metaStyle}>
        {ft(v.feet)} ft ·{" "}
        <span style={{ color: v.skied ? ACCENT : FAINT }}>{v.skied ? "Skied" : "Unskied"}</span>
      </div>
    </Chip>
  );
}
