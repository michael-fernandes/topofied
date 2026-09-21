"use client";

// Ported from michael-fernandes/mferns (src/pages/projects/interactive-dots.tsx),
// itself adapted from https://observablehq.com/@d3/collision-detection/2 —
// a force-simulated cluster of dots that scatters away from the pointer.
import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { easings, useSpring, animated } from "react-spring";
import { BG } from "./kit";

const LONG_ANIMATION = 600;
const SHORT_ANIMATION = 400;
const MAX_SIZE = 1000;
const SMALL_SCREEN = 500;

interface ForceNode {
  id: number;
  r: number;
  group: string;
  fx?: number;
  fy?: number;
  x?: number;
  y?: number;
}

const gradient = d3.interpolateCool;

export default function InteractiveDots({
  showDots = true,
}: {
  showDots?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  // The canvas is a CSS-sized square; JS only mirrors that size into the
  // backing store and into the simulation's origin, so the cluster stays
  // centred at any container width.
  const [size, setSize] = useState(0);
  const sizeRef = useRef(0);
  sizeRef.current = size;

  const isSmallerScreen = size > 0 && size < SMALL_SCREEN;
  const iterations = isSmallerScreen ? 1 : 3;
  const radius = isSmallerScreen ? 3 : 4;
  const forceHat = isSmallerScreen ? 0.001 : 0.00075;
  const numNodes = isSmallerScreen ? 75 : 125;

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: LONG_ANIMATION + 50,
    config: { duration: SHORT_ANIMATION, easing: easings.easeInCubic },
  });

  const nodes = useMemo(
    (): ForceNode[] =>
      d3.range(numNodes).map((n: number) => ({
        id: n,
        r: Math.ceil(Math.random() * radius) + 6,
        group: (n && gradient((n % numNodes) / numNodes)) || "",
      })),
    [numNodes, radius],
  );

  // Track the canvas' laid-out size (resize, rotation, font/zoom changes).
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize(Math.round(entry.contentRect.width));
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [showDots]);

  // Resize the backing store for the device pixel ratio.
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !size) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [size, showDots]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !size) return;
    const ctx = canvas.getContext("2d");

    const pointed = (event: SyntheticEvent) => {
      const extent = sizeRef.current;
      let [x, y] = d3.pointer(event);

      if (x < extent / 4) {
        x = x * -1;
      }
      if (y < extent / 4) {
        y = y * -1;
      }

      if (nodes[0]) {
        nodes[0].fx = x - extent / 2;
        nodes[0].fy = y - extent / 2;
      }
    };

    const ticked = () => {
      if (!ctx) return;
      const extent = sizeRef.current;
      ctx.clearRect(0, 0, extent, extent);
      ctx.save();
      ctx.translate(extent / 2, extent / 2);
      for (let i = 0; i < nodes.length; i++) {
        const d: ForceNode | undefined = nodes[i];
        if (d) {
          ctx.beginPath();
          ctx.moveTo((d.x || 0) + d.r, d.y || 0);
          ctx.arc(d.x || 0, d.y || 0, d.r, 0, 2 * Math.PI);
          ctx.fillStyle = d.id ? d.group : "transparent";
          ctx.globalAlpha = 1;
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const simulation = d3
      .forceSimulation<ForceNode>(nodes)
      .alpha(0.4)
      .alphaDecay(0.01)
      .alphaTarget(0.2)
      .velocityDecay(0.025)
      .force("x", d3.forceX().strength(forceHat))
      .force("y", d3.forceY().strength(forceHat))
      .force(
        "collide",
        d3
          .forceCollide()
          .radius((d: any) => d.r + 1)
          .iterations(iterations),
      )
      .force(
        "charge",
        d3.forceManyBody().strength((d: any, i: number) => (i ? 0 : d.r)),
      )
      .on("tick", ticked);

    d3.select(canvas)
      .on("touchmove", (event: SyntheticEvent) => event.preventDefault())
      .on("pointermove", pointed);

    return () => {
      simulation.stop();
    };
    // `size` only gates the first run — resizes are picked up via sizeRef,
    // so the simulation isn't torn down mid-drag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, size > 0, showDots, iterations, forceHat]);

  return (
    // The canvas is transparent between dots, so the component carries its own
    // opaque ground — otherwise the terrain reads straight through the
    // simulation wherever this gets dropped on a page.
    <section
      className="h-full w-full overflow-visible flex items-center justify-center"
      style={{ background: BG }}
    >
      {showDots && (
        <animated.canvas
          ref={ref}
          style={{
            ...fadeIn,
            display: "block",
            width: "100%",
            maxWidth: MAX_SIZE,
            aspectRatio: "1 / 1",
          }}
        />
      )}
    </section>
  );
}
