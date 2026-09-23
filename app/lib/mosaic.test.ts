// Run: node --experimental-strip-types --test app/lib/mosaic.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickSlot, rotate, seed } from "./mosaic.ts";

const items = Array.from({ length: 10 }, (_, i) => i);

test("seed splits visible slots from the queue", () => {
  assert.deepEqual(seed(items, 4), { slots: [0, 1, 2, 3], queue: [4, 5, 6, 7, 8, 9] });
});

test("rotate never shows a photo twice and keeps every photo", () => {
  let m = seed(items, 4);
  for (let n = 0; n < 50; n++) {
    m = rotate(m, n % 4);
    assert.equal(new Set(m.slots).size, 4);
    assert.deepEqual([...m.slots, ...m.queue].sort((a, b) => a - b), items);
  }
});

test("every photo eventually gets a turn", () => {
  let m = seed(items, 4);
  const seen = new Set(m.slots);
  for (let n = 0; n < items.length; n++) {
    m = rotate(m, n % 4);
    m.slots.forEach((s) => seen.add(s));
  }
  assert.equal(seen.size, items.length);
});

test("rotate is a no-op with an empty queue or bad slot", () => {
  const m = seed(items, 10);
  assert.equal(rotate(m, 0), m);
  assert.equal(rotate(seed(items, 4), 9).slots.length, 4);
});

test("pickSlot avoids repeating the previous slot", () => {
  for (let n = 0; n < 20; n++) assert.notEqual(pickSlot([0, 1, 2], 1, () => n / 20), 1);
  assert.equal(pickSlot([3], 3), 3);
  assert.equal(pickSlot([], 0), -1);
});
