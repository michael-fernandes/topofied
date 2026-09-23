import type { Metadata } from "next";
import PageShell from "../components/page-shell";
import TopoHero from "../components/topo-hero";
import JoyDivision from "../components/joy-division";
import VolcanoSurvey from "../components/volcano/survey";
import { BG, INK, DIM, FAINT, ACCENT, ACCENT_DIM, SectionHeader } from "../components/kit";

export const metadata: Metadata = {
  title: { absolute: "About Michael Fernandes — Data Viz Developer, Seattle" },
  description:
    "Michael Fernandes is a Seattle-based data visualization developer and design engineer with a UX design background — building interactive data applications across global health, green tech, and AI products.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Michael Fernandes, data visualization developer",
    description:
      "A data visualization developer and design engineer living on the edge of design and engineering — global health, green tech, and highly structured experiences around AI.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <PageShell current="/about" seed="about-hero">
      {/* Joy Division ↔ topo field as the page backdrop (masks the shell's
          persistent terrain); toggle button lives bottom-right. */}
      <JoyDivision />
      <TopoHero height={220}>
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
        {/* Desktop: writeup sits narrower and centered, tucked close under the
            hero title. Full width on mobile. */}
        <div className="md:mx-auto md:max-w-[500px]">
          <Scrim>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: DIM, margin: 0 }}>
              I&apos;m a data visualization developer and design engineer.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: DIM, margin: "20px 0 0" }}>
              I started my career in software development — prototyping,
              user-testing and developing data visualizations used for
              decision-making around uncertainty. That experience never left
              me. After college I started working as a UX designer on complex products. I saw the user experience shaped as much by engineering decisions as by design ones. So I became a full stack engineer, carrying that design lens through every layer of the product.
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
        </div>
      </section>

      <section
        className="mx-page"
        style={{ borderTop: `1px solid ${FAINT}`, paddingTop: 44, paddingBottom: 56 }}
      >
        <div className="mx-auto" style={{ maxWidth: 880 }}>
          <Scrim>
            <SectionHeader
              kicker="Off the clock"
              title="Skiing the Cascade volcanoes"
              subtitle="I'm an avid ski tourer in my free time. As an ongoing side project I am attempting to ski from the summit of every volcano on the West Coast. On a good day this involves using specialized ski touring equipment to ascend the mountain, a quick mechanical transition to switch it into downhill mode and enjoy the ride down. On a bad day this involves a ton of bush-whacking, getting lost and wondering why I thought this was a good idea in the first place."
            />
            <VolcanoSurvey />
          </Scrim>
        </div>
      </section>

      <section
        className="mx-page"
        style={{ borderTop: `1px solid ${FAINT}`, paddingTop: 28, paddingBottom: 40 }}
      >
        {/* Match the writeup's centered column so the contact row reads as
            part of the same content track (full-width divider above stays). */}
        <div className="md:mx-auto md:max-w-[500px]">
          <Scrim className="flex flex-col md:flex-row md:justify-center md:items-baseline gap-4">
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
        </div>
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
          background: BG,
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
