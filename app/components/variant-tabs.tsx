"use client";

import type { TopoVariant } from "../topo-svg";

interface VariantTabsProps {
  variant: TopoVariant;
  onVariantChange: (v: TopoVariant) => void;
}

const TABS: { value: TopoVariant; label: string }[] = [
  { value: "classic",   label: "CLASSIC"   },
  { value: "relief",    label: "RELIEF"    },
  { value: "engraving", label: "ENGRAVING" },
];

export default function VariantTabs({ variant, onVariantChange }: VariantTabsProps) {
  return (
    <div className="fixed bottom-9 right-6 z-30 flex gap-px">
      {TABS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onVariantChange(value)}
          className={`font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-colors ${
            variant === value
              ? "border-white/25 text-[#d0d0d0] bg-white/[0.06]"
              : "border-white/[0.07] text-[#383838] hover:text-[#686868]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
