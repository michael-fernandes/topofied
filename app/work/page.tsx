import Link from "next/link";
import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";
import ProjectCard, { type Project } from "../components/project-card";
import {
  INK,
  DIM,
  FAINT,
  CARD_BG,
  Eyebrow,
  SectionHeader,
  Placeholder,
} from "../components/kit";

const FEATURED = [
  { id: "project-1", name: "Project 01", note: "Short placeholder description of the first major project." },
  { id: "project-2", name: "Project 02", note: "Short placeholder description of the second major project." },
];

const ONE_OFFS: Project[] = [
  { id: "project-3", name: "Project 03", year: "—", note: "Placeholder one-off.", hue: 92, sat: 18 },
  { id: "project-4", name: "Project 04", year: "—", note: "Placeholder one-off.", hue: 24, sat: 22 },
  { id: "project-5", name: "Project 05", year: "—", note: "Placeholder one-off.", hue: 232, sat: 18 },
  { id: "project-6", name: "Project 06", year: "—", note: "Placeholder one-off.", hue: 190, sat: 16 },
  { id: "project-7", name: "Project 07", year: "—", note: "Placeholder one-off.", hue: 48, sat: 18 },
  { id: "project-8", name: "Project 08", year: "—", note: "Placeholder one-off.", hue: 320, sat: 14 },
];

export default function WorkPage() {
  return (
    <PageShell current="/work" seed="work-hero">
      <TopoHero height={340}>
        <div
          data-topo-id="work"
          data-topo-hover-id="work"
          data-topo-important=""
          data-topo-height="80"
          data-topo-falloff="120"
          style={{ position: "absolute", left: 20, right: 20, top: 130, padding: 4 }}
          className="md:left-[60px] md:right-[60px]"
        >
          <Eyebrow style={{ marginBottom: 16 }}>Work</Eyebrow>
          <h1
            className="font-medium m-0"
            style={{
              fontSize: "clamp(18px, 1.8vw, 24px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: INK,
              maxWidth: 560,
              textWrap: "balance",
            }}
          >
            A field survey of the work.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, marginTop: 14, maxWidth: 460, textWrap: "pretty" }}>
            Placeholder description. A line or two about how the work is organized — bigger
            case studies up top, smaller experiments below.
          </p>
        </div>
      </TopoHero>

      {/* ── Main projects ── */}
      <section className="px-page" style={{ paddingTop: 32, paddingBottom: 60 }}>
        <SectionHeader kicker="Main projects" title="The bigger ones." />
        {FEATURED.map((p, i) => (
          <Link
            key={p.id}
            href={`/work/${p.id}`}
            className="topo-card"
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              border: `1px solid ${FAINT}`,
              padding: 24,
              marginBottom: 16,
              background: CARD_BG,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6 md:gap-10 items-center">
              <div>
                <Eyebrow style={{ marginBottom: 12 }}>{`Project · 0${i + 1}`}</Eyebrow>
                <h3 className="font-medium" style={{ fontSize: 20, letterSpacing: "-0.015em", lineHeight: 1.1, margin: 0, color: INK }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: DIM, marginTop: 10, maxWidth: 400 }}>{p.note}</p>
                <div className="font-mono uppercase" style={{ marginTop: 18, fontSize: 10, letterSpacing: "0.22em", color: INK }}>
                  Read the case study →
                </div>
              </div>
              <Placeholder height={220} label="Project hero image" ratio="≈ 16:11" />
            </div>
          </Link>
        ))}
      </section>

      {/* ── One-off projects ── */}
      <section
        className="px-page"
        style={{ paddingTop: 40, paddingBottom: 60, borderTop: `1px solid ${FAINT}` }}
      >
        <SectionHeader
          kicker="Experiments"
          title="Smaller one-off projects."
          subtitle="Placeholder grid of experiments, sketches, and things made on a weekend."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ONE_OFFS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
