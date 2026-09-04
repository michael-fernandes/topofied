import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";
import {
  BG,
  INK,
  DIM,
  FAINT,
  ACCENT,
  CARD_BG,
  Eyebrow,
  SectionHeader,
  Plate,
  Placeholder,
} from "../components/kit";
import Image, { type StaticImageData } from "next/image";
import cardImg from "@/media/uncertainty/card.png";
import covidCardImg from "@/media/covid-forecasting/card.png";
import goalGridImg from "@/media/small-projects/goal-grid.png";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and small projects by Michael Fernandes — an IHME COVID-19 forecast dashboard, a CHI-published uncertainty display for transit, and experiments in data visualization.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work — Michael Fernandes",
    description:
      "A field survey of the work: the IHME COVID-19 forecast dashboard, a CHI-published uncertainty display for transit, and smaller dataviz experiments.",
    url: "/work",
  },
};

// Media window on a small-project card. One value for video, image, and
// placeholder so every card in the scroll strip lines up.
const MEDIA_H = "clamp(104px, 30vw, 132px)";

const SMALL_PROJECTS: {
  title: string;
  description: string;
  link: string;
  external?: boolean;
  video?: string;
  image?: StaticImageData;
  alt?: string;
}[] = [
    {
      title: "Concentric Radar Chart",
      description: "A radial take on the radar chart — categories ring outward instead of sharing one center.",
      link: "https://observablehq.com/@michael-fernandes/concentric-radar-chart/2",
      external: true,
      video: "/small-projects/concentric-radar-chart.mov",
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
    },
    {
      title: "Bingo Vision Card",
      description:
        "creates a online app for a social media trend for tracking your goals in the new year.",
      link: "https://www.bingovisioncard.com",
      external: true,
      image: goalGridImg,
      alt: "The Goal Grid board — five pillar columns of goal cards, the finished ones struck through and checked off.",
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
      <section className="px-page band band-lead">
        <SectionHeader
          kicker="Formative projects"
          title="A couple data-heavy apps I'm proud of."
          gap="clamp(40px, 9vw, 62px)"
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
              className={`grid grid-cols-1 gap-4 md:gap-7 items-center ${
                i % 2 === 1 ? "md:grid-cols-[0.85fr_1fr]" : "md:grid-cols-[1fr_0.85fr]"
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
                <h3 className="font-medium" style={{ fontSize: "clamp(14px, 3.8vw, 16px)", letterSpacing: "-0.015em", lineHeight: 1.1, margin: 0, color: INK }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: "clamp(11px, 3vw, 12px)", lineHeight: 1.5, color: DIM, marginTop: 8, maxWidth: 300 }}>{p.note}</p>
                <div className="font-mono uppercase" style={{ marginTop: "clamp(10px, 2.8vw, 13px)", fontSize: 9.5, letterSpacing: "0.2em", color: ACCENT }}>
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
                <Plate src={p.image} alt={p.alt} sizes="(min-width: 768px) 30vw, 60vw" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ── Small projects ── */}
      <section className="px-page band" style={{ borderTop: `1px solid ${FAINT}` }}>
        <SectionHeader kicker="Small projects" title="The smaller ones." />
        {/* A horizontal strip rather than a grid — cards sitting side by side
            in rows fight the contour field; a single scrolling line reads as a
            transect across it. Runs off both page margins (see .scroll-strip),
            so the card clipped at the right edge is its own scroll cue. */}
        <div className="scroll-strip">
          {SMALL_PROJECTS.map((p) => (
            <Link
              key={p.title}
              href={p.link}
              target={p.external ? "_blank" : undefined}
              rel={p.external ? "noopener noreferrer" : undefined}
              className="topo-link-card"
              style={{
                display: "block",
                textDecoration: "none",
                color: "inherit",
                border: `1px solid ${FAINT}`,
                padding: "clamp(11px, 3.2vw, 14px)",
                background: CARD_BG,
              }}
            >
              {p.video ? (
                <div style={{ height: MEDIA_H, border: `1px solid ${FAINT}`, background: BG, overflow: "hidden" }}>
                  <video
                    src={p.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              ) : p.image ? (
                // Same window as the video card. Screenshots are taller than
                // the window, so they cover from the top — the part worth
                // seeing (headers, first row) is always at the top of the frame.
                <div
                  className="relative"
                  style={{ height: MEDIA_H, border: `1px solid ${FAINT}`, background: BG, overflow: "hidden" }}
                >
                  <Image
                    src={p.image}
                    alt={p.alt ?? p.title}
                    fill
                    sizes="248px"
                    placeholder="blur"
                    style={{ objectFit: "cover", objectPosition: "center top" }}
                  />
                </div>
              ) : (
                <Placeholder height={MEDIA_H} label={p.title} />
              )}
              <h3
                className="font-medium"
                style={{
                  fontSize: "clamp(12px, 3.4vw, 14px)",
                  letterSpacing: "-0.01em",
                  color: INK,
                  margin: "clamp(9px, 2.8vw, 12px) 0 0",
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: "clamp(10.5px, 2.9vw, 12px)", lineHeight: 1.5, color: DIM, marginTop: 6 }}>
                {p.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
