"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { LEGAL_DOCS, type LegalDocId } from "@/lib/legal";

function ParagraphText({ text }: { text: string }) {
  if (text.startsWith("Email: ")) {
    const email = text.slice("Email: ".length);
    return (
      <p>
        Email:{" "}
        <a
          href={`mailto:${email}`}
          className="underline decoration-black/25 underline-offset-2 hover:decoration-black/60"
        >
          {email}
        </a>
      </p>
    );
  }

  if (text.startsWith("Phone: ")) {
    const phone = text.slice("Phone: ".length);
    return (
      <p>
        Phone:{" "}
        <a
          href={`tel:${phone.replace(/[^\d+]/g, "")}`}
          className="underline decoration-black/25 underline-offset-2 hover:decoration-black/60"
        >
          {phone}
        </a>
      </p>
    );
  }

  return <p>{text}</p>;
}

export default function LegalModal({
  docId,
  onClose,
}: {
  docId: LegalDocId | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = docId !== null;
  const doc = docId ? LEGAL_DOCS[docId] : null;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !doc) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6 lg:p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white text-black shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/10 px-6 py-5 sm:px-8">
          <h2
            id={titleId}
            className="text-2xl font-regular tracking-tight sm:text-3xl"
          >
            {doc.title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-black/60 transition-colors hover:bg-black/5 hover:text-black"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-8 text-[15px] font-light leading-[1.7] text-black/70">
            {doc.sections.map((section, index) => (
              <section key={`${doc.id}-${index}`} className="space-y-3">
                {section.heading ? (
                  <h3 className="text-sm font-regular uppercase tracking-[0.14em] text-black">
                    {section.heading}
                  </h3>
                ) : null}
                {section.paragraphs?.map((paragraph, paragraphIndex) => (
                  <ParagraphText
                    key={`${doc.id}-${index}-p-${paragraphIndex}`}
                    text={paragraph}
                  />
                ))}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          <p className="mt-10 text-sm font-light text-black/40">
            Last updated: {doc.lastUpdated}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
