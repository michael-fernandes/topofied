"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  buildField,
  buildLevels,
  createRenderer,
  hashSeed,
  type Peak,
} from "./lib/topo-engine";

const PEAK_HEIGHTS: Record<string, number> = {
  H1: 100, H2: 68, H3: 46, H4: 34, H5: 28, H6: 25,
  BUTTON: 80,
  IMG: 64, VIDEO: 64,
  BLOCKQUOTE: 36, PRE: 36, FIGURE: 40, TABLE: 40,
  P: 22,
  INPUT: 30, TEXTAREA: 30, SELECT: 30,
  LABEL: 18, LI: 18,
  A: 22,
};
const CONTAINER_TAGS = new Set([
  "SECTION", "ARTICLE", "FIGURE", "MAIN", "HEADER", "FOOTER", "NAV",
]);
const SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,button,a,img,video,input,textarea,select," +
  "blockquote,pre,figure,table,label,li," +
  "[data-topo-important],[data-topo-peak]";

const SEED = "topofied-density";
const RES = 6;
const HOVER_BOOST = 32;
const NUM_LEVELS = 28;
const INDEX_EVERY = 4;

function scanDocument(root: HTMLElement): Peak[] {
  const candidates = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR));
  const kept: HTMLElement[] = [];
  const claimed = new Set<HTMLElement>();

  for (const el of candidates) {
    let hiddenAncestor: HTMLElement | null = null;
    let cur: HTMLElement | null = el;
    while (cur && cur !== root) {
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

  const selected: HTMLElement[] = [];
  for (const el of kept) {
    const isImportant =
      el.hasAttribute("data-topo-important") ||
      el.hasAttribute("data-topo-peak");
    if (!isImportant) {
      let parent: HTMLElement | null = el.parentElement;
      while (parent && parent !== root) {
        if (claimed.has(parent)) break;
        parent = parent.parentElement;
      }
      if (parent && parent !== root && claimed.has(parent)) continue;
    }
    const isContainer =
      CONTAINER_TAGS.has(el.tagName) ||
      el.hasAttribute("data-topo-container");
    if (!isContainer) claimed.add(el);
    selected.push(el);
  }

  const peaks: Peak[] = [];
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
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
      x: r.left + scrollX,
      y: r.top + scrollY,
      w: r.width,
      h: r.height,
      height: baseHeight,
      falloff,
      sharpness,
    });
  }
  return peaks;
}

export default function TopoDensity() {
  const svgRef = useRef<SVGSVGElement>(null);
  const rendererRef = useRef<ReturnType<typeof createRenderer> | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const hoverRef = useRef<string | null>(null);
  const animRef = useRef<{ current: Record<string, number>; raf: number }>({
    current: {},
    raf: 0,
  });
  const measureRef = useRef<(() => void) | null>(null);
  const seedNum = useMemo(() => hashSeed(SEED), []);

  useLayoutEffect(() => {
    const measure = () => {
      const svg = svgRef.current;
      if (!svg) return;
      if (!rendererRef.current) rendererRef.current = createRenderer(svg);

      const W = document.documentElement.scrollWidth;
      const H = document.documentElement.scrollHeight;
      if (W !== sizeRef.current.w || H !== sizeRef.current.h) {
        sizeRef.current = { w: W, h: H };
        setSize({ w: W, h: H });
      }

      const peaks = scanDocument(document.body);
      const state = animRef.current.current;
      const fieldPeaks: Peak[] = peaks.map((p) => {
        const boost = (p.id && state[p.id]) || 0;
        return { ...p, baseHeight: p.height, height: p.height + boost };
      });

      const fr = buildField({
        width: W,
        height: H,
        peaks: fieldPeaks,
        seed: seedNum,
        res: RES,
        noiseAmp: 1,
      });
      if (!fr) return;
      const levels = buildLevels(fr, {
        numLevels: NUM_LEVELS,
        indexEvery: INDEX_EVERY,
        accentHue: 24,
        accentSat: 22,
        theme: "dark",
      });
      rendererRef.current(levels);
    };

    // expose for hover loop
    measureRef.current = measure;

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    const mo = new MutationObserver(() => measure());
    mo.observe(document.body, {
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
      document.fonts.ready.then(() => measure());
    }
    return () => {
      ro.disconnect();
      mo.disconnect();
      measureRef.current = null;
    };
  }, [seedNum]);

  useEffect(() => {
    const state = animRef.current;
    const kick = () => {
      if (state.raf) return;
      const tick = () => {
        const cur = state.current;
        const activeId = hoverRef.current;
        if (activeId && cur[activeId] == null) cur[activeId] = 0;
        let moving = false;
        for (const key of Object.keys(cur)) {
          const target = activeId === key ? HOVER_BOOST : 0;
          const c = cur[key];
          const next = c + (target - c) * 0.2;
          if (Math.abs(next - target) > 0.25) moving = true;
          cur[key] =
            Math.abs(next - target) < 0.25 ? target : next;
        }
        measureRef.current?.();
        state.raf = moving ? requestAnimationFrame(tick) : 0;
      };
      state.raf = requestAnimationFrame(tick);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.(
        "[data-topo-hover-id],[data-topo-id]"
      ) as HTMLElement | null;
      const id = el?.dataset.topoHoverId ?? el?.dataset.topoId ?? null;
      if (hoverRef.current === id) return;
      hoverRef.current = id;
      kick();
    };
    const onLeave = () => {
      if (hoverRef.current == null) return;
      hoverRef.current = null;
      kick();
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onLeave);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onLeave);
      if (state.raf) {
        cancelAnimationFrame(state.raf);
        state.raf = 0;
      }
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width={size.w}
      height={size.h}
      viewBox={`0 0 ${size.w} ${size.h}`}
      fill="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
