import PageShell from "../components/page-shell";

const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";
const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";

export default function Article() {
  return (
    <PageShell current="/article">
      <div className="max-w-6xl mx-auto px-12">

        {/* ── Hero ── */}
        <section className="pt-44 pb-16">
          <div
            data-topo-id="title"
            data-topo-hover-id="title"
            data-topo-important=""
            data-topo-height="90"
            data-topo-falloff="200"
            className="grid items-end gap-14"
            style={{ gridTemplateColumns: "1fr auto" }}
          >
            <div>
              <div
                data-topo-hidden=""
                className="font-mono uppercase flex items-center mb-6"
                style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, gap: 14 }}
              >
                <a href="/" className="no-underline" style={{ color: DIM }}>
                  ← Work
                </a>
                <span style={{ color: FAINT }}>/</span>
                <span>Case 01</span>
                <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
                <span>2,340 m · 2014–2018</span>
              </div>
              <h1
                className="font-medium m-0"
                style={{ fontSize: 72, letterSpacing: "-0.03em", lineHeight: 1.0, color: INK, maxWidth: 1100 }}
              >
                Uncertainty displays for on-the-go decision making
              </h1>
            </div>
            <div
              data-topo-hidden=""
              className="font-mono uppercase text-right"
              style={{ fontSize: 10, letterSpacing: "0.22em", color: FAINT, minWidth: 220 }}
            >
              <div style={{ color: DIM }}>N 47°39′ W 122°18′</div>
              <div style={{ marginTop: 6 }}>UW Interactive Data Lab</div>
            </div>
          </div>
        </section>

        {/* ── Meta strip ── */}
        <div
          data-topo-hidden=""
          className="grid font-mono uppercase"
          style={{
            borderTop: `1px solid ${FAINT}`,
            borderBottom: `1px solid ${FAINT}`,
            padding: "22px 0",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 32,
            fontSize: 10,
            letterSpacing: "0.2em",
          }}
        >
          {[
            { k: "Role", v: "Designer + researcher" },
            { k: "Year", v: "2014 – 2018" },
            { k: "Lab", v: "UW IDL" },
            { k: "Funded by", v: "NSF" },
            { k: "Published", v: "ACM CHI 2018" },
          ].map((m) => (
            <div key={m.k}>
              <div style={{ color: FAINT, marginBottom: 8 }}>{m.k}</div>
              <div
                className="font-sans"
                style={{ color: INK, letterSpacing: "0.05em", textTransform: "none", fontSize: 14 }}
              >
                {m.v}
              </div>
            </div>
          ))}
        </div>

        {/* ── Pull quote / problem statement ── */}
        <section className="py-24">
          <div className="grid gap-14 items-start" style={{ gridTemplateColumns: "180px 1fr" }}>
            <div
              className="font-mono uppercase flex items-center"
              style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, paddingTop: 12, gap: 10 }}
            >
              <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
              01 — The problem
            </div>
            <div>
              <p
                className="m-0"
                style={{
                  fontSize: 32,
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
                uncertainty for real-time transit data. The deliverable was a perceptual ranking;
                the byproduct was a much better understanding of how people actually decide under
                time pressure.
              </p>
            </div>
          </div>
        </section>

        {/* ── Process ── */}
        <section className="py-16">
          <SectionHeader kicker="02 — Process" title="Encodings, then experiments, then ranking." />
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              {
                n: "01",
                t: "Catalog the encodings",
                b: "Dot plots, gradient plots, density strips, intervals, pdf overlays. Five families, twenty-something variants. Mostly drawing.",
              },
              {
                n: "02",
                t: "Run the studies",
                b: "Crowdsourced experiments where participants made transit decisions under simulated pressure. Two studies, ~600 participants total.",
              },
              {
                n: "03",
                t: "Rank and write",
                b: "Quantile dot plots came out near the top — a finding that's since shown up in weather, election, and finance dataviz. Published at CHI 2018.",
              },
            ].map((step) => (
              <div key={step.n} style={{ border: `1px solid ${FAINT}`, padding: 28, minHeight: 240 }}>
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT, marginBottom: 16 }}
                >
                  ▲ Step {step.n}
                </div>
                <h3
                  className="font-medium"
                  style={{
                    fontSize: 20,
                    letterSpacing: "-0.012em",
                    lineHeight: 1.2,
                    margin: "0 0 12px",
                    color: INK,
                  }}
                >
                  {step.t}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, margin: 0 }}>{step.b}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-8" style={{ marginTop: 40, gridTemplateColumns: "1.6fr 1fr" }}>
            <PlaceholderImage height={300} label="Encoding catalog · Figure 4" ratio="16:9" />
            <div>
              <div
                className="font-mono uppercase"
                style={{ fontSize: 10, letterSpacing: "0.22em", color: FAINT, marginBottom: 12 }}
              >
                Figure 4 · encodings tested
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, margin: 0 }}>
                Each row is a different way of drawing the same arrival distribution — 11 minutes,
                σ ≈ 3.4. The question is which one people actually use to decide whether to start
                walking now.
              </p>
            </div>
          </div>
        </section>

        {/* ── Outcomes ── */}
        <section className="py-16">
          <SectionHeader kicker="03 — Outcomes" title="The chart that won, and what it changed." />
          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              { stat: "≈600", l: "participants across two studies" },
              { stat: "CHI '18", l: "honorable mention, peer-reviewed" },
              { stat: "+34%", l: "decision accuracy with quantile dot plots vs. point estimate" },
            ].map((s) => (
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
          <div style={{ marginTop: 40 }}>
            <PlaceholderImage height={260} label="Final ranking — Figure 11" ratio="21:9" />
          </div>
        </section>

        {/* ── Reflection ── */}
        <section className="py-16">
          <div className="grid gap-14 items-start" style={{ gridTemplateColumns: "180px 1fr" }}>
            <div
              className="font-mono uppercase flex items-center"
              style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, paddingTop: 12, gap: 10 }}
            >
              <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
              04 — Reflection
            </div>
            <div>
              <p
                className="m-0"
                style={{
                  fontSize: 22,
                  letterSpacing: "-0.012em",
                  lineHeight: 1.4,
                  color: INK,
                  textWrap: "pretty",
                  maxWidth: 820,
                }}
              >
                The thing I keep returning to: the perceptual job of a chart is sometimes lower-level than
                we admit. People aren&apos;t reading axes. They&apos;re counting dots, eyeballing density, doing
                fast-and-frugal arithmetic. Designing for that, instead of for the conference talk, was
                the real lesson.
              </p>
            </div>
          </div>
        </section>

        {/* ── Links / artifacts ── */}
        <section style={{ borderTop: `1px solid ${FAINT}`, paddingTop: 36, paddingBottom: 36 }}>
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {[
              { k: "Read", v: "Paper · CHI 2018 (PDF)" },
              { k: "Code", v: "github.com/uwdata" },
              { k: "Talk", v: "CHI 2018 · 18 min" },
            ].map((l) => (
              <a
                key={l.k}
                href="#"
                data-topo-id={`link-${l.k}`}
                data-topo-hover-id={`link-${l.k}`}
                data-topo-important=""
                data-topo-height="30"
                data-topo-falloff="80"
                className="block no-underline"
                style={{ padding: 24, border: `1px solid ${FAINT}`, color: INK }}
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

        {/* ── Next case ── */}
        <section style={{ paddingBottom: 40 }}>
          <a
            href="#"
            className="flex justify-between items-center no-underline text-inherit"
            style={{ padding: "32px 0", borderTop: `1px solid ${FAINT}` }}
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
      </div>
    </PageShell>
  );
}

function SectionHeader({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: 64 }}>
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
        style={{
          fontSize: 56,
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          color: INK,
          maxWidth: 900,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 17, lineHeight: 1.55, color: DIM, maxWidth: 620, margin: "20px 0 0" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PlaceholderImage({
  height,
  label,
  ratio,
}: {
  height: number;
  label: string;
  ratio: string;
}) {
  return (
    <div
      data-topo-hidden=""
      className="flex items-center justify-center font-mono uppercase relative"
      style={{
        width: "100%",
        height,
        background: "rgba(235,226,212,0.025)",
        border: `1px dashed ${FAINT}`,
        fontSize: 10,
        letterSpacing: "0.22em",
        color: FAINT,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.025) 8px 9px)",
        }}
      />
      <div className="text-center" style={{ lineHeight: 1.6 }}>
        <div style={{ color: DIM }}>{label}</div>
        <div style={{ color: FAINT, marginTop: 4, fontSize: 9 }}>{ratio}</div>
      </div>
    </div>
  );
}
