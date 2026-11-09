"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { TypewriterClass } from "typewriter-effect";
import GetInvolved from "@/components/GetInvolved";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

// typewriter-effect touches the DOM directly, so it must load client-side only.
const TypewriterComponent = dynamic(() => import("typewriter-effect"), {
  ssr: false,
});

const ChapterGlobe = dynamic(() => import("@/components/ChapterGlobe"), {
  ssr: false,
});

// Below the fold and pulls in gsap + cobe + motion; split it out so the hero
// hydrates sooner. Still server-rendered, so there's no layout shift.
const MagicBento = dynamic(() => import("@/components/MagicBento"));

const StackGallery = dynamic(() => import("@/components/StackGallery"), {
  ssr: false,
});

// Last word is the one the animation types out and locks into.
const TYPED_WORDS = [
  "Nurses.",
  "Doctors.",
  "Aides.",
  "Therapists.",
  "Heroes.",
  "Caregivers.",
];

const TYPING_DELAY = 90; // ms per character while typing
const DELETE_SPEED = 45; // ms per character while deleting
const HOLD_AFTER_TYPE = 1400; // ms to pause once a word is fully typed
const CURSOR_HIDE_DELAY = 1000; // ms to wait after locking before the cursor fades

const HERO_VIDEO_SRC = "/hero.mp4";

// Replace with your YouTube video ID when ready.
const WATCH_YOUTUBE_ID = "";

function WatchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6 lg:p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Watch video"
        className="relative h-[92vh] w-[94vw] overflow-hidden bg-black"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close video"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${WATCH_YOUTUBE_ID}?autoplay=1&rel=0`}
          title="Caring for Caregivers"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const [watchOpen, setWatchOpen] = useState(false);
  const [aboutRevealed, setAboutRevealed] = useState(false);
  const watchButtonRef = useRef<HTMLButtonElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);
  const videoDimRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aboutRevealedRef = useRef(false);

  const closeWatch = useCallback(() => {
    setWatchOpen(false);
    watchButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const video = videoRef.current;
      const dim = videoDimRef.current;
      const overlay = darkenRef.current;
      const about = aboutRef.current;
      const divider = dividerRef.current;

      if (dim) {
        const prep = Math.min(1, Math.max(0, y / vh));
        dim.style.opacity = String(prep * 0.65);
      }

      const aboutRect = about?.getBoundingClientRect();

      // Keep the video running through the hero and the darkened Who we are
      // section. Pause only after that section has fully left the viewport.
      if (video && aboutRect) {
        if (aboutRect.bottom <= 0) {
          if (!video.paused) video.pause();
        } else if (video.paused) {
          void video.play();
        }
      }

      if (overlay && aboutRect) {
        const vw = window.innerWidth;

        const clipTop = Math.max(0, aboutRect.top);
        const clipRight = Math.max(0, vw - aboutRect.right);
        const clipBottom = Math.max(0, vh - aboutRect.bottom);
        const clipLeft = Math.max(0, aboutRect.left);
        overlay.style.clipPath = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px)`;

        const dividerGone = !divider || divider.getBoundingClientRect().bottom <= 0;
        const stillInAbout =
          aboutRect.top <= 0 && aboutRect.bottom >= vh * 0.4;

        overlay.style.opacity = dividerGone && stillInAbout ? "1" : "0";

        if (!aboutRevealedRef.current && aboutRect.top < vh * 0.18) {
          aboutRevealedRef.current = true;
          setAboutRevealed(true);
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
    <main className="relative w-full bg-black">
      {/* Background video stays fixed so it keeps playing as the page scrolls */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="fixed inset-0 h-screen w-full object-cover"
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Dim without a video filter — opacity on a layer is much cheaper. */}
      <div
        ref={videoDimRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] bg-black"
        style={{ opacity: 0 }}
      />

      {/* Screen wash for the about section only — fades in after the hero divider leaves. */}
      <div
        ref={darkenRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-0 transition-opacity duration-700 ease-in-out"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.36) 45%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      <SiteHeader />

      <section className="relative h-screen w-full">
        {/* Hero copy */}
        <div className="absolute bottom-16 left-6 z-10 max-w-8xl sm:bottom-20 sm:left-10 lg:left-14">
          <h1 className="text-4xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-5xl">
            Someone needs to care for the
          </h1>

          <h1 className="text-4xl mt-4 font-regular leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-9xl">
            <TypewriterComponent
              onInit={(typewriter: TypewriterClass) => {
                // Type + delete every word except the last one.
                TYPED_WORDS.slice(0, -1).forEach((word) => {
                  typewriter
                    .typeString(word)
                    .pauseFor(HOLD_AFTER_TYPE)
                    .deleteAll(DELETE_SPEED);
                });

                // Type the final word, hold on it, then fade the cursor out.
                typewriter
                  .typeString(TYPED_WORDS[TYPED_WORDS.length - 1])
                  .callFunction((state) => {
                    setTimeout(() => {
                      const cursor = state.elements.cursor;
                      // The library blinks the cursor via a CSS animation, which
                      // keeps overriding inline opacity every frame — stop it
                      // first, then the opacity transition actually sticks.
                      cursor.style.animation = "none";
                      cursor.style.transition = "opacity 0.5s ease";
                      cursor.style.opacity = "0";
                    }, CURSOR_HIDE_DELAY);
                  })
                  .start();
              }}
              options={{
                delay: TYPING_DELAY,
                deleteSpeed: DELETE_SPEED,
                loop: false,
                autoStart: true,
              }}
            />
          </h1>

          <button
            ref={watchButtonRef}
            type="button"
            onClick={() => setWatchOpen(true)}
            className="group mt-6 flex items-center gap-4 text-2xl font-light leading-none text-white/90 transition-colors hover:text-white sm:text-5xl"
          >
            Watch
            {/* Sized in em so it's always exactly 1 line-height tall — i.e.
                exactly the height of "Watch" at whatever font size is active. */}
            <span className="flex aspect-square h-[1em] shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur transition-colors duration-300 group-hover:bg-blue-500">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-[0.05em] h-[0.4em] w-[0.4em] text-white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </div>

        <div
          ref={dividerRef}
          aria-hidden
          className="absolute inset-x-6 bottom-6 z-10 h-px bg-white/30 sm:inset-x-10 lg:inset-x-14"
        />
      </section>

      <section ref={aboutRef} className="relative z-10 min-h-[140vh] w-full">
        <div className="relative flex min-h-[140vh] items-center px-6 sm:px-10 lg:px-14">
          <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-12 md:gap-16 lg:gap-24">
            <p
              className="text-xl font-light text-white sm:text-2xl md:col-span-4 lg:text-3xl"
              style={{
                transform: aboutRevealed ? "translateY(0)" : "translateY(7rem)",
                opacity: aboutRevealed ? 1 : 0,
                transition:
                  "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease-out",
              }}
            >
              Who we are
            </p>
            <p
              className="text-2xl font-regular leading-[1.25] tracking-tight text-white sm:text-3xl md:col-span-8 lg:text-4xl"
              style={{
                transform: aboutRevealed ? "translateY(0)" : "translateY(7rem)",
                opacity: aboutRevealed ? 1 : 0,
                transition:
                  "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease-out",
              }}
            >
              Caring for Caregivers is a student-led nonprofit dedicated to
              supporting healthcare workers, combating stress and burnout, and
              fostering a culture of appreciation through community events,
              education, research, and wellness initiatives.
            </p>
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

      <StackGallery />

      <section className="relative z-10 w-full bg-white">
        <div className="grid min-h-[120vh] grid-cols-1 items-center gap-12 px-6 pb-16 pt-[18vh] sm:px-10 sm:pb-20 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:pb-24">
          <div className="lg:col-span-5">
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-black">
              Connecting <span className="text-blue-500">Globally</span>
            </h2>
            <p className="mt-8 max-w-xl text-base font-light leading-[1.7] text-black/50 sm:text-lg lg:text-xl">
              With seven chapters in four countries, we work to spread awareness
              of healthcare burnout and its effects, engaging communities to
              educate, support, and promote the well-being of healthcare
              workers. At the same time, we provide students with meaningful
              opportunities for leadership, community service, and hands-on
              involvement, fostering the next generation of advocates who
              prioritize the mental and emotional health of those who care for
              others.
            </p>
          </div>
          <div className="lg:col-span-7">
            <ChapterGlobe />
          </div>
        </div>
      </section>

      <GetInvolved />

      <WatchModal open={watchOpen} onClose={closeWatch} />
    </main>
    <SiteFooter />
    </>
  );
}
