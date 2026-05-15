import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";
import Link from "next/link";

const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";
const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";

const PROJECTS = [
  { id: "radify",   name: "Radify",   year: "2020", note: "A spotify-shaped curiosity engine. You feed it an artist, it walks the graph." },
  { id: "topofied", name: "Topofied", year: "2026", note: "This site, basically. Contour lines as importance hierarchy." },
  { id: "inkpot",   name: "Inkpot",   year: "2024", note: "Generative ink painter. Brownian motion in a teacup." },
  { id: "tides",    name: "Tides",    year: "2023", note: "An excuse to look at NOAA buoy data for six months." },
];

const EXPERIMENTS = [
  { name: "Cellular grid · 60fps", note: "WebGL · 2025", year: "2025" },
  { name: "Probability rivers",    note: "d3 · canvas",  year: "" },
];

const SKETCHES = [
  { title: "Untitled · contour study 04", medium: "ink + pen, a slow afternoon" },
  { title: "Shader doodle · raymarched terrain", medium: "fragment shader" },
  { title: "Margin doodle · February", medium: "" },
];

const PHOTOS = [
  { title: "Cascades · 2022" },
  { title: "Olympic NP · 2023" },
  { title: "Studio · 2025" },
];

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
    <PageShell current="/work" seed="case-uncertainty">
      <TopoHero height={720}>
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 md:gap-14"
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: 200,
            alignItems: "end",
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
            className="hidden md:block font-mono uppercase text-right"
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
        className="mx-page grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 py-[22px] border-t border-b"
        style={{
          borderColor: FAINT,
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
      <section className="px-page" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-[60px]" style={{ alignItems: "start" }}>
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
      <section className="px-page" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <SectionHeader kicker="02 — Process" title="Encodings, then experiments, then ranking." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" style={{ marginBottom: 40 }}>
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

        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-4 md:gap-8">
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
      <section className="px-page" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <SectionHeader kicker="03 — Outcomes" title="The chart that won, and what it changed." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" style={{ marginBottom: 40 }}>
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
      <section className="px-page" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-[60px]" style={{ alignItems: "start" }}>
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
      <section className="px-page" style={{ paddingTop: 20 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
      <section className="px-page" style={{ paddingTop: 60 }}>
        <a
          href="#"
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
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

      {/* ── Fun & ephemera ── */}
      <section className="px-page" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div
          style={{
            borderTop: `1px solid ${FAINT}`,
            paddingTop: 60,
          }}
        >
          <div
            data-topo-hidden=""
            className="font-mono uppercase flex items-center"
            style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 18, gap: 14 }}
          >
            <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
            Foothills · 800–1,400 m
          </div>
          <h2
            className="font-medium m-0"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "-0.025em", lineHeight: 1.05, color: INK, marginBottom: 12 }}
          >
            Fun &amp; ephemera
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: DIM, marginTop: 16, maxWidth: 540, marginBottom: 56 }}>
            Things made on weekends. Nothing here is a deliverable. Some of it doesn&apos;t even work.
          </p>

          <CategoryLabel first>Projects</CategoryLabel>
          <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-4" style={{ marginBottom: 18 }}>
            {PROJECTS.map((p) => (
              <a
                key={p.id}
                id={p.id}
                href={`#${p.id}`}
                style={{
                  border: `1px solid ${FAINT}`,
                  background: "rgba(235,226,212,0.012)",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <CardStill label="project" minHeight={140} />
                <CardMeta name={p.name} year={p.year} />
                <div style={{ fontSize: 12, color: DIM, lineHeight: 1.45 }}>{p.note}</div>
              </a>
            ))}
          </div>

          <CategoryLabel>Experiments</CategoryLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: 18 }}>
            {EXPERIMENTS.map((e) => (
              <div
                key={e.name}
                style={{
                  border: `1px solid ${FAINT}`,
                  background: "rgba(235,226,212,0.012)",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardStill label="experiment" minHeight={100} />
                <CardMeta name={e.name} year={e.year} />
                <div style={{ fontSize: 12, color: DIM, lineHeight: 1.45 }}>{e.note}</div>
              </div>
            ))}
          </div>

          <CategoryLabel>Sketches</CategoryLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ marginBottom: 18 }}>
            {SKETCHES.map((s) => (
              <div
                key={s.title}
                style={{
                  border: `1px solid ${FAINT}`,
                  background: "rgba(235,226,212,0.012)",
                  padding: 14,
                }}
              >
                <div
                  data-topo-hidden=""
                  style={{
                    height: 160,
                    background: "rgba(235,226,212,0.015)",
                    backgroundImage: "repeating-linear-gradient(45deg, transparent 0 6px, rgba(235,226,212,0.04) 6px 7px)",
                    position: "relative",
                    marginBottom: 10,
                  }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{ position: "absolute", top: 8, left: 8, fontSize: 9, letterSpacing: "0.22em", color: FAINT }}
                  >
                    sketch
                  </span>
                </div>
                <div style={{ fontSize: 13, color: DIM, fontStyle: "italic" }}>{s.title}</div>
                {s.medium && (
                  <div className="font-mono uppercase" style={{ fontSize: 9, color: FAINT, letterSpacing: "0.18em", marginTop: 4 }}>
                    {s.medium}
                  </div>
                )}
              </div>
            ))}
          </div>

          <CategoryLabel>Photos</CategoryLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" style={{ marginBottom: 18 }}>
            {PHOTOS.map((ph) => (
              <div
                key={ph.title}
                style={{
                  border: `1px solid ${FAINT}`,
                  background: "rgba(235,226,212,0.012)",
                  padding: 14,
                }}
              >
                <div
                  data-topo-hidden=""
                  style={{
                    height: 200,
                    background: "linear-gradient(135deg, hsla(24, 18%, 22%, 0.6), hsla(24, 14%, 12%, 0.9))",
                    position: "relative",
                    marginBottom: 8,
                  }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{ position: "absolute", top: 8, left: 8, fontSize: 9, letterSpacing: "0.22em", color: "rgba(235,226,212,0.5)" }}
                  >
                    photo
                  </span>
                </div>
                <div className="font-mono uppercase" style={{ fontSize: 9, color: FAINT, letterSpacing: "0.18em" }}>
                  {ph.title}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{ padding: "32px 0 0", fontStyle: "italic", fontSize: 20, lineHeight: 1.4, color: DIM }}
          >
            &ldquo;The map is not the territory, but it does have to load fast.&rdquo;
          </div>
        </div>
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

function CategoryLabel({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <div
      data-topo-hidden=""
      className="font-mono uppercase flex items-center"
      style={{
        fontSize: 10,
        letterSpacing: "0.32em",
        color: ACCENT,
        marginBottom: 24,
        marginTop: first ? 0 : 56,
        paddingTop: first ? 0 : 24,
        borderTop: first ? "none" : `1px solid ${FAINT}`,
        gap: 14,
      }}
    >
      <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
      {children}
    </div>
  );
}

function CardStill({ label, minHeight }: { label: string; minHeight: number }) {
  return (
    <div
      data-topo-hidden=""
      style={{
        flex: 1,
        minHeight,
        background: "rgba(235,226,212,0.025)",
        backgroundImage: "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.025) 8px 9px)",
        position: "relative",
        marginBottom: 14,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ position: "absolute", top: 8, left: 8, fontSize: 9, letterSpacing: "0.22em", color: FAINT }}
      >
        {label}
      </span>
    </div>
  );
}

function CardMeta({ name, year }: { name: string; year: string }) {
  return (
    <div className="flex justify-between items-baseline" style={{ marginBottom: 4 }}>
      <span className="font-medium" style={{ fontSize: 17, color: INK }}>{name}</span>
      {year && (
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: FAINT }}>
          {year}
        </span>
      )}
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
