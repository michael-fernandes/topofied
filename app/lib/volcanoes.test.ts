// Run: node --experimental-strip-types --test app/lib/volcanoes.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { cameraOn, nearestStation, project, snappedIndex, VIEW_TALL, VIEW_WIDE, VOLCANOES } from "./volcanoes.ts";

const inside = (v: typeof VIEW_TALL, p: { x: number; y: number }) =>
  p.x > v.x && p.x < v.x + v.w && p.y > v.y && p.y < v.y + v.h;

test("both views hold every volcano", () => {
  for (const v of VOLCANOES) {
    const p = project(v.lat, v.lon);
    assert.ok(inside(VIEW_TALL, p), v.name);
    assert.ok(inside(VIEW_WIDE, p), v.name);
  }
});

test("the wide view is wider and shares the tall view's latitudes", () => {
  assert.ok(VIEW_WIDE.w > VIEW_TALL.w * 1.5);
  assert.equal(VIEW_WIDE.y, VIEW_TALL.y);
  assert.equal(VIEW_WIDE.h, VIEW_TALL.h);
});

test("the camera keeps its peak in frame, the aspect fixed, and stays on the chart", () => {
  VOLCANOES.forEach((v, i) => {
    const c = cameraOn(i);
    assert.ok(inside(c, project(v.lat, v.lon)), v.name);
    assert.ok(Math.abs(c.w / c.h - VIEW_WIDE.w / VIEW_WIDE.h) < 1e-9);
    assert.ok(c.y >= VIEW_WIDE.y - 1e-9 && c.y + c.h <= VIEW_WIDE.y + VIEW_WIDE.h + 1e-9);
  });
});

test("nearestStation picks the closest point in range", () => {
  const pts = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 12, y: 0 }];
  assert.equal(nearestStation({ x: 11.2, y: 1 }, pts, 5), 2);
  assert.equal(nearestStation({ x: 1, y: 1 }, pts, 5), 0);
  assert.equal(nearestStation({ x: 40, y: 40 }, pts, 5), -1);
});

test("snappedIndex finds the card nearest the scroll position", () => {
  const offsets = [0, 96, 272, 448];
  assert.equal(snappedIndex(0, offsets), 0);
  assert.equal(snappedIndex(260, offsets), 2);
  assert.equal(snappedIndex(9999, offsets), 3);
});
