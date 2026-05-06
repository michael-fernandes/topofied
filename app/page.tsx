import PageShell from "./components/page-shell";
import WhatIDoTriad from "./components/what-i-do-triad";

const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";
const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";

const funItems = [
  { name: "Radify", year: "2020", note: "spotify-shaped curiosity engine", w: "1.4fr" },
  { name: "Topofied", year: "2026", note: "this site, basically", w: "1fr" },
  { name: "Inkpot", year: "2024", note: "generative ink painter", w: "1fr" },
  { name: "Tides", year: "2023", note: "an excuse to look at NOAA data", w: "1.2fr" },
];

export default function Home() {
  return (
    <PageShell current="/">
      <div className="max-w-6xl mx-auto px-12">

        {/* ───── HERO ───── */}
        <section className="relative pt-44 pb-40 text-center">
          <div
            data-topo-id="summit"
            data-topo-hover-id="summit"
            data-topo-important=""
            data-topo-height="100"
            data-topo-falloff="150"
            data-topo-sharpness="1.3"
            className="inline-block px-8 py-6"
          >
            <div
              data-topo-hidden=""
              className="font-mono uppercase mb-6"
              style={{ fontSize: 10, letterSpacing: "0.35em", color: ACCENT }}
            >
              ▲ Summit · 2,340 m
            </div>
            <h1
              className="font-medium m-0"
              style={{
                fontSize: 96,
                letterSpacing: "-0.035em",
                lineHeight: 0.96,
                color: INK,
              }}
            >
              Michael Fernandes
            </h1>
            <p
              className="mx-auto"
              style={{
                maxWidth: 520,
                marginTop: 26,
                fontSize: 17,
                lineHeight: 1.55,
                color: DIM,
              }}
            >
              A designer who became an engineer, mostly so the designs would survive the trip.
            </p>
          </div>

          <div
            data-topo-hidden=""
            className="font-mono uppercase mx-auto mt-16 text-center"
            style={{ fontSize: 9, letterSpacing: "0.32em", color: FAINT }}
          >
            <div style={{ marginBottom: 8 }}>↓ Begin descent</div>
            <div style={{ width: 1, height: 36, background: FAINT, margin: "0 auto" }} />
          </div>
        </section>

        {/* ───── WHAT I DO ───── */}
        <section className="py-24">
          <SectionHeader
            kicker="01 — Practice"
            title="I sit between design and engineering, mostly so neither side has to translate."
            subtitle="Three things I keep coming back to."
          />
          <WhatIDoTriad />
        </section>

        {/* ───── SELECTED WORK ───── */}
        <section className="py-24">
          <SectionHeader
            kicker="02 — Selected work"
            title="Two projects I keep returning to."
            subtitle="One was a 4-year academic deep-dive on uncertainty. The other was the kind of project that finds you. Both are about helping people decide under conditions they didn't ask for."
          />

          {/* Feature project */}
          <a
            href="/article"
            data-topo-id="feat"
            data-topo-hover-id="feat"
            data-topo-important=""
            data-topo-height="70"
            data-topo-falloff="220"
            className="block no-underline text-inherit relative mb-10"
            style={{
              border: `1px solid ${FAINT}`,
              padding: 40,
              background: "rgba(235,226,212,0.012)",
            }}
          >
            <div className="grid gap-14" style={{ gridTemplateColumns: "1fr 1.1fr" }}>
              <div>
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT, marginBottom: 18 }}
                >
                  ▲ Feature · 2,340 m
                </div>
                <h3
                  className="font-medium m-0"
                  style={{ fontSize: 38, letterSpacing: "-0.02em", lineHeight: 1.1, color: INK }}
                >
                  Uncertainty displays for on-the-go decision making
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: DIM, marginTop: 22, maxWidth: 480 }}>
                  A 4-year collaboration with the University of Washington Interactive Data Lab, ranking
                  visual encodings of probabilistic transit data. People do real things with the bus they
                  catch — turns out how you draw the uncertainty changes the bus they catch.
                </p>
                <div
                  className="font-mono uppercase flex flex-wrap"
                  style={{ gap: 24, marginTop: 28, fontSize: 10, letterSpacing: "0.22em", color: FAINT }}
                >
                  <span>CHI 2018</span>
                  <span>·</span>
                  <span>NSF-funded</span>
                  <span>·</span>
                  <span>Research + design</span>
                  <span>·</span>
                  <span>UW IDL</span>
                </div>
                <div
                  className="font-mono uppercase"
                  style={{ marginTop: 32, fontSize: 11, letterSpacing: "0.22em", color: INK }}
                >
                  Read the case study →
                </div>
              </div>
              <PlaceholderImage height={360} label="Project hero image" ratio="≈ 16:11" />
            </div>
          </a>

          {/* Secondary project — half-width, offset right */}
          <a
            href="#"
            data-topo-id="sec"
            data-topo-hover-id="sec"
            data-topo-important=""
            data-topo-height="50"
            data-topo-falloff="150"
            className="block no-underline text-inherit relative ml-auto"
            style={{
              border: `1px solid ${FAINT}`,
              padding: 32,
              width: "62%",
              background: "rgba(235,226,212,0.012)",
            }}
          >
            <div className="grid gap-8" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
              <div>
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT, marginBottom: 14 }}
                >
                  ▲ 1,820 m
                </div>
                <h3
                  className="font-medium m-0"
                  style={{ fontSize: 26, letterSpacing: "-0.015em", lineHeight: 1.15, color: INK }}
                >
                  Communicating exponential risk, when most of the country was learning the word.
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: DIM, marginTop: 16 }}>
                  IHME&apos;s COVID-19 forecast dashboard. Built fast, used by millions, briefed at the
                  White House. A crash course in dataviz under deadline, scrutiny, and grief.
                </p>
                <div
                  className="font-mono uppercase flex"
                  style={{ gap: 18, marginTop: 22, fontSize: 10, letterSpacing: "0.22em", color: FAINT }}
                >
                  <span>2020</span>
                  <span>·</span>
                  <span>IHME</span>
                  <span>·</span>
                  <span>Public dataviz</span>
                </div>
              </div>
              <PlaceholderImage height={210} label="Dashboard still" ratio="≈ 4:3" />
            </div>
          </a>
        </section>

        {/* ───── FUN PREVIEW ───── */}
        <section className="py-24">
          <SectionHeader
            kicker="03 — Field notes & ephemera"
            title="Things made on weekends, mostly."
            subtitle="Toys, sketches, half-finished bets. The full collection lives at /learn."
          />
          <div
            className="grid"
            style={{ gridTemplateColumns: funItems.map((i) => i.w).join(" "), gap: 18 }}
          >
            {funItems.map((it) => (
              <a
                key={it.name}
                href={`/learn#${it.name.toLowerCase()}`}
                data-topo-id={`fun-${it.name}`}
                data-topo-hover-id={`fun-${it.name}`}
                data-topo-important=""
                data-topo-height="35"
                data-topo-falloff="70"
                className="no-underline text-inherit flex flex-col justify-between"
                style={{
                  border: `1px solid ${FAINT}`,
                  padding: 18,
                  height: 240,
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
                  <div
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
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-baseline">
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
            href="/learn"
            data-topo-id="fun-cta"
            data-topo-hover-id="fun-cta"
            data-topo-important=""
            data-topo-height="30"
            data-topo-falloff="60"
            className="inline-block font-mono uppercase no-underline"
            style={{
              marginTop: 28,
              fontSize: 11,
              letterSpacing: "0.22em",
              color: INK,
              borderBottom: `1px solid ${ACCENT}`,
              paddingBottom: 4,
            }}
          >
            Wander the foothills →
          </a>
        </section>

        {/* ───── ABOUT TEASER ───── */}
        <section className="py-16" style={{ borderTop: `1px solid ${FAINT}` }}>
          <div className="grid gap-20 items-start pt-12" style={{ gridTemplateColumns: "1fr 1.5fr" }}>
            <div
              className="font-mono uppercase flex items-center"
              style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, gap: 14 }}
            >
              <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
              04 — Base camp
            </div>
            <div>
              <p
                className="m-0"
                style={{ fontSize: 19, lineHeight: 1.55, color: INK, letterSpacing: "-0.005em" }}
              >
                I&apos;m a designer who learned to code so the ideas would stop dying in handoff. I work on
                tools for thinking — usually with data, often with uncertainty, occasionally for fun.
              </p>
              <a
                href="/dashboard"
                data-topo-id="about-cta"
                data-topo-hover-id="about-cta"
                data-topo-important=""
                data-topo-height="30"
                data-topo-falloff="60"
                className="inline-block font-mono uppercase no-underline"
                style={{
                  marginTop: 24,
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  color: DIM,
                  borderBottom: `1px solid ${FAINT}`,
                  paddingBottom: 4,
                }}
              >
                Read the long version →
              </a>
            </div>
          </div>
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
