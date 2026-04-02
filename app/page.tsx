import PageShell from "./components/page-shell";

export default function Home() {
  return (
    <PageShell current="/">
      <div>

        {/* ── Navigation ── */}
        <nav className="flex items-center justify-between px-8 py-5 border-b border-white/[0.06]">
          <span className="text-lg font-bold tracking-widest text-[#c8a96e]">TOPOFIED</span>
          <div className="flex gap-8 text-sm text-[#8a8880]">
            <a href="#features" className="hover:text-[#c8a96e] transition-colors">Features</a>
            <a href="#terrain" className="hover:text-[#c8a96e] transition-colors">Terrain</a>
            <a href="#data" className="hover:text-[#c8a96e] transition-colors">Data</a>
            <a href="#about" className="hover:text-[#c8a96e] transition-colors">About</a>
          </div>
          <button className="px-4 py-2 text-sm rounded border border-[#c8a96e]/40 text-[#c8a96e] hover:bg-[#c8a96e]/10 transition-colors">
            Get Started
          </button>
        </nav>

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center px-8 pt-28 pb-24 gap-6">
          <p className="text-xs tracking-[0.3em] text-[#c8a96e]/70 uppercase">Elevation Intelligence</p>
          <h1 className="text-6xl font-black leading-none tracking-tight max-w-2xl text-[#e8e4dc]">
            Read the Landscape of Every Page
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-[#7a7872]">
            The elements on your page aren&apos;t just content — they&apos;re terrain. Topofied
            maps importance into elevation, letting you see the shape of information at a glance.
          </p>
          <div className="flex gap-4 mt-4">
            <button className="px-7 py-3 rounded-full bg-[#c8a96e] text-[#0d0d0d] font-semibold text-sm hover:bg-[#d4b87e] transition-colors">
              Explore Terrain
            </button>
            <button className="px-7 py-3 rounded-full border border-white/10 text-[#8a8880] text-sm hover:border-white/20 hover:text-[#d4d0c8] transition-colors">
              View Source
            </button>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-8 py-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#e8e4dc] mb-3">
            How the Terrain Forms
          </h2>
          <p className="text-center text-[#5a5852] mb-14 max-w-md mx-auto">
            Each element contributes to the elevation field. The algorithm measures, weighs, and renders.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div className="text-2xl mb-4">◎</div>
              <h3 className="text-lg font-semibold text-[#e8e4dc] mb-2">DOM Measurement</h3>
              <p className="text-sm text-[#5a5852] leading-relaxed">
                After the page loads, every element is measured — its position, size, and tag type
                are all factored into the elevation field calculation.
              </p>
              <button className="mt-4 text-xs text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors">
                Learn more →
              </button>
            </article>

            <article className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div className="text-2xl mb-4">⬡</div>
              <h3 className="text-lg font-semibold text-[#e8e4dc] mb-2">Gaussian Hills</h3>
              <p className="text-sm text-[#5a5852] leading-relaxed">
                Each element radiates a Gaussian elevation peak. Headings rise high, paragraphs
                form gentle ridges, and buttons create sharp local summits.
              </p>
              <button className="mt-4 text-xs text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors">
                Learn more →
              </button>
            </article>

            <article className="p-6 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div className="text-2xl mb-4">∿</div>
              <h3 className="text-lg font-semibold text-[#e8e4dc] mb-2">Marching Squares</h3>
              <p className="text-sm text-[#5a5852] leading-relaxed">
                Contour lines are extracted at 16 elevation thresholds using the marching squares
                algorithm, producing smooth isolines across the terrain.
              </p>
              <button className="mt-4 text-xs text-[#c8a96e]/70 hover:text-[#c8a96e] transition-colors">
                Learn more →
              </button>
            </article>
          </div>
        </section>

        {/* ── Stats ── */}
        <section id="terrain" className="px-8 py-16 border-y border-white/[0.05]">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-black text-[#c8a96e]">16</p>
              <p className="text-xs text-[#5a5852] mt-1 uppercase tracking-wider">Contour Levels</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#c8a96e]">5px</p>
              <p className="text-xs text-[#5a5852] mt-1 uppercase tracking-wider">Grid Resolution</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#c8a96e]">30+</p>
              <p className="text-xs text-[#5a5852] mt-1 uppercase tracking-wider">Tag Weights</p>
            </div>
            <div>
              <p className="text-4xl font-black text-[#c8a96e]">0ms</p>
              <p className="text-xs text-[#5a5852] mt-1 uppercase tracking-wider">Added Latency</p>
            </div>
          </div>
        </section>

        {/* ── Elevation Table ── */}
        <section id="data" className="px-8 py-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#e8e4dc] mb-3">Elevation Index</h2>
          <p className="text-[#5a5852] mb-10 max-w-lg">
            The importance weighting system assigns each HTML tag a relative elevation score.
            Higher scores produce taller peaks and tighter contour rings.
          </p>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-[#8a8880] font-medium">Element</th>
                <th className="text-left py-3 text-[#8a8880] font-medium">Tag</th>
                <th className="text-right py-3 text-[#8a8880] font-medium">Elevation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[
                ["Page Title", "h1", 100],
                ["Section Heading", "h2", 85],
                ["Card Heading", "h3", 70],
                ["Button", "button", 78],
                ["Image", "img", 65],
                ["Navigation", "nav", 58],
                ["Link", "a", 52],
                ["Paragraph", "p", 24],
                ["List Item", "li", 16],
              ].map(([name, tag, score]) => (
                <tr key={String(tag)} className="hover:bg-white/[0.015] transition-colors">
                  <td className="py-3 text-[#d4d0c8]">{name}</td>
                  <td className="py-3">
                    <code className="text-xs bg-white/[0.06] px-2 py-1 rounded text-[#c8a96e]/80">
                      &lt;{tag}&gt;
                    </code>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-[#c8a96e] font-mono font-semibold">{score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── About / Text section ── */}
        <section id="about" className="px-8 py-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#e8e4dc] mb-6">Why Topology?</h2>

          <p className="text-[#6a6860] leading-relaxed mb-4">
            Topographic maps were invented to represent three-dimensional terrain on a flat surface.
            The same principle applies to information architecture — some things rise above others,
            demand attention, and create natural focal points in a composition.
          </p>

          <p className="text-[#6a6860] leading-relaxed mb-4">
            This project asks: what if we could <em className="text-[#c8a96e] not-italic">see</em> the
            informational landscape of a webpage the same way we see a mountain range? The canvas
            overlay renders after DOM layout is complete, using element bounding rects and semantic
            tag weights to construct a continuous elevation field.
          </p>

          <p className="text-[#6a6860] leading-relaxed mb-8">
            The result is a living topo map — one that changes completely when you change the page.
            Add an h1 and watch a mountain appear. Remove a section and the valley fills in.
            Every design decision has a geographic consequence.
          </p>

          <blockquote className="border-l-2 border-[#c8a96e]/40 pl-6 my-8">
            <p className="text-[#8a8880] italic leading-relaxed">
              &ldquo;Information has shape. Topology makes that shape legible.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── CTA ── */}
        <section className="px-8 py-24 text-center">
          <h2 className="text-4xl font-black text-[#e8e4dc] mb-4">
            Map Your Own Terrain
          </h2>
          <p className="text-[#5a5852] mb-10 max-w-md mx-auto">
            Drop the component into any Next.js app and watch your page reveal its hidden geography.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <input
              type="email"
              placeholder="your@email.com"
              className="px-5 py-3 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm text-[#d4d0c8] placeholder-[#4a4840] outline-none focus:border-[#c8a96e]/40 w-64"
            />
            <button className="px-6 py-3 rounded-full bg-[#c8a96e] text-[#0d0d0d] font-semibold text-sm hover:bg-[#d4b87e] transition-colors">
              Notify Me
            </button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="px-8 py-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#3a3830]">
          <span className="font-bold tracking-widest text-[#c8a96e]/40">TOPOFIED</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#6a6860] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[#6a6860] transition-colors">Docs</a>
            <a href="#" className="hover:text-[#6a6860] transition-colors">License</a>
          </div>
          <span>Elevation rendered client-side · No data collected</span>
        </footer>

      </div>
    </PageShell>
  );
}
