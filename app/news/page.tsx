import PageShell from "../components/page-shell";

const lead = {
  label: "Breaking",
  headline: "Scientists Map the Deepest Topography of the Ocean Floor With Unprecedented Clarity",
  sub: "A new synthesis of sonar data from 140 research vessels produces the most complete picture of underwater terrain ever assembled.",
  author: "Elena Vasquez",
  time: "2h ago",
  readTime: "8 min read",
};

const secondary = [
  {
    label: "Technology",
    headline: "The Algorithm That Reads Cities From Satellite Images",
    author: "James Okoro",
    time: "4h ago",
  },
  {
    label: "Climate",
    headline: "Glacial Retreat Is Rewriting Maps Faster Than Cartographers Can Keep Up",
    author: "Nina Petrov",
    time: "6h ago",
  },
];

const grid = [
  { label: "Culture",  headline: "Why Museums Are Rebuilding Their Map Collections",             author: "Lena Mori",   time: "1d ago" },
  { label: "History",  headline: "The Lost Expedition That First Charted the Antarctic Interior", author: "Tom Ashby",   time: "1d ago" },
  { label: "Research", headline: "Cave Networks Under the Yucatán May Span 400 Kilometres",       author: "D. Souza",    time: "2d ago" },
  { label: "Tech",     headline: "LiDAR Scans Reveal Hidden Temples Beneath Guatemalan Jungle",   author: "Felix Crane", time: "3d ago" },
];

export default function News() {
  return (
    <PageShell current="/news">
      <div className="max-w-6xl mx-auto px-12 py-16">

        {/* Masthead */}
        <div className="text-center py-12 mb-12 border-b border-white/[0.06]">
          <h1 className="text-4xl font-black tracking-tight text-[#e8e8e8]">The Terrain</h1>
          <p className="text-xs text-[#383838] tracking-[0.3em] mt-2 uppercase">Geography · Science · Culture</p>
        </div>

        {/* Lead story + secondary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20 pb-20 border-b border-white/[0.05]">

          <article className="lg:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400/80 mb-4 block">{lead.label}</span>
            <h2 className="text-3xl font-black leading-tight text-[#e8e8e8] mb-6">{lead.headline}</h2>
            <p className="text-[#686868] leading-relaxed mb-6 text-base">{lead.sub}</p>
            <div className="flex items-center gap-3 text-xs text-[#383838]">
              <span className="text-[#888888]">{lead.author}</span>
              <span>·</span>
              <span>{lead.time}</span>
              <span>·</span>
              <span>{lead.readTime}</span>
            </div>
          </article>

          <div className="space-y-10">
            {secondary.map((s) => (
              <article key={s.headline}>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]/60 mb-3 block">{s.label}</span>
                <h3 className="text-sm font-semibold text-[#d0d0d0] leading-snug mb-3">{s.headline}</h3>
                <p className="text-xs text-[#383838]">{s.author} · {s.time}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 mb-20 pb-20 border-b border-white/[0.05]">
          {grid.map((a) => (
            <article key={a.headline} className="cursor-pointer group">
              <div className="w-full h-44 rounded-lg bg-white/[0.03] mb-6 border border-white/[0.05]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]/60 mb-3 block">{a.label}</span>
              <h3 className="text-sm font-semibold text-[#d0d0d0] leading-snug mb-3 group-hover:text-[#e8e8e8] transition-colors">{a.headline}</h3>
              <p className="text-xs text-[#383838]">{a.author} · {a.time}</p>
            </article>
          ))}
        </div>

        {/* Newsletter */}
        <div className="max-w-sm mx-auto text-center py-12">
          <h2 className="text-sm font-bold text-[#e8e8e8] mb-3">The Weekly Contour</h2>
          <p className="text-xs text-[#585858] leading-relaxed mb-8">
            Five stories about the physical world, curated every Friday.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#d0d0d0] placeholder-[#383838] outline-none text-xs"
            />
            <button className="w-full py-2.5 rounded-lg bg-[#a0a0a0] text-[#000000] text-xs font-bold hover:bg-[#b8b8b8] transition-colors">
              Subscribe free
            </button>
          </div>
        </div>

      </div>
    </PageShell>
  );
}
