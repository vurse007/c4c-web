"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const SPEED = 70; // px per second
const EASE = 4; // higher = snappier slow-down / speed-up

export default function PartnersLoop({ logos }: { logos: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLUListElement>(null);
  const hovering = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    let x = 0;
    let speed = SPEED;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = hovering.current ? 0 : SPEED;
      speed += (target - speed) * (1 - Math.exp(-EASE * dt));
      const width = copyRef.current?.offsetWidth ?? 0;
      if (width > 0) {
        x = (x + speed * dt) % width;
        if (trackRef.current)
          trackRef.current.style.transform = `translate3d(${-x}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="mt-28 overflow-hidden py-10 sm:mt-36 lg:mt-44"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div ref={trackRef} className="flex w-max items-center will-change-transform">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            ref={copy === 0 ? copyRef : undefined}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-20 pr-20 sm:gap-28 sm:pr-28"
          >
            {logos.map((src, i) => (
              <li key={`${src}-${i}`} className="shrink-0">
                {/* Logos have mixed aspect ratios, so let CSS size them
                    (fixed height, auto width) and give the optimizer a
                    width hint via `sizes`. */}
                <Image
                  src={src}
                  alt=""
                  width={0}
                  height={0}
                  sizes="(min-width: 640px) 22rem, 18rem"
                  className="h-20 w-auto max-w-[18rem] origin-center object-contain opacity-60 grayscale transition duration-200 ease-out hover:scale-110 hover:opacity-100 hover:grayscale-0 sm:h-28 sm:max-w-[22rem]"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
