"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const PHOTOS = [
  "/stack_gallery/IMG_3721.JPG",
  "/stack_gallery/IMG_3724.JPG",
  "/stack_gallery/IMG_3770.JPG",
  "/stack_gallery/IMG_4191.JPG",
  "/stack_gallery/IMG_4346.JPG",
  "/stack_gallery/IMG_4932.JPG",
  "/stack_gallery/IMG_6134.jpeg",
  "/stack_gallery/IMG_6266.jpeg",
  "/stack_gallery/IMG_6639.jpg",
  "/stack_gallery/IMG_7407.jpeg",
  "/stack_gallery/IMG_8926.JPG",
  "/stack_gallery/IMG_9851.JPG",
] as const;

const START_SCALE = 0.55;
const SLIDE_VH = 62;

export default function StackGallery({
  photos = PHOTOS,
}: {
  photos?: readonly string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [mountedThrough, setMountedThrough] = useState(1);

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      frame.style.transform = "scale(0.92)";
      return;
    }

    let ticking = false;
    let listening = false;

    const update = () => {
      ticking = false;
      const max = section.offsetHeight - window.innerHeight;
      if (max <= 0) return;
      const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / max));
      frame.style.transform = `scale(${START_SCALE + progress * (1 - START_SCALE)})`;

      const idx = Math.min(
        photos.length - 1,
        Math.floor(progress * photos.length),
      );
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
        setMountedThrough((prev) => Math.max(prev, Math.min(photos.length - 1, idx + 1)));
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!listening) {
            listening = true;
            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll);
          }
          update();
          frame.style.willChange = "transform";
        } else if (listening) {
          listening = false;
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
          frame.style.willChange = "auto";
        }
      },
      { rootMargin: "20% 0px" },
    );

    io.observe(section);
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [photos.length]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-white"
      style={{ height: `${100 + photos.length * SLIDE_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <div
          ref={frameRef}
          className="relative h-[88vh] w-[92vw] origin-center overflow-hidden rounded-[1.75rem] bg-neutral-200"
          style={{ transform: `scale(${START_SCALE})` }}
        >
          {photos.slice(0, mountedThrough + 1).map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="92vw"
              quality={70}
              className="object-cover"
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
