import PageShell from "../components/page-shell";

export default function Article() {
  return (
    <PageShell current="/article">
      <div className="max-w-3xl mx-auto px-8 py-16">

        {/* Metadata */}
        <div className="flex items-center gap-3 mb-8 text-xs text-[#5a4f43]">
          <span className="px-2 py-1 rounded bg-[#ebe2d4]/[0.03] text-[#a89a86]/70">Cartography</span>
          <span>March 18, 2026</span>
          <span>·</span>
          <span>9 min read</span>
        </div>

        <h1 className="text-5xl font-black leading-tight text-[#ebe2d4] mb-6 tracking-tight">
          The Hidden Shape of Information: What Topographic Thinking Reveals About Design
        </h1>

        <p className="text-xl text-[#a89a86] leading-relaxed mb-10 border-l-2 border-[#5a4f43] pl-6">
          Every interface has topography. Most designers never see it. The ones who do
          build things that feel inevitable.
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mb-12 pb-8 border-b border-[#5a4f43]/30">
          <div className="w-9 h-9 rounded-full bg-[#ebe2d4]/20 flex items-center justify-center text-xs text-[#a89a86]">
            MK
          </div>
          <div>
            <p className="text-sm text-[#ebe2d4] font-medium">Mira Kessler</p>
            <p className="text-xs text-[#5a4f43]">Design Systems · Cartography</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#ebe2d4] mb-4">The Elevation Problem</h2>

        <p className="text-[#a89a86] leading-relaxed mb-5">
          In the summer of 1854, a physician named John Snow plotted cholera deaths on a map of London&apos;s
          Soho district. The clustering — the topography of disease — pointed directly to a contaminated
          water pump on Broad Street. The map didn&apos;t just represent data. It made the invisible
          visible by giving it shape.
        </p>

        <p className="text-[#a89a86] leading-relaxed mb-5">
          Modern web interfaces have a similar problem: they contain enormous amounts of information
          arranged according to invisible hierarchies. A heading matters more than a caption. A call-to-action
          outweighs a footer link. But these relative weights are never rendered — they exist only as
          assumptions embedded in font sizes, whitespace, and colour.
        </p>

        <p className="text-[#a89a86] leading-relaxed mb-10">
          What if we made that hierarchy literal? What if every element cast a shadow of importance
          across the canvas, and those shadows accumulated into terrain?
        </p>

        <h2 className="text-2xl font-bold text-[#ebe2d4] mb-4">How Contour Lines Work</h2>

        <p className="text-[#a89a86] leading-relaxed mb-5">
          A topographic contour line connects all points at equal elevation. The closer the lines,
          the steeper the gradient. Wide spacing means gentle terrain; tight rings mean a sharp peak.
          A trained eye reads contour maps the way a musician reads sheet music — fluently, instinctively,
          extracting three-dimensional structure from flat marks on paper.
        </p>

        <blockquote className="border-l-2 border-[#5a4f43] pl-6 my-8">
          <p className="text-[#a89a86] italic leading-relaxed text-lg">
            &ldquo;The map is not the territory, but a good map reveals the territory&apos;s
            structure in ways direct observation never could.&rdquo;
          </p>
          <cite className="text-xs text-[#5a4f43] mt-3 block not-italic">— Alfred Korzybski, paraphrased</cite>
        </blockquote>

        <p className="text-[#a89a86] leading-relaxed mb-5">
          The marching squares algorithm, developed by Lorensen and Cline in 1987, provides a
          systematic method for extracting these lines from a scalar field. For every 2×2 grid cell,
          it classifies each corner as inside or outside the current elevation threshold, then
          draws line segments through the cell accordingly. Sixteen cases, all precomputed.
          Applied at 28 threshold levels, it produces a full contour map from any height field.
        </p>

        <h2 className="text-2xl font-bold text-[#ebe2d4] mb-4">Semantic Weight as Elevation</h2>

        <p className="text-[#a89a86] leading-relaxed mb-5">
          The key insight is that HTML already encodes a partial importance hierarchy. A
          <code className="text-[#a89a86]/80 bg-[#ebe2d4]/[0.03] px-1.5 py-0.5 rounded mx-1 text-xs">&lt;h1&gt;</code>
          outranks
          <code className="text-[#a89a86]/80 bg-[#ebe2d4]/[0.03] px-1.5 py-0.5 rounded mx-1 text-xs">&lt;h2&gt;</code>,
          which outranks
          <code className="text-[#a89a86]/80 bg-[#ebe2d4]/[0.03] px-1.5 py-0.5 rounded mx-1 text-xs">&lt;p&gt;</code>.
          Interactive elements — buttons, links, inputs — carry higher attentional weight than passive containers.
          Images and media interrupt the reading flow in ways that text alone does not.
        </p>

        <p className="text-[#a89a86] leading-relaxed mb-5">
          Assigning numeric elevation scores to each tag type, then placing a Gaussian
          &ldquo;hill&rdquo; at each element&apos;s centre with amplitude proportional to its score
          and spread proportional to its physical size, converts a DOM tree into a continuous
          scalar field. Contour lines extracted from that field become a literal map of the
          page&apos;s information architecture.
        </p>

        <h2 className="text-2xl font-bold text-[#ebe2d4] mb-4">What You See When You Look</h2>

        <p className="text-[#a89a86] leading-relaxed mb-5">
          The pattern is immediately legible once you know what to look for. A page with a strong
          single-column hierarchy — one dominant heading, supporting subheadings, body text —
          produces a mountain range running down the centre. An e-commerce grid of equal-weight
          product cards produces a regular constellation of identical peaks, like a volcanic
          island chain seen from orbit.
        </p>

        <p className="text-[#a89a86] leading-relaxed mb-5">
          A form page is perhaps the most interesting. Input fields, labels, and a submit button
          create a tight cluster of moderate-elevation peaks surrounded by near-flat plains.
          The submit button usually rises highest — its importance score outpaces its small physical
          size. You can see, quite literally, where the form is trying to take you.
        </p>

        <p className="text-[#a89a86] leading-relaxed mb-10">
          None of this requires machine learning, user research, or eye-tracking. It requires
          only a weighted DOM traversal, a 5-pixel grid, and the marching squares algorithm running
          at page load. The terrain renders in under 50ms on most modern hardware.
        </p>

        <h2 className="text-2xl font-bold text-[#ebe2d4] mb-4">Further Reading</h2>

        <ul className="space-y-2 mb-10">
          {[
            "Marching Squares, Lorensen & Cline (1987)",
            "Semiology of Graphics, Jacques Bertin (1967)",
            "The Visual Display of Quantitative Information, Edward Tufte (1983)",
            "Information Architecture for the World Wide Web, Morville & Rosenfeld",
          ].map((ref) => (
            <li key={ref} className="text-sm text-[#a89a86] flex items-start gap-2">
              <span className="text-[#a89a86]/40 mt-0.5">▸</span>
              <a href="#" className="hover:text-[#a89a86]/70 transition-colors">{ref}</a>
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-8 border-t border-[#5a4f43]/30">
          {["Cartography", "Information Design", "DOM", "Marching Squares", "Data Visualization"].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full border border-[#5a4f43]/30 text-xs text-[#a89a86]">
              {tag}
            </span>
          ))}
        </div>

      </div>
    </PageShell>
  );
}
