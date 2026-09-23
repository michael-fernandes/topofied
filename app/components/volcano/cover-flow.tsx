"use client";

// One peak's photos as a cover flow: centered photo flat, neighbors tilted
// back. Arrow keys, ‹ › buttons, swipe, or clicking a neighbor move it.

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { ACCENT, BG, CARD_BG, DIM, FAINT, INK } from "../kit";
import { COVER_REACH, coverTransform } from "../../lib/coverflow";
import { ft, nn, photosOf, type Volcano } from "../../lib/volcanoes";

const SWIPE_PX = 40;
const SLIDE_W = "min(640px, 70%)";

export default function CoverFlow({ v, index, start }: { v: Volcano; index: number; start: number }) {
  const photos = photosOf(v);
  const [idx, setIdx] = useState(start);
  const go = (i: number) => setIdx(Math.max(0, Math.min(photos.length - 1, i)));
  const downX = useRef<number | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest?.("input, textarea, select")) return;
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIdx((i) => Math.min(photos.length - 1, i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [photos.length]);

  return (
    <div>
      <div
        className="relative"
        onPointerDown={(e) => {
          downX.current = e.clientX;
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          if (downX.current == null) return;
          const dx = e.clientX - downX.current;
          downX.current = null;
          if (Math.abs(dx) < SWIPE_PX) return;
          swiped.current = true;
          go(idx + (dx < 0 ? 1 : -1));
        }}
        style={{ perspective: 1100, overflow: "hidden", padding: "6px 0", touchAction: "pan-y", userSelect: "none" }}
      >
        {/* Sizer: the center slide's footprint */}
        <div style={{ width: SLIDE_W, aspectRatio: "3 / 2", margin: "0 auto" }} />
        {photos.map((src, i) => {
          const off = i - idx;
          if (Math.abs(off) > COVER_REACH + 1) return null;
          const t = coverTransform(off);
          return (
            <button
              key={`${v.slug}-${i}`}
              type="button"
              className="cover-slide"
              tabIndex={t.opacity && off !== 0 ? 0 : -1}
              aria-label={off === 0 ? undefined : `Photo ${i + 1}`}
              onClick={() => !swiped.current && go(i)}
              style={{
                position: "absolute",
                top: 6,
                left: "50%",
                width: SLIDE_W,
                aspectRatio: "3 / 2",
                marginLeft: `calc(${SLIDE_W} / -2)`,
                padding: 0,
                border: `1px solid ${FAINT}`,
                background: BG,
                overflow: "hidden",
                cursor: off === 0 ? "default" : "pointer",
                zIndex: 10 + t.z,
                opacity: t.opacity,
                transform: `translateX(${t.x * 100}%) rotateY(${t.rotateY}deg) scale(${t.scale})`,
                pointerEvents: t.opacity ? "auto" : "none",
              }}
            >
              <Image
                src={src}
                alt={off === 0 ? `${v.name} — from the ski project` : ""}
                fill
                draggable={false}
                sizes={off === 0 ? "(max-width: 767px) 70vw, 640px" : "(max-width: 767px) 58vw, 500px"}
                style={{ objectFit: "cover" }}
              />
            </button>
          );
        })}
        <button type="button" aria-label="Previous photo" disabled={idx === 0} onClick={() => go(idx - 1)} style={arrow("left", idx === 0)}>
          ‹
        </button>
        <button type="button" aria-label="Next photo" disabled={idx === photos.length - 1} onClick={() => go(idx + 1)} style={arrow("right", idx === photos.length - 1)}>
          ›
        </button>
      </div>

      <div style={{ width: "min(640px, 100%)", margin: "12px auto 0" }}>
        <div className="flex items-baseline flex-wrap" style={{ columnGap: 12, rowGap: 4 }}>
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
            {ft(v.feet)} ft · {v.region} · <span style={{ color: DIM }}>{idx + 1} / {photos.length}</span>
          </div>
        </div>
        {v.note && <div style={{ fontSize: 11, lineHeight: 1.5, color: DIM, marginTop: 6 }}>{v.note}</div>}
      </div>
    </div>
  );
}

const arrow = (side: "left" | "right", off: boolean): CSSProperties => ({
  position: "absolute",
  [side]: 4,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 20,
  width: 26,
  height: 26,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: CARD_BG,
  border: `1px solid ${FAINT}`,
  color: INK,
  fontSize: 14,
  lineHeight: 1,
  padding: 0,
  cursor: off ? "default" : "pointer",
  opacity: off ? 0.3 : 1,
});
