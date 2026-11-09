"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_DURATION_MS = 2000;
const NUMBER_CLASS =
  "whitespace-nowrap text-[clamp(2.25rem,calc((100vw-40rem)/10.2),6rem)] font-regular leading-none text-black";
/** Left inset stays put (hairline → number). Right inset is the wider column gutter. */
const BOX_INSET =
  "pl-8 pr-20 pt-8 pb-8 sm:pl-10 sm:pr-28 sm:pt-10 sm:pb-10 lg:pr-36";

const STATS = [
  {
    value: 200,
    label:
      "healthcare providers supported with care package donation, community events, resources, research, and more.",
    suffix: "+",
  },
  {
    value: 9000,
    label:
      "of funding support recieved from grants, fundraisers and partnerships, as well as individual donors.",
    prefix: "$",
    suffix: "+",
    grouped: true,
  },
  {
    value: 300,
    label:
      "volunteers at work through various initiatives around the world to support caregivers since 2025.",
    suffix: "+",
  },
] as const;

function StatNumber({
  display,
  prefix = "",
  suffix = "",
}: {
  display: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <span className="flex h-[1em] items-start tabular-nums leading-none">
      {prefix ? (
        <span className="mr-[0.06em] self-start leading-none">
          <span className="block text-[0.42em] leading-none">{prefix}</span>
        </span>
      ) : null}
      <span className="tracking-tight leading-none">{display}</span>
      {suffix ? (
        <span className="ml-[0.05em] self-start leading-none">
          <span className="block text-[0.42em] leading-none">{suffix}</span>
        </span>
      ) : null}
    </span>
  );
}

function CountUpValue({
  end,
  started,
  prefix = "",
  suffix = "",
  grouped = false,
}: {
  end: number;
  started: boolean;
  prefix?: string;
  suffix?: string;
  grouped?: boolean;
}) {
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

  const display = grouped ? value.toLocaleString("en-US") : String(value);

  return <StatNumber display={display} prefix={prefix} suffix={suffix} />;
}

export default function ImpactStats() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex w-full min-w-0 justify-end">
      <div className="flex min-w-0 w-max max-w-full flex-col sm:flex-row sm:flex-nowrap sm:justify-end">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`relative flex w-max min-w-0 max-w-full flex-col ${BOX_INSET}`}
            style={{
              transform: started ? "translateY(0)" : "translateY(1.25rem)",
              opacity: started ? 1 : 0,
              transition: `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${
                120 + i * 180
              }ms, opacity 0.4s ease-out ${120 + i * 180}ms`,
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top bg-black/15"
              style={{
                transform: started ? "scaleY(1)" : "scaleY(0)",
                transition: `transform 0.85s cubic-bezier(0.22, 1, 0.36, 1) ${
                  80 + i * 160
                }ms`,
              }}
            />
            <div className={`mb-20 grid w-max items-start ${NUMBER_CLASS}`}>
              <div aria-hidden className="invisible col-start-1 row-start-1">
                <StatNumber display="9,000" prefix="$" suffix="+" />
              </div>
              <div className="col-start-1 row-start-1">
                <CountUpValue
                  end={stat.value}
                  started={started}
                  prefix={"prefix" in stat ? stat.prefix : undefined}
                  suffix={"suffix" in stat ? stat.suffix : undefined}
                  grouped={"grouped" in stat ? stat.grouped : false}
                />
              </div>
            </div>
            <p className="w-0 min-w-full text-sm font-light leading-[1.5] text-black/50 sm:text-[18px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
