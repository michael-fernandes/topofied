"use client";

import { useEffect, useState } from "react";

const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";
const FAINT = "#5a4f43";
const DIM = "#a89a86";
const INK = "#ebe2d4";

type Kind = "tools" | "viz" | "hcd";

const items: { key: Kind; title: string; body: string; tags: string[] }[] = [
  {
    key: "tools",
    title: "Technical tools",
    body: "Internal apps, design systems, prototypes that actually run. The unglamorous infrastructure that turns a brief into a thing.",
    tags: ["Next.js", "TS", "design systems", "prototyping"],
  },
  {
    key: "viz",
    title: "Data visualization",
    body: "Especially the messy parts: uncertainty, probability, ensembles. Charts that don't lie about what they don't know.",
    tags: ["d3", "viz design", "uncertainty"],
  },
  {
    key: "hcd",
    title: "Human-centered design",
    body: "Research, testing, field studies. Designs that work for the person standing at the bus stop in the rain, not the one in the conference talk.",
    tags: ["studies", "interviews", "iteration"],
  },
];

export default function WhatIDoTriad() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 3800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-9 items-stretch">
      {items.map((it, i) => {
        const isActive = active === i;
        return (
          <div
            key={it.key}
            onMouseEnter={() => setActive(i)}
            className="relative p-8 transition-colors"
            style={{
              border: `1px solid ${isActive ? ACCENT_DIM : FAINT}`,
              background: isActive ? "rgba(235,226,212,0.04)" : "transparent",
              minHeight: 320,
            }}
          >
            <TriadGlyph kind={it.key} active={isActive} />
            <div
              className="font-mono uppercase mb-3.5 transition-colors"
              style={{
                fontSize: 10,
                letterSpacing: "0.28em",
                color: isActive ? ACCENT : FAINT,
              }}
            >
              {String(i + 1).padStart(2, "0")} ◇ {isActive ? "Active layer" : "Layer"}
            </div>
            <h3
              className="font-medium mb-3.5 transition-colors"
              style={{
                fontSize: 22,
                letterSpacing: "-0.012em",
                lineHeight: 1.2,
                color: isActive ? INK : DIM,
              }}
            >
              {it.title}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, margin: 0 }}>
              {it.body}
            </p>
            <div
              className="font-mono uppercase flex flex-wrap"
              style={{
                gap: 12,
                marginTop: 22,
                fontSize: 9,
                letterSpacing: "0.18em",
                color: FAINT,
              }}
            >
              {it.tags.map((t) => (
                <span key={t}>· {t}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TriadGlyph({ kind, active }: { kind: Kind; active: boolean }) {
  const c = active ? ACCENT : FAINT;
  const cw = active ? ACCENT_DIM : FAINT;
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = () => {
      setT((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pulse = active ? Math.sin(t * 1.6) * 0.5 + 0.5 : 0;

  return (
    <div style={{ position: "absolute", top: 24, right: 24, width: 64, height: 64 }}>
      <svg viewBox="0 0 64 64" width={64} height={64} style={{ overflow: "visible" }}>
        {kind === "tools" &&
          [0, 1, 2].map((i) => {
            const o = i * 6 + (active ? pulse * 2 : 0);
            return (
              <g
                key={i}
                stroke={i === 1 ? cw : c}
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
                stroke={i === 0 ? cw : c}
                strokeWidth={i === 0 ? 1.2 : 0.8}
                fill="none"
                opacity={1 - i * 0.18}
              />
            ))}
            <circle
              cx={32 + Math.cos(t * 1.2) * 16}
              cy={32 + Math.sin(t * 1.2) * 16}
              r={2.4}
              fill={cw}
              opacity={active ? 1 : 0.5}
            />
          </>
        )}
        {kind === "hcd" &&
          (() => {
            const angle = active ? t * 0.4 : 0;
            const pts = [0, 1, 2].map((i) => ({
              x: 32 + Math.cos(angle + (i * Math.PI * 2) / 3) * 18,
              y: 32 + Math.sin(angle + (i * Math.PI * 2) / 3) * 18,
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
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={3}
                    fill={i === 0 ? cw : c}
                    opacity={active ? 1 : 0.55}
                  />
                ))}
                <circle cx="32" cy="32" r="1.5" fill={cw} opacity={active ? 1 : 0.4} />
              </>
            );
          })()}
      </svg>
    </div>
  );
}
