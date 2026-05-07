"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import TopoScene from "../lib/topo-scene";

export default function TopoHero({
  height,
  seed,
  children,
}: {
  height: number;
  seed: string;
  children: ReactNode | ((ctx: { hover: string | null }) => ReactNode);
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.round(entry.contentRect.width));
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height }}>
      {width > 0 && (
        <TopoScene
          width={width}
          height={height}
          seed={seed}
          accentHue={24}
          accentSat={22}
          hoverBoost={22}
          theme="dark"
        >
          {children}
        </TopoScene>
      )}
    </div>
  );
}
