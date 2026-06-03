"use client";

import Link from "next/link";
import TopoScene from "../lib/topo-scene";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/collaborate", label: "Collaborate" },
  { href: "/about", label: "About" },
];

const BG = "#1f1a16";

export default function PageShell({
  children,
  current,
  seed = "page",
}: {
  children: React.ReactNode;
  current: string;
  seed?: string;
}) {
  return (
    <div className="relative min-h-screen bg-[#1f1a16] text-[#ebe2d4] font-sans overflow-x-hidden">
      {/* TopoScene fills the full viewport width so contours bleed past the
          content column on wide screens; content is centered at max-w below. */}
      <TopoScene
        fill
        seed={seed}
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
            background: `linear-gradient(to bottom, transparent 0%, transparent 70vh, rgba(31,26,22,0.55) 110vh, rgba(31,26,22,0.55) 100%)`,
          }}
        />

        {/* Centered content column — peaks come from here; contours extend outward */}
        <div className="relative z-10 max-w-[1280px] mx-auto">
          {/* Nav — inside TopoScene so links are discovered as peaks */}
          <div
            className="px-page absolute left-0 right-0 top-0 z-20 flex items-center justify-end"
            style={{ paddingTop: 32, paddingBottom: 32 }}
          >
            <div className="flex items-center" style={{ gap: 36 }}>
              {PAGES.map(({ href, label }) => {
                const active = current === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="font-mono uppercase transition-colors"
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

          {/* Page content */}
          <div className="pb-16">{children}</div>
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
    </div>
  );
}
