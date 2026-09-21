import { ImageResponse } from "next/og";
import { BG, INK, DIM, FAINT, ACCENT } from "./components/kit";
import { ROLE, SITE_NAME, LOCALITY } from "./lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — ${ROLE}`;

// Concentric rings stand in for the site's contour field: satori has no canvas,
// so the terrain is faked with nested rounded borders offset off-canvas.
function Contours() {
  return (
    <div style={{ position: "absolute", right: -260, top: -180, display: "flex" }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 200 + i * 108,
            height: 160 + i * 92,
            right: 0,
            top: 0,
            borderRadius: 9999,
            border: `1px solid ${i % 4 === 0 ? ACCENT : FAINT}`,
            opacity: i % 4 === 0 ? 0.5 : 0.28,
          }}
        />
      ))}
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: BG,
          padding: 84,
          position: "relative",
        }}
      >
        <Contours />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: ACCENT,
          }}
        >
          <div style={{ width: 40, height: 1, background: ACCENT }} />
          {LOCALITY}
        </div>
        <div style={{ fontSize: 82, color: INK, marginTop: 28, letterSpacing: -2 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 40, color: DIM, marginTop: 14, maxWidth: 1000, lineHeight: 1.25 }}>
          Data visualization developer &amp; design engineer
        </div>
      </div>
    ),
    size,
  );
}
