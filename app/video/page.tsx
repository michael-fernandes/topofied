import PageShell from "../components/page-shell";

const featured = {
  title: "The Entire History of Cartography in 90 Minutes",
  channel: "Map & Territory",
  views: "2.4M views",
  time: "3 days ago",
  duration: "1:32:14",
  desc: "From Ptolemy's world map to satellite composites — a complete history of how humans have pictured the planet.",
  hue: 200,
};

const queue = [
  { title: "Why No World Map Is Correct",               channel: "Vox",          views: "18M views",  duration: "5:45",  hue: 40  },
  { title: "Mapping the Moon: Apollo's Cartographers",  channel: "NASA Goddard", views: "4.1M views", duration: "22:08", hue: 220 },
];

const recommended = [
  { title: "Contour Lines Explained",                 channel: "Ordnance Survey", views: "820K",  duration: "7:33",  hue: 100 },
  { title: "Why Antarctica Looks Huge on Every Map",  channel: "RealLifeLore",    views: "22M",   duration: "11:06", hue: 180 },
  { title: "Terrain Modelling With Lidar Data",       channel: "ESRI",            views: "440K",  duration: "31:12", hue: 140 },
  { title: "The Ocean Floor Is Mostly Unmapped",      channel: "Seeker",          views: "7.8M",  duration: "6:58",  hue: 200 },
];

export default function Video() {
  return (
    <PageShell current="/video">
      <div className="max-w-6xl mx-auto px-12 py-16">

        {/* Search */}
        <div className="flex gap-3 mb-16 max-w-md">
          <input
            type="search"
            placeholder="Search videos…"
            className="flex-1 px-5 py-2.5 rounded-full bg-[#ebe2d4]/[0.03] border border-[#5a4f43]/30 text-sm text-[#ebe2d4] placeholder-[#383838] outline-none focus:border-[#5a4f43] transition-colors"
          />
          <button className="px-5 py-2.5 rounded-full border border-[#5a4f43]/30 text-xs text-[#a89a86] hover:text-[#ebe2d4] transition-colors">
            Search
          </button>
        </div>

        {/* Featured + queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">

          {/* Player */}
          <div className="lg:col-span-2">
            <div
              className="w-full aspect-video rounded-xl mb-6 flex items-end relative overflow-hidden"
              style={{ background: `hsla(${featured.hue}, 20%, 10%, 1)` }}
            >
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(ellipse at 40% 60%, hsla(${featured.hue}, 50%, 25%, 0.3) 0%, transparent 65%)` }}
              />
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {featured.duration}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white/70 text-xl ml-1">▶</span>
                </div>
              </div>
            </div>
            <h1 className="text-xl font-bold text-[#ebe2d4] mb-3 leading-snug">{featured.title}</h1>
            <div className="flex items-center gap-3 mb-5 text-xs text-[#5a4f43]">
              <span className="text-[#ebe2d4] font-medium">{featured.channel}</span>
              <span>·</span>
              <span>{featured.views}</span>
              <span>·</span>
              <span>{featured.time}</span>
            </div>
            <p className="text-sm text-[#a89a86] leading-relaxed mb-6 border-l border-[#5a4f43]/30 pl-4">
              {featured.desc}
            </p>
            <button className="px-5 py-2 rounded-full bg-[#ebe2d4] text-[#1f1a16] text-xs font-semibold hover:bg-[hsl(24_22%_70%)] transition-colors">
              ▶ Watch now
            </button>
          </div>

          {/* Queue */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#5a4f43] mb-6">Up next</h2>
            <div className="space-y-8">
              {queue.map((v) => (
                <article key={v.title} className="flex gap-4 cursor-pointer group">
                  <div
                    className="w-32 aspect-video rounded-lg shrink-0 relative overflow-hidden"
                    style={{ background: `hsla(${v.hue}, 18%, 11%, 1)` }}
                  >
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                      {v.duration}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-[#ebe2d4] leading-snug mb-2 group-hover:text-[#ebe2d4] transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-[10px] text-[#5a4f43]">{v.channel}</p>
                    <p className="text-[10px] text-[#5a4f43]">{v.views}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#5a4f43] mb-10">Recommended</h2>
        <div className="grid grid-cols-2 gap-12">
          {recommended.map((v) => (
            <article key={v.title} className="cursor-pointer group">
              <div
                className="w-full aspect-video rounded-lg mb-4 relative overflow-hidden"
                style={{ background: `hsla(${v.hue}, 18%, 11%, 1)` }}
              >
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                  {v.duration}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-[#ebe2d4] leading-snug mb-2 group-hover:text-[#ebe2d4] transition-colors">
                {v.title}
              </h3>
              <p className="text-[10px] text-[#5a4f43]">{v.channel}</p>
            </article>
          ))}
        </div>

      </div>
    </PageShell>
  );
}
