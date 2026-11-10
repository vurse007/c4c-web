"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const FORM_PATH = "/embed/donation-form/give-back-to-those-who-care";
const FORM_URL = `https://www.zeffy.com${FORM_PATH}`;
// If Zeffy's script hasn't rendered the form by then (blocked or failed),
// show the plain iframe.
const FALLBACK_AFTER_MS = 5000;

export default function ZeffyForm() {
  const [fallback, setFallback] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!embedRef.current?.querySelector("iframe")) setFallback(true);
    }, FALLBACK_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      {!fallback && (
        <div ref={embedRef} data-zeffy-embed data-form-url={FORM_PATH} />
      )}
      {fallback && (
        <div className="relative h-[760px] w-full overflow-hidden">
          <iframe
            title="Donation form powered by Zeffy"
            src={FORM_URL}
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
            allow="payment"
          />
        </div>
      )}
      <Script
        src="https://www.zeffy.com/embed/v2/zeffy-embed.js"
        strategy="afterInteractive"
        // The script only scans the page once, when it first loads. After a
        // client-side navigation it's already loaded, so re-run its init
        // (it skips embeds it has already set up).
        onReady={() => {
          (
            window as { Zeffy?: { embed?: { init?: () => void } } }
          ).Zeffy?.embed?.init?.();
        }}
        onError={() => setFallback(true)}
      />
    </div>
  );
}
