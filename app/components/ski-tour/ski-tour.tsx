"use client";

// Ski-tour page: the three.js world plus a quiet HUD — altimeter, a topo
// minimap, and a field-note panel that only opens once you stand on a summit.
// Per-frame values (elevation, minimap) are written straight to the DOM; React
// state changes only on events (arrive at a summit, switch skins/skis).

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { createWorld, type Frame } from "./world";
import { SUMMIT_COPY } from "./summit-content";
import { SUMMITS, WORLD_HALF, heightAt, metres, type Input, type Mode } from "../../lib/ski-terrain";
import { BG, INK, DIM, FAINT, ACCENT, ACCENT_DIM } from "../kit";

const MAP_PX = 168;
const KEYS: Record<string, keyof Input> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

const mono: CSSProperties = {
  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
  textTransform: "uppercase",
  textShadow: "0 1px 6px rgba(18,14,11,0.9)",
};

const noop = () => () => {};

/** Pre-render the minimap: hillshade-free, just contour lines like the site's terrain. */
function drawMapBase() {
  const c = document.createElement("canvas");
  c.width = c.height = MAP_PX;
  const g = c.getContext("2d")!;
  const img = g.createImageData(MAP_PX, MAP_PX);
  const toWorld = (p: number) => (p / MAP_PX) * 2 * WORLD_HALF - WORLD_HALF;
  const band = (h: number) => Math.floor(h / 8);
  for (let py = 0; py < MAP_PX; py++) {
    for (let px = 0; px < MAP_PX; px++) {
      const x = toWorld(px);
      const z = toWorld(py);
      const b = band(heightAt(x, z));
      const edge = b !== band(heightAt(toWorld(px + 1), z)) || b !== band(heightAt(x, toWorld(py + 1)));
      const index = edge && b % 5 === 0;
      const i = (py * MAP_PX + px) * 4;
      const [r, gg, bb, a] = index ? [196, 147, 106, 255] : edge ? [125, 110, 93, 200] : [36, 29, 24, 215];
      img.data[i] = r;
      img.data[i + 1] = gg;
      img.data[i + 2] = bb;
      img.data[i + 3] = a;
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

// The tour takes over the whole viewport, so it portals to <body> — out from
// under the terrain shell's nav and bottom strip.
export default function SkiTour() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return mounted ? createPortal(<Tour />, document.body) : null;
}

function Tour() {
  const stageRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const mapRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<Input>({ up: false, down: false, left: false, right: false });
  const worldRef = useRef<ReturnType<typeof createWorld> | null>(null);
  const discoveredRef = useRef<Set<string>>(new Set());

  const [started, setStarted] = useState(false);
  const [mode, setModeState] = useState<Mode>("skins");
  const [hint, setHint] = useState<string | null>(null);
  const [summitId, setSummitId] = useState<string | undefined>();
  const [dismissed, setDismissed] = useState<string | undefined>();
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    const stage = stageRef.current!;
    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2") && !probe.getContext("webgl")) {
      // Handled in render — nothing to mount.
      queueMicrotask(() => setWebgl(false));
      return;
    }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mapBase = drawMapBase();
    const mapCtx = mapRef.current!.getContext("2d")!;
    const toMap = (w: number) => ((w + WORLD_HALF) / (2 * WORLD_HALF)) * MAP_PX;

    let lastHint: string | null = null;
    let lastSummit: string | undefined;
    let lastAlt = -1;

    const onFrame = (f: Frame) => {
      if (f.elevation !== lastAlt && altRef.current) {
        altRef.current.textContent = f.elevation.toLocaleString("en-US");
        lastAlt = f.elevation;
      }

      // Minimap: contours, summits (hollow until found), and you.
      mapCtx.clearRect(0, 0, MAP_PX, MAP_PX);
      mapCtx.drawImage(mapBase, 0, 0);
      SUMMITS.forEach((s, i) => {
        const found = discoveredRef.current.has(s.id);
        mapCtx.save();
        mapCtx.translate(toMap(s.x), toMap(s.z));
        mapCtx.rotate(Math.PI / 4);
        mapCtx.strokeStyle = found ? INK : "hsl(26 46% 72%)";
        mapCtx.fillStyle = INK;
        mapCtx.lineWidth = 1.25;
        mapCtx.strokeRect(-3.5, -3.5, 7, 7);
        if (found) mapCtx.fillRect(-3.5, -3.5, 7, 7);
        mapCtx.restore();
        mapCtx.fillStyle = found ? INK : "hsl(26 46% 72%)";
        mapCtx.font = "9px ui-monospace, monospace";
        mapCtx.fillText(`0${i + 1}`, toMap(s.x) + 7, toMap(s.z) + 3);
      });
      mapCtx.save();
      mapCtx.translate(toMap(f.x), toMap(f.z));
      // heading 0 faces +z, which is down the map.
      mapCtx.rotate(-f.heading);
      mapCtx.fillStyle = "#d0743a";
      mapCtx.beginPath();
      mapCtx.moveTo(0, 6);
      mapCtx.lineTo(4, -4);
      mapCtx.lineTo(0, -2);
      mapCtx.lineTo(-4, -4);
      mapCtx.closePath();
      mapCtx.fill();
      mapCtx.restore();

      const nextHint = f.tooSteep ? "Too steep to skin straight up — traverse ← → and zig-zag" : null;
      if (nextHint !== lastHint) {
        lastHint = nextHint;
        setHint(nextHint);
      }

      if (f.summitId !== lastSummit) {
        lastSummit = f.summitId;
        setSummitId(f.summitId);
        if (f.summitId && !discoveredRef.current.has(f.summitId)) {
          discoveredRef.current.add(f.summitId);
          setDiscovered([...discoveredRef.current]);
          worldRef.current?.markDiscovered(f.summitId);
        }
        if (!f.summitId) setDismissed(undefined);
      }
    };

    const world = createWorld({ container: stage, input: inputRef.current, reducedMotion, onFrame });
    worldRef.current = world;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = KEYS[e.key];
      if (k) {
        e.preventDefault();
        inputRef.current[k] = down;
        if (down) setStarted(true);
      } else if (down && e.key === " ") {
        e.preventDefault();
        setModeState((m) => {
          const next = m === "skins" ? "skis" : "skins";
          world.setMode(next);
          return next;
        });
      } else if (down && e.key === "Escape") {
        setDismissed(lastSummit);
      }
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    // Losing focus mid-stride would leave a key "held" forever.
    const release = () => Object.assign(inputRef.current, { up: false, down: false, left: false, right: false });
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", release);

    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("blur", release);
      world.dispose();
      worldRef.current = null;
    };
  }, []);

  const toggleMode = () => {
    const next = mode === "skins" ? "skis" : "skins";
    worldRef.current?.setMode(next);
    setModeState(next);
  };

  const press = (k: keyof Input, down: boolean) => {
    inputRef.current[k] = down;
    if (down) setStarted(true);
  };

  const openSummit = summitId && summitId !== dismissed ? summitId : undefined;
  const summitIndex = SUMMITS.findIndex((s) => s.id === openSummit);
  const copy = openSummit ? SUMMIT_COPY[openSummit] : undefined;

  return (
    <div className="fixed inset-0 z-[40] select-none" style={{ background: BG, color: INK }}>
      <div ref={stageRef} className="absolute inset-0" aria-hidden />

      {!webgl && (
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center" style={{ color: DIM }}>
          This tour needs WebGL. <Link href="/" style={{ color: ACCENT, marginLeft: 6 }}>Head home →</Link>
        </div>
      )}

      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4 md:p-6 pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/" style={{ ...mono, fontSize: 10.5, letterSpacing: "0.25em", color: DIM, textDecoration: "none" }}>
            ← Michael Fernandes
          </Link>
          <div style={{ ...mono, fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginTop: 10 }}>
            Ski tour · {discovered.length}/{SUMMITS.length} summits
          </div>
        </div>
        <div className="text-right">
          <div style={{ ...mono, fontSize: 9.5, letterSpacing: "0.28em", color: FAINT }}>Altitude</div>
          <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            <span ref={altRef}>1,200</span>
            <span style={{ fontSize: 13, color: DIM, marginLeft: 4 }}>m</span>
          </div>
          <button
            onClick={toggleMode}
            className="pointer-events-auto"
            style={{
              ...mono,
              marginTop: 8,
              fontSize: 9.5,
              letterSpacing: "0.22em",
              color: mode === "skins" ? ACCENT : INK,
              background: "rgba(36,29,24,0.7)",
              border: `1px solid ${FAINT}`,
              padding: "5px 9px",
              cursor: "pointer",
            }}
          >
            {mode === "skins" ? "Skins on · climb" : "Skins off · ski"} <span className="hidden md:inline" style={{ color: FAINT }}>[space]</span>
          </button>
        </div>
      </div>

      {/* Minimap */}
      <div className="absolute left-4 bottom-4 md:left-6 md:bottom-6 pointer-events-none" style={{ border: `1px solid ${FAINT}` }}>
        <canvas ref={mapRef} width={MAP_PX} height={MAP_PX} style={{ display: "block", width: 132, height: 132 }} className="md:!w-[168px] md:!h-[168px]" />
      </div>

      {/* Intro */}
      {!started && webgl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
          <div style={{ background: "rgba(36,29,24,0.82)", border: `1px solid ${FAINT}`, padding: "22px 26px", maxWidth: 380 }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: "0.32em", color: ACCENT, marginBottom: 12 }}>Base camp · 1,200 m</div>
            <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 10 }}>
              Four summits. Something waits on each.
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: DIM, margin: 0 }}>
              <b style={{ color: INK }}>↑</b> skin forward · <b style={{ color: INK }}>← →</b> turn ·{" "}
              <b style={{ color: INK }}>↓</b> back off. Steep flanks won&apos;t hold a straight line — zig-zag like a
              real skin track. At the top, hit <b style={{ color: INK }}>space</b> to rip skins and ski down.
            </p>
          </div>
        </div>
      )}

      {/* Steepness hint */}
      {hint && !openSummit && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none text-center"
          style={{ ...mono, top: "22%", fontSize: 10.5, letterSpacing: "0.2em", color: INK, background: "rgba(36,29,24,0.75)", padding: "7px 12px", border: `1px solid ${ACCENT_DIM}` }}
        >
          {hint}
        </div>
      )}

      {/* Summit field note */}
      {copy && (
        <div
          key={openSummit}
          className="ski-summit absolute right-4 md:right-6 top-[132px] md:top-[150px] overflow-y-auto"
          style={{
            width: "min(380px, calc(100vw - 32px))",
            maxHeight: "calc(100% - 300px)",
            background: "rgba(36,29,24,0.9)",
            border: `1px solid ${FAINT}`,
            padding: "18px 20px",
            backdropFilter: "blur(4px)",
          }}
          role="dialog"
          aria-label={copy.title}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
            <div style={{ ...mono, fontSize: 10, letterSpacing: "0.3em", color: ACCENT }}>
              ▲ Summit 0{summitIndex + 1} · {metres(heightAt(SUMMITS[summitIndex].x, SUMMITS[summitIndex].z)).toLocaleString("en-US")} m
            </div>
            <button
              onClick={() => setDismissed(openSummit)}
              aria-label="Close"
              style={{ ...mono, fontSize: 10, color: FAINT, background: "none", border: "none", cursor: "pointer" }}
            >
              esc ✕
            </button>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 12px", color: INK }}>{copy.title}</h2>
          {copy.body}
          {mode === "skins" && (
            <div style={{ ...mono, fontSize: 9.5, letterSpacing: "0.2em", color: FAINT, marginTop: 16 }}>
              Space — rip skins and ski the next line
            </div>
          )}
        </div>
      )}

      {/* Touch pad — arrow keys for thumbs */}
      <div className="absolute right-4 bottom-4 grid md:hidden" style={{ gridTemplateColumns: "repeat(3, 48px)", gap: 6 }}>
        {(
          [
            ["up", "↑", "2 / 1"],
            ["left", "←", "1 / 2"],
            ["down", "↓", "2 / 2"],
            ["right", "→", "3 / 2"],
          ] as const
        ).map(([k, label, area]) => (
          <button
            key={k}
            aria-label={k}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              press(k, true);
            }}
            onPointerUp={() => press(k, false)}
            onPointerCancel={() => press(k, false)}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              gridColumn: area.split(" / ")[0],
              gridRow: area.split(" / ")[1],
              height: 48,
              fontSize: 18,
              color: INK,
              background: "rgba(36,29,24,0.75)",
              border: `1px solid ${FAINT}`,
              touchAction: "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
