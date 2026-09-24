"use client";

// Mobile: a rotating photo collage in the map's empty east side. All peaks
// when nothing is picked, else the picked peak's set.

import { allPhotos, VOLCANOES, type WallPhoto } from "../../lib/volcanoes";
import { Tile, useMosaic } from "./photo-wall";

// [col span, row span] — repeats down the column; dense flow fills gaps.
const SPANS: [number, number][] = [[1, 2], [1, 3], [1, 3], [1, 2], [2, 3], [1, 2], [1, 2]];
const SLOTS = 14;

export default function PhotoColumn({
  selected,
  onOpen,
}: {
  selected: number | null;
  onOpen: (peak: number, photo: number) => void;
}) {
  const photos: WallPhoto[] = selected == null ? allPhotos() : allPhotos().filter((p) => p.peak === selected);
  // Remount per selection so the mosaic reseeds and fades in fresh.
  return <Column key={selected == null ? "all" : VOLCANOES[selected].slug} photos={photos} onOpen={onOpen} />;
}

function Column({ photos, onOpen }: { photos: WallPhoto[]; onOpen: (peak: number, photo: number) => void }) {
  const { ref, slots, hover } = useMosaic(photos, SLOTS);
  return (
    <div ref={ref} className="photo-column survey-fade" {...hover}>
      {slots.map((p, i) => {
        const [c, r] = SPANS[i % SPANS.length];
        return (
          <div key={i} data-slot={i} className="relative" style={{ gridColumn: `span ${c}`, gridRow: `span ${r}` }}>
            <Tile p={p} onOpen={onOpen} sizes="30vw" />
          </div>
        );
      })}
    </div>
  );
}
