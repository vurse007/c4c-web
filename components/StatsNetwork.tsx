"use client";

import { useRef } from "react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

// One network spanning two side-by-side bento cards. The canvas is two
// cards wide; x is a % of that full width, so x < 50 is the left card and
// x > 50 is the right card. Each card renders the whole canvas, shifted so
// its overflow-hidden shows only its own half — the halves line up exactly
// at the shared border, as if the grid gap weren't there.
const NODES = {
  hubL: { x: 33, y: 50, size: "size-7" },
  a: { x: 12, y: -10, size: "size-5" },
  b: { x: -6, y: 48, size: "size-6" },
  c: { x: 27, y: 122, size: "size-6" },
  g: { x: 60, y: 112, size: "size-4" },
  h: { x: 40, y: -10, size: "size-5" },
  hubR: { x: 70, y: 20, size: "size-7" },
  d: { x: 96, y: -10, size: "size-5" },
  j: { x: 115, y: 40, size: "size-5" },
  e: { x: 112, y: 64, size: "size-7" },
  f: { x: 84, y: 120, size: "size-5" },
} as const;

type NodeId = keyof typeof NODES;

const EDGES: [NodeId, NodeId][] = [
  ["hubL", "a"],
  ["hubL", "b"],
  ["hubL", "c"],
  ["hubL", "g"],
  ["hubL", "hubR"],
  ["hubL", "h"],
  ["h", "hubR"],
  ["hubR", "d"],
  ["hubR", "j"],
  ["j", "e"],
  ["hubR", "f"],
];

const BEAM_PROPS = {
  pathColor: "#9ca3af",
  pathOpacity: 0.3,
  gradientStartColor: "#bfdbfe",
  gradientStopColor: "#3b82f6",
  pathWidth: 3,
  duration: 4.5,
  curvature: 0,
};

export default function StatsNetwork({ side }: { side: "left" | "right" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = {
    hubL: useRef<HTMLDivElement>(null),
    a: useRef<HTMLDivElement>(null),
    b: useRef<HTMLDivElement>(null),
    c: useRef<HTMLDivElement>(null),
    g: useRef<HTMLDivElement>(null),
    h: useRef<HTMLDivElement>(null),
    hubR: useRef<HTMLDivElement>(null),
    d: useRef<HTMLDivElement>(null),
    j: useRef<HTMLDivElement>(null),
    e: useRef<HTMLDivElement>(null),
    f: useRef<HTMLDivElement>(null),
  };

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-y-0 z-0 w-[200%] opacity-55",
        side === "left" ? "left-0" : "-left-full",
      )}
    >
      {/* Beams first so the nodes paint on top and hide the path inside
          each ring. Same duration, no delay, identical geometry in both
          cards — so pulses stay in sync and continue across the seam. */}
      {EDGES.map(([from, to]) => (
        <AnimatedBeam
          key={`${from}-${to}`}
          containerRef={containerRef}
          fromRef={refs[from]}
          toRef={refs[to]}
          {...BEAM_PROPS}
        />
      ))}

      {(Object.keys(NODES) as NodeId[]).map((id) => {
        const node = NODES[id];
        return (
          <div
            key={id}
            ref={refs[id]}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-neutral-400 bg-black",
              node.size,
            )}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          />
        );
      })}
    </div>
  );
}
