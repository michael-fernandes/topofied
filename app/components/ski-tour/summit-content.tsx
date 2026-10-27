// What waits at the top of each peak. Each summit is one facet of the site —
// the tour never shows this until the skier is standing on the summit.

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { INK, DIM, FAINT, ACCENT } from "../kit";
import cardImg from "@/media/uncertainty/card.png";
import covidCardImg from "@/media/covid-forecasting/card.png";

export type SummitCopy = { title: string; body: ReactNode };

const P = ({ children }: { children: ReactNode }) => (
  <p style={{ fontSize: 14, lineHeight: 1.6, color: DIM, margin: "0 0 12px" }}>{children}</p>
);

const Go = ({ href, children }: { href: string; children: ReactNode }) => {
  const external = href.startsWith("http");
  const style = {
    display: "inline-block",
    marginTop: 6,
    marginRight: 22,
    fontSize: 10.5,
    letterSpacing: "0.22em",
    color: ACCENT,
    textDecoration: "none",
    borderBottom: `1px solid ${FAINT}`,
    paddingBottom: 3,
  };
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className="font-mono uppercase" style={style}>
      {children} ↗
    </a>
  ) : (
    <Link href={href} className="font-mono uppercase" style={style}>
      {children} →
    </Link>
  );
};

const SKILLS = [
  ["Data visualization", "Turning dense scientific and computational data into something you can actually read."],
  ["Design engineering", "Taking experiences end to end — first sketch to shipped code."],
  ["Rapid iteration", "Learning from real people, then testing ideas in days, not months."],
  ["Accessibility", "Tools that are appealing and usable for a wide range of people."],
];

const WORK = [
  {
    href: "/work/uncertainty-displays-for-transit",
    name: "Uncertainty displays for on-the-go decisions",
    note: "Showing riders the spread of likely arrivals — a CHI 2018 Honourable Mention.",
    img: cardImg,
  },
  {
    href: "/work/covid-forecasting",
    name: "A forecast you could plan around",
    note: "Early public COVID-19 peak forecasts, used by millions.",
    img: covidCardImg,
  },
];

export const SUMMIT_COPY: Record<string, SummitCopy> = {
  skills: {
    title: "Four things I do.",
    body: (
      <>
        <div style={{ display: "grid", gap: 12, marginBottom: 14 }}>
          {SKILLS.map(([t, n]) => (
            <div key={t}>
              <div style={{ fontSize: 14, color: INK, fontWeight: 500 }}>{t}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: DIM }}>{n}</div>
            </div>
          ))}
        </div>
        <Go href="/">Home</Go>
      </>
    ),
  },
  work: {
    title: "Selected work.",
    body: (
      <>
        <div style={{ display: "grid", gap: 14, marginBottom: 10 }}>
          {WORK.map((w) => (
            <Link
              key={w.href}
              href={w.href}
              className="topo-link-card"
              style={{
                display: "grid",
                gridTemplateColumns: "96px 1fr",
                gap: 12,
                alignItems: "center",
                textDecoration: "none",
                border: `1px solid ${FAINT}`,
                padding: 8,
              }}
            >
              <Image src={w.img} alt="" sizes="96px" style={{ width: 96, height: "auto", display: "block" }} />
              <span>
                <span style={{ display: "block", fontSize: 13.5, color: INK, fontWeight: 500, lineHeight: 1.25 }}>
                  {w.name}
                </span>
                <span style={{ display: "block", fontSize: 12, color: DIM, marginTop: 4, lineHeight: 1.45 }}>{w.note}</span>
              </span>
            </Link>
          ))}
        </div>
        <Go href="/work">All work</Go>
      </>
    ),
  },
  about: {
    title: "Hi, I'm Michael.",
    body: (
      <>
        <P>
          I&apos;m a data visualization developer and design engineer. I started out prototyping and user-testing
          visualizations for decisions under uncertainty, worked as a UX designer, then became a full-stack engineer
          to carry that design lens through every layer of the product.
        </P>
        <P>Global health, green tech, and now highly structured experiences around AI.</P>
        <Go href="/about">The longer story</Go>
      </>
    ),
  },
  collaborate: {
    title: "You made it to the top.",
    body: (
      <>
        <P>
          The highest peak is the one I care about most: building something together. I take on a small number of
          projects — internal tooling, design systems, and data-viz prototyping. Seattle-based, comfortable remote.
        </P>
        <Go href="/collaborate">Collaborate</Go>
        <Go href="https://github.com/michael-fernandes">GitHub</Go>
      </>
    ),
  },
};
