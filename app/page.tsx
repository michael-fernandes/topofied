import PageShell from "./components/page-shell";
import TopoHero from "./components/topo-hero";
import WhatIDoTriad from "./components/what-i-do-triad";

const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";
const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";

const FUN_PREVIEW = [
  { id: "radify",   name: "Radify",   year: "2020", note: "spotify-shaped curiosity engine", w: "1.4fr" },
  { id: "topofied", name: "Topofied", year: "2026", note: "this site, basically",            w: "1fr" },
  { id: "inkpot",   name: "Inkpot",   year: "2024", note: "generative ink painter",          w: "1fr" },
  { id: "tides",    name: "Tides",    year: "2023", note: "an excuse to look at NOAA data",  w: "1.2fr" },
];

export default function LandingPage() {
  return (
    <PageShell current="/" seed="landing-hero">
      <TopoHero height={900}>
        <div
          data-topo-id="summit"
          data-topo-hover-id="summit"
          data-topo-important=""
          data-topo-height="100"
          data-topo-falloff="150"
          data-topo-sharpness="1.3"
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            width: 1,
            height: 1,
            pointerEvents: "none",
          }}
        />

        <div
          data-topo-hidden=""
          className="font-mono uppercase"
          style={{
            position: "absolute",
            top: 110,
            right: 60,
            fontSize: 10,
            letterSpacing: "0.22em",
            color: FAINT,
            textAlign: "right",
            zIndex: 4,
          }}
        >
          <div style={{ color: DIM }}>N 47°36′</div>
          <div>W 122°19′</div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "52%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <div data-topo-hover-id="summit" style={{ padding: "24px 32px" }}>
            <div
              data-topo-hidden=""
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.35em",
                color: ACCENT,
                marginBottom: 22,
              }}
            >
              ▲ Summit · 2,340 m
            </div>
            <h1
              className="font-medium"
              style={{
                fontSize: "clamp(56px, 7vw, 96px)",
                letterSpacing: "-0.035em",
                lineHeight: 0.96,
                margin: 0,
                color: INK,
              }}
            >
              Michael fern
            </h1>
            <p
              style={{
                maxWidth: 520,
                margin: "26px auto 0",
                fontSize: 17,
                lineHeight: 1.55,
                color: DIM,
              }}
            >
              A designer who became an engineer, mostly so the designs would survive the trip.
            </p>
          </div>
        </div>

        <div
          data-topo-hidden=""
          className="font-mono uppercase"
          style={{
            position: "absolute",
            left: "50%",
            bottom: 40,
            transform: "translateX(-50%)",
            fontSize: 9,
            letterSpacing: "0.32em",
            color: FAINT,
            textAlign: "center",
            zIndex: 4,
          }}
        >
          <div style={{ marginBottom: 8 }}>↓ Begin descent</div>
          <div style={{ width: 1, height: 36, background: FAINT, margin: "0 auto" }} />
        </div>
      </TopoHero>

      {/* ── 01 — Practice ── */}
      <section className="px-page" style={{ paddingTop: 120, paddingBottom: 80 }}>
        <SectionHeader
          kicker="01 — Practice"
          title="I sit between design and engineering, mostly so neither side has to translate."
          subtitle="Three things I keep coming back to."
        />
        <WhatIDoTriad />
      </section>

      {/* ── 02 — Selected work ── */}
      <section className="px-page" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <SectionHeader
          kicker="02 — Selected work"
          title="Two projects I keep returning to."
          subtitle="One was a 4-year academic deep-dive on uncertainty. The other was the kind of project that finds you. Both are about helping people decide under conditions they didn't ask for."
        />

        <a
          href="/work"
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            border: `1px solid ${FAINT}`,
            padding: 40,
            marginBottom: 40,
            background: "rgba(235,226,212,0.012)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-8 md:gap-14">
            <div>
              <div
                className="font-mono uppercase"
                style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT, marginBottom: 18 }}
              >
                ▲ Feature · 2,340 m
              </div>
              <h3
                className="font-medium"
                style={{ fontSize: 38, letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0, color: INK }}
              >
                Uncertainty displays for on-the-go decision making
              </h3>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: DIM, marginTop: 22, maxWidth: 480 }}>
                A 4-year collaboration with the University of Washington Interactive Data Lab,
                ranking visual encodings of probabilistic transit data. People do real things with
                the bus they catch — turns out how you draw the uncertainty changes the bus they catch.
              </p>
              <div
                className="font-mono uppercase flex flex-wrap"
                style={{ gap: 24, marginTop: 28, fontSize: 10, letterSpacing: "0.22em", color: FAINT }}
              >
                <span>CHI 2018</span><span>·</span><span>NSF-funded</span><span>·</span>
                <span>Research + design</span><span>·</span><span>UW IDL</span>
              </div>
              <div
                className="font-mono uppercase"
                style={{ marginTop: 32, fontSize: 11, letterSpacing: "0.22em", color: INK }}
              >
                Read the case study →
              </div>
            </div>
            <Placeholder height={360} label="Project hero image" ratio="≈ 16:11" />
          </div>
        </a>

        <a
          href="/work"
          style={{
            display: "block",
            textDecoration: "none",
            color: "inherit",
            border: `1px solid ${FAINT}`,
            padding: 32,
            marginLeft: "auto",
            marginRight: "auto",
            width: "min(62%, 100%)",
            background: "rgba(235,226,212,0.012)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6 md:gap-8">
            <div>
              <div
                className="font-mono uppercase"
                style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT, marginBottom: 14 }}
              >
                ▲ 1,820 m
              </div>
              <h3
                className="font-medium"
                style={{ fontSize: 26, letterSpacing: "-0.015em", lineHeight: 1.15, margin: 0, color: INK }}
              >
                Communicating exponential risk, when most of the country was learning the word.
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 16 }}>
                IHME&apos;s COVID-19 forecast dashboard. Built fast, used by millions, briefed at the
                White House. A crash course in dataviz under deadline, scrutiny, and grief.
              </p>
              <div
                className="font-mono uppercase flex flex-wrap"
                style={{ gap: 18, marginTop: 22, fontSize: 10, letterSpacing: "0.22em", color: FAINT }}
              >
                <span>2020</span><span>·</span><span>IHME</span><span>·</span><span>Public dataviz</span>
              </div>
            </div>
            <Placeholder height={210} label="Dashboard still" ratio="≈ 4:3" />
          </div>
        </a>
      </section>

      {/* ── 03 — Field notes ── */}
      <section className="px-page" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <SectionHeader
          kicker="03 — Field notes & ephemera"
          title="Things made on weekends, mostly."
          subtitle="Toys, sketches, half-finished bets. The full collection lives at /fun."
        />
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-4">
          {FUN_PREVIEW.map((it) => (
            <a
              key={it.id}
              href={`/fun#${it.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                border: `1px solid ${FAINT}`,
                padding: 18,
                height: 240,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "rgba(235,226,212,0.012)",
              }}
            >
              <div
                data-topo-hidden=""
                style={{
                  flex: 1,
                  marginBottom: 14,
                  position: "relative",
                  background: "rgba(235,226,212,0.025)",
                  backgroundImage:
                    "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.025) 8px 9px)",
                }}
              >
                <span
                  className="font-mono uppercase"
                  style={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    color: FAINT,
                  }}
                >
                  still
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <div className="font-medium" style={{ fontSize: 17, color: INK }}>
                    {it.name}
                  </div>
                  <div
                    className="font-mono uppercase"
                    style={{ fontSize: 9, letterSpacing: "0.22em", color: FAINT }}
                  >
                    {it.year}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: DIM, marginTop: 4, lineHeight: 1.45 }}>
                  {it.note}
                </div>
              </div>
            </a>
          ))}
        </div>
        <a
          href="/fun"
          className="font-mono uppercase"
          style={{
            display: "inline-block",
            marginTop: 28,
            fontSize: 11,
            letterSpacing: "0.22em",
            color: INK,
            textDecoration: "none",
            borderBottom: `1px solid ${ACCENT}`,
            paddingBottom: 4,
          }}
        >
          Wander the foothills →
        </a>
      </section>

      {/* ── 04 — Base camp ── */}
      <section
        className="px-page"
        style={{ paddingTop: 80, paddingBottom: 60, borderTop: `1px solid ${FAINT}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] items-start gap-6 md:gap-20">
          <div
            className="font-mono uppercase flex items-center"
            style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, gap: 14 }}
          >
            <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
            04 — Base camp
          </div>
          <div>
            <p
              style={{ fontSize: 19, lineHeight: 1.55, color: INK, margin: 0, letterSpacing: "-0.005em" }}
            >
              I&apos;m a designer who learned to code so the ideas would stop dying in handoff.
              I work on tools for thinking — usually with data, often with uncertainty,
              occasionally for fun.
            </p>
            <a
              href="/about"
              className="font-mono uppercase"
              style={{
                display: "inline-block",
                marginTop: 24,
                fontSize: 11,
                letterSpacing: "0.22em",
                color: DIM,
                textDecoration: "none",
                borderBottom: `1px solid ${FAINT}`,
                paddingBottom: 4,
              }}
            >
              Read the long version →
            </a>
          </div>
        </div>
      </section>
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
        className="font-medium"
        style={{
          fontSize: "clamp(34px, 4vw, 56px)",
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          margin: 0,
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

function Placeholder({
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
