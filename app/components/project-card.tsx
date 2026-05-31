"use client";

import { useState } from "react";

const INK = "#ebe2d4";
const DIM = "#a89a86";
const FAINT = "#5a4f43";

export type Project = {
  id: string;
  name: string;
  year: string;
  note: string;
  hue: number;
  sat: number;
};

export default function ProjectCard({ project }: { project: Project }) {
  const [hover, setHover] = useState(false);
  const { hue, sat } = project;

  // Tonal stack — all derived from one hue so the card reads as one note.
  const wash       = `hsla(${hue}, ${sat}%, 32%, ${hover ? 0.22 : 0.13})`;
  const washInner  = `hsla(${hue}, ${sat}%, 18%, 0.55)`;
  const stripe     = `hsla(${hue}, ${sat}%, 70%, ${hover ? 0.16 : 0.08})`;
  const chipBase   = `hsl(${hue}, ${sat}%, 62%)`;
  const chipDim    = `hsl(${hue}, ${sat - 6}%, 42%)`;
  const border     = hover ? `hsl(${hue}, ${sat}%, 38%)` : FAINT;
  const labelColor = hover ? chipBase : FAINT;

  return (
    <a
      id={project.id}
      href={`#${project.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${border}`,
        background: "rgba(235,226,212,0.012)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.25s",
      }}
    >
      <div
        data-topo-hidden=""
        style={{
          flex: 1,
          minHeight: 140,
          background: `linear-gradient(135deg, ${wash} 0%, ${washInner} 100%)`,
          backgroundImage: `repeating-linear-gradient(135deg, transparent 0 8px, ${stripe} 8px 9px), linear-gradient(135deg, ${wash} 0%, ${washInner} 100%)`,
          position: "relative",
          marginBottom: 14,
          transition: "background-image 0.25s",
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
            color: labelColor,
            transition: "color 0.25s",
          }}
        >
          project
        </span>
        {/* Hue chip — quiet identifier in the corner */}
        <span
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: chipBase,
            boxShadow: hover ? `0 0 0 3px ${chipDim}33` : "none",
            transition: "box-shadow 0.25s",
          }}
        />
      </div>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 4 }}>
        <span className="font-medium" style={{ fontSize: 17, color: INK }}>{project.name}</span>
        {project.year && (
          <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: "0.22em", color: FAINT }}>
            {project.year}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: DIM, lineHeight: 1.45 }}>{project.note}</div>
    </a>
  );
}
