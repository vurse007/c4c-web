"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export const CHAPTERS = [
  {
    id: "irvine",
    label: "Irvine",
    location: [33.6846, -117.8265] as [number, number],
    labelShift: "-110% -10px",
  },
  {
    id: "mission-viejo",
    label: "Mission Viejo",
    location: [33.6, -117.672] as [number, number],
    labelShift: "10px -10px",
  },
  {
    id: "nyc",
    label: "New York City",
    location: [40.7128, -74.006] as [number, number],
    labelShift: "-50% -12px",
  },
  {
    id: "sf",
    label: "San Francisco",
    location: [37.7749, -122.4194] as [number, number],
    labelShift: "-50% -12px",
  },
  {
    id: "taiwan",
    label: "Taiwan",
    location: [25.033, 121.5654] as [number, number],
    labelShift: "-50% -12px",
  },
  {
    id: "toronto",
    label: "Toronto",
    location: [43.6532, -79.3832] as [number, number],
    labelShift: "-50% -12px",
  },
  {
    id: "uganda",
    label: "Uganda",
    location: [0.3476, 32.5825] as [number, number],
    labelShift: "-50% -12px",
  },
] as const;

const CHAPTER_BY_ID = Object.fromEntries(
  CHAPTERS.map((chapter) => [chapter.id, chapter]),
);

function loc(id: (typeof CHAPTERS)[number]["id"]): [number, number] {
  return [...CHAPTER_BY_ID[id].location] as [number, number];
}

const ARCS = [
  { from: loc("sf"), to: loc("taiwan") },
  { from: loc("nyc"), to: loc("uganda") },
  { from: loc("taiwan"), to: loc("uganda") },
  { from: loc("irvine"), to: loc("nyc") },
  { from: loc("toronto"), to: loc("taiwan") },
  { from: loc("mission-viejo"), to: loc("toronto") },
];

export default function ChapterGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = wrap.clientWidth || 600;
    let phi = 0;
    let phiOffset = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let frame = 0;
    let running = false;
    let cancelled = false;

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width,
      height: width,
      phi,
      theta: 0.2,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 8000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.2, 0.4, 1],
      glowColor: [1, 1, 1],
      scale: 1,
      markerElevation: 0.02,
      context: { alpha: true, antialias: false, depth: false, stencil: false },
      markers: CHAPTERS.map((chapter) => ({
        id: chapter.id,
        location: [...chapter.location] as [number, number],
        size: 0.03,
      })),
      arcs: ARCS.map((arc) => ({
        from: [...arc.from] as [number, number],
        to: [...arc.to] as [number, number],
      })),
      arcColor: [0.3, 0.5, 1],
      arcWidth: 0.5,
      arcHeight: 0.42,
    });

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const tick = () => {
      if (cancelled || !running) return;
      if (!dragging) phi += 0.005;
      globe.update({ phi: phi + phiOffset });
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || cancelled) return;
      running = true;
      tick();
    };

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      dragStartX = event.clientX;
      dragStartOffset = phiOffset;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      phiOffset = dragStartOffset + (event.clientX - dragStartX) / 220;
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const resize = () => {
      const next = wrap.clientWidth || width;
      if (Math.abs(next - width) < 1) return;
      width = next;
      globe.update({ width, height: width });
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.1 },
    );
    io.observe(wrap);

    canvas.style.opacity = "1";

    return () => {
      cancelled = true;
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      globe.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-[48rem] lg:max-w-none"
    >
      <canvas
        ref={canvasRef}
        aria-label="Globe showing Caring for Caregivers chapters"
        className="block h-full w-full cursor-grab touch-none [contain:layout_paint_size] opacity-0 transition-opacity duration-700"
      />
      {CHAPTERS.map((chapter) => (
        <span
          key={chapter.id}
          className="pointer-events-none absolute z-10 rounded-full bg-white px-2.5 py-1 text-[11px] font-light tracking-wide text-black/80 shadow-sm ring-1 ring-black/15 sm:text-xs"
          style={{
            positionAnchor: `--cobe-${chapter.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: chapter.labelShift,
            opacity: `var(--cobe-visible-${chapter.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${chapter.id}, 0)) * 8px))`,
            transition: "opacity 0.3s ease, filter 0.3s ease",
          }}
        >
          {chapter.label}
        </span>
      ))}
    </div>
  );
}
