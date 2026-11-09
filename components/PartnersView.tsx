"use client";

import Image from "next/image";
import partnerHero from "../public/partner-hero.jpeg";
import { useEffect, useRef, useState } from "react";

const INTRO =
  "We partner with organizations around the world to expand our reach and take part in initiatives that deepen the positive impact we make, whether that be community events, giving back, research, or fundraisers. Together with hospitals, universities, local businesses, and community groups, we turn shared goals into real support for healthcare workers, and we're always looking for new partners who want to help us show gratitude to those who care for others.";

export default function PartnersView() {
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;

      if (imageRef.current) {
        const prep = Math.min(1, Math.max(0, y / window.innerHeight));
        imageRef.current.style.filter = `brightness(${1 - prep * 0.65})`;
      }

      const overlay = darkenRef.current;
      const intro = introRef.current;
      const divider = dividerRef.current;
      if (overlay && intro) {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const introRect = intro.getBoundingClientRect();

        overlay.style.clipPath = `inset(${Math.max(0, introRect.top)}px ${Math.max(0, vw - introRect.right)}px ${Math.max(0, vh - introRect.bottom)}px ${Math.max(0, introRect.left)}px)`;

        const dividerGone =
          !divider || divider.getBoundingClientRect().bottom <= 0;
        const stillInIntro =
          introRect.top <= 0 && introRect.bottom >= vh * 0.4;

        overlay.style.opacity = dividerGone && stillInIntro ? "1" : "0";

        if (!revealedRef.current && introRect.top < vh * 0.18) {
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

  const reveal = {
    transform: revealed ? "translateY(0)" : "translateY(7rem)",
    opacity: revealed ? 1 : 0,
    transition:
      "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease-out",
  };

  return (
    <>
      <div ref={imageRef} className="fixed inset-0 h-screen w-full">
        <Image
          src={partnerHero}
          placeholder="blur"
          alt=""
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          aria-hidden
          className="object-cover object-[50%_75%]"
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
            Partners
          </h1>
        </div>
        <div
          ref={dividerRef}
          aria-hidden
          className="absolute inset-x-6 bottom-6 z-10 h-px bg-white/30 sm:inset-x-10 lg:inset-x-14"
        />
      </section>

      <section ref={introRef} className="relative z-10 min-h-[140vh] w-full">
        <div className="relative flex min-h-[140vh] items-center px-6 sm:px-10 lg:px-14">
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-16 lg:gap-24">
            <p
              className="text-xl font-light text-white sm:text-2xl md:col-span-4 lg:text-3xl"
              style={reveal}
            >
              Our Partners
            </p>
            <p
              className="text-2xl font-regular leading-[1.25] tracking-tight text-white sm:text-3xl md:col-span-8 lg:text-4xl"
              style={reveal}
            >
              {INTRO}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
