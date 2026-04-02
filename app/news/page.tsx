import PageShell from "../components/page-shell";

const lead = {
  label: "Breaking",
  headline: "Scientists Map the Deepest Topography of the Ocean Floor With Unprecedented Clarity",
  sub: "A new synthesis of sonar data from 140 research vessels over 12 years produces the most complete picture of underwater terrain ever assembled — revealing mountain ranges taller than the Himalayas, hidden entirely beneath 4km of water.",
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
  {
    label: "Science",
    headline: "Light-Based Sensors Now Detect Subsurface Water on Mars",
    author: "Raj Mehta",
    time: "9h ago",
  },
];

const grid = [
  { label: "Culture",     headline: "Why Museums Are Rebuilding Their Map Collections From Scratch",   author: "Lena Mori",    time: "1d ago" },
  { label: "History",     headline: "The Lost Expedition That First Charted the Antarctic Interior",     author: "Tom Ashby",    time: "1d ago" },
  { label: "Photography", headline: "Aerial Photographers Capture Six Months of Wildfire Erosion",     author: "Caris Bloom",  time: "2d ago" },
  { label: "Research",    headline: "Cave Networks Under the Yucatán May Span 400 Kilometres",          author: "D. Souza",     time: "2d ago" },
  { label: "Design",      headline: "The Designers Bringing Contour Lines Into Living Spaces",          author: "Maya Alvi",    time: "3d ago" },
  { label: "Tech",        headline: "LiDAR Scans Reveal Hidden Temples Beneath Guatemalan Jungle",      author: "Felix Crane",  time: "3d ago" },
];

const opinion = [
  { headline: "We Should Stop Calling It \"Remote\" Land", author: "Ana Lima" },
  { headline: "The Map Projection Wars Are Far From Over", author: "David Cho" },
  { headline: "Terrain as Data: A New Language for Climate Journalism", author: "Yuki Tanaka" },
];

export default function News() {
  return (
    <PageShell current="/news">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Masthead */}
        <div className="text-center py-8 mb-6 border-b border-white/[0.06]">
          <h1 className="text-4xl font-black tracking-tight text-[#e8e4dc]">The Terrain</h1>
          <p className="text-xs text-[#3a3830] tracking-[0.3em] mt-1 uppercase">Geography · Science · Culture · Technology</p>
        </div>

        {/* Lead story + secondary stack */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/[0.05]">

          <article className="lg:col-span-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400/80 mb-3 block">{lead.label}</span>
            <h2 className="text-3xl font-black leading-tight text-[#e8e4dc] mb-4">{lead.headline}</h2>
            <p className="text-[#6a6860] leading-relaxed mb-5 text-base">{lead.sub}</p>
            <div className="flex items-center gap-3 text-xs text-[#3a3830]">
              <span className="text-[#8a8880]">{lead.author}</span>
              <span>·</span>
              <span>{lead.time}</span>
              <span>·</span>
              <span>{lead.readTime}</span>
            </div>
          </article>

          <div className="divide-y divide-white/[0.05]">
            {secondary.map((s) => (
              <article key={s.headline} className="py-5 first:pt-0 last:pb-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c8a96e]/60 mb-2 block">{s.label}</span>
                <h3 className="text-sm font-semibold text-[#d4d0c8] leading-snug mb-2">{s.headline}</h3>
                <p className="text-xs text-[#3a3830]">{s.author} · {s.time}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/[0.05]">
          {grid.map((a) => (
            <article key={a.headline} className="cursor-pointer group">
              {/* Placeholder image */}
              <div className="w-full h-40 rounded-lg bg-white/[0.03] mb-4 border border-white/[0.05]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c8a96e]/60 mb-2 block">{a.label}</span>
              <h3 className="text-sm font-semibold text-[#d4d0c8] leading-snug mb-2 group-hover:text-[#e8e4dc] transition-colors">{a.headline}</h3>
              <p className="text-xs text-[#3a3830]">{a.author} · {a.time}</p>
            </article>
          ))}
        </div>

        {/* Opinion + newsletter row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#6a6860] mb-5">Opinion</h2>
            <div className="divide-y divide-white/[0.05]">
              {opinion.map((o, i) => (
                <article key={o.headline} className="flex items-start gap-4 py-4 first:pt-0">
                  <span className="text-2xl font-black text-[#c8a96e]/20 tabular-nums w-6 shrink-0">{i + 1}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-[#d4d0c8] leading-snug mb-1">{o.headline}</h3>
                    <p className="text-xs text-[#4a4840]">{o.author}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02] flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#e8e4dc] mb-2">The Weekly Contour</h2>
              <p className="text-xs text-[#5a5852] leading-relaxed mb-5">
                Five stories about the physical world, curated every Friday. No noise.
              </p>
            </div>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-[#d4d0c8] placeholder-[#3a3830] outline-none text-xs"
              />
              <button className="w-full py-2.5 rounded-lg bg-[#c8a96e] text-[#0d0d0d] text-xs font-bold hover:bg-[#d4b87e] transition-colors">
                Subscribe free
              </button>
            </div>
          </div>

        </div>

        {/* Footer nav */}
        <footer className="pt-6 border-t border-white/[0.04] flex flex-wrap gap-6 justify-center text-xs text-[#3a3830]">
          {["World","Science","Technology","Climate","Culture","Photography","Podcast","Archive"].map(s => (
            <a key={s} href="#" className="hover:text-[#6a6860] transition-colors">{s}</a>
          ))}
        </footer>

      </div>
    </PageShell>
  );
}
