// The volcano ski project — data + map projection for the About-page survey.
// To tick a summit: flip `skied`. To add photos: drop files in
// public/volcanoes/<slug>/ and list their public paths in `photos`.

export type Volcano = {
  slug: string;
  name: string;
  /** Roster label — the name without the "Mount" honorific. */
  short: string;
  region: "Washington" | "Oregon" | "California";
  lat: number;
  lon: number;
  feet: number;
  skied: boolean;
  photos?: string[]; // e.g. "/volcanoes/mount-baker/summit.jpg"
  note?: string;
};

// Shared stand-in art until real trip photos land — same set for every peak.
export const STAND_INS = [
  "/volcanoes/stand-in/01.jpg",
  "/volcanoes/stand-in/02.jpg",
  "/volcanoes/stand-in/03.jpg",
];

/** A volcano's photo set, falling back to the shared stand-ins. */
export function photosOf(v: Volcano): string[] {
  return v.photos ?? STAND_INS;
}

// North → south, the order the map and roster both read in.
export const VOLCANOES: Volcano[] = [
  { slug: "mount-baker", name: "Mount Baker", short: "Baker", region: "Washington", lat: 48.777, lon: -121.813, feet: 10781, skied: false },
  { slug: "glacier-peak", name: "Glacier Peak", short: "Glacier Peak", region: "Washington", lat: 48.112, lon: -121.113, feet: 10541, skied: false },
  { slug: "mount-rainier", name: "Mount Rainier", short: "Rainier", region: "Washington", lat: 46.853, lon: -121.76, feet: 14411, skied: false },
  { slug: "mount-adams", name: "Mount Adams", short: "Adams", region: "Washington", lat: 46.203, lon: -121.491, feet: 12281, skied: false },
  { slug: "mount-st-helens", name: "Mount St. Helens", short: "St. Helens", region: "Washington", lat: 46.191, lon: -122.194, feet: 8363, skied: false },
  { slug: "mount-hood", name: "Mount Hood", short: "Hood", region: "Oregon", lat: 45.374, lon: -121.696, feet: 11249, skied: false },
  { slug: "mount-jefferson", name: "Mount Jefferson", short: "Jefferson", region: "Oregon", lat: 44.674, lon: -121.799, feet: 10502, skied: false },
  { slug: "mount-washington", name: "Mount Washington", short: "Washington", region: "Oregon", lat: 44.332, lon: -121.839, feet: 7795, skied: false },
  { slug: "three-sisters", name: "Three Sisters", short: "Three Sisters", region: "Oregon", lat: 44.103, lon: -121.769, feet: 10363, skied: false, note: "Three summits in one — South, Middle, and North." },
  { slug: "broken-top", name: "Broken Top", short: "Broken Top", region: "Oregon", lat: 44.083, lon: -121.7, feet: 9177, skied: false },
  { slug: "mount-thielsen", name: "Mount Thielsen", short: "Thielsen", region: "Oregon", lat: 43.153, lon: -122.066, feet: 9184, skied: false },
  { slug: "mount-shasta", name: "Mount Shasta", short: "Shasta", region: "California", lat: 41.409, lon: -122.195, feet: 14179, skied: false },
  { slug: "lassen-peak", name: "Lassen Peak", short: "Lassen", region: "California", lat: 40.488, lon: -121.505, feet: 10457, skied: false },
];

// Equirectangular projection over the arc's bounding box, with headroom past
// the 49th parallel so B.C. reads as territory, not a border sliver. Pure.
export const MAP = { latMax: 50.3, latMin: 39.9, lonMin: -125.3, lonMax: -119.7, h: 616 };
const YS = MAP.h / (MAP.latMax - MAP.latMin);
const XS = YS * Math.cos((44.6 * Math.PI) / 180);
export const MAP_W = Math.round((MAP.lonMax - MAP.lonMin) * XS);

export function project(lat: number, lon: number): { x: number; y: number } {
  return { x: (lon - MAP.lonMin) * XS, y: (MAP.latMax - lat) * YS };
}

export function meters(feet: number): number {
  return Math.round(feet * 0.3048);
}
