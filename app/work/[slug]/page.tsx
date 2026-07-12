import Link from "next/link";
import PageShell from "../../components/page-shell";
import TopoHero from "../../components/topo-hero";
import {
  INK,
  DIM,
  FAINT,
  ACCENT,
  Eyebrow,
  MetaRow,
  Placeholder,
} from "../../components/kit";

function labelFor(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const META = [
  { k: "Role", v: "Placeholder" },
  { k: "Year", v: "—" },
  { k: "Type", v: "Placeholder" },
  { k: "Stack", v: "Placeholder" },
];

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const label = labelFor(slug);

  return (
    <PageShell current="/work" seed={`project-${slug}`}>
      <TopoHero height={360}>
        <div
          data-topo-id="project"
          data-topo-hover-id="project"
          data-topo-important=""
          data-topo-height="90"
          data-topo-falloff="120"
          style={{ position: "absolute", left: 20, right: 20, top: 140, padding: 4 }}
          className="md:left-[60px] md:right-[60px]"
        >
          <Eyebrow style={{ marginBottom: 16 }}>Case study</Eyebrow>
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
            {label}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, marginTop: 14, maxWidth: 460, textWrap: "pretty" }}>
            One-line placeholder summary of the project — what it is, in plain language.
          </p>
        </div>
      </TopoHero>

      {/* ── Heads-up data ── */}
      <section className="px-page" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <MetaRow items={META} />
      </section>

      {/* ── Short description ── */}
      <section
        className="px-page"
        style={{ paddingTop: 40, paddingBottom: 40, borderTop: `1px solid ${FAINT}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>Overview</Eyebrow>
          <div>
            <p
              style={{ fontSize: 16, lineHeight: 1.55, color: INK, margin: 0, letterSpacing: "-0.008em", maxWidth: 640, textWrap: "pretty" }}
            >
              Placeholder for a short description of the project. What the problem was, what was
              built, and what changed as a result — a paragraph or two, no more.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: DIM, marginTop: 14, maxWidth: 580, textWrap: "pretty" }}>
              A second placeholder paragraph for context — constraints, collaborators, the part that
              was harder than it looked. Real copy lands later.
            </p>
          </div>
        </div>
      </section>

      {/* ── Placeholder media ── */}
      <section className="px-page" style={{ paddingTop: 16, paddingBottom: 60 }}>
        <Placeholder height={380} label="Project hero image" ratio="≈ 16:9" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginTop: 16 }}>
          <Placeholder height={220} label="Detail" ratio="4:3" />
          <Placeholder height={220} label="Detail" ratio="4:3" />
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
