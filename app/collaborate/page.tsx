import type { Metadata } from "next";
import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";
import {
  INK,
  DIM,
  FAINT,
  ACCENT,
  CARD_BG,
  Marker,
  Eyebrow,
} from "../components/kit";

export const metadata: Metadata = {
  title: "Collaborate",
  description:
    "Work with Michael Fernandes, a Seattle-based UX engineer and data visualization designer, on internal tooling, design systems, and dataviz prototyping.",
  alternates: { canonical: "/collaborate" },
  openGraph: {
    title: "Collaborate — Michael Fernandes",
    description:
      "Open to a small number of select projects — internal tooling, design systems, and dataviz prototyping. Seattle-based, comfortable remote.",
    url: "/collaborate",
  },
};

const SERVICES = [
  "Service 01",
  "Service 02",
  "Service 03",
  "Service 04",
  "Service 05",
  "Service 06",
];

export default function CollaboratePage() {
  return (
    <PageShell current="/collaborate" seed="collaborate-hero">
      <TopoHero height={360}>
        <div
          data-topo-id="collab"
          data-topo-hover-id="collab"
          data-topo-important=""
          data-topo-height="80"
          data-topo-falloff="120"
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: 140,
            padding: 4,
          }}
          className="md:left-[60px] md:right-[60px]"
        >
          <Eyebrow style={{ marginBottom: 16 }}>Collaborate</Eyebrow>
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
            Let&apos;s chart something together.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, marginTop: 14, maxWidth: 460, textWrap: "pretty" }}>
            Placeholder intro for freelance work. A line about the kind of projects I take on and
            roughly how I like to work with people.
          </p>
        </div>
      </TopoHero>

      {/* ── Things I can do — 6-up legend ── */}
      <section className="px-page" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Eyebrow style={{ marginBottom: 24 }}>What I can help with</Eyebrow>
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          style={{ gap: 1, background: FAINT, border: `1px solid ${FAINT}` }}
        >
          {SERVICES.map((s, i) => (
            <div
              key={s}
              style={{ background: "#1f1a16", padding: "18px 16px", minHeight: 120 }}
              className="flex flex-col justify-between"
            >
              <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.18em", color: ACCENT }}>
                {`0${i + 1}`}
              </div>
              <div>
                <Marker size={6} style={{ marginBottom: 10 }} />
                <div className="font-medium" style={{ fontSize: 14, color: INK, letterSpacing: "-0.01em" }}>
                  {s}
                </div>
                <div style={{ fontSize: 12, color: DIM, lineHeight: 1.45, marginTop: 4 }}>
                  Short placeholder.
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Availability / contact ── */}
      <section
        className="px-page"
        style={{ paddingTop: 40, paddingBottom: 60, borderTop: `1px solid ${FAINT}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-14 items-start">
          <div>
            <Eyebrow style={{ marginBottom: 16 }}>How it works</Eyebrow>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: INK, margin: 0, maxWidth: 420, textWrap: "pretty" }}>
              Placeholder for a short note on process — scope, timeline, the kind of engagement that
              tends to go well. Two or three sentences.
            </p>
          </div>

          <div
            className="topo-card flex flex-col justify-between"
            style={{ border: `1px solid ${FAINT}`, padding: 24, minHeight: 220, background: CARD_BG }}
          >
            <div>
              <div
                className="font-mono uppercase flex items-center"
                style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT, gap: 10 }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: ACCENT,
                    boxShadow: "0 0 0 3px rgba(214,196,170,0.18)",
                  }}
                />
                Availability
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.5, color: INK, marginTop: 14, letterSpacing: "-0.005em" }}>
                Open to a small number of select projects. Seattle-based, comfortable remote.
              </p>
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.28em", color: FAINT, marginBottom: 8 }}>
                Start a conversation
              </div>
              <a href="mailto:m.fern93@gmail.com" className="no-underline" style={{ fontSize: 16, color: INK, letterSpacing: "-0.01em" }}>
                m.fern93@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
