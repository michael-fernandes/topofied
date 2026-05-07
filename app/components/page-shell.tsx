import Link from "next/link";

const PAGES = [
  { href: "/",      label: "Index", coords: "N 47°36′ · W 122°19′" },
  { href: "/work",  label: "Work",  coords: "N 47°39′ · W 122°18′" },
  { href: "/fun",   label: "Fun",   coords: "N 47°38′ · W 122°21′" },
  { href: "/about", label: "About", coords: "N 47°36′12″ · W 122°20′40″" },
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
      {/* ── Nav (floats above the hero scene; hidden from peak discovery) ── */}
      <div
        data-topo-hidden=""
        className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between"
        style={{ padding: "32px 60px" }}
      >
        <div
          className="font-mono flex items-baseline"
          style={{ fontSize: 11, letterSpacing: "0.22em", gap: 14 }}
        >
          <span style={{ color: "#ebe2d4" }}>◇ MF</span>
          <span style={{ color: "#5a4f43" }}>—</span>
          <span style={{ color: "#a89a86", letterSpacing: "0.12em", textTransform: "none" }}>
            Michael Fernandes, UX Engineer
          </span>
        </div>
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

      <div className="relative z-10 pb-16">{children}</div>

      {/* ── Bottom instrument strip ── */}
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
