import type { Metadata } from "next";
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
  Plate,
  Marker,
  CtaButton,
  FindingsPanel,
  Finding,
  bodyStyle,
  foldHeadingStyle,
} from "../../components/kit";
import JsonLd from "../../components/json-ld";
import { caseStudyJsonLd } from "../../lib/seo";
import forecastImg from "@/media/covid-forecasting/forecast.png";
import timingImg from "@/media/covid-forecasting/timing.png";
import capacityImg from "@/media/covid-forecasting/capacity.png";

export const metadata: Metadata = {
  title: { absolute: "COVID-19 Forecast Dashboard — Data Viz Case Study" },
  description:
    "A data visualization case study: how Michael Fernandes helped build the IHME COVID-19 forecast dashboard — one of the first public forecasts of when the pandemic would peak and whether hospitals would have the room to meet it. Used by millions, briefed by the White House.",
  alternates: { canonical: "/work/covid-forecasting" },
  openGraph: {
    title: "A forecast you could plan around — Michael Fernandes",
    description:
      "One of the first public forecasts of when COVID-19 would peak — and whether hospitals would have the room to meet it.",
    url: "/work/covid-forecasting",
    type: "article",
  },
};

const JSON_LD = caseStudyJsonLd({
  path: "/work/covid-forecasting",
  name: "IHME COVID-19 forecast dashboard",
  description:
    "A public data visualization of when COVID-19 would peak and whether hospitals would have the beds to meet it, built at IHME.",
  datePublished: "2020-03-26",
  keywords: [
    "data visualization",
    "COVID-19 forecast",
    "dashboard design",
    "uncertainty visualization",
    "D3.js",
    "IHME",
  ],
});

const META = [
  { k: "Role", v: "Data viz · design eng" },
  { k: "Year", v: "2020" },
  { k: "Org", v: "IHME · UW" },
];

export default function CovidForecastingPage() {
  return (
    <PageShell current="/work" seed="covid-forecasting">
      <JsonLd data={JSON_LD} />
      <TopoHero height={430}>
        <div
          style={{ position: "absolute", left: 20, right: 20, top: 116, padding: 4 }}
          className="md:left-[60px] md:right-[60px] pb-64 width-fit-content"
        >
          {/* Heading block — a broad, low ridge; the CTA below is the true summit. */}
          <div data-topo-id="project" data-topo-important="" data-topo-height="48" data-topo-falloff="110">
            <Eyebrow style={{ marginBottom: 16 }}>Industry work</Eyebrow>
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
              A forecast you could plan around.
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, marginTop: 14, maxWidth: 480, textWrap: "pretty" }}>
              One of the first public forecasts of when COVID-19 would peak — and whether hospitals
              would have the room to meet it.
            </p>
          </div>
          <CtaButton
            href="https://viz-archive.healthdata.org/covid/"
            topoId="cta-dashboard"
            style={{ marginTop: 26 }}
          >
            View Project
          </CtaButton>
        </div>
      </TopoHero>

      {/* ── Heads-up data ── */}
      {/* Runs tight at the bottom: the fold below follows with no rule between
          them, so the two bands' padding would otherwise stack into a hole. */}
      <section className="px-page band band-lead" style={{ paddingBottom: "calc(var(--band) * 0.45)" }}>
        <MetaRow items={META} />
      </section>

      {/* ── Fold 2 — the build → why it stuck ── */}
      <section className="px-page band band-lead">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>How it was made</Eyebrow>
          <div>
            <h2 className="font-medium" style={foldHeadingStyle}>
              A daily forecasting model, made readable in seconds.
            </h2>
            <p style={bodyStyle}>
              In 2020 I was at <span style={{ color: INK }}>IHME</span>: projected deaths and hospital
              demand for every U.S. state, then every country, each shown as a range rather than one
              confident number. The first public version shipped in weeks. We rebuilt it every day
              after that.
            </p>

            <FindingsPanel label="Reach">
              <Finding>Ran daily in national and global news.</Finding>
              <Finding>Used by millions, and briefed by the White House.</Finding>
            </FindingsPanel>
          </div>
        </div>
        <div style={{ maxWidth: 680, margin: "clamp(18px, 5vw, 28px) auto 0" }}>
          <Plate
            src={forecastImg}
            alt="A region's daily-deaths forecast: the observed climb so far, a projected curve continuing past today, and a shaded uncertainty band that widens into the future toward a marked projected peak."
            sizes="(min-width: 768px) 680px, 100vw"
            caption="One region: what we’d seen, what we projected, and the uncertainty widening ahead."
          />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5 md:gap-[60px] items-start"
          style={{ marginTop: "clamp(24px, 6vw, 40px)" }}
        >
          <Eyebrow style={{ paddingTop: 6 }}>Why it stuck</Eyebrow>
          <div>
            <h2 className="font-medium" style={foldHeadingStyle}>
              Most dashboards counted what had already happened.
            </h2>
            <p style={bodyStyle}>
              This was one of the first to put a date on the{" "}
              <span style={{ color: INK }}>peak</span>: when each place would crest, and whether its
              hospitals would have room.
            </p>
          </div>
        </div>

        {/* The two reads people came for: the "when", and the "will we have
            room". Side by side at every width — they're a pair. */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4" style={{ marginTop: "clamp(18px, 5vw, 28px)" }}>
          <Plate
            src={timingImg}
            alt="Several regional curves on one timeline, each peaking on a different date, with the peaks connected to show the wave arriving later from place to place."
            sizes="47vw"
            caption={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: DIM }}>
                <Marker size={6} /> Peaks weeks apart by region
              </span>
            }
          />
          <Plate
            src={capacityImg}
            alt="A projected demand curve cresting above a dashed capacity line, with the gap between them — the shortfall — shaded in."
            sizes="47vw"
            caption={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: DIM }}>
                <Marker size={6} /> Projected demand vs. capacity
              </span>
            }
          />
        </div>

        <p style={{ ...bodyStyle, marginTop: "clamp(18px, 5vw, 28px)" }}>
          Same idea as my transit work: the forecast people can act on isn’t the most{" "}
          <span style={{ color: INK }}>confident</span> one, it’s the one that’s honest about how
          wrong it might be.
        </p>
      </section>

      {/* ── Footer nav ── */}
      <section
        className="px-page band band-lead band-tail flex items-center justify-between"
        style={{ borderTop: `1px solid ${FAINT}` }}
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
