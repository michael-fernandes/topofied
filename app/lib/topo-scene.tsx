// Auto-discovers "peaks" by scanning the scene DOM, and renders contour lines
// into an SVG that sits underneath the scene content.
//
// Discovery rules:
//   • A set of "interesting" tags is scanned (headings, buttons, links, p…).
//   • Elements with [data-topo-hidden] are skipped, AND their descendants are
//     skipped — UNLESS a descendant carries [data-topo-important].
//   • Elements with [data-topo-important] are always included.
//   • Parent-claim: non-container parents absorb their children so nested text
//     doesn't create extra peaks.
//
// Per-element tuning (all optional, numeric):
//   data-topo-height="60" data-topo-falloff="90" data-topo-sharpness="1.3"
//   data-topo-id="my-id"        — stable id for this peak
//   data-topo-hover-id="my-id"  — id used when this element is hovered
//
// Container the scene renders into MUST be `position: relative` and have a
// fixed width/height (TopoScene sets these).
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  buildField,
  buildLevels,
  createRenderer,
  hashSeed,
  type Peak,
} from "./topo-engine";

// ── Defaults ─────────────────────────────────────────────────
const PEAK_HEIGHTS: Record<string, number> = {
  H1: 100, H2: 68, H3: 46, H4: 34, H5: 28, H6: 25,
  BUTTON: 80,
  IMG: 64, VIDEO: 64,
  BLOCKQUOTE: 36, PRE: 36, FIGURE: 40, TABLE: 40,
  P: 22,
  INPUT: 30, TEXTAREA: 30, SELECT: 30,
  LABEL: 18, LI: 18,
  A: 22,
  SPAN: 20, DIV: 20,
};
const CONTAINER_TAGS = new Set([
  "SECTION", "ARTICLE", "FIGURE", "MAIN", "HEADER", "FOOTER", "NAV",
]);

const SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,button,a,img,video,input,textarea,select," +
  "blockquote,pre,figure,table,label,li,[data-topo-important],[data-topo-peak]";

function scanScene(sceneEl: HTMLElement, sceneRect: DOMRect): Peak[] {
  const candidates = Array.from(
    sceneEl.querySelectorAll<HTMLElement>(SELECTOR)
  );

  const kept: HTMLElement[] = [];
  const claimed = new Set<HTMLElement>();

  // Pass 1 — respect data-topo-hidden / data-topo-important
  for (const el of candidates) {
    let hiddenAncestor: HTMLElement | null = null;
    let cur: HTMLElement | null = el;
    while (cur && cur !== sceneEl) {
      if (cur.hasAttribute("data-topo-hidden")) {
        hiddenAncestor = cur;
        break;
      }
      cur = cur.parentElement;
    }
    if (hiddenAncestor) {
      let important = false;
      cur = el;
      while (cur && cur !== hiddenAncestor) {
        if (
          cur.hasAttribute("data-topo-important") ||
          cur.hasAttribute("data-topo-peak")
        ) {
          important = true;
          break;
        }
        cur = cur.parentElement;
      }
      if (!important) continue;
    }
    kept.push(el);
  }

  // Pass 2 — parent-claim absorption
  const selected: HTMLElement[] = [];
  for (const el of kept) {
    const isImportant =
      el.hasAttribute("data-topo-important") ||
      el.hasAttribute("data-topo-peak");
    if (!isImportant) {
      let parent: HTMLElement | null = el.parentElement;
      while (parent && parent !== sceneEl) {
        if (claimed.has(parent)) break;
        parent = parent.parentElement;
      }
      if (parent && parent !== sceneEl && claimed.has(parent)) continue;
    }
    const isContainer =
      CONTAINER_TAGS.has(el.tagName) ||
      el.hasAttribute("data-topo-container");
    if (!isContainer) claimed.add(el);
    selected.push(el);
  }

  // Pass 3 — build peak specs
  const peaks: Peak[] = [];
  for (const el of selected) {
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;

    const ds = el.dataset;
    const dsHeight = parseFloat(ds.topoHeight ?? "");
    const dsFalloff = parseFloat(ds.topoFalloff ?? "");
    const dsSharpness = parseFloat(ds.topoSharpness ?? "");

    const baseHeight = Number.isFinite(dsHeight)
      ? dsHeight
      : el.hasAttribute("data-topo-important")
        ? 90
        : PEAK_HEIGHTS[el.tagName] ?? 20;

    const isContainer =
      CONTAINER_TAGS.has(el.tagName) ||
      el.hasAttribute("data-topo-container");

    const falloff = Number.isFinite(dsFalloff)
      ? dsFalloff
      : isContainer
        ? 18 + baseHeight * 0.4
        : 40 + baseHeight * 1.2;

    const sharpness = Number.isFinite(dsSharpness)
      ? dsSharpness
      : isContainer
        ? 3.0
        : 1.5;

    const id = ds.topoId ?? ds.topoHoverId ?? null;

    peaks.push({
      id,
      x: r.left - sceneRect.left,
      y: r.top - sceneRect.top,
      w: r.width,
      h: r.height,
      height: baseHeight,
      falloff,
      sharpness,
    });
  }

  return peaks;
}

// ── Component ────────────────────────────────────────────────
export type TopoSceneProps = {
  width: number;
  height: number;
  seed?: string;
  accentHue?: number;
  accentSat?: number;
  indexEvery?: number;
  numLevels?: number;
  inverted?: boolean;
  res?: number;
  noiseAmp?: number;
  hoverBoost?: number;
  theme?: "dark" | "paper";
  style?: CSSProperties;
  className?: string;
  children?:
    | ReactNode
    | ((ctx: {
        hover: string | null;
        setHover: (id: string | null) => void;
      }) => ReactNode);
};

export default function TopoScene({
  width,
  height,
  seed = "topo",
  accentHue = 200,
  accentSat = 60,
  indexEvery = 4,
  numLevels = 28,
  inverted = false,
  res = 4,
  noiseAmp = 1,
  hoverBoost = 42,
  theme = "dark",
  style,
  className,
  children,
}: TopoSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rendererRef = useRef<ReturnType<typeof createRenderer> | null>(null);

  const [hover, setHover] = useState<string | null>(null);
  const hoverRef = useRef<string | null>(null);
  const animRef = useRef<{ current: Record<string, number>; raf: number }>({
    current: {},
    raf: 0,
  });

  const seedNum = useMemo(() => hashSeed(seed), [seed]);

  const measureAndRender = useCallback(() => {
    const scene = sceneRef.current;
    const svg = svgRef.current;
    if (!scene || !svg) return;
    if (!rendererRef.current) rendererRef.current = createRenderer(svg);

    const sceneRect = scene.getBoundingClientRect();
    const peaks = scanScene(scene, sceneRect);
    const state = animRef.current.current;

    const fieldPeaks: Peak[] = peaks.map((p) => {
      const boost = (p.id && state[p.id]) || 0;
      return { ...p, baseHeight: p.height, height: p.height + boost };
    });

    const fr = buildField({
      width,
      height,
      peaks: fieldPeaks,
      seed: seedNum,
      res,
      noiseAmp,
    });
    if (!fr) return;
    if (inverted) {
      for (let i = 0; i < fr.field.length; i++)
        fr.field[i] = 100 - fr.field[i];
    }
    const levels = buildLevels(fr, {
      numLevels,
      indexEvery,
      accentHue,
      accentSat,
      theme,
    });
    rendererRef.current(levels);
  }, [
    width,
    height,
    seedNum,
    res,
    noiseAmp,
    inverted,
    numLevels,
    indexEvery,
    accentHue,
    accentSat,
    theme,
  ]);

  // hover → animated boost
  useEffect(() => {
    hoverRef.current = hover;
    const state = animRef.current;

    const tick = () => {
      if (hoverRef.current && state.current[hoverRef.current] == null)
        state.current[hoverRef.current] = 0;
      let moving = false;
      for (const key of Object.keys(state.current)) {
        const target = hoverRef.current === key ? hoverBoost : 0;
        const c = state.current[key];
        const next = c + (target - c) * 0.2;
        if (Math.abs(next - target) > 0.25) moving = true;
        state.current[key] =
          Math.abs(next - target) < 0.25 ? target : next;
      }
      measureAndRender();
      if (moving) state.raf = requestAnimationFrame(tick);
      else state.raf = 0;
    };

    if (!state.raf) state.raf = requestAnimationFrame(tick);
  }, [hover, hoverBoost, measureAndRender]);

  // delegated hover
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.(
        "[data-topo-hover-id],[data-topo-id]"
      ) as HTMLElement | null;
      if (!el || !scene.contains(el)) {
        setHover(null);
        return;
      }
      const id = el.dataset.topoHoverId ?? el.dataset.topoId ?? null;
      setHover(id);
    };
    const onLeave = (e: MouseEvent) => {
      if (!scene.contains(e.relatedTarget as Node | null)) setHover(null);
    };
    scene.addEventListener("mouseover", onOver);
    scene.addEventListener("mouseleave", onLeave);
    return () => {
      scene.removeEventListener("mouseover", onOver);
      scene.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // initial + resize + mutations
  useLayoutEffect(() => {
    measureAndRender();
    const scene = sceneRef.current;
    if (!scene) return;
    const ro = new ResizeObserver(() => measureAndRender());
    ro.observe(scene);
    const mo = new MutationObserver(() => measureAndRender());
    mo.observe(scene, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        "data-topo-hidden",
        "data-topo-important",
        "data-topo-height",
        "data-topo-falloff",
        "data-topo-sharpness",
      ],
    });
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => measureAndRender());
    }
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [measureAndRender]);

  return (
    <div
      ref={sceneRef}
      className={className}
      style={{ position: "relative", width, height, ...style }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {typeof children === "function"
        ? children({ hover, setHover })
        : children}
    </div>
  );
}
