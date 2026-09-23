"use client";

// Every photo in one compact, clipped mosaic. Tiles that don't fit are cut
// off; every few seconds a visible tile swaps for a hidden photo.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animated, useTransition } from "react-spring";
import { ACCENT, BG, FAINT } from "../kit";
import { allPhotos, nn, VOLCANOES, type WallPhoto } from "../../lib/volcanoes";
import { pickSlot, rotate, seed } from "../../lib/mosaic";

const PHOTOS = allPhotos();
const SLOTS = 24; // more than ever fit; the frame clips the rest
const EVERY_MS = 2600;
const idOf = (p: WallPhoto) => `${p.peak}-${p.photo}`;

export default function PhotoWall({ onOpen }: { onOpen: (peak: number, photo: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mosaic, setMosaic] = useState(() => seed(PHOTOS, SLOTS));
  const visible = useRef(new Set<number>());
  const paused = useRef(false);

  // Track which slots are actually on screen inside the clipped frame.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const i = Number((e.target as HTMLElement).dataset.slot);
          if (e.isIntersecting) visible.current.add(i);
          else visible.current.delete(i);
        }),
      { root, threshold: 0.6 },
    );
    Array.from(root.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  // Swap one visible slot at a time; still under reduced motion or when hidden.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let prev = -1;
    const t = setInterval(() => {
      if (paused.current || document.hidden || !visible.current.size) return;
      prev = pickSlot([...visible.current], prev);
      setMosaic((m) => rotate(m, prev));
    }, EVERY_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="photo-wall-frame">
      <div
        ref={ref}
        className="photo-wall"
        onPointerEnter={() => (paused.current = true)}
        onPointerLeave={() => (paused.current = false)}
      >
        {mosaic.slots.map((p, i) => (
          <div key={i} data-slot={i} className="wall-cell">
            <Tile p={p} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** One cell; the incoming photo fades up over the outgoing one. */
function Tile({ p, onOpen }: { p: WallPhoto; onOpen: (peak: number, photo: number) => void }) {
  const t = useTransition(p, {
    keys: idOf,
    initial: { opacity: 1, scale: 1 },
    from: { opacity: 0, scale: 1.08 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 1 },
    config: { tension: 120, friction: 26 },
  });

  return t((style, { src, peak, photo }) => {
    const v = VOLCANOES[peak];
    return (
      <animated.button
        type="button"
        className="wall-thumb"
        onClick={() => onOpen(peak, photo)}
        aria-label={`${v.name}, photo ${photo + 1}`}
        style={{ ...style, position: "absolute", inset: 0, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
      >
        <div className="relative" style={{ aspectRatio: "3 / 2", border: `1px solid ${FAINT}`, background: BG, overflow: "hidden" }}>
          <Image src={src} alt="" fill sizes="(max-width: 767px) 30vw, 140px" style={{ objectFit: "cover" }} />
        </div>
        <div
          className="font-mono uppercase"
          style={{ height: "var(--cap)", paddingTop: 5, fontSize: 8, letterSpacing: "0.16em", color: FAINT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          <span style={{ color: ACCENT }}>{nn(peak)}</span> {v.short}
        </div>
      </animated.button>
    );
  });
}
