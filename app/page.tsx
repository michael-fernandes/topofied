import Link from "next/link";
import PageShell from "./components/page-shell";
import TopoHero from "./components/topo-hero";
import {
  INK,
  DIM,
  FAINT,
  CARD_BG,
  Eyebrow,
  SectionHeader,
  Placeholder,
  Plate,
} from "./components/kit";
import SkillGlyph, { type GlyphKind } from "./components/skill-glyph";
import type { StaticImageData } from "next/image";
import cardImg from "@/media/uncertainty/card.png";
import covidCardImg from "@/media/covid-forecasting/card.png";

const SKILLS: { kind: GlyphKind; title: string; note: string }[] = [
  {
    kind: "viz",
    title: "Data visualization",
    note: "Making sense of scientific, computational, and data-heavy apps — turning dense data into something you can actually read.",
  },
  {
    kind: "tools",
    title: "Design engineering",
    note: "Taking experiences end to end — from the first sketch to shipped code — with usability driving every call.",
  },
  {
    kind: "hcd",
    title: "Research & prototyping",
    note: "Learning from real people, then prototyping fast — testing ideas in days, not months.",
  },
];

export default function LandingPage() {
  return (
    <PageShell current="/" seed="landing-hero">
      <TopoHero height={900}>
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
          className="md:left-[60px] md:right-[60px]"
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
            style={{ display: "inline-block", padding: "12px 32px 12px 4px" }}
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
              margin: "8px 0 0",
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
          title="Three things I do."
          subtitle="The stuff I'm good at and genuinely like doing."
        />

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
          {SKILLS.map((s) => (
            <div
              key={s.title}
              className="topo-card"
              style={{ border: `1px solid ${FAINT}`, padding: "22px 20px", background: CARD_BG }}
            >
              <div style={{ marginBottom: 14, marginLeft: -1 }}>
                <SkillGlyph kind={s.kind} size={48} />
              </div>
              <h3 className="font-medium" style={{ fontSize: 15, letterSpacing: "-0.01em", color: INK, margin: 0 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: DIM, marginTop: 8 }}>{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 02 — Bigger projects ── */}
      <section
        className="px-page"
        style={{ paddingTop: 60, paddingBottom: 60, borderTop: `1px solid ${FAINT}` }}
      >
        <SectionHeader
          kicker="02 — Selected work"
          title="A couple of public-facing data projects I'm proud of."
        />

        {([
          {
            id: "uncertainty-displays-for-transit",
            name: "Uncertainty you can act on",
            note: "How a transit app should show what it doesn't know — and a 408-person study showing the right display makes better decisions.",
            image: cardImg,
            alt: "The OneBusAway interface showing a bus's arrival uncertainty as a quantile dotplot.",
          },
          {
            id: "covid-forecasting",
            name: "A forecast you could plan around",
            note: "One of the first public forecasts of when COVID-19 would peak — and whether hospitals would have the room to meet it.",
            image: covidCardImg,
            alt: "A region's COVID-19 daily-deaths forecast — observed so far, projected ahead, with the model's uncertainty fanning into the future.",
          },
        ] as { id: string; name: string; note: string; image?: StaticImageData; alt?: string }[]).map((p, i) => (
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
              {p.image ? (
                <Plate src={p.image} alt={p.alt ?? p.name} sizes="(min-width: 768px) 45vw, 100vw" />
              ) : (
                <Placeholder height={220} label="Project hero image" ratio="≈ 16:11" />
              )}
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
