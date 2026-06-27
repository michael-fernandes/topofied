"use client";

// Persistent app shell. Lives in the root layout so it survives client
// navigation — which is what lets the active-tab summit *glide* between pages
// instead of being regenerated. Owns the full-bleed TopoScene, nav, gradient
// overlay, and bottom instrument strip.
//
// The terrain uses one shared seed so the base landscape stays continuous
// across routes; on navigation the active-tab summit eases from the old tab
// to the newly-selected one.

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import TopoScene from "../lib/topo-scene";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

// One seed shared by every route keeps the base terrain continuous so the
// summit reads as gliding across a stable landscape rather than regenerating.
const SHARED_SEED = "topo-continuous";

// Nav peak elevations. All nav links share a falloff/sharpness so only height
// distinguishes the active summit — that makes the gliding transition a clean
// elevation morph rather than a shape change.
//
// The summit is kept broad (large falloff) and gently sloped (low sharpness)
// so its rings spread out and breathe rather than crowding the header; height
// still makes it the unmistakable local high point.
const ACTIVE_H = 46;
const INACTIVE_H = 12;
const NAV_FALLOFF = 76;
const NAV_SHARPNESS = 1.45;
// Per-frame easing toward the target height. Higher = snappier glide.
const GLIDE_EASE = 0.22;

export default function TerrainShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Per-link height, animated toward its target as the route changes. The ref
  // is the mutable per-frame scratch value (touched only inside the effect);
  // each frame it's mirrored into state so render reads from state — never the
  // ref — and TopoScene re-renders with the updated data attributes.
  const initialHeights = () =>
    Object.fromEntries(
      PAGES.map((p) => [p.href, p.href === pathname ? ACTIVE_H : INACTIVE_H])
    );
  const heightsRef = useRef<Record<string, number>>(initialHeights());
  const [heights, setHeights] = useState<Record<string, number>>(initialHeights);
  const rafRef = useRef(0);

  useEffect(() => {
    const targetFor = (href: string) =>
      href === pathname ? ACTIVE_H : INACTIVE_H;

    const tick = () => {
      let moving = false;
      const h = heightsRef.current;
      for (const { href } of PAGES) {
        const target = targetFor(href);
        const cur = h[href] ?? INACTIVE_H;
        const next = cur + (target - cur) * GLIDE_EASE;
        if (Math.abs(next - target) > 0.5) {
          h[href] = next;
          moving = true;
        } else {
          h[href] = target;
        }
      }
      setHeights({ ...h });
      if (moving) rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pathname]);

  // Buffer page content below the header so the active summit's rings don't
  // bleed into it. The landing hero already centers its content well below
  // this line, so it's exempt to avoid pushing the heading off-screen.
  const contentPadTop = pathname === "/" ? undefined : "27vh";

  return (
    <TopoScene
      fill
      seed={SHARED_SEED}
      accentHue={24}
      accentSat={22}
      hoverBoost={22}
      theme="dark"
      res={5}
    >
      {/* Gradient: full-bleed; transparent through hero, fades to bg below fold */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: `linear-gradient(to bottom, transparent 0%, transparent 70vh, rgba(31,26,22,0.70) 110vh, rgba(31,26,22,0.70) 100%)`,
        }}
      />

      {/* Centered content column — peaks come from here; contours extend outward */}
      <div className="relative z-10 max-w-[1280px] mx-auto">
        {/* Nav — inside TopoScene so links are discovered as peaks */}
        <div
          className="px-page absolute left-0 right-0 top-0 z-20 flex items-center justify-end"
          style={{ paddingTop: 12, paddingBottom: 32 }}
        >
          <div className="flex items-center" style={{ gap: 36 }}>
            {PAGES.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="font-mono uppercase transition-colors"
                  // The active tab is the dominant peak in the header; its
                  // height eases toward ACTIVE_H as the route changes.
                  data-topo-important={active ? "" : undefined}
                  data-topo-id={`nav-${href}`}
                  data-topo-height={(heights[href] ?? INACTIVE_H).toFixed(1)}
                  data-topo-falloff={NAV_FALLOFF}
                  data-topo-sharpness={NAV_SHARPNESS}
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.25em",
                    color: active ? "#ebe2d4" : "#a89a86",
                    textDecoration: "none",
                    borderBottom: active
                      ? "1px solid hsl(24 22% 70%)"
                      : "1px solid transparent",
                    paddingBottom: 3,
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Page content — buffered below the header so the active summit's
            contour rings have room to breathe and don't bleed into content. */}
        <div className="pb-16" style={{ paddingTop: contentPadTop }}>
          {children}
        </div>
      </div>

      {/* Bottom instrument strip — a single quiet map nod: a scale bar. */}
      <div className="fixed bottom-0 left-0 right-0 z-[21] flex items-center justify-between px-6 py-2 border-t border-[#5a4f43]/50 bg-[#1f1a16]/80 backdrop-blur-sm font-mono text-[10px] uppercase tracking-wider text-[#5a4f43]">
        <span>Michael Fernandes</span>
        <div className="flex items-center gap-2">
          <span>0</span>
          <div className="relative h-1.5 w-24">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-[#5a4f43]" />
            <div className="absolute left-0 top-0 h-full w-px bg-[#5a4f43]" />
            <div className="absolute left-1/4 top-[3px] h-[3px] w-px bg-[#5a4f43]" />
            <div className="absolute left-1/2 top-[2px] h-[4px] w-px bg-[#5a4f43]" />
            <div className="absolute left-3/4 top-[3px] h-[3px] w-px bg-[#5a4f43]" />
            <div className="absolute right-0 top-0 h-full w-px bg-[#5a4f43]" />
          </div>
          <span>500 PX</span>
        </div>
      </div>
    </TopoScene>
  );
}
