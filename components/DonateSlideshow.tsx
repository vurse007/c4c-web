"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INTERVAL_MS = 4500;
const TRANSITION_MS = 1400;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

// "Glass" transition: instead of a plain crossfade, the outgoing photo frosts
// over (blurs, brightens, and drifts slightly larger) while the incoming one
// starts frosted and comes into focus — like looking through a fogged pane
// that clears. The slight scale keeps the blurred edges from showing a halo.
const FOCUSED = {
  opacity: 1,
  filter: "blur(0px) brightness(1) saturate(1)",
  transform: "scale(1)",
};
const FROSTED = {
  opacity: 0,
  filter: "blur(28px) brightness(1.15) saturate(1.3)",
  transform: "scale(1.08)",
};

export default function DonateSlideshow({ photos }: { photos: string[] }) {
  const [{ index, prev }, setSlide] = useState<{
    index: number;
    prev: number | null;
  }>({ index: 0, prev: null });

  useEffect(() => {
    if (photos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      // Don't advance while the tab is hidden — saves decoding and blur work
      // nobody can see, and avoids a burst of catch-up transitions on return.
      if (document.hidden) return;
      setSlide(({ index: i }) => ({
        index: (i + 1) % photos.length,
        prev: i,
      }));
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [photos.length]);

  const next = (index + 1) % photos.length;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-black/15 bg-black/5 lg:aspect-auto lg:min-h-[560px]">
      {photos.map((src, i) => {
        // Only mount the visible photo, the one frosting out, and the next one
        // (so it's already loaded when its turn comes).
        if (i !== index && i !== prev && i !== next) return null;
        const active = i === index;
        return (
          <Image
            key={src}
            src={src}
            alt={
              active
                ? "Caring for Caregivers volunteers and healthcare workers"
                : ""
            }
            aria-hidden={!active}
            fill
            // The first photo is above the fold on /donate, so fetch it right
            // away; the rest stay lazy (they only mount one step ahead).
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            sizes="(min-width: 1024px) 60vw, 100vw"
            quality={70}
            className="object-cover"
            style={{
              ...(active ? FOCUSED : FROSTED),
              zIndex: active ? 2 : i === prev ? 1 : 0,
              willChange: "opacity, filter, transform",
              transition: [
                `opacity ${TRANSITION_MS}ms ${EASE}`,
                `filter ${TRANSITION_MS}ms ${EASE}`,
                `transform ${TRANSITION_MS}ms ${EASE}`,
              ].join(", "),
            }}
          />
        );
      })}
    </div>
  );
}
