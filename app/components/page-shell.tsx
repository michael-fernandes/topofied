import TopoCanvas from "../topo-canvas";
import Link from "next/link";

const PAGES = [
  { href: "/",        label: "Landing", coords: "N 40°12'30\" · W 073°58'01\"" },
  { href: "/news",    label: "News",    coords: "N 37°46'29\" · W 122°25'09\"" },
  { href: "/article", label: "Article", coords: "N 51°30'26\" · W 000°07'39\"" },
  { href: "/video",   label: "Video",   coords: "N 35°41'22\" · E 139°41'30\"" },
  { href: "/learn",   label: "Course",  coords: "N 47°36'35\" · W 122°19'59\"" },
];

export default function PageShell({
  children,
  current,
}: {
  children: React.ReactNode;
  current: string;
}) {
  const sector = PAGES.find((p) => p.href === current) ?? PAGES[0];

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#d0d0d0] font-sans overflow-x-hidden">
      <TopoCanvas />
      <div className="relative z-10 pb-12">
        {/* ── Top instrument strip: page switcher ── */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-white/[0.05] bg-[#000000]/80 backdrop-blur-sm sticky top-0 z-20">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#a0a0a0]/50 uppercase mr-4">
            TOPOFIED
          </span>
          {PAGES.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-mono px-3 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                current === href
                  ? "text-[#d0d0d0] border-b border-[#d0d0d0]/60"
                  : "text-[#484848] hover:text-[#888888] border-b border-transparent"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {children}
      </div>

      {/* ── Bottom instrument strip: coords + scale bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-2 border-t border-white/[0.06] bg-[#000000]/80 backdrop-blur-sm font-mono text-[10px] uppercase tracking-wider text-white/35">
        <span>{sector.coords}</span>
        <div className="flex items-center gap-2">
          <span>0</span>
          <div className="relative h-1.5 w-24">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-white/35" />
            <div className="absolute left-0 top-0 h-full w-px bg-white/35" />
            <div className="absolute left-1/4 top-[3px] h-[3px] w-px bg-white/35" />
            <div className="absolute left-1/2 top-[2px] h-[4px] w-px bg-white/35" />
            <div className="absolute left-3/4 top-[3px] h-[3px] w-px bg-white/35" />
            <div className="absolute right-0 top-0 h-full w-px bg-white/35" />
          </div>
          <span>500 PX</span>
        </div>
      </div>
    </div>
  );
}
