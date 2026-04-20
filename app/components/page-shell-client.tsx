"use client";

import { useEffect, useState } from "react";
import TopoSvg, { type TopoVariant } from "../topo-svg";
import VariantTabs from "./variant-tabs";

const VALID_VARIANTS: TopoVariant[] = ["classic", "relief", "engraving"];

export default function PageShellClient() {
  const [variant, setVariant] = useState<TopoVariant>("classic");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("topo-variant") as TopoVariant | null;
    if (stored && VALID_VARIANTS.includes(stored)) {
      setVariant(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("topo-variant", variant);
  }, [variant]);

  if (!mounted) return <TopoSvg variant="classic" />;

  return (
    <>
      <TopoSvg variant={variant} />
      <VariantTabs variant={variant} onVariantChange={setVariant} />
    </>
  );
}
