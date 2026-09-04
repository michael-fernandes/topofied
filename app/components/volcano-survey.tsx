"use client";

// The ski-project survey: a schematic West Coast chart with the Cascade
// volcanoes as survey stations. Desktop: hover a marker or roster row for a
// transient popover whose photos auto-cycle; click to pin it and page the
// photos by hand (Esc or an outside click releases it). Mobile: the snap
// strip drives the active station, whose photos run full-width in the panel
// below — touch the panel to take over and swipe. Data + projection live in
// lib/volcanoes.ts.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ACCENT, ACCENT_DIM, BG, CARD_BG, DIM, FAINT, INK, Placeholder } from "./kit";
import { MAP, MAP_W, photosOf, project, VOLCANOES, type Volcano } from "../lib/volcanoes";

const ft = (n: number) => n.toLocaleString("en-US");
const nn = (i: number) => String(i + 1).padStart(2, "0");
const REGIONS = ["Washington", "Oregon", "California"] as const;

export default function VolcanoSurvey() {
  // Desktop: `hover` is transient; `pinned` (set by click) outlasts it and
  // switches the popover to manual paging. Mobile keeps a persistent `active`
  // that tracks the strip, unlabeled on the map until the visitor scrolls.
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const suppressUntil = useRef(0);
  const skied = VOLCANOES.filter((x) => x.skied).length;

  const shown = pinned ?? hover;
  const togglePin = (i: number) => setPinned((p) => (p === i ? null : i));

  // A pinned popover releases on Esc or any press outside the desktop block.
  // (Presses inside it — markers, roster rows, arrows — handle themselves.)
  useEffect(() => {
    if (pinned == null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPinned(null);
    const onDown = (e: PointerEvent) => {
      if (!deskRef.current?.contains(e.target as Node)) setPinned(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [pinned]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  const stripStep = () => {
    const kids = stripRef.current?.children;
    return kids && kids.length > 1
      ? (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
      : 0;
  };

  const onStripScroll = () => {
    const el = stripRef.current;
    if (!el || performance.now() < suppressUntil.current) return;
    const step = stripStep();
    if (!step) return;
    const i = Math.max(0, Math.min(VOLCANOES.length - 1, Math.round(el.scrollLeft / step)));
    // Only a scroll that lands on a new card counts as touching the map —
    // the browser's initial snap settle fires here too and shouldn't label it.
    if (i !== active) pick(i);
  };

  // Tapping a map marker on mobile also carries the strip to that card.
  const pickFromMap = (i: number) => {
    pick(i);
    const el = stripRef.current;
    if (!el) return;
    suppressUntil.current = performance.now() + 800;
    el.scrollTo({ left: i * stripStep(), behavior: "smooth" });
  };

  return (
    <div>
      <div
        data-topo-hidden=""
        className="font-mono uppercase flex items-baseline"
        style={{ fontSize: 10, letterSpacing: "0.26em", color: FAINT, gap: 14, marginBottom: 26 }}
      >
        <span>
          <span style={{ color: ACCENT }}>{skied} / {VOLCANOES.length}</span> skied
        </span>
        <span aria-hidden style={{ flex: 1, height: 1, background: FAINT, opacity: 0.45 }} />
        <span>surveyed n → s</span>
      </div>

      {/* Desktop: chart + index; photos pop up at the hovered marker */}
      <div
        ref={deskRef}
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "250px minmax(0, 220px)",
          justifyContent: "center",
          gap: 72,
          alignItems: "start",
        }}
      >
        <ArcMap
          focus={shown}
          popover
          pinned={pinned != null}
          onEnter={setHover}
          onLeave={() => setHover(null)}
          onPick={togglePin}
          width={250}
        />
        <Roster
          active={shown}
          onEnter={setHover}
          onLeave={() => setHover(null)}
          onPick={togglePin}
        />
      </div>

      {/* Mobile: chart, the snap strip drives it, photos in the panel below */}
      <div className="md:hidden">
        <ArcMap
          focus={touched ? active : null}
          popover={false}
          pinned={false}
          onEnter={() => {}}
          onLeave={() => {}}
          onPick={pickFromMap}
          width={186}
          style={{ margin: "0 auto" }}
        />
        <div ref={stripRef} className="scroll-strip" onScroll={onStripScroll} style={{ marginTop: 26 }}>
          {VOLCANOES.map((x, i) => (
            <StripCard key={x.slug} v={x} index={i} active={i === active} />
          ))}
        </div>
        <PhotoPanel v={VOLCANOES[active]} index={active} />
      </div>
    </div>
  );
}

/* ── Chart ──────────────────────────────────────────────────────────── */

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

function ArcMap({
  focus,
  popover,
  pinned,
  onEnter,
  onLeave,
  onPick,
  width,
  style,
}: {
  /** Station to highlight, or null for a bare chart. */
  focus: number | null;
  /** true → HTML photo popover at the marker; false → small text label. */
  popover: boolean;
  /** Popover pinned by a click — manual photo paging, pointer events live. */
  pinned: boolean;
  onEnter: (i: number) => void;
  onLeave: () => void;
  /** Click/tap on a marker. */
  onPick: (i: number) => void;
  width: number;
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
  const a = focus != null ? project(VOLCANOES[focus].lat, VOLCANOES[focus].lon) : null;

  return (
    <div style={{ position: "relative", width, margin: 0, ...style }}>
    <svg
      aria-hidden
      viewBox={`0 0 ${MAP_W} ${MAP.h}`}
      width={width}
      height={Math.round((width * MAP.h) / MAP_W)}
      style={{ overflow: "visible", display: "block" }}
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
        const on = i === focus;
        const s = on ? 3.4 : 2.7;
        return (
          <g
            key={v.slug}
            data-station={i}
            transform={`translate(${p.x.toFixed(1)},${p.y.toFixed(1)})`}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={onLeave}
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

      {/* Mobile-only station label, set out in the ocean with a leader line */}
      {!popover && focus != null && a && (
      <g style={{ pointerEvents: "none" }}>
        <line x1={a.x - 26} y1={a.y} x2={a.x - 9} y2={a.y} stroke={ACCENT_DIM} strokeWidth={0.8} />
        <text
          x={a.x - 31} y={a.y + 2.5}
          textAnchor="end"
          className="font-mono"
          style={{ fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", paintOrder: "stroke" }}
          fill={INK} stroke={BG} strokeWidth={3}
        >
          {VOLCANOES[focus].name}
        </text>
        <text
          x={a.x - 31} y={a.y + 12.5}
          textAnchor="end"
          className="font-mono"
          style={{ fontSize: 7, letterSpacing: "0.14em", paintOrder: "stroke" }}
          fill={DIM} stroke={BG} strokeWidth={3}
        >
          {ft(VOLCANOES[focus].feet)} ft
        </text>
      </g>
      )}
    </svg>
    {popover && focus != null && (
      <MapPopover
        v={VOLCANOES[focus]}
        index={focus}
        width={width}
        pinned={pinned}
        onClose={() => onPick(focus)}
      />
    )}
    </div>
  );
}

/** Transient hover card: photo(s) + name, pinned near the focused marker.
 *  While `pinned`, it takes pointer events and pages photos via the arrows. */
function MapPopover({
  v,
  index,
  width,
  pinned,
  onClose,
}: {
  v: Volcano;
  index: number;
  width: number;
  pinned: boolean;
  onClose: () => void;
}) {
  const s = width / MAP_W;
  const mapH = (width * MAP.h) / MAP_W;
  const p = project(v.lat, v.lon);
  const y = p.y * s;
  const below = y < mapH * 0.55;
  return (
    <div
      data-volcano-popover=""
      style={{
        position: "absolute",
        left: 4,
        right: 4,
        ...(below ? { top: y + 16 } : { bottom: mapH - y + 16 }),
        border: `1px solid ${pinned ? ACCENT_DIM : FAINT}`,
        background: BG,
        padding: 8,
        zIndex: 2,
        pointerEvents: pinned ? "auto" : "none",
      }}
    >
      {pinned && (
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="font-mono flex items-center justify-center"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 3,
            width: 20,
            height: 20,
            background: CARD_BG,
            border: `1px solid ${FAINT}`,
            color: INK,
            fontSize: 10,
            lineHeight: 1,
            padding: 0,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      )}
      <PhotoCarousel
        key={v.slug}
        photos={photosOf(v)}
        alt={`${v.name} — from the ski project`}
        ratio="3 / 2"
        sizes="240px"
        auto={!pinned}
        arrows={pinned}
      />
      <div style={{ marginTop: 8 }}>
        <div className="font-medium" style={{ fontSize: 12.5, color: INK, letterSpacing: "-0.005em" }}>
          {v.name}
        </div>
        <div
          className="font-mono uppercase"
          style={{ fontSize: 8, letterSpacing: "0.16em", color: FAINT, marginTop: 5 }}
        >
          {nn(index)} · {ft(v.feet)} ft ·{" "}
          <span style={{ color: v.skied ? ACCENT : FAINT }}>{v.skied ? "Skied" : "Unskied"}</span>
        </div>
        {v.note && (
          <div style={{ fontSize: 10.5, lineHeight: 1.5, color: DIM, marginTop: 6 }}>{v.note}</div>
        )}
      </div>
    </div>
  );
}

/* ── Index ──────────────────────────────────────────────────────────── */

function Roster({
  active,
  onEnter,
  onLeave,
  onPick,
}: {
  active: number | null;
  onEnter: (i: number) => void;
  onLeave: () => void;
  onPick: (i: number) => void;
}) {
  return (
    <div>
      {REGIONS.map((region) => (
        <div key={region} style={{ marginBottom: 18 }}>
          <div
            className="font-mono uppercase"
            style={{ fontSize: 8, letterSpacing: "0.3em", color: FAINT, marginBottom: 8 }}
          >
            {region}
          </div>
          {VOLCANOES.map((v, i) =>
            v.region !== region ? null : (
              <button
                key={v.slug}
                type="button"
                onMouseEnter={() => onEnter(i)}
                onMouseLeave={onLeave}
                onFocus={() => onEnter(i)}
                onBlur={onLeave}
                onClick={() => onPick(i)}
                className="font-mono uppercase flex items-baseline"
                style={{
                  width: "100%",
                  gap: 10,
                  background: "none",
                  border: "none",
                  padding: "5px 0",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  color: i === active ? INK : DIM,
                  transition: "color 150ms ease",
                }}
              >
                <span style={{ fontSize: 9, color: i === active ? ACCENT : FAINT }}>
                  {nn(i)}
                </span>
                <span>{v.short}</span>
                <span
                  aria-hidden
                  style={{
                    marginLeft: "auto",
                    width: 5,
                    height: 5,
                    transform: "rotate(45deg)",
                    flex: "none",
                    alignSelf: "center",
                    background: v.skied ? ACCENT : "transparent",
                    border: `1px solid ${v.skied ? ACCENT : FAINT}`,
                  }}
                />
              </button>
            ),
          )}
        </div>
      ))}
      <div
        className="font-mono uppercase flex items-center"
        style={{ fontSize: 8, letterSpacing: "0.2em", color: FAINT, gap: 8, marginTop: 4 }}
      >
        <span
          aria-hidden
          style={{ width: 5, height: 5, transform: "rotate(45deg)", background: ACCENT, flex: "none" }}
        />
        skied from the summit
      </div>
    </div>
  );
}

/* ── Carousel ───────────────────────────────────────────────────────── */

/** Scroll-snap photo pager. `auto` cycles until the visitor takes over
 *  (touch, wheel, or an arrow); slides lazy-load as they come into view. */
function PhotoCarousel({
  photos,
  alt,
  ratio,
  sizes,
  auto,
  arrows,
}: {
  photos: string[];
  alt: string;
  ratio: string;
  sizes: string;
  auto: boolean;
  arrows: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const stopped = useRef(false);

  const goTo = (i: number, smooth: boolean) => {
    const el = scrollerRef.current;
    if (!el || !el.clientWidth) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: smooth && !reduced ? "smooth" : "auto" });
  };

  useEffect(() => {
    if (!auto || photos.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      const el = scrollerRef.current;
      // clientWidth is 0 while the other breakpoint's copy is display:none.
      if (!el || !el.clientWidth || stopped.current) return;
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % photos.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: next === 0 ? "auto" : "smooth" });
    }, 3600);
    return () => clearInterval(t);
  }, [auto, photos.length]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || !el.clientWidth) return;
    setIdx(Math.max(0, Math.min(photos.length - 1, Math.round(el.scrollLeft / el.clientWidth))));
  };

  const stop = () => {
    stopped.current = true;
  };

  const step = (d: number) => {
    stop();
    const n = idx + d;
    const w = (n + photos.length) % photos.length;
    goTo(w, n === w); // wrapping around the end jumps instead of a reverse sweep
  };

  if (!photos.length) {
    return (
      <div style={{ aspectRatio: ratio }}>
        <Placeholder height="100%" label="Awaiting descent" />
      </div>
    );
  }
  return (
    <div
      className="relative"
      style={{ aspectRatio: ratio, border: `1px solid ${FAINT}`, background: BG, overflow: "hidden" }}
    >
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        onPointerDown={stop}
        onTouchStart={stop}
        onWheel={stop}
        className="absolute inset-0 flex"
        style={{ overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {photos.map((src) => (
          <div key={src} className="relative" style={{ flex: "0 0 100%", scrollSnapAlign: "start" }}>
            <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
          </div>
        ))}
      </div>
      {/* Same faint 135° hatch the kit's Plate uses */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.01) 8px 9px)",
        }}
      />
      {photos.length > 1 && (
        <div
          className="font-mono"
          style={{
            position: "absolute",
            right: 6,
            bottom: 6,
            fontSize: 8,
            letterSpacing: "0.14em",
            color: INK,
            background: CARD_BG,
            padding: "2px 6px",
            pointerEvents: "none",
          }}
        >
          {idx + 1} / {photos.length}
        </div>
      )}
      {arrows && photos.length > 1 && (
        <>
          <button type="button" aria-label="Previous photo" onClick={() => step(-1)} style={arrowStyle("left")}>
            ‹
          </button>
          <button type="button" aria-label="Next photo" onClick={() => step(1)} style={arrowStyle("right")}>
            ›
          </button>
        </>
      )}
    </div>
  );
}

const arrowStyle = (side: "left" | "right"): CSSProperties => ({
  position: "absolute",
  [side]: 6,
  top: "50%",
  transform: "translateY(-50%)",
  width: 22,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: CARD_BG,
  border: `1px solid ${FAINT}`,
  color: INK,
  fontSize: 13,
  lineHeight: 1,
  padding: 0,
  cursor: "pointer",
});

/* ── Mobile strip + panel ───────────────────────────────────────────── */

function StripCard({ v, index, active }: { v: Volcano; index: number; active: boolean }) {
  return (
    <article
      style={{
        // Text-only now — narrower than .scroll-strip's stylesheet width.
        width: "clamp(148px, 42vw, 186px)",
        border: `1px solid ${active ? ACCENT_DIM : FAINT}`,
        background: CARD_BG,
        padding: "10px 12px 11px",
        transition: "border-color 250ms ease, color 250ms ease",
      }}
    >
      <div
        className="font-medium"
        style={{ fontSize: 12.5, color: active ? INK : DIM, letterSpacing: "-0.005em", whiteSpace: "nowrap", transition: "color 250ms ease" }}
      >
        <span className="font-mono" style={{ fontSize: 9, color: active ? ACCENT : FAINT, marginRight: 8 }}>
          {nn(index)}
        </span>
        {v.short}
      </div>
      <div
        className="font-mono uppercase"
        style={{ fontSize: 8.5, letterSpacing: "0.16em", color: FAINT, marginTop: 6 }}
      >
        {ft(v.feet)} ft ·{" "}
        <span style={{ color: v.skied ? ACCENT : FAINT }}>{v.skied ? "Skied" : "Unskied"}</span>
      </div>
    </article>
  );
}

/** Full-width photo panel under the strip: the active station's photos,
 *  auto-cycling until touched, then swiped by hand. */
function PhotoPanel({ v, index }: { v: Volcano; index: number }) {
  return (
    <div data-photo-panel="" style={{ marginTop: 18 }}>
      <PhotoCarousel
        key={v.slug}
        photos={photosOf(v)}
        alt={`${v.name} — from the ski project`}
        ratio="3 / 2"
        sizes="94vw"
        auto
        arrows={false}
      />
      <div className="flex items-baseline" style={{ gap: 12, marginTop: 10 }}>
        <div className="font-medium" style={{ fontSize: 13.5, color: INK, letterSpacing: "-0.005em" }}>
          <span className="font-mono" style={{ fontSize: 9, color: ACCENT, marginRight: 8 }}>
            {nn(index)}
          </span>
          {v.name}
        </div>
        <div
          className="font-mono uppercase"
          style={{ marginLeft: "auto", fontSize: 8.5, letterSpacing: "0.16em", color: FAINT, whiteSpace: "nowrap" }}
        >
          {ft(v.feet)} ft · {v.region}
        </div>
      </div>
      {v.note && <div style={{ fontSize: 11, lineHeight: 1.5, color: DIM, marginTop: 6 }}>{v.note}</div>}
    </div>
  );
}
