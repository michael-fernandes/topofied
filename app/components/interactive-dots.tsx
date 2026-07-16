"use client";

// Ported from michael-fernandes/mferns (src/pages/projects/interactive-dots.tsx),
// itself adapted from https://observablehq.com/@d3/collision-detection/2 —
// a force-simulated cluster of dots that scatters away from the pointer.
import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import { easings, useSpring, animated } from "react-spring";

const LONG_ANIMATION = 600;
const SHORT_ANIMATION = 400;

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

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
const PAGE_PADDING_X = 20 * 2;

export default function InteractiveDots({
  showDots = true,
}: {
  showDots?: boolean;
}) {
  const isClient = useIsClient();

  const isSmallerScreen = isClient ? window?.innerWidth < 500 : false;

  const width =
    isClient && isSmallerScreen
      ? (window?.innerWidth - PAGE_PADDING_X) * 2
      : 1000;

  const height = width;
  const iterations = isSmallerScreen ? 1 : 3;
  const radius = isSmallerScreen ? 3 : 4;
  const forceHat = isSmallerScreen ? 0.001 : 0.00075;
  const numNodes = isSmallerScreen ? 75 : 125;
  const ref = useRef(null);

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
  const innerWidth = typeof window !== "undefined" ? window.innerWidth : 0;

  useEffect((): any => {
    if (ref.current) {
      const canvas = ref.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx?.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const pointed = (event: SyntheticEvent) => {
        let [x, y] = d3.pointer(event);

        if (x < width / 4) {
          x = x * -1;
        }
        if (y < height / 4) {
          y = y * -1;
        }

        if (nodes[0]) {
          nodes[0].fx = x - width / 2;
          nodes[0].fy = y - height / 2;
        }
      };

      const ticked = () => {
        if (ctx) {
          ctx.clearRect(0, 0, width * 2, height * 2);
          ctx.save();
          ctx.translate(width / 2, height / 2);
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
          ctx.globalCompositeOperation = "lighter";
          ctx.restore();
        }
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

      if (ctx) {
        d3.select(ctx.canvas)
          .on("touchmove", (event: SyntheticEvent) => event.preventDefault())
          .on("pointermove", pointed);
      }

      return () => simulation.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, ref.current, innerWidth, showDots]);

  return (
    <section className="h-full w-full overflow-visible flex items-center justify-center">
      {showDots && (
        <animated.canvas
          style={{ ...fadeIn, maxWidth: "100%", height: "auto" }}
          height={height}
          width={width}
          ref={ref}
        />
      )}
    </section>
  );
}
