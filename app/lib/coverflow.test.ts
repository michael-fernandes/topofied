// Run: node --experimental-strip-types --test app/lib/coverflow.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { COVER_REACH, coverTransform } from "./coverflow.ts";

test("center is flat and full size", () => {
  assert.deepEqual(coverTransform(0), { x: 0, rotateY: 0, scale: 1, opacity: 1, z: 0 });
});

test("neighbors mirror each other", () => {
  const l = coverTransform(-1);
  const r = coverTransform(1);
  assert.equal(l.x, -r.x);
  assert.equal(l.rotateY, -r.rotateY);
  assert.equal(r.rotateY, -45);
  assert.equal(l.scale, r.scale);
});

test("farther slides shrink, dim and sink", () => {
  const a = coverTransform(1);
  const b = coverTransform(2);
  assert.ok(b.scale < a.scale && b.opacity < a.opacity && b.z < a.z && b.x > a.x);
});

test("beyond reach is invisible", () => {
  assert.equal(coverTransform(COVER_REACH + 1).opacity, 0);
});
