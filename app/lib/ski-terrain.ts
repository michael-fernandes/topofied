// Terrain + movement model for the ski-tour page.
// Pure TS — no DOM, no three.js — so the physics is unit-testable and the
// renderer and the skier sample the exact same surface.

export type Summit = {
  id: string;
  x: number;
  z: number;
  /** Peak height above the valley floor, in world units. */
  height: number;
  /** Horizontal spread of the peak. */
  radius: number;
};

/** World is a square of this half-width, centred on the origin. */
export const WORLD_HALF = 420;

/** Where the skin track starts — low, open ground at the south edge. */
export const BASE_CAMP = { x: 0, z: 330 };

// Ordered roughly by distance from base camp so the tour has a natural arc,
// with the biggest objective at the back of the range.
export const SUMMITS: Summit[] = [
  { id: "skills", x: -160, z: 130, height: 62, radius: 130 },
  { id: "work", x: 150, z: 60, height: 80, radius: 150 },
  { id: "about", x: -110, z: -170, height: 96, radius: 165 },
  { id: "collaborate", x: 160, z: -230, height: 120, radius: 185 },
];

/** Counts as "standing on top" inside this horizontal distance. */
export const SUMMIT_REACH = 9;

// World units → metres for the altimeter. Base camp reads ~1,200 m, matching
// the about page's "Base camp · 1,200 m".
export const metres = (y: number) => Math.round(1200 + y * 14);

// ── Noise ──────────────────────────────────────────────────────────────────
// Deterministic value noise so every visitor skins the same range.

function hash(ix: number, iz: number) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iz, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function valueNoise(x: number, z: number) {
  const ix = Math.floor(x);
  const iz = Math.floor(z);
  const fx = x - ix;
  const fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sz = fz * fz * (3 - 2 * fz);
  const a = hash(ix, iz);
  const b = hash(ix + 1, iz);
  const c = hash(ix, iz + 1);
  const d = hash(ix + 1, iz + 1);
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
}

function fbm(x: number, z: number) {
  let sum = 0;
  let amp = 1;
  let freq = 1;
  for (let o = 0; o < 4; o++) {
    sum += (valueNoise(x * freq, z * freq) - 0.5) * amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum;
}

// ── Height field ───────────────────────────────────────────────────────────

/** Elevation at (x, z). Peaks are smoothed cones so the top is a real, flat-ish
 *  summit you can stand on, and the flanks are steep enough to need switchbacks. */
export function heightAt(x: number, z: number): number {
  let h = 0;
  let core = 0;
  for (const s of SUMMITS) {
    const dx = (x - s.x) / s.radius;
    const dz = (z - s.z) / s.radius;
    // Softened distance rounds the very tip into a small standable top.
    const d = Math.sqrt(dx * dx + dz * dz + 0.004) - 0.063;
    const t = Math.max(0, 1 - d);
    // Concave flanks: steep up high, a long gentle apron below.
    const cone = Math.pow(t, 1.7);
    // Ridges and gullies radiating from the top, strongest mid-flank so the
    // summit itself and the valley floor stay clean.
    const ang = Math.atan2(dz, dx);
    const ridge = (Math.sin(ang * 5 + s.x * 0.01) * 0.5 + Math.sin(ang * 9 + s.z * 0.02) * 0.3) * t * (1 - t) * 1.1;
    h = Math.max(h, s.height * (cone + ridge * cone));
    core = Math.max(core, cone);
  }
  // Rolling ground everywhere — damped near base camp so the start is gentle,
  // and near each top so the noise can't put a higher bump beside the summit.
  const fromCamp = Math.hypot(x - BASE_CAMP.x, z - BASE_CAMP.z);
  const roll = Math.min(1, fromCamp / 120) * (1 - core * core);
  h += fbm(x / 80, z / 80) * 14 * roll;
  // Ridgelines wrapping the world edge give the valley a horizon.
  const edge = Math.max(Math.abs(x), Math.abs(z)) / WORLD_HALF;
  if (edge > 0.78) h += Math.pow((edge - 0.78) / 0.22, 2) * 70;
  return h;
}

/** Central-difference gradient: rise per unit run along x and z. */
export function gradientAt(x: number, z: number): [number, number] {
  const e = 0.75;
  return [
    (heightAt(x + e, z) - heightAt(x - e, z)) / (2 * e),
    (heightAt(x, z + e) - heightAt(x, z - e)) / (2 * e),
  ];
}

// ── Skier ──────────────────────────────────────────────────────────────────

export type Mode = "skins" | "skis";

export type Skier = {
  x: number;
  z: number;
  /** Radians; forward is (sin heading, cos heading) in xz. */
  heading: number;
  /** Signed speed along heading, world units / second. */
  speed: number;
  mode: Mode;
};

export type Input = { up: boolean; down: boolean; left: boolean; right: boolean };

export type StepResult = {
  /** Rise per unit run along the direction of travel. */
  grade: number;
  /** True when the skier is pushing straight up a slope too steep to skin. */
  tooSteep: boolean;
};

/** Steepest grade skins will hold — about 27°. Beyond it you must traverse. */
export const MAX_SKIN_GRADE = 0.5;
const SKIN_SPEED = 13;
const SKI_TOP_SPEED = 34;
const GRAVITY = 26;
const TURN_RATE = 2.1;

export function createSkier(): Skier {
  // Face the range (north = -z).
  return { x: BASE_CAMP.x, z: BASE_CAMP.z, heading: Math.PI, speed: 0, mode: "skins" };
}

/** Advance the skier by dt seconds. Mutates and returns the grade it saw. */
export function step(s: Skier, input: Input, dt: number): StepResult {
  // Turning is quicker when slow — a kick turn on the spot, a carve at speed.
  const turn = TURN_RATE * (1.25 - Math.min(1, Math.abs(s.speed) / SKI_TOP_SPEED) * 0.6);
  if (input.left) s.heading += turn * dt;
  if (input.right) s.heading -= turn * dt;

  const fx = Math.sin(s.heading);
  const fz = Math.cos(s.heading);
  const [gx, gz] = gradientAt(s.x, s.z);
  const grade = gx * fx + gz * fz;
  let tooSteep = false;

  if (s.mode === "skins") {
    // Skins grip: no sliding back, little glide. Uphill speed falls off with grade.
    let target = 0;
    if (input.up) {
      if (grade > MAX_SKIN_GRADE) {
        tooSteep = true;
        target = 0.6;
      } else {
        target = SKIN_SPEED * (1 - 0.55 * Math.max(0, grade) / MAX_SKIN_GRADE);
        // A touch of free speed on the way down, but skins brake hard.
        target += Math.max(0, -grade) * 6;
      }
    } else if (input.down) {
      target = -SKIN_SPEED * 0.4;
    }
    s.speed += (target - s.speed) * Math.min(1, dt * 5);
  } else {
    // Skis: gravity does the work. Up is a skate push on the flat, down is a snowplough.
    s.speed += -grade * GRAVITY * dt;
    if (input.up && grade < 0.15) s.speed += 10 * dt;
    if (input.down) s.speed *= Math.exp(-2.6 * dt);
    s.speed *= Math.exp(-0.25 * dt);
    // Can't ski backwards up a hill; you just stop.
    if (s.speed < 0) s.speed *= Math.exp(-6 * dt);
    s.speed = Math.max(-4, Math.min(SKI_TOP_SPEED, s.speed));
  }

  s.x += fx * s.speed * dt;
  s.z += fz * s.speed * dt;

  // Soft boundary — the edge ridges are walls you slide along, not through.
  const lim = WORLD_HALF * 0.86;
  if (Math.abs(s.x) > lim || Math.abs(s.z) > lim) {
    s.x = Math.max(-lim, Math.min(lim, s.x));
    s.z = Math.max(-lim, Math.min(lim, s.z));
    s.speed *= 0.5;
  }

  return { grade, tooSteep };
}

/** The summit the skier is standing on, if any. */
export function summitAt(x: number, z: number): Summit | undefined {
  return SUMMITS.find((s) => Math.hypot(x - s.x, z - s.z) < SUMMIT_REACH);
}
