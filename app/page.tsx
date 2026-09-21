import Link from "next/link";
import PageShell from "./components/page-shell";
import TopoHero from "./components/topo-hero";
import {
  INK,
  DIM,
  FAINT,
  ACCENT,
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

const FEATURED: { id: string; name: string; note: string; image?: StaticImageData; alt?: string }[] = [
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
            <Eyebrow rule={false} style={{ marginBottom: 10 }}>
              ▲ Data viz developer · Design engineer
            </Eyebrow>
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
            Seattle-based data visualization developer working at the intersection of
            design and engineering — interactive, data-heavy applications built end to end.
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
      <section className="px-page band band-lead">
        <SectionHeader
          kicker="01 — What I do"
          title="Three things I do."
          subtitle="The stuff I'm good at and genuinely like doing."
        />

        {/* Half-width tiles on mobile. Three cards don't halve evenly, so the
            last one takes the full row rather than leaving an orphan — two
            square tiles over one wide one reads as a deliberate 2+1 block,
            and the irregular silhouette suits the terrain better than a
            uniform stack would. */}
        <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: "var(--card-gap)" }}>
          {SKILLS.map((s, i) => (
            <div
              key={s.title}
              className={`field-note${i === SKILLS.length - 1 ? " col-span-2 md:col-span-1" : ""}`}
            >
              <div style={{ marginBottom: "clamp(8px, 2.4vw, 10px)", marginLeft: -1 }}>
                <SkillGlyph kind={s.kind} size={34} />
              </div>
              <h3
                className="font-medium"
                style={{ fontSize: "clamp(12px, 3.4vw, 14px)", letterSpacing: "-0.01em", color: INK, margin: 0 }}
              >
                {s.title}
              </h3>
              <p style={{ fontSize: "clamp(10.5px, 2.9vw, 12px)", lineHeight: 1.5, color: DIM, marginTop: 6 }}>{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 02 — Bigger projects ── */}
      <section className="px-page band" style={{ borderTop: `1px solid ${FAINT}` }}>
        <SectionHeader
          kicker="02 — Selected work"
          title="A couple of public-facing data projects I'm proud of."
        />

        {FEATURED.map((p, i) => (
          <Link
            key={p.id}
            href={`/work/${p.id}`}
            className="topo-link-card field-card"
            // The card itself is low, broad ground — the summit lives on the
            // art below, so the contours read as rising to the image rather
            // than outlining the whole panel. (An <a> would otherwise sit at
            // the default elevation of 22 and flatten the difference.)
            data-topo-height="12"
            data-topo-falloff="120"
            data-topo-sharpness="2.4"
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              border: `1px solid ${FAINT}`,
              padding: "clamp(13px, 3.4vw, 16px)",
              background: CARD_BG,
            }}
          >
            <div
              className={`grid grid-cols-1 gap-4 md:gap-7 items-center ${i % 2 === 1 ? "md:grid-cols-[0.85fr_1fr]" : "md:grid-cols-[1fr_0.85fr]"
                }`}
            >
              <div
                className={i % 2 === 1 ? "md:order-2" : undefined}
                data-topo-important=""
                data-topo-height="16"
                data-topo-falloff="105"
                data-topo-sharpness="2.2"
              >
                <Eyebrow style={{ marginBottom: "clamp(8px, 2.4vw, 10px)" }}>{`Project · 0${i + 1}`}</Eyebrow>
                <h3
                  className="font-medium"
                  style={{ fontSize: "clamp(14px, 3.8vw, 16px)", letterSpacing: "-0.015em", lineHeight: 1.1, margin: 0, color: INK }}
                >
                  {p.name}
                </h3>
                <p style={{ fontSize: "clamp(11px, 3vw, 12px)", lineHeight: 1.5, color: DIM, marginTop: 8, maxWidth: 320 }}>{p.note}</p>
                <div
                  className="font-mono uppercase"
                  style={{ marginTop: "clamp(10px, 2.8vw, 13px)", fontSize: 9.5, letterSpacing: "0.2em", color: ACCENT }}
                >
                  Read the case study <span className="card-arrow inline-block">→</span>
                </div>
              </div>
              <div
                className={`field-art ${i % 2 === 1 ? "md:order-1" : ""}`}
                data-topo-important=""
                data-topo-id={`featured-art-${p.id}`}
                data-topo-hover-id={`featured-art-${p.id}`}
                data-topo-height="96"
                data-topo-falloff="150"
                data-topo-sharpness="1.25"
              >
                {p.image ? (
                  <Plate src={p.image} alt={p.alt ?? p.name} sizes="(min-width: 768px) 30vw, 60vw" />
                ) : (
                  <Placeholder height="clamp(96px, 28vw, 200px)" label="Project hero image" ratio="≈ 16:11" />
                )}
              </div>
            </div>
          </Link>
        ))}

        <Link
          href="/work"
          className="font-mono uppercase"
          style={{
            display: "inline-block",
            marginTop: 48,
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
