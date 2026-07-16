import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../../components/page-shell";
import TopoHero from "../../components/topo-hero";
import { INK, DIM, FAINT, ACCENT, Eyebrow } from "../../components/kit";
import InteractiveDots from "../../components/interactive-dots";

export const metadata: Metadata = {
  title: "Simulation",
  description:
    "A force-simulated cluster of dots that scatters away from the pointer, built with d3 and ported from an Observable collision-detection example.",
  alternates: { canonical: "/projects/interactive-dots" },
  openGraph: {
    title: "Simulation — Michael Fernandes",
    description: "A force-simulated cluster of dots that scatters away from the pointer.",
    url: "/projects/interactive-dots",
  },
};

export default function InteractiveDotsPage() {
  return (
    <PageShell current="/work" seed="interactive-dots">
      <TopoHero height={280}>
        <div
          data-topo-id="project"
          data-topo-hover-id="project"
          data-topo-important=""
          data-topo-height="80"
          data-topo-falloff="110"
          style={{ position: "absolute", left: 20, right: 20, top: 100, padding: 4 }}
          className="md:left-[60px] md:right-[60px]"
        >
          <Eyebrow style={{ marginBottom: 16 }}>Small project</Eyebrow>
          <h1
            className="font-medium m-0"
            style={{
              fontSize: "clamp(18px, 1.8vw, 24px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: INK,
              maxWidth: 640,
              textWrap: "balance",
            }}
          >
            Simulation
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, marginTop: 14, maxWidth: 520, textWrap: "pretty" }}>
            A force-simulated cluster of dots that scatters away from the pointer. Ported from{" "}
            <a
              href="https://observablehq.com/@d3/collision-detection/2"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: INK }}
            >
              d3&apos;s collision-detection example
            </a>
            .
          </p>
        </div>
      </TopoHero>

      <section className="px-page" style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div style={{ border: `1px solid ${FAINT}`, background: "#1f1a16", overflow: "hidden" }}>
          <InteractiveDots />
        </div>
      </section>

      {/* ── Footer nav ── */}
      <section
        className="px-page flex items-center justify-between"
        style={{ paddingTop: 24, paddingBottom: 36, borderTop: `1px solid ${FAINT}` }}
      >
        <Link
          href="/work"
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: DIM, textDecoration: "none", borderBottom: `1px solid ${FAINT}`, paddingBottom: 3 }}
        >
          ← All work
        </Link>
        <a
          href="mailto:m.fern93@gmail.com"
          className="font-mono uppercase"
          style={{ fontSize: 10, letterSpacing: "0.22em", color: INK, textDecoration: "none", borderBottom: `1px solid ${ACCENT}`, paddingBottom: 3 }}
        >
          Get in touch →
        </a>
      </section>
    </PageShell>
  );
}
