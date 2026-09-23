// Photo mosaic rotation: a fixed set of visible slots fed from a queue of
// hidden photos. Pure, so the swap order is testable.

export type Mosaic<T> = { slots: T[]; queue: T[] };

/** First `k` items fill the slots; the rest wait in the queue. */
export function seed<T>(items: T[], k: number): Mosaic<T> {
  return { slots: items.slice(0, k), queue: items.slice(k) };
}

/** Swap slot `i`: the queue's head comes in, the outgoing photo joins the tail. */
export function rotate<T>(m: Mosaic<T>, i: number): Mosaic<T> {
  if (!m.queue.length || i < 0 || i >= m.slots.length) return m;
  const [next, ...rest] = m.queue;
  const slots = m.slots.slice();
  const out = slots[i];
  slots[i] = next;
  return { slots, queue: [...rest, out] };
}

/** A random slot from `candidates`, never `prev` when there's a choice. */
export function pickSlot(candidates: number[], prev: number, rand: () => number = Math.random): number {
  const pool = candidates.length > 1 ? candidates.filter((c) => c !== prev) : candidates;
  return pool.length ? pool[Math.floor(rand() * pool.length)] : -1;
}
