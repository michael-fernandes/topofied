import PageShell from "./components/page-shell";

export default function Home() {
  return (
    <PageShell current="/">
      <div>

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center px-12 pt-44 pb-40 gap-8">
          <h1 className="text-4xl font-black leading-none tracking-tight max-w-2xl text-[#e8e8e8]">
            Read the Landscape of Every Page
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-[#787878]">
            Topofied maps importance into elevation, letting you see the
            shape of information at a glance.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="font-mono px-7 py-3 text-[11px] uppercase tracking-[0.2em] bg-[#d0d0d0] text-[#000000] hover:bg-white transition-colors">
              Explore Terrain
            </button>
            <button className="font-mono px-7 py-3 text-[11px] uppercase tracking-[0.2em] border border-white/15 text-[#a0a0a0] hover:border-white/35 hover:text-[#e8e8e8] transition-colors">
              View Source
            </button>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="mx-24 py-24 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-[#e8e8e8] mb-12">
            How the Terrain Forms
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <article className="p-8">
              <h3 className="text-lg font-semibold text-[#e8e8e8] mb-3">DOM Measurement</h3>
              <p className="text-sm text-[#686868] leading-relaxed">
                Every element is measured — position, size, and tag type
                feed the elevation field.
              </p>
            </article>

            <article className="p-8">
              <h3 className="text-lg font-semibold text-[#e8e8e8] mb-3">Distance Field</h3>
              <p className="text-sm text-[#686868] leading-relaxed">
                Contour lines flow around content, tracing equal-distance
                paths like water between islands.
              </p>
            </article>

            <article className="p-8">
              <h3 className="text-lg font-semibold text-[#e8e8e8] mb-3">Marching Squares</h3>
              <p className="text-sm text-[#686868] leading-relaxed">
                Smooth isolines extracted at 32 thresholds using the
                classic marching squares algorithm.
              </p>
            </article>
          </div>
        </section>

        {/* ── About ── */}
        <section id="about" className="px-12 py-32 max-w-2xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#a0a0a0]/50 uppercase mb-3">
            § 02 · Reasoning
          </p>
          <h2 className="text-3xl font-bold text-[#e8e8e8] mb-10">Why Topology?</h2>

          <p className="text-[#787878] leading-relaxed mb-8">
            Topographic maps represent three-dimensional terrain on a flat surface.
            The same principle applies to information architecture — some things rise
            above others, demand attention, and create natural focal points.
          </p>

          <p className="text-[#787878] leading-relaxed mb-12">
            What if we could <em className="text-[#d0d0d0] not-italic">see</em> the
            informational landscape of a webpage the same way we see a mountain range?
            Every design decision has a geographic consequence.
          </p>

          <blockquote className="border-l border-[#a0a0a0]/30 pl-8 my-16">
            <p className="text-[#a0a0a0] italic leading-relaxed text-lg">
              &ldquo;Information has shape. Topology makes that shape legible.&rdquo;
            </p>
          </blockquote>
        </section>

      </div>
    </PageShell>
  );
}
