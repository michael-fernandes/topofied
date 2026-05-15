"use client";

import Link from "next/link";
import TopoScene from "../lib/topo-scene";

const PAGES = [
  { href: "/", label: "Home", coords: "N 47°36′ · W 122°19′" },
  { href: "/work", label: "Work", coords: "N 47°39′ · W 122°18′" },
  { href: "/about", label: "About", coords: "N 47°36′12″ · W 122°20′40″" },
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
  const sector = PAGES.find((p) => p.href === current) ?? PAGES[0];

  return (
    <div className="relative min-h-screen bg-[#1f1a16] text-[#ebe2d4] font-sans overflow-x-hidden max-w-[1280px] mx-auto">
      <TopoScene
        fill
        seed={seed}
        accentHue={24}
        accentSat={22}
        hoverBoost={22}
        theme="dark"
        res={5}
      >
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

        {/* Gradient: transparent through hero, fades to bg below fold */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background: `linear-gradient(to bottom, transparent 0%, transparent 70vh, rgba(31,26,22,0.60) 100vh, rgba(31,26,22,0.88) 140vh, rgba(31,26,22,0.90) 200vh)`,
          }}
        />

        {/* Page content */}
        <div className="relative z-10 pb-16">{children}</div>

        {/* Bottom instrument strip */}
        <div className="fixed bottom-0 left-0 right-0 z-[21] flex items-center justify-between px-6 py-2 border-t border-[#5a4f43]/50 bg-[#1f1a16]/80 backdrop-blur-sm font-mono text-[10px] uppercase tracking-wider text-[#5a4f43]">
          <span>{sector.coords}</span>
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
