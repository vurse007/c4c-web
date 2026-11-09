"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AdvisoryBoard from "@/components/AdvisoryBoard";
import ChapterBoards from "@/components/ChapterBoards";
import OurTeam from "@/components/OurTeam";

const MISSION = [
  "Caring for Caregivers is a 501(c)(3) nonprofit dedicated to supporting the wellness of healthcare providers and raising awareness about healthcare burnout. Through community events, education, research, and wellness initiatives, we work alongside students and local communities to show gratitude for those who sacrifice so much to care for others.",
  "These efforts serve as a platform for our deeper mission: addressing the root causes of burnout by educating younger generations on how to navigate the emotional, physical, and mental demands of healthcare. We strive to give back, advocate for improvements in training environments, and inspire future healthcare professionals to pursue this vital and heroic field with resilience and compassion.",
];

export default function AboutView() {
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (imageRef.current) {
        const prep = Math.min(1, Math.max(0, y / window.innerHeight));
        imageRef.current.style.filter = `brightness(${1 - prep * 0.65})`;
      }

      const overlay = darkenRef.current;
      const mission = missionRef.current;
      const divider = dividerRef.current;
      if (overlay && mission) {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const missionRect = mission.getBoundingClientRect();

        overlay.style.clipPath = `inset(${Math.max(0, missionRect.top)}px ${Math.max(0, vw - missionRect.right)}px ${Math.max(0, vh - missionRect.bottom)}px ${Math.max(0, missionRect.left)}px)`;

        const dividerGone =
          !divider || divider.getBoundingClientRect().bottom <= 0;
        const stillInMission =
          missionRect.top <= 0 && missionRect.bottom >= vh * 0.4;

        overlay.style.opacity = dividerGone && stillInMission ? "1" : "0";

        if (!revealedRef.current && missionRect.top < vh * 0.18) {
          revealedRef.current = true;
          setRevealed(true);
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div ref={imageRef} className="fixed inset-0 h-screen w-full">
        <Image
          src="/about-hero.JPG"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          aria-hidden
          className="object-cover"
        />
      </div>

      <div
        ref={darkenRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-0 transition-opacity duration-700 ease-in-out"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.36) 45%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      <section className="relative h-screen w-full">
        <div className="absolute bottom-16 left-6 z-10 sm:bottom-20 sm:left-10 lg:left-14">
          <h1 className="text-[clamp(5rem,7vw,6rem)] font-regular leading-[1.05] tracking-tight text-white">
            About Us
          </h1>
        </div>
        <div
          ref={dividerRef}
          aria-hidden
          className="absolute inset-x-6 bottom-6 z-10 h-px bg-white/30 sm:inset-x-10 lg:inset-x-14"
        />
      </section>

      <section ref={missionRef} className="relative z-10 min-h-[140vh] w-full">
        <div className="relative flex min-h-[140vh] items-center px-6 sm:px-10 lg:px-14">
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-16 lg:gap-24">
            <p
              className="text-xl font-light text-white sm:text-2xl md:col-span-4 lg:text-3xl"
              style={{
                transform: revealed ? "translateY(0)" : "translateY(7rem)",
                opacity: revealed ? 1 : 0,
                transition:
                  "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease-out",
              }}
            >
              Mission
            </p>
            <div
              className="space-y-8 text-2xl font-regular leading-[1.25] tracking-tight text-white sm:text-3xl md:col-span-8 lg:text-4xl"
              style={{
                transform: revealed ? "translateY(0)" : "translateY(7rem)",
                opacity: revealed ? 1 : 0,
                transition:
                  "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease-out",
              }}
            >
              {MISSION.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AdvisoryBoard />
      <OurTeam />
      <ChapterBoards />
    </>
  );
}
