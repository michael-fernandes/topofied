import Link from "next/link";
import PageShell from "../../components/page-shell";
import TopoHero from "../../components/topo-hero";
import { INK, DIM, FAINT, ACCENT, Eyebrow, MetaRow, Plate, Marker } from "../../components/kit";
import interfaceImg from "@/media/uncertainty/interface.png";
import dotImg from "@/media/uncertainty/dot.png";
import cdfImg from "@/media/uncertainty/cdf.png";
import controlImg from "@/media/uncertainty/control.png";

const META = [
  { k: "Role", v: "Design · prototyping · study" },
  { k: "Year", v: "2018" },
  { k: "Venue", v: "ACM CHI 2018" },
  { k: "Recognition", v: "Honourable Mention" },
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

export default function UncertaintyDisplaysPage() {
  return (
    <PageShell current="/work" seed="uncertainty-displays-for-transit">
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
            Decisions when the answer is only “probably.”
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, marginTop: 14, maxWidth: 480, textWrap: "pretty" }}>
            Everyday apps give you one confident number — but most real choices, like when to leave for the bus,
            are decisions made under uncertainty.
          </p>
        </div>
      </TopoHero>

      {/* ── Heads-up data ── */}
      <section className="px-page" style={{ paddingTop: 16, paddingBottom: 40 }}>
        <MetaRow items={META} />
      </section>

      {/* ── Fold 2 — process → interface ── */}
      <section className="px-page" style={{ paddingTop: 40, paddingBottom: 48, borderTop: `1px solid ${FAINT}` }}>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>How it was made</Eyebrow>
          <div>
            <h2 className="font-medium" style={headingStyle}>
              We started from how people already ride.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 14, maxWidth: 600, textWrap: "pretty" }}>
              Rather than invent from scratch, we built on earlier interviews and ethnographic studies of how riders
              weigh waiting against risk — which pointed to a handful of ways to picture uncertainty. We rebuilt those
              into <span style={{ color: INK }}>OneBusAway</span>, a real transit app, then refined them through
              think-aloud sessions and 80+ pilot runs until people read them the way we intended.
            </p>
          </div>
        </div>
        <div style={{ maxWidth: 680, margin: "28px auto 0" }}>
          <Plate
            src={interfaceImg}
            alt="OneBusAway before and after: the standard app beside our version, which shows each bus's spread of likely arrival times."
            sizes="(min-width: 768px) 680px, 100vw"
            caption="OneBusAway, before → after — the same app, now showing each bus's spread of likely arrivals."
          />
        </div>
      </section>

      {/* ── Fold 3 — large quantitative study → finding ── */}
      <section className="px-page" style={{ paddingTop: 40, paddingBottom: 48, borderTop: `1px solid ${FAINT}` }}>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>Does it help?</Eyebrow>
          <div>
            <h2 className="font-medium" style={headingStyle}>
              Then we tested it at scale.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 14, maxWidth: 600, textWrap: "pretty" }}>
              408 people made real, incentivized bus-catching decisions — rewarded for good calls, penalized for
              waiting in the rain. Of ten ways to show uncertainty, quantile dot plots and CDFs produced the best,
              most consistent decisions: about <span style={{ color: INK }}>97% of the best-possible payoff</span>,
              and steadily better as people learned to read them.
            </p>
          </div>
        </div>

        {/* The displays — a single tick (status quo) → the two that won. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginTop: 28 }}>
          <Plate
            src={controlImg}
            alt="A single tick on a timeline — one predicted arrival time, with no uncertainty shown."
            sizes="(min-width: 640px) 31vw, 100vw"
            caption="No uncertainty — today's apps"
          />
          <Plate
            src={dotImg}
            alt="A quantile dotplot: stacked dots showing the spread of likely arrival times."
            sizes="(min-width: 640px) 31vw, 100vw"
            caption={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: DIM }}>
                <Marker size={6} /> Quantile dot plot
              </span>
            }
          />
          <Plate
            src={cdfImg}
            alt="A cumulative distribution curve over likely arrival times."
            sizes="(min-width: 640px) 31vw, 100vw"
            caption={
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: DIM }}>
                <Marker size={6} /> CDF
              </span>
            }
          />
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 28, maxWidth: 600, textWrap: "pretty" }}>
          The takeaway: shown well, uncertainty doesn&apos;t overwhelm people — it quietly raises{" "}
          <span style={{ color: INK }}>everyone&apos;s</span> decisions, not just the experts&apos;.
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
