"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Testimonials from "@/components/Testimonials";
import impactHero from "../public/impact.jpeg";

// Below the hero and pulls in gsap + cobe + motion; split into its own chunk.
const MagicBento = dynamic(() => import("@/components/MagicBento"));

const COUNT_DURATION_MS = 2000;
const BURNOUT_RATE = 58;

function CountUpPercent({ end, started }: { end: number; started: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!started) {
      setValue(0);
      return;
    }

    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min(1, (now - start) / COUNT_DURATION_MS);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(end * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, end]);

  return (
    <span className="flex h-[1em] items-start tabular-nums leading-none">
      <span className="leading-none">{value}</span>
      <span className="-ml-[0.04em] mt-[0.08em] text-[0.45em] leading-none">
        %
      </span>
    </span>
  );
}

export default function ImpactView() {
  const [revealed, setRevealed] = useState(false);
  const [counted, setCounted] = useState(false);
  const revealedRef = useRef(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (imageRef.current) {
        const prep = Math.min(1, Math.max(0, y / window.innerHeight));
        imageRef.current.style.filter = `brightness(${1 - prep * 0.65})`;
      }

      const overlay = darkenRef.current;
      const problem = problemRef.current;
      const divider = dividerRef.current;
      if (overlay && problem) {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const problemRect = problem.getBoundingClientRect();

        overlay.style.clipPath = `inset(${Math.max(0, problemRect.top)}px ${Math.max(0, vw - problemRect.right)}px ${Math.max(0, vh - problemRect.bottom)}px ${Math.max(0, problemRect.left)}px)`;

        const dividerGone =
          !divider || divider.getBoundingClientRect().bottom <= 0;
        const stillInProblem =
          problemRect.top <= 0 && problemRect.bottom >= vh * 0.4;

        overlay.style.opacity = dividerGone && stillInProblem ? "1" : "0";

        if (!revealedRef.current && problemRect.top < vh * 0.18) {
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

  useEffect(() => {
    const el = statRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCounted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={imageRef} className="fixed inset-0 h-screen w-full">
        <Image
          src={impactHero}
          placeholder="blur"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          aria-hidden
          className="object-cover object-top"
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
            Impact
          </h1>
        </div>
        <div
          ref={dividerRef}
          aria-hidden
          className="absolute inset-x-6 bottom-6 z-10 h-px bg-white/30 sm:inset-x-10 lg:inset-x-14"
        />
      </section>

      <section ref={problemRef} className="relative z-10 min-h-[140vh] w-full">
        <div className="relative flex min-h-[140vh] items-center px-6 sm:px-10 lg:px-14">
          <div
            className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-16 lg:gap-24"
            style={{
              transform: revealed ? "translateY(0)" : "translateY(7rem)",
              opacity: revealed ? 1 : 0,
              transition:
                "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease-out",
            }}
          >
            <p className="text-xl font-light text-white sm:text-2xl md:col-span-4 lg:text-3xl">
              The Problem
            </p>
            <div className="md:col-span-8">
              <div
                ref={statRef}
                className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8"
              >
                <p className="flex shrink-0 items-start whitespace-nowrap text-[clamp(6rem,8vw,7rem)] font-regular leading-none tracking-tight text-white">
                  <CountUpPercent end={BURNOUT_RATE} started={counted} />
                </p>
                <p className="max-w-sm text-base font-light leading-[1.5] text-white/80 sm:text-lg">
                  of primary care physicians reported burnout in 2022 — the
                  highest rate of any occupation in a six-year study of U.S.
                  health care workers.
                </p>
              </div>

              <div
                aria-hidden
                className="mt-10 h-px w-full bg-white/30 sm:mt-12"
              />

              <div className="mt-10 space-y-6 text-base font-light leading-[1.7] text-white/80 sm:mt-12 sm:text-lg lg:text-xl lg:leading-[1.7]">
                <p>
                  Burnout among health care workers rose during the pandemic and
                  remains elevated compared with prepandemic levels. In 2023,
                  more than a third of workers in the Veterans Health
                  Administration still reported burnout — and primary care
                  physicians remained the most affected.
                </p>
                <p>
                  Caring for Caregivers exists to support these professionals
                  through community events, education, research, and wellness
                  initiatives, and to help the next generation of caregivers
                  enter the field with more resilience and more support.
                </p>
                <p className="text-[15px] text-white/45 sm:text-base">
                  Source:{" "}
                  <a
                    href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12013355/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/70 hover:decoration-white/50"
                  >
                    Mohr et al., JAMA Network Open, 2025
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 w-full bg-white">
        <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
          <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-black">
            By the Numbers
          </h2>
          <div
            aria-hidden
            className="mt-16 h-px w-full bg-black/15 sm:mt-20 lg:mt-24"
          />
          <div className="mt-10">
            <MagicBento
              textAutoHide={true}
              enableStars={false}
              enableSpotlight={false}
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={false}
              spotlightRadius={100}
              particleCount={12}
              glowColor="59, 130, 246"
            />
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
