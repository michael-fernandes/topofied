import Link from "next/link";
import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";
import {
  INK,
  DIM,
  FAINT,
  CARD_BG,
  Eyebrow,
  SectionHeader,
  Plate,
  Placeholder,
} from "../components/kit";
import type { StaticImageData } from "next/image";
import cardImg from "@/media/uncertainty/card.png";
import covidCardImg from "@/media/covid-forecasting/card.png";

const SMALL_PROJECTS: { title: string; description: string; link: string; external?: boolean; video?: string }[] = [
  {
    title: "Concentric Radar Chart",
    description: "A radial take on the radar chart — categories ring outward instead of sharing one center.",
    link: "https://observablehq.com/@michael-fernandes/concentric-radar-chart/2",
    external: true,
  },
  {
    title: "Simulation",
    description: "A force-simulated cluster of dots that scatters away from the pointer.",
    link: "/projects/interactive-dots",
  },
  {
    title: "Child Mortality",
    description: "IHME's Local Burden of Disease atlas of under-5 mortality, mapped down to the district level.",
    link: "https://web.archive.org/web/20210421060225if_/https://vizhub.healthdata.org/child-mortality",
    external: true,
    video: "/small-projects/child-mortality.mov",
  },
];

const FEATURED: { id: string; name: string; note: string; image: StaticImageData; alt: string }[] = [
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
              <Plate src={p.image} alt={p.alt} sizes="(min-width: 768px) 45vw, 100vw" />
            </div>
          </Link>
        ))}
      </section>

      {/* ── Small projects ── */}
      <section className="px-page" style={{ paddingTop: 0, paddingBottom: 60, borderTop: `1px solid ${FAINT}` }}>
        <div style={{ paddingTop: 60 }}>
          <SectionHeader kicker="Small projects" title="The smaller ones." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          {SMALL_PROJECTS.map((p) => (
            <Link
              key={p.title}
              href={p.link}
              target={p.external ? "_blank" : undefined}
              rel={p.external ? "noopener noreferrer" : undefined}
              className="topo-card"
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                border: `1px solid ${FAINT}`,
                padding: 20,
                background: CARD_BG,
              }}
            >
              {p.video ? (
                <div style={{ height: 160, border: `1px solid ${FAINT}`, background: "#1f1a16", overflow: "hidden" }}>
                  <video
                    src={p.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ) : (
                <Placeholder height={160} label={p.title} />
              )}
              <h3 className="font-medium" style={{ fontSize: 15, letterSpacing: "-0.01em", color: INK, margin: "16px 0 0" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: DIM, marginTop: 8 }}>{p.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
