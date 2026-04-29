import TopoDensity from "../topo-density";
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
    <div className="relative min-h-screen bg-[#1f1a16] text-[#ebe2d4] font-sans overflow-x-hidden">
      <TopoDensity />
      <div className="relative z-10 pb-12">
        {/* ── Top instrument strip: page switcher ── */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-[#5a4f43]/40 bg-[#1f1a16]/80 backdrop-blur-sm sticky top-0 z-20">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#ebe2d4] uppercase mr-4">
            TOPOFIED
          </span>
          {PAGES.map(({ href, label }) => {
            const id = `nav-${href}`;
            return (
              <Link
                key={href}
                href={href}
                data-topo-id={id}
                data-topo-hover-id={id}
                data-topo-important=""
                data-topo-height="32"
                data-topo-falloff="70"
                className={`font-mono px-3 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                  current === href
                    ? "text-[#ebe2d4] border-b border-[#ebe2d4]/60"
                    : "text-[#a89a86] hover:text-[#ebe2d4] border-b border-transparent"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {children}
      </div>

      {/* ── Bottom instrument strip: coords + scale bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-2 border-t border-[#5a4f43]/50 bg-[#1f1a16]/80 backdrop-blur-sm font-mono text-[10px] uppercase tracking-wider text-[#5a4f43]">
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
    </div>
  );
}
