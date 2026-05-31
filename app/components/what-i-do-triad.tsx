"use client";

import { useEffect, useRef, useState } from "react";

const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";
const FAINT = "#5a4f43";
const DIM = "#a89a86";
const INK = "#ebe2d4";

type Kind = "tools" | "viz" | "hcd";

const items: { key: Kind; label: string; title: string; body: string; tags: string[] }[] = [
  {
    key: "tools",
    label: "Engineering",
    title: "Technical tools",
    body: "Internal apps, design systems, prototypes that actually run. The unglamorous infrastructure that turns a brief into a thing.",
    tags: ["Next.js", "TS", "design systems", "prototyping"],
  },
  {
    key: "viz",
    label: "Visualization",
    title: "Data visualization",
    body: "Especially the messy parts: uncertainty, probability, ensembles. Charts that don't lie about what they don't know.",
    tags: ["d3", "viz design", "uncertainty"],
  },
  {
    key: "hcd",
    label: "Research",
    title: "Human-centered design",
    body: "Research, testing, field studies. Designs that work for the person standing at the bus stop in the rain, not the one in the conference talk.",
    tags: ["studies", "interviews", "iteration"],
  },
];

export default function WhatIDoTriad() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-9 items-stretch">
      {items.map((it, i) => (
        <TriadCard key={it.key} item={it} index={i} />
      ))}
    </div>
  );
}

function TriadCard({ item, index }: { item: typeof items[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [inCenter, setInCenter] = useState(false);
  const animating = hovering || inCenter;

  // Mobile: animate when card is roughly centered in the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInCenter(entry.isIntersecting),
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative p-8"
      style={{
        border: `1px solid ${hovering ? ACCENT_DIM : FAINT}`,
        background: hovering ? "rgba(235,226,212,0.03)" : "transparent",
        minHeight: 320,
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      <TriadGlyph kind={item.key} animating={animating} />
      <div
        className="font-mono uppercase mb-3.5"
        style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT }}
      >
        {String(index + 1).padStart(2, "0")} ◇ {item.label}
      </div>
      <h3
        className="font-medium mb-3.5"
        style={{ fontSize: 22, letterSpacing: "-0.012em", lineHeight: 1.2, color: INK }}
      >
        {item.title}
      </h3>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, margin: 0 }}>
        {item.body}
      </p>
      <div
        className="font-mono uppercase flex flex-wrap"
        style={{ gap: 12, marginTop: 22, fontSize: 9, letterSpacing: "0.18em", color: FAINT }}
      >
        {item.tags.map((t) => (
          <span key={t}>· {t}</span>
        ))}
      </div>
    </div>
  );
}

function TriadGlyph({ kind, animating }: { kind: Kind; animating: boolean }) {
  const [t, setT] = useState(0);
  const rafRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);

  useEffect(() => {
    if (!animating) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const startWall = performance.now();
    const startT = offsetRef.current;
    const loop = () => {
      const elapsed = startT + (performance.now() - startWall) / 1000;
      offsetRef.current = elapsed;
      setT(elapsed);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animating]);

  const pulse = animating ? Math.sin(t * 1.6) * 0.5 + 0.5 : 0;

  return (
    <div style={{ position: "absolute", top: 24, right: 24, width: 64, height: 64 }}>
      <svg viewBox="0 0 64 64" width={64} height={64} style={{ overflow: "visible" }}>
        {kind === "tools" &&
          [0, 1, 2].map((i) => {
            const o = i * 6 + pulse * 2;
            return (
              <g
                key={i}
                stroke={i === 1 ? ACCENT_DIM : ACCENT}
                strokeWidth="1.2"
                fill="none"
                opacity={1 - i * 0.25}
              >
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
                stroke={i === 0 ? ACCENT_DIM : ACCENT}
                strokeWidth={i === 0 ? 1.2 : 0.8}
                fill="none"
                opacity={1 - i * 0.18}
              />
            ))}
            <circle
              cx={32 + Math.cos(t * 1.2) * 16}
              cy={32 + Math.sin(t * 1.2) * 16}
              r={2.4}
              fill={ACCENT_DIM}
            />
          </>
        )}
        {kind === "hcd" &&
          (() => {
            const angle = t * 0.4;
            const pts = [0, 1, 2].map((i) => ({
              x: 32 + Math.cos(angle + (i * Math.PI * 2) / 3) * 18,
              y: 32 + Math.sin(angle + (i * Math.PI * 2) / 3) * 18,
            }));
            return (
              <>
                <path
                  d={`M${pts[0].x},${pts[0].y} L${pts[1].x},${pts[1].y} L${pts[2].x},${pts[2].y} Z`}
                  stroke={ACCENT}
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.6"
                />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={3} fill={i === 0 ? ACCENT_DIM : ACCENT} />
                ))}
                <circle cx="32" cy="32" r="1.5" fill={ACCENT_DIM} />
              </>
            );
          })()}
      </svg>
    </div>
  );
}
