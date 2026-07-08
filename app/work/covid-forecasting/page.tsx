import Link from "next/link";
import PageShell from "../../components/page-shell";
import TopoHero from "../../components/topo-hero";
import { INK, DIM, FAINT, ACCENT, Eyebrow, MetaRow, Plate, Marker } from "../../components/kit";
import forecastImg from "@/media/covid-forecasting/forecast.png";
import timingImg from "@/media/covid-forecasting/timing.png";
import capacityImg from "@/media/covid-forecasting/capacity.png";

const META = [
  { k: "Role", v: "Data viz · design eng" },
  { k: "Year", v: "2020" },
  { k: "Org", v: "IHME · UW" },
  { k: "Reach", v: "National & global news" },
];

// Section heading shared by the two content folds.
const headingStyle = {
  fontSize: "clamp(16px, 1.5vw, 20px)",
  letterSpacing: "-0.015em",
  lineHeight: 1.15,
  margin: 0,
  color: INK,
  maxWidth: 560,
  textWrap: "balance" as const,
};

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
            When the peak would come — weeks before it did.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, marginTop: 14, maxWidth: 500, textWrap: "pretty" }}>
            When COVID-19 hit, hospitals needed more than “cases will rise.” They needed to know
            when, and how high — early enough to prepare.
          </p>
        </div>
      </TopoHero>

      {/* ── Heads-up data ── */}
      <section className="px-page" style={{ paddingTop: 16, paddingBottom: 40 }}>
        <MetaRow items={META} />
      </section>

      {/* ── Fold 2 — process → the forecast ── */}
      <section className="px-page" style={{ paddingTop: 40, paddingBottom: 48, borderTop: `1px solid ${FAINT}` }}>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>How it was made</Eyebrow>
          <div>
            <h2 className="font-medium" style={headingStyle}>
              Built in a pinch — then rebuilt every day.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 14, maxWidth: 600, textWrap: "pretty" }}>
              In the first weeks of 2020, a forecasting model at{" "}
              <span style={{ color: INK }}>IHME</span> — the Institute for Health Metrics and Evaluation —
              was producing some of the first projections of where the pandemic was actually headed. My job was
              to turn each day’s model run into something a governor, a hospital planner, or anyone at home could
              read in seconds: projected deaths and hospital demand for every U.S. state, then every country —
              each shown as <span style={{ color: INK }}>a range, not a single confident line</span>. We shipped
              the first public version in a matter of weeks, then kept rebuilding it daily as the data, and the
              world, shifted under us.
            </p>
          </div>
        </div>
        <div style={{ maxWidth: 680, margin: "28px auto 0" }}>
          <Plate
            src={forecastImg}
            alt="A region's daily-deaths forecast: the observed climb so far, a projected curve continuing past today, and a shaded uncertainty band that widens into the future toward a marked projected peak."
            sizes="(min-width: 768px) 680px, 100vw"
            caption="Each region’s daily forecast — what we’d observed, the projection ahead, and the model’s uncertainty fanning out into the future."
          />
        </div>
      </section>

      {/* ── Fold 3 — the finding → why it mattered ── */}
      <section className="px-page" style={{ paddingTop: 40, paddingBottom: 48, borderTop: `1px solid ${FAINT}` }}>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>Why it mattered</Eyebrow>
          <div>
            <h2 className="font-medium" style={headingStyle}>
              It put a date on the peak.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 14, maxWidth: 600, textWrap: "pretty" }}>
              Most early dashboards counted what had already happened. This was one of the first to model the{" "}
              <span style={{ color: INK }}>timing</span> of the curve — not just that a surge was coming, but
              when each place would crest, and whether its hospitals would have the beds, ICU rooms, and
              ventilators to meet it. That turned a vague dread into a planning horizon, and the projections
              became a daily reference in <span style={{ color: INK }}>national and global news</span> — and for
              the people making the calls.
            </p>
          </div>
        </div>

        {/* The two reads people came for: the "when", and the "will we have room". */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginTop: 28 }}>
          <Plate
            src={timingImg}
            alt="Several regional curves on one timeline, each peaking on a different date, with the peaks connected to show the wave arriving later from place to place."
            sizes="(min-width: 640px) 47vw, 100vw"
            caption={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: DIM }}>
                <Marker size={6} /> Peaks landed weeks apart by region
              </span>
            }
          />
          <Plate
            src={capacityImg}
            alt="A projected demand curve cresting above a dashed capacity line, with the gap between them — the shortfall — shaded in."
            sizes="(min-width: 640px) 47vw, 100vw"
            caption={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: DIM }}>
                <Marker size={6} /> Projected demand vs. real capacity
              </span>
            }
          />
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 28, maxWidth: 600, textWrap: "pretty" }}>
          The thread from the transit work held: a forecast people can act on isn’t the most{" "}
          <span style={{ color: INK }}>confident</span> one — it’s the one that’s honest about when, and by how
          much, it could be wrong.
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
