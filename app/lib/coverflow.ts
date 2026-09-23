// Cover-flow geometry: where a slide sits given its offset from center. Pure.

export type CoverPose = { x: number; rotateY: number; scale: number; opacity: number; z: number };

/** Slides past this many steps from center are hidden. */
export const COVER_REACH = 2;

/** `offset` = slide index − center index; `x` is a fraction of slide width. */
export function coverTransform(offset: number): CoverPose {
  const d = Math.abs(offset);
  const sign = Math.sign(offset);
  if (d === 0) return { x: 0, rotateY: 0, scale: 1, opacity: 1, z: 0 };
  if (d > COVER_REACH) return { x: sign * 0.9, rotateY: -sign * 45, scale: 0.6, opacity: 0, z: -d };
  return {
    x: sign * (0.52 + (d - 1) * 0.2),
    rotateY: -sign * 45,
    scale: 0.78 - (d - 1) * 0.1,
    opacity: d === 1 ? 0.55 : 0.28,
    z: -d,
  };
}
