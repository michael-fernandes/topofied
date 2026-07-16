import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "../../components/page-shell";
import TopoHero from "../../components/topo-hero";
import { INK, DIM, FAINT, ACCENT, Eyebrow, MetaRow, Plate, Marker } from "../../components/kit";
import forecastImg from "@/media/covid-forecasting/forecast.png";
import timingImg from "@/media/covid-forecasting/timing.png";
import capacityImg from "@/media/covid-forecasting/capacity.png";

export const metadata: Metadata = {
  title: "A Forecast You Could Plan Around",
  description:
    "How Michael Fernandes helped build one of the first public forecasts of when COVID-19 would peak, and whether hospitals would have the room to meet it — used by millions, briefed by the White House.",
  alternates: { canonical: "/work/covid-forecasting" },
  openGraph: {
    title: "A forecast you could plan around — Michael Fernandes",
    description:
      "One of the first public forecasts of when COVID-19 would peak — and whether hospitals would have the room to meet it.",
    url: "/work/covid-forecasting",
    type: "article",
  },
};

const META = [
  { k: "Role", v: "Data viz · design eng" },
  { k: "Year", v: "2020" },
  { k: "Org", v: "IHME · UW" },
];

export default function CovidForecastingPage() {
  return (
    <PageShell current="/work" seed="covid-forecasting">
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
          <Eyebrow style={{ marginBottom: 16 }}>A thing I made</Eyebrow>
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
          <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, marginTop: 14, maxWidth: 520, textWrap: "pretty" }}>
            One of the first public forecasts of when COVID-19 would peak — and whether hospitals
            would have the room to meet it.
          </p>
        </div>
      </TopoHero>

      {/* ── Heads-up data ── */}
      <section className="px-page" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <MetaRow items={META} />
      </section>

      {/* ── The gist + the forecast ── */}
      <section className="px-page" style={{ paddingTop: 40, paddingBottom: 48, borderTop: `1px solid ${FAINT}` }}>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 0, maxWidth: 600, textWrap: "pretty" }}>
          In 2020 I was at <span style={{ color: INK }}>IHME</span>, turning a daily forecasting model
          into something anyone could read in seconds: projected deaths and hospital demand for every
          U.S. state, then every country, each shown as a range rather than one confident number. The
          first public version shipped in weeks. We rebuilt it every day after that.
        </p>
        <div style={{ maxWidth: 680, margin: "28px auto 0" }}>
          <Plate
            src={forecastImg}
            alt="A region's daily-deaths forecast: the observed climb so far, a projected curve continuing past today, and a shaded uncertainty band that widens into the future toward a marked projected peak."
            sizes="(min-width: 768px) 680px, 100vw"
            caption="One region: what we’d seen, what we projected, and the uncertainty widening ahead."
          />
        </div>
      </section>

      {/* ── Why it stuck ── */}
      <section className="px-page" style={{ paddingTop: 40, paddingBottom: 48, borderTop: `1px solid ${FAINT}` }}>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 0, maxWidth: 600, textWrap: "pretty" }}>
          Most dashboards counted what had already happened. This was one of the first to put a date
          on the <span style={{ color: INK }}>peak</span>: when each place would crest, and whether
          its hospitals would have room. It ran daily in national and global news.
        </p>

        {/* The two reads people came for: the "when", and the "will we have room". */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 28 }}>
          <Plate
            src={timingImg}
            alt="Several regional curves on one timeline, each peaking on a different date, with the peaks connected to show the wave arriving later from place to place."
            sizes="(min-width: 640px) 47vw, 100vw"
            caption={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: DIM }}>
                <Marker size={6} /> Peaks weeks apart by region
              </span>
            }
          />
          <Plate
            src={capacityImg}
            alt="A projected demand curve cresting above a dashed capacity line, with the gap between them — the shortfall — shaded in."
            sizes="(min-width: 640px) 47vw, 100vw"
            caption={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: DIM }}>
                <Marker size={6} /> Projected demand vs. capacity
              </span>
            }
          />
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 28, maxWidth: 600, textWrap: "pretty" }}>
          Same idea as my transit work: the forecast people can act on isn’t the most{" "}
          <span style={{ color: INK }}>confident</span> one, it’s the one that’s honest about how
          wrong it might be.
        </p>
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
