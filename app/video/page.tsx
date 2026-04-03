import PageShell from "../components/page-shell";

const featured = {
  title: "The Entire History of Cartography in 90 Minutes",
  channel: "Map & Territory",
  views: "2.4M views",
  time: "3 days ago",
  duration: "1:32:14",
  desc: "From Ptolemy's world map to satellite composites — a complete history of how humans have pictured the planet. Covers projections, politics, colonial cartography, and the GPS era.",
  hue: 200,
};

const queue = [
  { title: "Why No World Map Is Correct",               channel: "Vox",            views: "18M views",  duration: "5:45",   hue: 40  },
  { title: "Mapping the Moon: Apollo's Cartographers",  channel: "NASA Goddard",   views: "4.1M views", duration: "22:08",  hue: 220 },
  { title: "The Biggest Lie on Maps",                   channel: "RealLifeLore",   views: "31M views",  duration: "8:12",   hue: 160 },
  { title: "How Google Maps Knows About Traffic",       channel: "Wendover",       views: "9.8M views", duration: "14:55",  hue: 290 },
];

const recommended = [
  { title: "Contour Lines Explained",                      channel: "Ordnance Survey",  views: "820K",   duration: "7:33",  hue: 100 },
  { title: "Inside the World's Most Detailed Atlas",       channel: "GeoFile",          views: "1.2M",   duration: "18:40", hue: 30  },
  { title: "Why Antarctica Looks Huge on Every Map",       channel: "RealLifeLore",     views: "22M",    duration: "11:06", hue: 180 },
  { title: "The Last Blank Spaces on Earth",               channel: "Verge Science",    views: "5.6M",   duration: "16:28", hue: 260 },
  { title: "How Medieval Maps Showed the Known World",     channel: "History Hit",      views: "3.3M",   duration: "24:55", hue: 50  },
  { title: "Terrain Modelling With Lidar Data",            channel: "ESRI",             views: "440K",   duration: "31:12", hue: 140 },
  { title: "Mapping Earthquakes in Real Time",             channel: "USGS",             views: "2.1M",   duration: "9:44",  hue: 320 },
  { title: "The Ocean Floor Is Mostly Unmapped",           channel: "Seeker",           views: "7.8M",   duration: "6:58",  hue: 200 },
];

export default function Video() {
  return (
    <PageShell current="/video">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Search bar */}
        <div className="flex gap-3 mb-10 max-w-xl">
          <input
            type="search"
            placeholder="Search videos…"
            className="flex-1 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm text-[#d0d0d0] placeholder-[#383838] outline-none focus:border-[#a0a0a0]/30 transition-colors"
          />
          <button className="px-5 py-2.5 rounded-full border border-white/[0.08] text-xs text-[#686868] hover:text-[#888888] transition-colors">
            Search
          </button>
        </div>

        {/* Featured player + queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

          {/* Player area */}
          <div className="lg:col-span-2">
            <div
              className="w-full aspect-video rounded-xl mb-4 flex items-end relative overflow-hidden"
              style={{ background: `hsla(${featured.hue}, 20%, 10%, 1)` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 40% 60%, hsla(${featured.hue}, 50%, 25%, 0.3) 0%, transparent 65%)`,
                }}
              />
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {featured.duration}
              </div>
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white/70 text-xl ml-1">▶</span>
                </div>
              </div>
            </div>
            <h1 className="text-xl font-bold text-[#e8e8e8] mb-2 leading-snug">{featured.title}</h1>
            <div className="flex items-center gap-3 mb-4 text-xs text-[#484848]">
              <span className="text-[#888888] font-medium">{featured.channel}</span>
              <span>·</span>
              <span>{featured.views}</span>
              <span>·</span>
              <span>{featured.time}</span>
            </div>
            <p className="text-sm text-[#585858] leading-relaxed mb-4 border-l border-white/[0.07] pl-4">
              {featured.desc}
            </p>
            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-full bg-[#a0a0a0] text-[#000000] text-xs font-semibold hover:bg-[#b8b8b8] transition-colors">
                ▶ Watch now
              </button>
              <button className="px-5 py-2 rounded-full border border-white/[0.08] text-xs text-[#686868] hover:text-[#888888] transition-colors">
                + Save
              </button>
              <button className="px-5 py-2 rounded-full border border-white/[0.08] text-xs text-[#686868] hover:text-[#888888] transition-colors">
                Share
              </button>
            </div>
          </div>

          {/* Queue */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#484848] mb-4">Up next</h2>
            <div className="space-y-4">
              {queue.map((v) => (
                <article key={v.title} className="flex gap-3 cursor-pointer group">
                  <div
                    className="w-28 aspect-video rounded-lg shrink-0 relative overflow-hidden"
                    style={{ background: `hsla(${v.hue}, 18%, 11%, 1)` }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: `radial-gradient(circle at 50% 50%, hsla(${v.hue}, 40%, 30%, 0.2) 0%, transparent 70%)` }}
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                      {v.duration}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-[#d0d0d0] leading-snug mb-1 line-clamp-2 group-hover:text-[#e8e8e8] transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-[10px] text-[#484848]">{v.channel}</p>
                    <p className="text-[10px] text-[#383838]">{v.views}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended grid */}
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#484848] mb-6">Recommended</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {recommended.map((v) => (
            <article key={v.title} className="cursor-pointer group">
              <div
                className="w-full aspect-video rounded-lg mb-3 relative overflow-hidden"
                style={{ background: `hsla(${v.hue}, 18%, 11%, 1)` }}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(circle at 40% 55%, hsla(${v.hue}, 45%, 28%, 0.25) 0%, transparent 65%)` }}
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 rounded">
                  {v.duration}
                </span>
              </div>
              <h3 className="text-xs font-semibold text-[#c0c0c0] leading-snug mb-1 group-hover:text-[#e8e8e8] transition-colors line-clamp-2">
                {v.title}
              </h3>
              <p className="text-[10px] text-[#484848]">{v.channel}</p>
              <p className="text-[10px] text-[#383838]">{v.views}</p>
            </article>
          ))}
        </div>

      </div>
    </PageShell>
  );
}
