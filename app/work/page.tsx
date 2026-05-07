import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";
import Link from "next/link";

const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";
const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";

const META = [
  { k: "Role",      v: "Designer + researcher" },
  { k: "Year",      v: "2014 – 2018" },
  { k: "Lab",       v: "UW IDL" },
  { k: "Funded by", v: "NSF" },
  { k: "Published", v: "ACM CHI 2018" },
];

const PROCESS = [
  { n: "01", t: "Catalog the encodings",
    b: "Dot plots, gradient plots, density strips, intervals, pdf overlays. Five families, twenty-something variants. Mostly drawing." },
  { n: "02", t: "Run the studies",
    b: "Crowdsourced experiments where participants made transit decisions under simulated pressure. Two studies, ~600 participants total." },
  { n: "03", t: "Rank and write",
    b: "Quantile dot plots came out near the top — a finding that's since shown up in weather, election, and finance dataviz. Published at CHI 2018." },
];

const STATS = [
  { stat: "≈600",     l: "participants across two studies" },
  { stat: "CHI '18",  l: "honorable mention, peer-reviewed" },
  { stat: "+34%",     l: "decision accuracy with quantile dot plots vs. point estimate" },
];

const ARTIFACTS = [
  { k: "Read", v: "Paper · CHI 2018 (PDF)" },
  { k: "Code", v: "github.com/uwdata" },
  { k: "Talk", v: "CHI 2018 · 18 min" },
];

export default function WorkPage() {
  return (
    <PageShell current="/work">
      <TopoHero height={720} seed="case-uncertainty">
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 200,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "end",
            gap: 60,
          }}
        >
          <div>
            <div
              data-topo-hidden=""
              className="font-mono uppercase flex items-center"
              style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 22, gap: 14 }}
            >
              <Link href="/" style={{ color: DIM, textDecoration: "none" }}>← Work</Link>
              <span style={{ color: FAINT }}>/</span>
              <span>Case 01</span>
              <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
              <span>2,340 m · 2014–2018</span>
            </div>
            <h1
              data-topo-id="title"
              data-topo-hover-id="title"
              data-topo-important=""
              data-topo-height="90"
              data-topo-falloff="200"
              className="font-medium m-0"
              style={{
                fontSize: "clamp(40px, 5.5vw, 72px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.0,
                color: INK,
                maxWidth: 1100,
              }}
            >
              Uncertainty displays for on-the-go decision making
            </h1>
          </div>
          <div
            data-topo-hidden=""
            className="font-mono uppercase text-right"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              color: FAINT,
              minWidth: 220,
            }}
          >
            <div style={{ color: DIM }}>N 47°39′ W 122°18′</div>
            <div style={{ marginTop: 6 }}>UW Interactive Data Lab</div>
          </div>
        </div>
      </TopoHero>

      {/* ── Meta strip ── */}
      <section
        style={{
          margin: "0 60px",
          padding: "22px 0",
          borderTop: `1px solid ${FAINT}`,
          borderBottom: `1px solid ${FAINT}`,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 32,
        }}
      >
        {META.map((m) => (
          <div key={m.k}>
            <div
              className="font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.2em", color: FAINT, marginBottom: 8 }}
            >
              {m.k}
            </div>
            <div style={{ color: INK, fontSize: 14 }}>{m.v}</div>
          </div>
        ))}
      </section>

      {/* ── 01 Problem ── */}
      <section style={{ padding: "60px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 60, alignItems: "start" }}>
          <LabelCol>01 — The problem</LabelCol>
          <div>
            <p
              className="m-0"
              style={{
                fontSize: "clamp(22px, 2.5vw, 32px)",
                letterSpacing: "-0.018em",
                lineHeight: 1.25,
                color: INK,
                textWrap: "pretty",
              }}
            >
              People do real things with the bus they catch. Showing them a single arrival time hides
              a probability distribution that — most of the time — is the actual thing they care about.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: DIM, marginTop: 28, maxWidth: 760 }}>
              We worked with the UW Interactive Data Lab to design and rank visual encodings of
              uncertainty for real-time transit data. The deliverable was a perceptual ranking; the
              byproduct was a much better understanding of how people actually decide under time pressure.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 Process ── */}
      <section style={{ padding: "60px 60px" }}>
        <SectionHeader kicker="02 — Process" title="Encodings, then experiments, then ranking." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
          {PROCESS.map((step) => (
            <div
              key={step.n}
              style={{ border: `1px solid ${FAINT}`, padding: 28, minHeight: 240 }}
            >
              <div
                className="font-mono uppercase"
                style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT, marginBottom: 16 }}
              >
                ▲ Step {step.n}
              </div>
              <h3
                className="font-medium m-0"
                style={{ fontSize: 20, letterSpacing: "-0.012em", lineHeight: 1.2, color: INK, marginBottom: 12 }}
              >
                {step.t}
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, margin: 0 }}>{step.b}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 32 }}>
          <Placeholder height={300} label="Encoding catalog · Figure 4 · 16:9" />
          <div>
            <div
              className="font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.22em", color: FAINT, marginBottom: 12 }}
            >
              Figure 4 · encodings tested
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, margin: 0 }}>
              Each row is a different way of drawing the same arrival distribution — 11 minutes, σ ≈ 3.4.
              The question is which one people actually use to decide whether to start walking now.
            </p>
          </div>
        </div>
      </section>

      {/* ── 03 Outcomes ── */}
      <section style={{ padding: "60px 60px" }}>
        <SectionHeader kicker="03 — Outcomes" title="The chart that won, and what it changed." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 40 }}>
          {STATS.map((s) => (
            <div key={s.l} style={{ border: `1px solid ${FAINT}`, padding: 32 }}>
              <div
                className="font-medium"
                style={{
                  fontSize: 56,
                  letterSpacing: "-0.02em",
                  color: ACCENT,
                  lineHeight: 1,
                  marginBottom: 14,
                }}
              >
                {s.stat}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: DIM }}>{s.l}</div>
            </div>
          ))}
        </div>
        <Placeholder height={260} label="Final ranking — Figure 11 · 21:9" />
      </section>

      {/* ── 04 Reflection ── */}
      <section style={{ padding: "60px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 60, alignItems: "start" }}>
          <LabelCol>04 — Reflection</LabelCol>
          <p
            className="m-0"
            style={{
              fontSize: 22,
              letterSpacing: "-0.012em",
              lineHeight: 1.4,
              color: INK,
              maxWidth: 820,
              textWrap: "pretty",
            }}
          >
            The thing I keep returning to: the perceptual job of a chart is sometimes lower-level
            than we admit. People aren&apos;t reading axes. They&apos;re counting dots, eyeballing
            density, doing fast-and-frugal arithmetic. Designing for that, instead of for the
            conference talk, was the real lesson.
          </p>
        </div>
      </section>

      {/* ── Artifacts ── */}
      <section style={{ padding: "20px 60px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {ARTIFACTS.map((l) => (
            <a
              key={l.k}
              href="#"
              style={{
                display: "block",
                padding: 24,
                border: `1px solid ${FAINT}`,
                textDecoration: "none",
                color: INK,
              }}
            >
              <div
                className="font-mono uppercase"
                style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT, marginBottom: 12 }}
              >
                ▲ {l.k}
              </div>
              <div style={{ fontSize: 16, color: INK }}>{l.v}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Next ── */}
      <section style={{ padding: "60px 60px 0" }}>
        <a
          href="#"
          className="flex justify-between items-center"
          style={{
            padding: "32px 0",
            borderTop: `1px solid ${FAINT}`,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div>
            <div
              className="font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.28em", color: FAINT, marginBottom: 8 }}
            >
              Next ridge →
            </div>
            <div
              className="font-medium"
              style={{ fontSize: 24, color: INK, letterSpacing: "-0.015em" }}
            >
              Communicating exponential risk · IHME COVID-19
            </div>
          </div>
          <div
            className="font-mono uppercase"
            style={{ fontSize: 11, letterSpacing: "0.28em", color: ACCENT }}
          >
            Case 02 →
          </div>
        </a>
      </section>
    </PageShell>
  );
}

function SectionHeader({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div
        data-topo-hidden=""
        className="font-mono uppercase flex items-center"
        style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 18, gap: 14 }}
      >
        <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
        {kicker}
      </div>
      <h2
        className="font-medium m-0"
        style={{ fontSize: 28, letterSpacing: "-0.018em", lineHeight: 1.2, color: INK }}
      >
        {title}
      </h2>
    </div>
  );
}

function LabelCol({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-topo-hidden=""
      className="font-mono uppercase flex items-center"
      style={{
        fontSize: 10,
        letterSpacing: "0.32em",
        color: ACCENT,
        paddingTop: 12,
        gap: 10,
      }}
    >
      <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
      {children}
    </div>
  );
}

function Placeholder({ height, label }: { height: number; label: string }) {
  return (
    <div
      data-topo-hidden=""
      className="flex items-center justify-center relative"
      style={{
        width: "100%",
        height,
        background: "rgba(235,226,212,0.03)",
        border: `1px solid ${FAINT}`,
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.025) 8px 9px)",
        }}
      />
      <span
        className="font-mono uppercase relative"
        style={{
          fontSize: 9,
          letterSpacing: "0.22em",
          color: FAINT,
        }}
      >
        {label}
      </span>
    </div>
  );
}
