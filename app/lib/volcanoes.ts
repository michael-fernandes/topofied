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

const STAND_IN_COUNT = 6;

/** A volcano's photo set, falling back to six cycled stand-ins. */
export function photosOf(v: Volcano): string[] {
  return v.photos ?? Array.from({ length: STAND_IN_COUNT }, (_, i) => STAND_INS[i % STAND_INS.length]);
}

export type WallPhoto = { src: string; peak: number; photo: number; count: number };

/** Every photo, N → S, tagged with its peak and position within that peak. */
export function allPhotos(list: Volcano[] = VOLCANOES): WallPhoto[] {
  return list.flatMap((v, peak) => {
    const ps = photosOf(v);
    return ps.map((src, photo) => ({ src, peak, photo, count: ps.length }));
  });
}

export const ft = (n: number) => n.toLocaleString("en-US");
export const nn = (i: number) => String(i + 1).padStart(2, "0");

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

// Equirectangular projection on one fixed origin/scale. A map view is just a
// rect in projected units, so desktop and mobile crop the same chart. Pure.
const ORIGIN = { lat: 51, lon: -128 };
const YS = 616 / 10.4;
const XS = YS * Math.cos((44.6 * Math.PI) / 180);

export function project(lat: number, lon: number): { x: number; y: number } {
  return { x: (lon - ORIGIN.lon) * XS, y: (ORIGIN.lat - lat) * YS };
}

export type MapView = { x: number; y: number; w: number; h: number; /** marker scale */ mark: number; wide: boolean };

function view(latMax: number, latMin: number, lonMin: number, lonMax: number, mark: number, wide: boolean): MapView {
  const a = project(latMax, lonMin);
  const b = project(latMin, lonMax);
  return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, mark, wide };
}

/** Desktop: a tall column beside the photos, B.C. trimmed to a sliver. */
export const VIEW_TALL = view(49.35, 39.9, -124.9, -119.8, 1, false);
/** Mobile overview: full-bleed, the arc left of center so the photo column
 * can sit over the empty east side. */
const WIDE_ASPECT = 390 / 400;
const ARC_X = project(45, -121.6).x;
const ARC_AT = 0.36; // arc's position across the frame
const WIDE_TOP = VIEW_TALL.y;
const WIDE_H = VIEW_TALL.h;
export const VIEW_WIDE: MapView = { x: ARC_X - WIDE_H * WIDE_ASPECT * ARC_AT, y: WIDE_TOP, w: WIDE_H * WIDE_ASPECT, h: WIDE_H, mark: 1.45, wide: true };

/** Mobile camera on one peak: zoomed in, panned vertically, same aspect. */
export function cameraOn(i: number, zoom = 1.2): MapView {
  const h = WIDE_H / zoom;
  const w = h * WIDE_ASPECT;
  const cy = project(VOLCANOES[i].lat, VOLCANOES[i].lon).y;
  const y = Math.min(Math.max(cy - h / 2, WIDE_TOP), WIDE_TOP + WIDE_H - h);
  return { ...VIEW_WIDE, x: ARC_X - w * ARC_AT, y, w, h };
}

/** Index of the point nearest `p` within `maxDist`, else -1. */
export function nearestStation(p: { x: number; y: number }, stations: { x: number; y: number }[], maxDist: number): number {
  let best = -1;
  let bestD = maxDist;
  stations.forEach((s, i) => {
    const d = Math.hypot(s.x - p.x, s.y - p.y);
    if (d <= bestD) {
      best = i;
      bestD = d;
    }
  });
  return best;
}

/** Index of the offset closest to `scrollLeft` (a snapped strip's current card). */
export function snappedIndex(scrollLeft: number, offsets: number[]): number {
  let best = 0;
  offsets.forEach((o, i) => {
    if (Math.abs(o - scrollLeft) < Math.abs(offsets[best] - scrollLeft)) best = i;
  });
  return best;
}

export function meters(feet: number): number {
  return Math.round(feet * 0.3048);
}
