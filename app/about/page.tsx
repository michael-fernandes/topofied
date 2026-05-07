import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";

const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";
const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";

const TIMELINE = [
  { y: "2014", h: 1200, t: "Started at the UW Interactive Data Lab",
    b: "Joined as a research assistant designing visual encodings of probabilistic data. Stayed for four years." },
  { y: "2018", h: 2340, t: "CHI 2018 · uncertainty displays paper",
    b: "Honorable mention. The encoding ranking still holds up." },
  { y: "2019", h: 1800, t: "Moved to IHME — disease modeling group",
    b: "Built tooling for forecasting researchers. A few months later, the world got interesting." },
  { y: "2020", h: 1820, t: "COVID-19 forecast dashboard",
    b: "Used by millions, briefed by the White House. A masterclass in dataviz under deadline." },
  { y: "2022", h: 1450, t: "Independent — design systems & dataviz consulting",
    b: "Internal tools, prototypes, the unglamorous infrastructure that makes software feel intentional." },
  { y: "Now",  h: 1500, t: "UX engineering · still here",
    b: "Working on tools for thinking. Drawing contour lines on things." },
];

const TOOLS = [
  "TypeScript", "React / Next.js", "d3", "Three / WebGL", "Figma",
  "Python / pandas", "research methods", "design systems",
  "rapid prototyping", "uncertainty viz", "writing", "interviewing",
];

const RECOGNITION = [
  { y: "2020", t: "IHME COVID-19 dashboard · briefed by The White House" },
  { y: "2018", t: "ACM CHI · Honorable Mention, uncertainty displays" },
  { y: "2017", t: "VIS · poster, quantile dot plots" },
  { y: "2016", t: "InfoVis · workshop talk, transit data" },
];

export default function AboutPage() {
  return (
    <PageShell current="/about">
      <TopoHero height={580} seed="about-hero">
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 180,
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 80,
            alignItems: "start",
          }}
        >
          <div
            data-topo-id="bio"
            data-topo-hover-id="bio"
            data-topo-important=""
            data-topo-height="80"
            data-topo-falloff="200"
            style={{ padding: 4 }}
          >
            <div
              data-topo-hidden=""
              className="font-mono uppercase flex items-center"
              style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 24, gap: 14 }}
            >
              <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
              Base camp · 1,200 m
            </div>
            <h1
              className="font-medium m-0"
              style={{
                fontSize: "clamp(36px, 4.5vw, 56px)",
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: INK,
                maxWidth: 800,
              }}
            >
              Hi, I&apos;m Michael Fernandes — a designer who became an engineer in order to come up with better designs.
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, color: DIM, marginTop: 28, maxWidth: 640 }}>
              I work on tools for thinking — usually with data, often with uncertainty,
              occasionally for fun. I learned to code so the prototypes wouldn&apos;t keep dying
              in handoff. It mostly worked.
            </p>
          </div>
          <Placeholder height={320} label="Portrait" ratio="4:5" />
        </div>
      </TopoHero>

      <section
        style={{ padding: "60px 60px 36px", borderTop: `1px solid ${FAINT}`, marginTop: 60 }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 60 }}>
          <div
            className="font-mono uppercase flex items-center"
            style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, paddingTop: 8, gap: 10 }}
          >
            <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
            Now
          </div>
          <div>
            <p
              className="m-0"
              style={{ fontSize: 22, lineHeight: 1.45, color: INK, textWrap: "pretty", maxWidth: 820 }}
            >
              UX engineer working on internal tooling and design systems. Reading too much about
              probabilistic forecasting. Drawing contour lines on things that don&apos;t need them.
            </p>
            <div
              className="font-mono uppercase flex"
              style={{ gap: 32, marginTop: 24, fontSize: 10, letterSpacing: "0.22em", color: DIM }}
            >
              <span>📍 Seattle, WA</span>
              <span>·</span>
              <span>↻ Last updated · April 2026</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 60px" }}>
        <SectionHeader kicker="Trajectory" title="A short topographic survey." />
        <Timeline />
      </section>

      <section style={{ padding: "40px 60px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
          <div>
            <div
              className="font-mono uppercase flex items-center"
              style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 22, gap: 10 }}
            >
              <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
              Tools I reach for
            </div>
            <ul className="m-0 p-0" style={{ listStyle: "none", columnCount: 2, columnGap: 32 }}>
              {TOOLS.map((t) => (
                <li
                  key={t}
                  style={{ fontSize: 14, color: DIM, lineHeight: 1.9, breakInside: "avoid" }}
                >
                  <span style={{ color: FAINT }}>· </span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div
              className="font-mono uppercase flex items-center"
              style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 22, gap: 10 }}
            >
              <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
              Recognition · publications
            </div>
            <ul className="m-0 p-0" style={{ listStyle: "none" }}>
              {RECOGNITION.map((r) => (
                <li
                  key={r.y}
                  className="grid"
                  style={{
                    gridTemplateColumns: "60px 1fr",
                    gap: 16,
                    padding: "10px 0",
                    borderTop: `1px solid ${FAINT}`,
                    fontSize: 14,
                  }}
                >
                  <span
                    className="font-mono"
                    style={{ fontSize: 11, letterSpacing: "0.18em", color: ACCENT }}
                  >
                    {r.y}
                  </span>
                  <span style={{ color: DIM, lineHeight: 1.5 }}>{r.t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="flex justify-between items-baseline"
        style={{
          margin: "0 60px",
          borderTop: `1px solid ${FAINT}`,
          paddingTop: 32,
          paddingBottom: 40,
        }}
      >
        <div>
          <div
            className="font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 8 }}
          >
            ✉ Get in touch
          </div>
          <a
            href="mailto:m.fern93@gmail.com"
            className="no-underline"
            style={{ fontSize: 24, color: INK }}
          >
            m.fern93@gmail.com
          </a>
        </div>
        <a
          href="https://github.com/michael-fernandes"
          className="font-mono uppercase no-underline"
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            color: DIM,
            borderBottom: `1px solid ${ACCENT}`,
            paddingBottom: 4,
          }}
        >
          github.com/michael-fernandes →
        </a>
      </section>
    </PageShell>
  );
}

function Timeline() {
  return (
    <div className="relative">
      <div
        className="absolute"
        style={{ left: 78, top: 12, bottom: 12, width: 1, background: FAINT }}
      />
      {TIMELINE.map((e, i) => (
        <div
          key={e.y}
          className="grid items-start"
          style={{
            gridTemplateColumns: "62px 32px 1fr 100px",
            gap: 24,
            padding: "20px 0",
            borderTop: i === 0 ? "none" : `1px solid ${FAINT}`,
          }}
        >
          <div
            className="font-mono"
            style={{ fontSize: 12, letterSpacing: "0.18em", color: ACCENT, paddingTop: 4 }}
          >
            {e.y}
          </div>
          <div className="relative" style={{ paddingTop: 4 }}>
            <div
              className="absolute"
              style={{
                width: 8,
                height: 8,
                transform: "rotate(45deg)",
                background: ACCENT,
                left: 8,
                top: 8,
              }}
            />
          </div>
          <div>
            <div
              className="font-medium"
              style={{ fontSize: 19, color: INK, letterSpacing: "-0.012em", lineHeight: 1.25 }}
            >
              {e.t}
            </div>
            <div style={{ fontSize: 14, color: DIM, lineHeight: 1.55, marginTop: 6, maxWidth: 720 }}>
              {e.b}
            </div>
          </div>
          <div
            className="font-mono uppercase text-right"
            style={{ fontSize: 10, letterSpacing: "0.22em", color: FAINT, paddingTop: 6 }}
          >
            {e.h.toLocaleString()} m
          </div>
        </div>
      ))}
    </div>
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
    <div style={{ marginBottom: 48 }}>
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
          fontSize: "clamp(28px, 3vw, 40px)",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          color: INK,
          maxWidth: 780,
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
