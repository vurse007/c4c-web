"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { CHAPTERS } from "@/components/ChapterGlobe";
import { cn } from "@/lib/utils";
import "./StatsGlobe.css";

// One globe spanning two side-by-side bento cards, same trick as
// StatsNetwork: the canvas is two cards wide and each card renders the whole
// thing, shifted so its overflow-hidden shows only its own half. The globe is
// centered above the cards so only its lower limb "hangs" into them, and it
// rolls forward — land rises up over the horizon toward the viewer.
// Rotation is derived from the shared page clock (not a per-instance
// counter), so both halves stay in lockstep.

// Globe radius as a multiple of the combined (two-card) width, and how far
// its lowest point reaches down into the cards, as a fraction of card height.
const RADIUS_OF_WIDTH = 0.8;
const DEPTH_OF_HEIGHT = 0.6;

// Forward roll (theta), plus a slow sideways sway (phi). No single roll
// path passes every chapter — around phi 0° Uganda never shows, around 30°
// Taiwan never does — so swaying between them brings all of them through.
const SWAY_CENTER = (15 * Math.PI) / 180;
const SWAY_AMPLITUDE = (15 * Math.PI) / 180;
const SWAY_PERIOD_SECONDS = 90;

const TAU = 2 * Math.PI;

// Measured (by rendering every theta across the sway range): land is in
// view for theta ≈ 0.75–4.55; the rest of the turn is open southern ocean.
// The roll holds one steady speed whenever any land shows, and only speeds
// up — ramping entirely inside the ocean stretch — once nothing is in sight.
const OCEAN_START = 4.5;
const OCEAN_END = 0.8 + TAU;
const OCEAN_RAMP = 0.35;
const LAND_RADIANS_PER_SECOND = 0.1;
const OCEAN_RADIANS_PER_SECOND = 0.6;

// cobe mis-samples its land map at the south pole (theta ≈ 5.6–6.2),
// drawing a stray ring of dots. It's mid-ocean, so fade the map out there.
const MAP_BRIGHTNESS = 2.2;
const POLE_FADE_START = 5.4;
const POLE_FADE_END = 6.35;
const POLE_FADE_RAMP = 0.12;

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

// 1 inside [start, end] (theta, wrapping past 2π), easing to 0 over `ramp`
// just inside each edge.
const windowWeight = (
  theta: number,
  start: number,
  end: number,
  ramp: number,
) => {
  const into = (((theta - start) % TAU) + TAU) % TAU;
  const width = end - start;
  if (into > width) return 0;
  return smoothstep(0, ramp, into) * smoothstep(width, width - ramp, into);
};

const rollSpeedAt = (theta: number) =>
  LAND_RADIANS_PER_SECOND +
  (OCEAN_RADIANS_PER_SECOND - LAND_RADIANS_PER_SECOND) *
    windowWeight(theta, OCEAN_START, OCEAN_END, OCEAN_RAMP);

// Time-to-angle table for one full turn (theta decreasing from 0), built by
// integrating dt = dθ / speed(θ). A pure function of the clock, so both
// cards land on the same theta every frame.
const ROLL_STEPS = 2048;
const ROLL_TIMES = (() => {
  const times = new Float64Array(ROLL_STEPS + 1);
  const step = TAU / ROLL_STEPS;
  for (let i = 1; i <= ROLL_STEPS; i++) {
    times[i] = times[i - 1] + step / rollSpeedAt(-(i - 0.5) * step);
  }
  return times;
})();
const ROLL_PERIOD = ROLL_TIMES[ROLL_STEPS];

const rollAt = (t: number) => {
  const time = t % ROLL_PERIOD;
  let lo = 0;
  let hi = ROLL_STEPS;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (ROLL_TIMES[mid] <= time) lo = mid;
    else hi = mid;
  }
  const frac = (time - ROLL_TIMES[lo]) / (ROLL_TIMES[hi] - ROLL_TIMES[lo]);
  return -((lo + frac) / ROLL_STEPS) * TAU;
};

// Marker ids become global CSS anchor names / :root vars, so they're
// namespaced per card to keep the two instances apart.
const markerId = (side: string, chapterId: string) =>
  `bento-${side}-${chapterId}`;

const rotationAt = (now: number) => {
  const t = now / 1000;
  const theta = rollAt(t);
  return {
    theta,
    mapBrightness:
      MAP_BRIGHTNESS *
      (1 -
        windowWeight(theta, POLE_FADE_START, POLE_FADE_END, POLE_FADE_RAMP)),
    phi:
      SWAY_CENTER +
      SWAY_AMPLITUDE * Math.sin((2 * Math.PI * t) / SWAY_PERIOD_SECONDS),
  };
};

export default function StatsGlobe({ side }: { side: "left" | "right" }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    let running = false;

    // cobe draws a sphere of radius 0.4 * scale * height (CSS px), centered
    // at offset * scale / height in NDC — solve for the size/placement above.
    const geometry = () => {
      const width = wrap.clientWidth || 800;
      const height = wrap.clientHeight || 300;
      const radius = width * RADIUS_OF_WIDTH;
      const scale = radius / (0.4 * height);
      const centerAboveTop = radius - height * DEPTH_OF_HEIGHT;
      return {
        width,
        height,
        scale,
        offset: [0, (-height - 2 * centerAboveTop) / scale] as [number, number],
      };
    };

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      ...geometry(),
      ...rotationAt(performance.now()),
      dark: 1,
      diffuse: 1.7,
      mapSamples: 50000,
      mapBaseBrightness: 0.02,
      baseColor: [0.7, 0.78, 0.95],
      markerColor: [0.23, 0.51, 0.96],
      // No cobe glow: the canvas's contrast filter would crush it, so the
      // atmosphere is the CSS ring below instead.
      glowColor: [0, 0, 0],
      // Size 0: cobe only tracks positions; the pulse markers below draw them.
      markers: CHAPTERS.map((chapter) => ({
        id: markerId(side, chapter.id),
        location: [...chapter.location] as [number, number],
        size: 0,
      })),
      markerElevation: 0,
      context: { alpha: true, antialias: false, depth: false, stencil: false },
    });

    const tick = (now: number) => {
      if (!running) return;
      globe.update(rotationAt(now));
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    io.observe(wrap);

    const ro = new ResizeObserver(() => globe.update(geometry()));
    ro.observe(wrap);

    canvas.style.opacity = "1";

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      globe.destroy();
    };
  }, [side]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 z-0 w-[200%] opacity-80",
        side === "left" ? "left-0" : "-left-full",
      )}
    >
      <canvas
        ref={canvasRef}
        // cobe's land dots are soft cones with a fixed size relative to the
        // globe, so at this scale they're big and blurry. A low map
        // brightness keeps only each cone's core lit; contrast then crisps
        // its edge — smaller, sharper dots.
        className="block h-full w-full opacity-0 [filter:contrast(1.9)] transition-opacity duration-1000"
      />
      {/* Atmosphere: a ring exactly on the globe's limb. */}
      <div
        className="stats-globe-atmosphere"
        style={{
          width: `${RADIUS_OF_WIDTH * 200}%`,
          left: `${50 - RADIUS_OF_WIDTH * 100}%`,
          bottom: `${(1 - DEPTH_OF_HEIGHT) * 100}%`,
        }}
      />
      {/* cobe's "Pulse" showcase markers, staggered per chapter. */}
      {CHAPTERS.map((chapter, index) => {
        const id = markerId(side, chapter.id);
        return (
          <div
            key={chapter.id}
            className="stats-globe-pulse"
            style={
              {
                positionAnchor: `--cobe-${id}`,
                opacity: `var(--cobe-visible-${id}, 0)`,
                filter: `blur(calc((1 - var(--cobe-visible-${id}, 0)) * 8px))`,
                "--delay": `${index * 0.35}s`,
              } as React.CSSProperties
            }
          >
            <span className="stats-globe-pulse-ring" />
            <span className="stats-globe-pulse-ring" />
            <span className="stats-globe-pulse-dot" />
          </div>
        );
      })}
    </div>
  );
}
