"use client";

import { useState, type FormEvent } from "react";

const SCRIPT_URL = process.env.NEXT_PUBLIC_CONTACT_SCRIPT_URL ?? "";

export default function ContactForm({ dark = false }: { dark?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");

    try {
      if (SCRIPT_URL) {
        await fetch(SCRIPT_URL, {
          method: "POST",
          body: data,
          mode: "no-cors",
        });
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "w-full rounded-xl bg-white px-4 py-3 text-[15px] font-light text-black outline-none ring-0 placeholder:text-black/35 focus:ring-2 focus:ring-white/70";

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-sm font-light text-white/80">
          First name
          <input
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="Jane"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-light text-white/80">
          Last name
          <input
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Doe"
            className={fieldClass}
          />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-light text-white/80">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-light text-white/80">
          Phone number
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="(555) 555-5555"
            className={fieldClass}
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-light text-white/80">
        Message
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How would you like to get involved?"
          className={`${fieldClass} min-h-[8.5rem] resize-y`}
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className={`mt-2 self-start rounded-full px-7 py-3 text-[15px] font-regular transition-colors disabled:cursor-wait disabled:opacity-70 ${
          dark
            ? "bg-blue-500 text-white hover:bg-blue-400"
            : "bg-white text-black hover:bg-white/90"
        }`}
      >
        {status === "sending" ? "Sending…" : "Get in Touch"}
      </button>
      {status === "sent" ? (
        <p className="text-sm font-light text-white/90">
          Thanks — we’ll be in touch soon.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm font-light text-white/90">
          Something went wrong. Please try again.
        </p>
      ) : null}
    </form>
  );
}
