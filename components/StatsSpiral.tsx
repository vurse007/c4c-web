"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// A photo trail (adapted from React Bits' InfiniteSpiral) that runs along one
// continuous path through the Support and Funding bento cards: in at the top
// of Support, right through its focus, looping around its right side, back
// left across the grid gap into Funding, through its focus, looping around
// its left side and out the bottom. Photos are largest at each card's focus
// and shrink/blur toward the loops and both ends, as if swinging behind a
// helix.
//
// Same one-canvas trick as StatsNetwork/StatsGlobe: both cards compute the
// identical path in shared grid coordinates (from each card's measured
// offset), render every photo, and let overflow-hidden show only their own
// part. Positions are a pure function of the page clock, so a photo crossing
// the gap continues seamlessly from one card into the other.

type Tile = "support" | "funding";
type Point = [x: number, y: number];

// Traced from the design sketch, as fractions of each card's own box, in
// travel order. Support's last point (its left edge) hands off to Funding's
// first across the gap — no matching point on Funding's right edge, since
// two points a gap-width apart kink the curve.
const PATH: Record<Tile, Point[]> = {
  support: [
    // Lead-in, so photos grow into the focus instead of appearing full size.
    [0.07, 0.14],
    [0.14, 0.18],
    [0.224, 0.217],
    [0.316, 0.25],
    [0.418, 0.308],
    [0.52, 0.339],
    [0.61, 0.358],
    [0.723, 0.392],
    [0.825, 0.447],
    [0.868, 0.512],
    [0.847, 0.576],
    [0.768, 0.627],
    [0.644, 0.665],
    [0.452, 0.693],
    [0.226, 0.73],
    [0, 0.757],
  ],
  funding: [
    [0.791, 0.276],
    [0.633, 0.312],
    [0.486, 0.338],
    [0.373, 0.362],
    [0.296, 0.393],
    [0.266, 0.45],
    [0.26, 0.527],
    [0.285, 0.604],
    [0.339, 0.684],
    [0.429, 0.773],
    [0.531, 0.862],
    [0.616, 0.908],
  ],
};

// Where each card's photo is largest.
const FOCUS: { tile: Tile; point: Point }[] = [
  { tile: "support", point: [0.52, 0.339] },
  { tile: "funding", point: [0.582, 0.32] },
];

// Arc-length distance (fraction of the whole path) over which a photo
// shrinks from full size at a focus down to MIN_SCALE — short enough that
// photos are at MIN_SCALE by the loops and at both ends of the path.
const FOCUS_SPREAD = 0.20;
const MIN_SCALE = 0.32;
const EDGE_FADE = 0.06;
const MAX_BLUR = 4;

const FOCUS_WIDTH_OF_CARD = 0.35;
const PHOTO_ASPECT = 3 / 2;
// Photos are spaced by their size, like a helix in perspective: neighbors
// sit at least (photo width × SPACING) apart along the path, so full-size
// photos at a focus never overlap while small ones bunch up.
const SPACING = 1;
const MAX_SLOTS = 32;
// Filled from public/spiral-gallery by next.config.ts.
const PHOTOS: string[] = JSON.parse(
  process.env.NEXT_PUBLIC_SPIRAL_PHOTOS ?? "[]",
);
const SLOT_PHOTOS = Array.from(
  { length: MAX_SLOTS },
  (_, i) => PHOTOS[i % PHOTOS.length],
);
// Seconds for one photo to travel the whole path.
const TRAVERSE_SECONDS = 70;

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

type Frame = { x: number; y: number; w: number; h: number };
type Path = {
  samples: Point[];
  // Cumulative arc length at each sample.
  lengths: number[];
  // Cumulative "slot distance" (∫ ds / scale) at each sample.
  slots: number[];
};

// Centripetal Catmull-Rom (alpha 0.5): unlike the uniform variant, it never
// overshoots or doubles back where neighboring points are unevenly spaced.
function sampleCurve(points: Point[]): Point[] {
  const samples: Point[] = [];
  const per = 24;
  const knot = (a: Point, b: Point) =>
    Math.sqrt(Math.hypot(b[0] - a[0], b[1] - a[1])) || 1e-4;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    // Mirror the neighbor at the ends so the end segments stay straight-ish.
    const p0: Point =
      points[i - 1] ?? [2 * p1[0] - p2[0], 2 * p1[1] - p2[1]];
    const p3: Point =
      points[i + 2] ?? [2 * p2[0] - p1[0], 2 * p2[1] - p1[1]];
    const t0 = 0;
    const t1 = t0 + knot(p0, p1);
    const t2 = t1 + knot(p1, p2);
    const t3 = t2 + knot(p2, p3);
    const lerp = (a: Point, b: Point, ta: number, tb: number, t: number): Point => {
      const f = (t - ta) / (tb - ta);
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
    };
    for (let j = 0; j < per; j++) {
      const t = t1 + ((t2 - t1) * j) / per;
      const a1 = lerp(p0, p1, t0, t1, t);
      const a2 = lerp(p1, p2, t1, t2, t);
      const a3 = lerp(p2, p3, t2, t3, t);
      const b1 = lerp(a1, a2, t0, t2, t);
      const b2 = lerp(a2, a3, t1, t3, t);
      samples.push(lerp(b1, b2, t1, t2, t));
    }
  }
  samples.push(points[points.length - 1]);
  return samples;
}

// Binary search a monotonic table, returning the bracketing index and the
// fraction between it and the next entry.
function locate(table: number[], value: number): [number, number] {
  let lo = 0;
  let hi = table.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (table[mid] <= value) lo = mid;
    else hi = mid;
  }
  return [lo, (value - table[lo]) / (table[hi] - table[lo] || 1)];
}

export default function StatsSpiral({ tile }: { tile: Tile }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const card = root?.parentElement;
    const grid = card?.parentElement;
    if (!root || !card || !grid) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let path: Path | null = null;
    let focusS: number[] = [];
    let slotCount = 0;
    let frame = 0;
    let running = false;

    const frameOf = (t: Tile): Frame | null => {
      const el = grid.querySelector<HTMLElement>(`[data-spiral-tile="${t}"]`)
        ?.parentElement;
      // offset* ignores the cards' hover transforms, unlike getBoundingClientRect.
      return el
        ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }
        : null;
    };

    const scaleAt = (s: number, total: number) => {
      const focus = Math.max(
        ...focusS.map(
          (f) => 1 - smoothstep(0, FOCUS_SPREAD * total, Math.abs(s - f)),
        ),
      );
      return MIN_SCALE + (1 - MIN_SCALE) * focus;
    };

    const measure = () => {
      const frames = { support: frameOf("support"), funding: frameOf("funding") };
      const self = frames[tile];
      if (!frames.support || !frames.funding || !self) return;
      const toLocal = (t: Tile, [x, y]: Point): Point => {
        const f = frames[t]!;
        return [f.x + x * f.w - self.x, f.y + y * f.h - self.y];
      };

      const samples = sampleCurve([
        ...PATH.support.map((p) => toLocal("support", p)),
        ...PATH.funding.map((p) => toLocal("funding", p)),
      ]);
      const lengths = [0];
      for (let i = 1; i < samples.length; i++) {
        const [ax, ay] = samples[i - 1];
        const [bx, by] = samples[i];
        lengths.push(lengths[i - 1] + Math.hypot(bx - ax, by - ay));
      }
      const total = lengths[lengths.length - 1];

      focusS = FOCUS.map(({ tile: t, point }) => {
        const [fx, fy] = toLocal(t, point);
        let best = 0;
        let bestDist = Infinity;
        samples.forEach(([x, y], i) => {
          const d = Math.hypot(x - fx, y - fy);
          if (d < bestDist) {
            bestDist = d;
            best = lengths[i];
          }
        });
        return best;
      });

      const slots = [0];
      for (let i = 1; i < samples.length; i++) {
        const ds = lengths[i] - lengths[i - 1];
        const mid = (lengths[i] + lengths[i - 1]) / 2;
        slots.push(slots[i - 1] + ds / scaleAt(mid, total));
      }
      path = { samples, lengths, slots };

      const width = self.w * FOCUS_WIDTH_OF_CARD;
      // Both cards measure the same geometry, so they agree on the count.
      slotCount = clamp(
        Math.floor(slots[slots.length - 1] / (width * SPACING)),
        1,
        MAX_SLOTS,
      );
      itemRefs.current.forEach((item, i) => {
        if (!item) return;
        item.style.width = `${width}px`;
        item.style.height = `${width / PHOTO_ASPECT}px`;
        item.style.display = i < slotCount ? "" : "none";
      });
    };

    const render = (now: number) => {
      if (!path) return;
      const { samples, lengths, slots } = path;
      const total = lengths[lengths.length - 1];
      const slotTotal = slots[slots.length - 1];
      const t = now / 1000;

      for (let i = 0; i < slotCount; i++) {
        const item = itemRefs.current[i];
        if (!item) continue;
        // Evenly spaced in slot distance, so spacing along the path grows
        // with photo size.
        const q = ((((i / slotCount + t / TRAVERSE_SECONDS) % 1) + 1) % 1) * slotTotal;
        const [k, f] = locate(slots, q);
        const next = Math.min(k + 1, samples.length - 1);
        const s = lengths[k] + (lengths[next] - lengths[k]) * f;
        const x = samples[k][0] + (samples[next][0] - samples[k][0]) * f;
        const y = samples[k][1] + (samples[next][1] - samples[k][1]) * f;

        const scale = scaleAt(s, total);
        const focus = (scale - MIN_SCALE) / (1 - MIN_SCALE);
        const u = s / total;
        const opacity =
          smoothstep(0, EDGE_FADE, u) * (1 - smoothstep(1 - EDGE_FADE, 1, u));
        const blur = MAX_BLUR * (1 - focus) ** 2;

        item.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        item.style.opacity = opacity.toFixed(3);
        item.style.filter = blur > 0.3 ? `blur(${blur.toFixed(2)}px)` : "none";
        item.style.zIndex = String(Math.round(scale * 1000));
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      render(now);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      if (reduceMotion.matches) {
        render(0);
        return;
      }
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    measure();
    const ro = new ResizeObserver(() => {
      measure();
      if (!running) render(reduceMotion.matches ? 0 : performance.now());
    });
    ro.observe(grid);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(root);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, [tile]);

  return (
    // Only at lg+, where Support and Funding sit diagonally with the path's
    // hand-off edges (Support's left, Funding's right) meeting across the gap.
    <div
      ref={rootRef}
      data-spiral-tile={tile}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
    >
      {SLOT_PHOTOS.map((src, i) => (
        <div
          key={i}
          ref={(node) => {
            itemRefs.current[i] = node;
          }}
          className="absolute left-0 top-0 overflow-hidden rounded-[10px] border border-white/20 bg-white/5 opacity-0 shadow-[0_14px_38px_rgba(0,0,0,0.45)] will-change-transform"
        >
          <Image src={src} alt="" fill sizes="360px" quality={70} className="object-cover" />
        </div>
      ))}
    </div>
  );
}
