import type { ReactNode } from "react";

export default function TopoHero({
  height,
  children,
}: {
  height: number;
  children: ReactNode;
}) {
  return (
    <div style={{ position: "relative", width: "100%", height }}>
      {children}
    </div>
  );
}
