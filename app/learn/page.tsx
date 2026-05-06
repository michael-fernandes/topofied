import PageShell from "../components/page-shell";

const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";
const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";

type Tile =
  | { id: string; kind: "project" | "experiment"; w: number; h: number; title: string; year?: string; note?: string; rot: number }
  | { id: string; kind: "sketch"; w: number; h: number; title: string; note?: string; rot: number }
  | { id: string; kind: "photo"; w: number; h: number; title: string; rot: number }
  | { id: string; kind: "note"; w: number; h: number; body: string; rot: number }
  | { id: string; kind: "talk" | "writing"; w: number; h: number; title: string; note?: string; rot: number };

const tiles: Tile[] = [
  { id: "radify", kind: "project", w: 480, h: 320, title: "Radify", year: "2020", note: "A spotify-shaped curiosity engine. You feed it an artist, it walks the graph.", rot: -0.4 },
  { id: "topo", kind: "project", w: 380, h: 260, title: "Topofied", year: "2026", note: "This site, basically. Contour lines as importance hierarchy.", rot: 0.6 },
  { id: "sketch01", kind: "sketch", w: 400, h: 300, title: "Untitled · contour study 04", note: "ink + pen, a slow afternoon", rot: -1.2 },
  { id: "tides", kind: "project", w: 320, h: 380, title: "Tides", year: "2023", note: "An excuse to look at NOAA buoy data for six months.", rot: 0.3 },
  { id: "ink", kind: "project", w: 540, h: 360, title: "Inkpot", year: "2024", note: "Generative ink painter. Brownian motion in a teacup.", rot: -0.2 },
  { id: "note01", kind: "note", w: 400, h: 120, body: "“The map is not the territory, but it does have to load fast.”", rot: 1.4 },
  { id: "photo01", kind: "photo", w: 190, h: 260, title: "Cascades · 2022", rot: -0.8 },
  { id: "photo02", kind: "photo", w: 190, h: 260, title: "Olympic NP · 2023", rot: 0.9 },
  { id: "talk", kind: "talk", w: 420, h: 220, title: "Quantile dot plots, 18 minutes", note: "CHI 2018 · invited talk", rot: 0.4 },
  { id: "shader", kind: "sketch", w: 320, h: 280, title: "Shader doodle · raymarched terrain", note: "fragment shader", rot: -1.0 },
  { id: "writing", kind: "writing", w: 520, h: 200, title: "On uncertainty, after the fact", note: "an essay · 12 min read", rot: 0 },
  { id: "snip", kind: "sketch", w: 280, h: 220, title: "Margin doodle · February", rot: 1.6 },
  { id: "photo03", kind: "photo", w: 220, h: 220, title: "Studio · 2025", rot: -0.6 },
  { id: "exp", kind: "experiment", w: 380, h: 220, title: "Cellular grid · 60fps", note: "WebGL · 2025", rot: 0.5 },
  { id: "exp02", kind: "experiment", w: 360, h: 200, title: "Probability rivers", note: "d3 · canvas", rot: -0.3 },
];

const layout: Record<string, { x: number; y: number }> = {
  radify: { x: 0, y: 0 },
  topo: { x: 510, y: 40 },
  sketch01: { x: 920, y: 0 },
  tides: { x: 0, y: 360 },
  ink: { x: 350, y: 380 },
  note01: { x: 920, y: 340 },
  photo01: { x: 920, y: 480 },
  photo02: { x: 1130, y: 480 },
  talk: { x: 0, y: 780 },
  shader: { x: 450, y: 780 },
  writing: { x: 800, y: 780 },
  snip: { x: 800, y: 1000 },
  photo03: { x: 1100, y: 1000 },
  exp: { x: 0, y: 1040 },
  exp02: { x: 410, y: 1080 },
};

export default function Learn() {
  return (
    <PageShell current="/learn">
      <div className="max-w-6xl mx-auto px-12">

        {/* Hero */}
        <section className="pt-44 pb-16">
          <div
            data-topo-hidden=""
            className="font-mono uppercase flex items-center mb-5"
            style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, gap: 14 }}
          >
            <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
            Foothills · 800–1,400 m
          </div>
          <h1
            className="font-medium m-0"
            style={{ fontSize: 64, letterSpacing: "-0.03em", lineHeight: 1, color: INK }}
          >
            Fun &amp; ephemera
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: DIM, marginTop: 18, maxWidth: 540 }}>
            Things made on weekends. Nothing here is a deliverable. Some of it doesn&apos;t even work.
          </p>
        </section>

        {/* Collage canvas */}
        <section className="relative" style={{ width: "100%", height: 1320, marginBottom: 80 }}>
          <div className="relative mx-auto" style={{ width: 1320, height: 1320 }}>
            {tiles.map((t) => {
              const pos = layout[t.id];
              return <FunTile key={t.id} tile={t} x={pos.x} y={pos.y} />;
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function FunTile({ tile, x, y }: { tile: Tile; x: number; y: number }) {
  const t = tile;
  return (
    <a
      href="#"
      data-topo-id={`fun-${t.id}`}
      data-topo-hover-id={`fun-${t.id}`}
      data-topo-important=""
      data-topo-height="32"
      data-topo-falloff="90"
      className="block no-underline text-inherit"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: t.w,
        height: t.h,
        transform: `rotate(${t.rot}deg)`,
        background: t.kind === "note" ? "transparent" : "rgba(235,226,212,0.012)",
        border: t.kind === "note" ? "none" : `1px solid ${FAINT}`,
        padding: t.kind === "note" ? 0 : 14,
        boxSizing: "border-box",
      }}
    >
      {t.kind === "note" && (
        <div
          className="italic"
          style={{ fontSize: 22, lineHeight: 1.4, color: DIM, textWrap: "pretty" }}
        >
          {t.body}
        </div>
      )}
      {(t.kind === "project" || t.kind === "experiment") && (
        <>
          <div
            data-topo-hidden=""
            className="relative"
            style={{
              height: t.h - 86,
              background: "rgba(235,226,212,0.025)",
              backgroundImage:
                "repeating-linear-gradient(135deg, transparent 0 8px, rgba(235,226,212,0.025) 8px 9px)",
            }}
          >
            <div
              className="font-mono uppercase absolute"
              style={{ top: 8, left: 8, fontSize: 9, letterSpacing: "0.22em", color: FAINT }}
            >
              {t.kind}
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <div className="flex justify-between items-baseline">
              <div className="font-medium" style={{ fontSize: 16, color: INK }}>
                {t.title}
              </div>
              <div
                className="font-mono uppercase"
                style={{ fontSize: 9, letterSpacing: "0.22em", color: FAINT }}
              >
                {t.year || ""}
              </div>
            </div>
            {t.note && <div style={{ fontSize: 12, color: DIM, marginTop: 4 }}>{t.note}</div>}
          </div>
        </>
      )}
      {t.kind === "sketch" && (
        <>
          <div
            data-topo-hidden=""
            className="relative"
            style={{
              height: t.h - 60,
              background: "rgba(235,226,212,0.015)",
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0 6px, rgba(235,226,212,0.04) 6px 7px)",
            }}
          >
            <div
              className="font-mono uppercase absolute"
              style={{ top: 8, left: 8, fontSize: 9, letterSpacing: "0.22em", color: FAINT }}
            >
              sketch
            </div>
          </div>
          <div className="italic" style={{ fontSize: 13, color: DIM, marginTop: 10 }}>
            {t.title}
          </div>
          {t.note && (
            <div
              className="font-mono uppercase"
              style={{ fontSize: 9, color: FAINT, marginTop: 4, letterSpacing: "0.18em" }}
            >
              {t.note}
            </div>
          )}
        </>
      )}
      {t.kind === "photo" && (
        <>
          <div
            data-topo-hidden=""
            className="relative"
            style={{
              height: t.h - 38,
              background: `linear-gradient(135deg, hsla(24, 18%, 22%, 0.6), hsla(24, 14%, 12%, 0.9))`,
            }}
          >
            <div
              className="font-mono uppercase absolute"
              style={{
                top: 8,
                left: 8,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(235,226,212,0.5)",
              }}
            >
              photo
            </div>
          </div>
          <div
            className="font-mono uppercase"
            style={{ fontSize: 9, color: FAINT, marginTop: 8, letterSpacing: "0.18em" }}
          >
            {t.title}
          </div>
        </>
      )}
      {t.kind === "talk" && (
        <div className="flex flex-col justify-between" style={{ height: "100%" }}>
          <div
            className="font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: "0.28em", color: ACCENT }}
          >
            ▶ Talk · 18:24
          </div>
          <div>
            <div
              className="font-medium"
              style={{
                fontSize: 19,
                color: INK,
                letterSpacing: "-0.012em",
                lineHeight: 1.25,
                textWrap: "pretty",
              }}
            >
              {t.title}
            </div>
            <div style={{ fontSize: 12, color: DIM, marginTop: 8 }}>{t.note}</div>
          </div>
        </div>
      )}
      {t.kind === "writing" && (
        <div className="flex flex-col justify-between" style={{ height: "100%" }}>
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
              {t.title}
            </div>
            <div style={{ fontSize: 12, color: DIM, marginTop: 6 }}>{t.note}</div>
          </div>
        </div>
      )}
    </a>
  );
}
