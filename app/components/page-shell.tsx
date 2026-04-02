import TopoCanvas from "../topo-canvas";
import Link from "next/link";

const PAGES = [
  { href: "/",       label: "Landing" },
  { href: "/news",   label: "News"    },
  { href: "/article",label: "Article" },
  { href: "/video",  label: "Video"   },
  { href: "/learn",  label: "Course"  },
];

export default function PageShell({
  children,
  current,
}: {
  children: React.ReactNode;
  current: string;
}) {
  return (
    <div className="relative min-h-screen bg-[#0d0d0d] text-[#d4d0c8] font-sans overflow-x-hidden">
      <TopoCanvas />
      <div className="relative z-10">
        {/* Page switcher */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-white/[0.05] bg-[#0d0d0d]/80 backdrop-blur-sm sticky top-0 z-20">
          <span className="text-[10px] tracking-[0.25em] text-[#c8a96e]/40 uppercase mr-3">TOPOFIED</span>
          {PAGES.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                current === href
                  ? "bg-[#c8a96e]/15 text-[#c8a96e]"
                  : "text-[#4a4840] hover:text-[#8a8880]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
