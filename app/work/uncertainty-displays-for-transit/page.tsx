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
import interfaceImg from "@/media/uncertainty/interface.png";
import dotImg from "@/media/uncertainty/dot.png";
import cdfImg from "@/media/uncertainty/cdf.png";
import controlImg from "@/media/uncertainty/control.png";

export const metadata: Metadata = {
  title: { absolute: "Uncertainty Displays for Transit — Data Viz Case Study" },
  description:
    "A data visualization case study and CHI 2018 paper (Honourable Mention): how a transit app should show what it doesn't know — showing riders the spread of likely arrivals led to better decisions.",
  alternates: { canonical: "/work/uncertainty-displays-for-transit" },
  openGraph: {
    title: "Uncertainty displays for on the go decision making — Michael Fernandes",
    description:
      "Showing riders the spread of likely arrivals, not one confident number, led to better decisions — a CHI 2018 Honourable Mention.",
    url: "/work/uncertainty-displays-for-transit",
    type: "article",
  },
};

const JSON_LD = caseStudyJsonLd({
  path: "/work/uncertainty-displays-for-transit",
  name: "Uncertainty displays for transit",
  description:
    "A CHI 2018 study (Honourable Mention for Best Paper) on how a transit app should visualize what it doesn't know — quantile dotplots and CDFs led riders to better decisions.",
  datePublished: "2018-04-21",
  keywords: [
    "uncertainty visualization",
    "quantile dotplot",
    "data visualization research",
    "ACM CHI 2018",
    "transit app design",
  ],
});

const META = [
  { k: "Role", v: "Development + Mixed-methods researcher" },
  { k: "Venue", v: "ACM CHI 2018" },
  { k: "Recognition", v: "Honourable Mention for best paper (top 5%)" },
  { k: "Google Scholar Citations", v: "242" },
];

export default function UncertaintyDisplaysPage() {
  return (
    <PageShell current="/work" seed="uncertainty-displays-for-transit">
      <JsonLd data={JSON_LD} />
      <TopoHero height={430}>
        <div
          style={{ position: "absolute", left: 20, right: 20, top: 116, padding: 4 }}
          className="md:left-[60px] md:right-[60px] pb-64  width-fit-content"
        >
          {/* Heading block — a broad, low ridge; the CTA below is the true summit. */}
          <div
            data-topo-id="project"
            data-topo-important=""
            data-topo-height="48"
            data-topo-falloff="110"
          >
            <Eyebrow style={{ marginBottom: 16 }}>Academic research work</Eyebrow>
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
              Uncertainty displays for on the go decision making
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: DIM, marginTop: 14, maxWidth: 480, textWrap: "pretty" }}>
              Everyday apps give you one confident number you are asked to make a decision on. Numeric predictions like how long it will take to commute, what temprature it will be and when a bus might arrive are numeric point estimates which obfusicate uncertainty
            </p>
          </div>
          <CtaButton
            href="https://github.com/michael-fernandes/uncertainty-displays-for-transit"
            topoId="cta-github"
            style={{ marginTop: 26 }}
          >
            View Project
          </CtaButton>
        </div>
      </TopoHero>

      {/* ── Heads-up data ── */}
      {/* Runs tight at the bottom: fold 2 follows with no rule between them, so
          the two bands' padding would otherwise stack into a ~270px hole. */}
      <section className="px-page band band-lead" style={{ paddingBottom: "calc(var(--band) * 0.45)" }}>
        <MetaRow items={META} />
      </section>

      {/* ── Fold 2 — process → interface ── */}
      {/* No borderTop, and the tighter lead padding: the MetaRow strip above
          already closes with a hairline, so this fold sits up against it. */}
      <section className="px-page band band-lead">
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>How it was made</Eyebrow>
          <div>
            <h2 className="font-medium" style={foldHeadingStyle}>
              High-level description
            </h2>
            <p style={bodyStyle}>
              This was the second part of an NIH grant-funded research program into how people make decisions under
              uncertainty in everyday transit. I worked with a rockstar team of research assistants and professors to
              design, implement and evaluate a range of uncertainty encodings — eventually presenting the paper at
              CHI 2018, where it received an Honourable Mention for Best Paper.
            </p>

            <FindingsPanel>
              <Finding>
                Quantile dot plots and cumulative distribution functions (CDFs) were the most effective displays for
                conveying uncertainty to users.
              </Finding>
              <Finding>
                Even users unfamiliar with mathematical representations made better decisions when some form of
                uncertainty was shown.
              </Finding>
            </FindingsPanel>
          </div>
        </div>
        <div style={{ maxWidth: 680, margin: "clamp(18px, 5vw, 28px) auto 0" }}>
          <Plate
            src={interfaceImg}
            alt="OneBusAway before and after: the standard app beside our version, which shows each bus's spread of likely arrival times."
            sizes="(min-width: 768px) 680px, 100vw"
            caption="OneBusAway, before → after — the same app, now showing each bus's spread of likely arrivals."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5 md:gap-[60px] items-start">
          <Eyebrow style={{ paddingTop: 6 }}>Does it help?</Eyebrow>
          <div>
            <h2 className="font-medium" style={foldHeadingStyle}>
              We tested 8 different uncertainty displays at scale.
            </h2>
            <p style={bodyStyle}>
              408 people made real, incentivized bus-catching decisions. People were rewarded for good calls, penalized for
              waiting in the rain. Of ten ways to show uncertainty, quantile dot plots and CDFs produced the best,
              most consistent decisions: about <span style={{ color: INK }}>97% of the best-possible payoff</span>,
              and steadily better as people learned to read them.
            </p>
          </div>
        </div>

        {/* The displays — a single tick (status quo) → the two that won.
            These stay stacked on mobile while the rest of the site goes
            half/third-width: the plates are 2.65:1, so a third-width column
            is a 40px sliver, and the CDF's shaded mass — already low
            contrast — disappears entirely at that size. */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4" style={{ marginTop: "clamp(18px, 5vw, 28px)" }}>
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
