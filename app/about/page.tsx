import type { Metadata } from "next";
import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";
import JoyDivision from "../components/joy-division";

export const metadata: Metadata = {
  title: "About",
  description:
    "Michael Fernandes is a Seattle-based software engineer with a UX design background — living on the edge of design and engineering across global health, green tech, and AI products.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Michael Fernandes",
    description:
      "A software engineer with a UX design background, living on the edge of design and engineering — global health, green tech, and highly structured experiences around AI.",
    url: "/about",
  },
};

const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";
const ACCENT = "hsl(24 22% 70%)";
const ACCENT_DIM = "hsl(24 22% 55%)";

export default function AboutPage() {
  return (
    <PageShell current="/about" seed="about-hero">
      {/* Joy Division ↔ topo field as the page backdrop (masks the shell's
          persistent terrain); toggle button lives bottom-right. */}
      <JoyDivision />
      <TopoHero height={300}>
        <div
          data-topo-hidden=""
          style={{ position: "absolute", left: 20, right: 20, top: 110 }}
        >
          <div
            className="font-mono uppercase flex items-center"
            style={{ fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 20, gap: 14 }}
          >
            <span style={{ width: 22, height: 1, background: ACCENT_DIM }} />
            Base camp · 1,200 m
          </div>
          <h1
            className="font-medium m-0"
            style={{
              fontSize: "clamp(20px, 2.2vw, 26px)",
              letterSpacing: "-0.015em",
              lineHeight: 1.3,
              color: INK,
              maxWidth: 640,
            }}
          >
            Hi, I&apos;m Michael.
          </h1>
        </div>
      </TopoHero>

      <section className="px-page" style={{ paddingBottom: 48 }}>
        <Scrim style={{ maxWidth: 620 }}>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: DIM, margin: 0 }}>
            I started my career in software development — prototyping,
            developing, and user-testing data visualizations used for
            decision-making around uncertainty. That experience never left
            me. After college I began work as a UX designer. Seeing the
            relationship between design and engineering made me feel that
            engineering was, at the time, the more powerful tool for bringing
            ideas to life. I wanted to be a part of that process, so I
            transitioned into software engineering.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: DIM, margin: "20px 0 0" }}>
            Ever since, I have lived on the edge of design and engineering,
            communicating with designers and engineers to create products
            that are both functional and user-friendly. My background in UX
            design allows me to approach software development with a unique
            perspective, ensuring that the end product not only meets
            technical requirements but also provides an intuitive and
            engaging user experience.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: DIM, margin: "20px 0 0" }}>
            In my career I&apos;ve worked in global health, green tech, and now
            in both the B2B and direct-to-consumer spaces, creating highly
            structured experiences around AI.
          </p>
        </Scrim>
      </section>

      <section
        className="mx-page"
        style={{ borderTop: `1px solid ${FAINT}`, paddingTop: 28, paddingBottom: 40 }}
      >
        <Scrim className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-4">
        <a
          href="mailto:m.fern93@gmail.com"
          className="no-underline"
          style={{ fontSize: 16, color: INK }}
        >
          m.fern93@gmail.com
        </a>
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
        </Scrim>
      </section>
    </PageShell>
  );
}

// Feathered backdrop panel that quiets the terrain/ridgeline background
// behind reading content, per the design criteria: content zones get a
// slightly opaque layer over the lines so the text can be focused on.
function Scrim({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ position: "relative", ...style }}>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-32px -56px",
          background: "#1f1a16",
          opacity: 0.82,
          filter: "blur(28px)",
          pointerEvents: "none",
        }}
      />
      <div className={className} style={{ position: "relative" }}>
        {children}
      </div>
    </div>
  );
}
