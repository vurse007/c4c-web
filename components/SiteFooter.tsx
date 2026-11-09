"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LegalModal from "@/components/LegalModal";
import { LEGAL_LINKS, type LegalDocId } from "@/lib/legal";
import { DONATE_HREF, NAV_LINKS } from "@/lib/nav";

const INSTAGRAM_URL = "https://www.instagram.com/caring.forcaregivers/";
// Replace with the channel URL when it is ready.
const YOUTUBE_URL = "https://www.youtube.com";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22.5 7.2a3 3 0 0 0-2.1-2.1C18.6 4.7 12 4.7 12 4.7s-6.6 0-8.4.4A3 3 0 0 0 1.5 7.2 31 31 0 0 0 1.1 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.4 8.4.4 8.4.4s6.6 0 8.4-.4a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.8 31 31 0 0 0-.4-4.8Z" />
      <path d="M9.8 15.2V8.8L15.5 12l-5.7 3.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socialClass =
  "flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white";

export default function SiteFooter() {
  const [legalDoc, setLegalDoc] = useState<LegalDocId | null>(null);
  const closeLegal = useCallback(() => setLegalDoc(null), []);
  return (
    <footer className="relative z-10 w-full bg-black text-white">
      <div className="grid grid-cols-1 gap-12 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-3 lg:items-start lg:gap-10 lg:px-14 lg:py-20">
        <nav className="flex flex-col gap-3 lg:pt-1">
          {[...NAV_LINKS, { label: "Donate", href: DONATE_HREF }].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="w-fit text-[15px] font-light text-white/75 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-start lg:items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/c4cweb.svg"
              alt="Caring for Caregivers"
              width={32}
              height={34}
              className="h-8 w-auto"
            />
            <span className="text-xl font-regular tracking-wide text-white sm:text-2xl">
              Caring for Caregivers
            </span>
          </Link>
          <div className="mt-6 flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={socialClass}
            >
              <InstagramIcon />
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className={socialClass}
            >
              <YoutubeIcon />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-[15px] font-light text-white/75 lg:items-end lg:text-right">
          <p>Irvine, CA 92602</p>
          <a
            href="tel:+16314175779"
            className="w-fit transition-colors hover:text-white"
          >
            (631) 417-5779
          </a>
          <a
            href="mailto:wearecaringforcaregivers@gmail.com"
            className="w-fit break-all transition-colors hover:text-white"
          >
            wearecaringforcaregivers@gmail.com
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/15 px-6 py-6 text-[13px] font-light text-white/45 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => setLegalDoc(link.id)}
              className="cursor-pointer text-left transition-colors hover:text-white/80"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <p>© {new Date().getFullYear()} Caring for Caregivers.</p>
      </div>
      <LegalModal docId={legalDoc} onClose={closeLegal} />
    </footer>
  );
}
