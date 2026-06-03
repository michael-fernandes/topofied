import Link from "next/link";
import PageShell from "./components/page-shell";
import TopoHero from "./components/topo-hero";
import {
  INK,
  DIM,
  FAINT,
  ACCENT,
  CARD_BG,
  Marker,
  Eyebrow,
  SectionHeader,
  Placeholder,
} from "./components/kit";

const SKILLS = [
  {
    title: "Skill one",
    note: "A short placeholder describing a core capability. One or two lines is plenty here.",
  },
  {
    title: "Skill two",
    note: "Another core capability. Keep these even in length so the three columns read as a set.",
  },
  {
    title: "Skill three",
    note: "The third capability. Placeholder copy stands in until the real positioning is written.",
  },
];

export default function LandingPage() {
  return (
    <PageShell current="/" seed="landing-hero">
      <TopoHero height={900}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "54%",
            transform: "translate(calc(-50% - 64px), -50%)",
            textAlign: "center",
            zIndex: 2,
            padding: "0 20px",
            maxWidth: "100%",
          }}
        >
          {/* The heading is the summit — its real footprint drives the terrain,
              so the contours read as organic rather than a machined bullseye.
              One-line title at a smaller size; the tagline below adds a second,
              lower peak that keeps the rings from collapsing into a flat ridge. */}
          <div
            data-topo-id="summit"
            data-topo-hover-id="summit"
            data-topo-important=""
            data-topo-height="110"
            data-topo-falloff="132"
            data-topo-sharpness="1.45"
            style={{ display: "inline-block", padding: "24px 32px 12px" }}
          >
            <h1
              className="font-medium"
              style={{
                fontSize: "clamp(22px, 2.8vw, 38px)",
                letterSpacing: "-0.025em",
                lineHeight: 1,
                margin: 0,
                whiteSpace: "nowrap",
                color: INK,
              }}
            >
              Michael Fernandes
            </h1>
          </div>
          <p
            style={{
              maxWidth: 440,
              margin: "8px auto 0",
              fontSize: 14,
              lineHeight: 1.55,
              color: DIM,
              textWrap: "pretty",
            }}
          >
            A designer who became an engineer, mostly so the designs would survive the trip.
          </p>
        </div>

        {/* Quiet scroll cue — no labels. */}
        <div
          data-topo-hidden=""
          style={{
            position: "absolute",
            left: "50%",
            bottom: 40,
            transform: "translateX(-50%)",
            width: 1,
            height: 44,
            background: `linear-gradient(to bottom, transparent, ${FAINT})`,
            zIndex: 4,
          }}
        />
      </TopoHero>

      {/* ── 01 — Core skills ── */}
      <section className="px-page" style={{ paddingTop: 80, paddingBottom: 60 }}>
        <SectionHeader
          kicker="01 — What I do"
          title="Three things I keep coming back to."
          subtitle="Placeholder intro for the skills section. A sentence or two framing the disciplines below."
        />

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: FAINT, border: `1px solid ${FAINT}` }}>
          {SKILLS.map((s) => (
            <div key={s.title} style={{ background: "#1f1a16", padding: "22px 20px" }}>
              <Marker size={6} style={{ marginBottom: 16 }} />
              <h3 className="font-medium" style={{ fontSize: 15, letterSpacing: "-0.01em", color: INK, margin: 0 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: DIM, marginTop: 8 }}>{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 02 — History ── */}
      <section
        className="px-page"
        style={{ paddingTop: 60, paddingBottom: 60, borderTop: `1px solid ${FAINT}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>02 — History</Eyebrow>
          <div>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                color: INK,
                margin: 0,
                letterSpacing: "-0.008em",
                maxWidth: 640,
                textWrap: "pretty",
              }}
            >
              Placeholder for a short history. A paragraph that explains where I&apos;ve worked and
              what kind of problems I tend to gravitate toward — written plainly, no résumé bullet points.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, marginTop: 14, maxWidth: 600, textWrap: "pretty" }}>
              A second placeholder paragraph for a little more texture — the throughline across the work,
              and why it matters. The real copy goes here later.
            </p>
            <Link
              href="/about"
              className="font-mono uppercase"
              style={{
                display: "inline-block",
                marginTop: 30,
                fontSize: 11,
                letterSpacing: "0.22em",
                color: INK,
                textDecoration: "none",
                borderBottom: `1px solid ${ACCENT}`,
                paddingBottom: 4,
              }}
            >
              Read the long version →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 03 — Bigger projects ── */}
      <section
        className="px-page"
        style={{ paddingTop: 60, paddingBottom: 60, borderTop: `1px solid ${FAINT}` }}
      >
        <SectionHeader
          kicker="03 — Selected work"
          title="A couple of the bigger projects."
          subtitle="Placeholder cards. Each links through to a full case study."
        />

        {[
          { id: "project-1", name: "Project 01", note: "Short placeholder description of the first major project — what it was and why it mattered." },
          { id: "project-2", name: "Project 02", note: "Short placeholder description of the second major project. Real details land later." },
        ].map((p, i) => (
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
                <h3
                  className="font-medium"
                  style={{ fontSize: 20, letterSpacing: "-0.015em", lineHeight: 1.1, margin: 0, color: INK }}
                >
                  {p.name}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.55, color: DIM, marginTop: 10, maxWidth: 420 }}>{p.note}</p>
                <div
                  className="font-mono uppercase"
                  style={{ marginTop: 18, fontSize: 10, letterSpacing: "0.22em", color: INK }}
                >
                  Read the case study →
                </div>
              </div>
              <Placeholder height={220} label="Project hero image" ratio="≈ 16:11" />
            </div>
          </Link>
        ))}

        <Link
          href="/work"
          className="font-mono uppercase"
          style={{
            display: "inline-block",
            marginTop: 16,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: DIM,
            textDecoration: "none",
            borderBottom: `1px solid ${FAINT}`,
            paddingBottom: 4,
          }}
        >
          See all work →
        </Link>
      </section>
    </PageShell>
  );
}
