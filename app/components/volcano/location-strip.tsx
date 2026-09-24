"use client";

// Location strip: an "All" chip, then one card per peak. Tapping selects;
// the selected card is scrolled into view (horizontally only). On mobile the
// strip snaps card by card and the card it settles on becomes the selection.

import { useEffect, useRef } from "react";
import { ACCENT, ACCENT_DIM, CARD_BG, DIM, FAINT, INK } from "../kit";
import { ft, nn, snappedIndex, VOLCANOES, type Volcano } from "../../lib/volcanoes";

const SETTLE_MS = 90;
const MOBILE = "(max-width: 767px)";

/** Each card's scroll position when snapped to the strip's start. */
const offsetsOf = (el: HTMLElement) => {
  const first = (el.children[0] as HTMLElement).offsetLeft;
  return Array.from(el.children, (c) => (c as HTMLElement).offsetLeft - first);
};

export default function LocationStrip({
  selected,
  onPick,
  onSwipe,
}: {
  selected: number | null;
  /** null = All. */
  onPick: (i: number | null) => void;
  /** The card a mobile swipe settled on (null = All). */
  onSwipe: (i: number | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const swipe = useRef(onSwipe);
  useEffect(() => {
    swipe.current = onSwipe;
  });

  // Child 0 is "All"; peak i is child i + 1. Skip when already there, so a
  // swipe-driven pick doesn't scroll the strip back at itself.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const offsets = offsetsOf(el);
    const target = selected == null ? 0 : selected + 1;
    if (snappedIndex(el.scrollLeft, offsets) === target) return;
    el.scrollTo({ left: offsets[target], behavior: "smooth" });
  }, [selected]);

  // Once a swipe settles, select the card it landed on (mobile only).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (!matchMedia(MOBILE).matches) return;
        const i = snappedIndex(el.scrollLeft, offsetsOf(el));
        swipe.current(i === 0 ? null : i - 1);
      }, SETTLE_MS);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="scroll-strip strip-always strip-snap" aria-label="Volcanoes">
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
