import PageShell from "./components/page-shell";

export default function Home() {
  return (
    <PageShell current="/">
      <div>

        {/* ── Navigation ── */}
        <nav className="flex items-center justify-between px-12 py-8 border-b border-white/[0.06]">
          <span className="text-lg font-bold tracking-widest text-[#a0a0a0]">TOPOFIED</span>
          <div className="flex gap-10 text-sm text-[#888888]">
            <a href="#features" className="hover:text-[#a0a0a0] transition-colors">Features</a>
            <a href="#about" className="hover:text-[#a0a0a0] transition-colors">About</a>
          </div>
          <button className="px-4 py-2 text-sm rounded border border-[#a0a0a0]/40 text-[#a0a0a0] hover:bg-[#a0a0a0]/10 transition-colors">
            Get Started
          </button>
        </nav>

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center px-12 pt-44 pb-40 gap-8">
          <p className="text-xs tracking-[0.3em] text-[#a0a0a0]/70 uppercase">Elevation Intelligence</p>
          <h1 className="text-6xl font-black leading-none tracking-tight max-w-2xl text-[#e8e8e8]">
            Read the Landscape of Every Page
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-[#787878]">
            Topofied maps importance into elevation, letting you see the
            shape of information at a glance.
          </p>
          <div className="flex gap-5 mt-6">
            <button className="px-7 py-3 rounded-full bg-[#a0a0a0] text-[#000000] font-semibold text-sm hover:bg-[#b8b8b8] transition-colors">
              Explore Terrain
            </button>
            <button className="px-7 py-3 rounded-full border border-white/10 text-[#888888] text-sm hover:border-white/20 hover:text-[#d0d0d0] transition-colors">
              View Source
            </button>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-12 py-32 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#e8e8e8] mb-20">
            How the Terrain Forms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <article className="p-8 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div className="text-2xl mb-6">◎</div>
              <h3 className="text-lg font-semibold text-[#e8e8e8] mb-3">DOM Measurement</h3>
              <p className="text-sm text-[#585858] leading-relaxed">
                Every element is measured — position, size, and tag type
                feed the elevation field.
              </p>
            </article>

            <article className="p-8 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div className="text-2xl mb-6">⬡</div>
              <h3 className="text-lg font-semibold text-[#e8e8e8] mb-3">Distance Field</h3>
              <p className="text-sm text-[#585858] leading-relaxed">
                Contour lines flow around content, tracing equal-distance
                paths like water between islands.
              </p>
            </article>

            <article className="p-8 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div className="text-2xl mb-6">∿</div>
              <h3 className="text-lg font-semibold text-[#e8e8e8] mb-3">Marching Squares</h3>
              <p className="text-sm text-[#585858] leading-relaxed">
                Smooth isolines extracted at 28 thresholds using the
                classic marching squares algorithm.
              </p>
            </article>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="px-12 py-32 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#e8e8e8] mb-10">Why Topology?</h2>

          <p className="text-[#686868] leading-relaxed mb-8">
            Topographic maps represent three-dimensional terrain on a flat surface.
            The same principle applies to information architecture — some things rise
            above others, demand attention, and create natural focal points.
          </p>

          <p className="text-[#686868] leading-relaxed mb-12">
            What if we could <em className="text-[#a0a0a0] not-italic">see</em> the
            informational landscape of a webpage the same way we see a mountain range?
            Every design decision has a geographic consequence.
          </p>

          <blockquote className="border-l-2 border-[#a0a0a0]/40 pl-8 my-16">
            <p className="text-[#888888] italic leading-relaxed text-lg">
              &ldquo;Information has shape. Topology makes that shape legible.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── Footer ── */}
        <footer className="px-12 py-16 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#383838]">
          <span className="font-bold tracking-widest text-[#a0a0a0]/40">TOPOFIED</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#686868] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[#686868] transition-colors">Docs</a>
          </div>
        </footer>

      </div>
    </PageShell>
  );
}
