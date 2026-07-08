"use client";

// Per-skill animated glyphs, ported from the origin "what-i-do-triad" component.
// Difference from origin: the motion is *always going* — the orbit, rotation and
// bracket-breathe run continuously off a single rAF clock, with no active/hover
// gating (matches the site's ambient-motion pattern). Honors reduced-motion.

import { useEffect, useState } from "react";
import { ACCENT, ACCENT_DIM } from "./kit";

export type GlyphKind = "tools" | "viz" | "hcd";

export default function SkillGlyph({ kind, size = 48 }: { kind: GlyphKind; size?: number }) {
  const [t, setT] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      setT((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const c = ACCENT_DIM; // base contour ink
  const cw = ACCENT; // emphasized element (moving node / inner ring)
  const pulse = Math.sin(t * 1.6) * 0.5 + 0.5;
  // Round every computed coordinate: sin/cos differ by ~1 ULP between the
  // server's and the browser's math libs, which at full float precision trips a
  // hydration mismatch. 2 decimals is sub-pixel here and makes both sides equal.
  const r = (n: number) => Math.round(n * 100) / 100;

  return (
    <svg aria-hidden viewBox="0 0 64 64" width={size} height={size} style={{ overflow: "visible" }}>
      {kind === "tools" &&
        [0, 1, 2].map((i) => {
          const o = r(i * 6 + pulse * 2);
          return (
            <g key={i} stroke={i === 1 ? cw : c} strokeWidth="1.2" fill="none" opacity={1 - i * 0.25}>
              <path d={`M${10 + o},${20 + o} L${4 + o},${32} L${10 + o},${44 - o}`} />
              <path d={`M${54 - o},${20 + o} L${60 - o},${32} L${54 - o},${44 - o}`} />
            </g>
          );
        })}

      {kind === "viz" && (
        <>
          {[24, 18, 12, 6].map((r, i) => (
            <circle
              key={i}
              cx="32"
              cy="32"
              r={r}
              stroke={i === 0 ? cw : c}
              strokeWidth={i === 0 ? 1.2 : 0.8}
              fill="none"
              opacity={1 - i * 0.18}
            />
          ))}
          <circle cx={r(32 + Math.cos(t * 1.2) * 16)} cy={r(32 + Math.sin(t * 1.2) * 16)} r={2.4} fill={cw} />
        </>
      )}

      {kind === "hcd" &&
        (() => {
          const angle = t * 0.4;
          const pts = [0, 1, 2].map((i) => ({
            x: r(32 + Math.cos(angle + (i * Math.PI * 2) / 3) * 18),
            y: r(32 + Math.sin(angle + (i * Math.PI * 2) / 3) * 18),
          }));
          return (
            <>
              <path
                d={`M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y} L${pts[2].x},${pts[2].y} Z`}
                stroke={c}
                strokeWidth="0.8"
                fill="none"
                opacity="0.6"
              />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={3} fill={i === 0 ? cw : c} />
              ))}
              <circle cx="32" cy="32" r="1.5" fill={cw} />
            </>
          );
        })()}
    </svg>
  );
}
