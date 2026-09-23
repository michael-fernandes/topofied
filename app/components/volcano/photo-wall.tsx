"use client";

// Every photo, N → S, in a bounded scrolling grid. Thumbs scale and fade in
// as they enter the viewport (and back out as they leave).

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ACCENT, BG, FAINT } from "../kit";
import { allPhotos, nn, VOLCANOES } from "../../lib/volcanoes";

const PHOTOS = allPhotos();

export default function PhotoWall({ onOpen }: { onOpen: (peak: number, photo: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.toggleAttribute("data-in", e.isIntersecting)),
      { root, threshold: 0.2 },
    );
    Array.from(root.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <div className="photo-wall-frame">
      <div ref={ref} className="photo-wall">
        {PHOTOS.map(({ src, peak, photo }) => {
          const v = VOLCANOES[peak];
          return (
            <button
              key={`${v.slug}-${photo}`}
              type="button"
              className="wall-thumb"
              onClick={() => onOpen(peak, photo)}
              aria-label={`${v.name}, photo ${photo + 1}`}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
            >
              <div className="relative" style={{ aspectRatio: "3 / 2", border: `1px solid ${FAINT}`, background: BG, overflow: "hidden" }}>
                <Image src={src} alt="" fill sizes="(max-width: 767px) 30vw, 176px" style={{ objectFit: "cover" }} />
              </div>
              <div
                className="font-mono uppercase"
                style={{ height: "var(--cap)", paddingTop: 5, fontSize: 8, letterSpacing: "0.16em", color: FAINT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                <span style={{ color: ACCENT }}>{nn(peak)}</span> {v.short}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
