"use client";

// The ski-project survey: map, then location strip + photos (beside it on
// desktop, stacked on mobile). One `selected`
// peak (null = all) drives everything; the map, strip and wall all set it.
// Unfiltered shows the photo wall; a pick opens that peak's cover flow.

import { useState } from "react";
import { ACCENT, FAINT } from "../kit";
import { VOLCANOES } from "../../lib/volcanoes";
import ArcMap from "./arc-map";
import CoverFlow from "./cover-flow";
import LocationStrip from "./location-strip";
import PhotoWall from "./photo-wall";

export default function Survey() {
  const [selected, setSelected] = useState<number | null>(null);
  const [start, setStart] = useState(0);
  const skied = VOLCANOES.filter((x) => x.skied).length;

  // Re-picking the selected peak clears back to All.
  const pick = (i: number | null) => {
    setStart(0);
    setSelected((s) => (s === i ? null : i));
  };
  const open = (peak: number, photo: number) => {
    setStart(photo);
    setSelected(peak);
  };

  return (
    <div>
      <div
        data-topo-hidden=""
        className="font-mono uppercase flex items-baseline"
        style={{ fontSize: 10, letterSpacing: "0.26em", color: FAINT, gap: 14, marginBottom: 26 }}
      >
        <span>
          <span style={{ color: ACCENT }}>{skied} / {VOLCANOES.length}</span> skied
        </span>
        <span aria-hidden style={{ flex: 1, height: 1, background: FAINT, opacity: 0.45 }} />
        <span>surveyed n → s</span>
      </div>

      <div className="survey">
        <ArcMap selected={selected} onPick={pick} style={{ width: "100%" }} />

        {/* Beside the map on desktop; its height is the map's, so the wall scrolls within it */}
        <div className="survey-side">
          <LocationStrip selected={selected} onPick={pick} />
          <div key={selected == null ? "wall" : VOLCANOES[selected].slug} className="survey-photos survey-fade">
            {selected == null ? (
              <PhotoWall onOpen={open} />
            ) : (
              <CoverFlow v={VOLCANOES[selected]} index={selected} start={start} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
