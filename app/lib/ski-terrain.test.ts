// Run: node --experimental-strip-types --test app/lib/ski-terrain.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SUMMITS,
  BASE_CAMP,
  MAX_SKIN_GRADE,
  createSkier,
  gradientAt,
  heightAt,
  step,
  summitAt,
} from "./ski-terrain.ts";

const DT = 1 / 60;

/** A patient skier: heads for the target, switchbacking whenever the line is too steep. */
function skinTo(target: { x: number; z: number }, maxSeconds = 600) {
  const s = createSkier();
  let flip = 1;
  for (let t = 0; t < maxSeconds; t += DT) {
    if (summitAt(s.x, s.z)?.id === (target as { id?: string }).id) return { s, t };
    const aim = Math.atan2(target.x - s.x, target.z - s.z);
    const [gx, gz] = gradientAt(s.x, s.z);
    let want = aim;
    if (gx * Math.sin(aim) + gz * Math.cos(aim) > MAX_SKIN_GRADE * 0.9) {
      // Traverse: rotate off the fall line until the grade is skinnable,
      // and kick-turn to the other side every so often.
      if (Math.floor(t / 12) % 2 === 0) flip = 1;
      else flip = -1;
      for (let off = 0; off < Math.PI; off += 0.05) {
        want = aim + flip * off;
        if (gx * Math.sin(want) + gz * Math.cos(want) < MAX_SKIN_GRADE * 0.85) break;
      }
    }
    const d = Math.atan2(Math.sin(want - s.heading), Math.cos(want - s.heading));
    step(s, { up: Math.abs(d) < 0.6, down: false, left: d > 0.03, right: d < -0.03 }, DT);
  }
  return { s, t: Infinity };
}

test("each summit is the high point of its own neighbourhood", () => {
  for (const s of SUMMITS) {
    const top = heightAt(s.x, s.z);
    for (let a = 0; a < Math.PI * 2; a += 0.3) {
      assert.ok(heightAt(s.x + Math.cos(a) * 15, s.z + Math.sin(a) * 15) < top, s.id);
    }
  }
});

test("base camp is low and gentle", () => {
  const [gx, gz] = gradientAt(BASE_CAMP.x, BASE_CAMP.z);
  assert.ok(Math.hypot(gx, gz) < 0.15);
  assert.ok(heightAt(BASE_CAMP.x, BASE_CAMP.z) < 5);
});

test("every summit can be reached on skins by switchbacking", () => {
  for (const summit of SUMMITS) {
    const { t } = skinTo(summit);
    assert.ok(t < 600, `${summit.id} unreachable`);
  }
});

test("skins won't climb straight up a steep flank", () => {
  const s = createSkier();
  // Find a steep spot on the biggest peak and point straight up it.
  const peak = SUMMITS[SUMMITS.length - 1];
  s.x = peak.x;
  s.z = peak.z + peak.radius * 0.25;
  const [gx, gz] = gradientAt(s.x, s.z);
  assert.ok(Math.hypot(gx, gz) > MAX_SKIN_GRADE);
  s.heading = Math.atan2(gx, gz);
  const r = step(s, { up: true, down: false, left: false, right: false }, DT);
  assert.ok(r.tooSteep);
});

test("on skis gravity pulls you downhill", () => {
  const s = createSkier();
  const peak = SUMMITS[0];
  s.x = peak.x;
  s.z = peak.z + peak.radius * 0.3;
  s.mode = "skis";
  const [gx, gz] = gradientAt(s.x, s.z);
  s.heading = Math.atan2(-gx, -gz);
  for (let i = 0; i < 120; i++) step(s, { up: false, down: false, left: false, right: false }, DT);
  assert.ok(s.speed > 10);
});
