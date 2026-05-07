import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";

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

export default function FunPage() {
  return (
    <PageShell current="/fun">
      <TopoHero height={320} seed="fun-hero">
        <div style={{ position: "absolute", left: 60, top: 130 }}>
          <div
            data-topo-hidden=""
            className="font-mono uppercase flex items-center"
            style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 18, gap: 14 }}
          >
            <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
            Foothills · 800–1,400 m
          </div>
          <h1
            data-topo-id="fun-hero"
            data-topo-hover-id="fun-hero"
            data-topo-important=""
            data-topo-height="70"
            data-topo-falloff="220"
            className="font-medium m-0"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: INK,
            }}
          >
            Fun &amp; ephemera
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: DIM, marginTop: 18, maxWidth: 540 }}>
            Things made on weekends. Nothing here is a deliverable. Some of it doesn&apos;t even work.
          </p>
        </div>
      </TopoHero>

      <div style={{ padding: "60px 60px 80px" }}>
        <CategoryLabel first>Projects</CategoryLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr",
            gap: 18,
            marginBottom: 18,
          }}
        >
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
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
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent 0 6px, rgba(235,226,212,0.04) 6px 7px)",
                  position: "relative",
                  marginBottom: 10,
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
                  sketch
                </span>
              </div>
              <div style={{ fontSize: 13, color: DIM, fontStyle: "italic" }}>{s.title}</div>
              {s.medium && (
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: 9, color: FAINT, letterSpacing: "0.18em", marginTop: 4 }}
                >
                  {s.medium}
                </div>
              )}
            </div>
          ))}
        </div>

        <CategoryLabel>Photos</CategoryLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 18 }}>
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
                  background:
                    "linear-gradient(135deg, hsla(24, 18%, 22%, 0.6), hsla(24, 14%, 12%, 0.9))",
                  position: "relative",
                  marginBottom: 8,
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
                    color: "rgba(235,226,212,0.5)",
                  }}
                >
                  photo
                </span>
              </div>
              <div
                className="font-mono uppercase"
                style={{ fontSize: 9, color: FAINT, letterSpacing: "0.18em" }}
              >
                {ph.title}
              </div>
            </div>
          ))}
        </div>

        <CategoryLabel>Talks &amp; writing</CategoryLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <div
            style={{
              border: `1px solid ${FAINT}`,
              background: "rgba(235,226,212,0.012)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 200,
            }}
          >
            <div
              className="font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT }}
            >
              ▶ Talk · 18:24
            </div>
            <div>
              <div
                className="font-medium"
                style={{ fontSize: 19, color: INK, letterSpacing: "-0.012em", lineHeight: 1.25 }}
              >
                Quantile dot plots, 18 minutes
              </div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 8 }}>CHI 2018 · invited talk</div>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${FAINT}`,
              background: "rgba(235,226,212,0.012)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 180,
            }}
          >
            <div
              className="font-mono uppercase"
              style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT }}
            >
              ✎ Writing
            </div>
            <div>
              <div
                className="font-medium"
                style={{ fontSize: 22, color: INK, letterSpacing: "-0.015em", lineHeight: 1.2 }}
              >
                On uncertainty, after the fact
              </div>
              <div style={{ fontSize: 12, color: DIM, marginTop: 6 }}>an essay · 12 min read</div>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "32px 0 0",
            fontStyle: "italic",
            fontSize: 20,
            lineHeight: 1.4,
            color: DIM,
          }}
        >
          &ldquo;The map is not the territory, but it does have to load fast.&rdquo;
        </div>
      </div>
    </PageShell>
  );
}

function CategoryLabel({
  children,
  first,
}: {
  children: React.ReactNode;
  first?: boolean;
}) {
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
        backgroundImage:
          "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.025) 8px 9px)",
        position: "relative",
        marginBottom: 14,
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
        {label}
      </span>
    </div>
  );
}

function CardMeta({ name, year }: { name: string; year: string }) {
  return (
    <div
      className="flex justify-between items-baseline"
      style={{ marginBottom: 4 }}
    >
      <span className="font-medium" style={{ fontSize: 17, color: INK }}>
        {name}
      </span>
      {year && (
        <span
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: "0.22em", color: FAINT }}
        >
          {year}
        </span>
      )}
    </div>
  );
}
