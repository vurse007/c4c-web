import { MapPin } from "lucide-react";
import {
  RevealControl,
  RevealProvider,
  RevealedContact,
} from "@/components/RevealContact";

type Card = {
  /** Key into the server-side contact table (see app/api/reveal). */
  id: string;
  title: string;
  lines?: string[];
  instagram?: string;
  span?: string;
};

const CARDS: Card[] = [
  {
    id: "main",
    title: "Main",
    instagram: "@caring.forcaregivers",
    span: "lg:col-span-2",
  },
  {
    id: "irvine",
    title: "Irvine Chapter",
    lines: ["Irvine, CA 92602"],
  },
  {
    id: "new-york",
    title: "New York Chapter",
    lines: ["Jericho, NY 11753"],
  },
  {
    id: "bay-area",
    title: "Bay Area Chapter",
    lines: ["Los Altos, CA 94022"],
  },
  {
    id: "toronto",
    title: "Toronto Chapter",
    lines: ["Toronto, Canada"],
  },
  {
    id: "mission-viejo",
    title: "Mission Viejo Chapter",
    lines: ["Mission Viejo, CA 92691"],
  },
  {
    id: "designer",
    title: "Website Designer: Ayush Patel",
    lines: ["Irvine, California"],
    span: "lg:col-span-2",
  },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
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

const iconClass = "h-5 w-5 shrink-0 text-blue-500 transition-colors group-hover:text-white";

const CONTACT_IDS = CARDS.map((card) => card.id);

const linkClass =
  "flex w-fit items-center gap-3 break-all underline-offset-4 transition-colors hover:underline";

export default function ContactView() {
  return (
    <section className="relative z-10 min-h-screen w-full bg-black">
      <div className="px-6 pb-16 pt-32 sm:px-10 sm:pb-20 sm:pt-40 lg:px-14 lg:pb-24 lg:pt-44">
        <p className="text-xl font-light text-white/60 sm:text-2xl">
          Get in touch
        </p>
        <h1 className="mt-4 text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-white">
          We&apos;re here to <span className="text-blue-500">help</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light leading-[1.6] text-white/60 sm:text-xl">
          For any questions or inquiries, feel free to reach out to us at:
        </p>
        <div aria-hidden className="mt-16 h-px w-full bg-white/30 sm:mt-20" />

        <RevealProvider keys={CONTACT_IDS}>
        <RevealControl tone="dark" announce className="mt-12 max-w-sm" />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className={`group flex min-h-[15rem] flex-col justify-between gap-10 border border-white/15 bg-neutral-950 p-6 transition-colors duration-300 hover:border-blue-500 hover:bg-blue-500 sm:p-8 ${card.span ?? ""}`}
            >
              <div>
                <h2 className="text-2xl font-regular tracking-tight text-white sm:text-3xl">
                  {card.title}
                </h2>
                {card.lines?.map((line) => (
                  <p
                    key={line}
                    className="mt-3 flex items-center gap-3 text-base font-light text-white/60 transition-colors group-hover:text-white/85"
                  >
                    <MapPin className={iconClass} aria-hidden />
                    {line}
                  </p>
                ))}
              </div>
              <div className="flex flex-col gap-2 text-base font-light text-white/85 sm:text-lg">
                <RevealedContact
                  id={card.id}
                  show={card.id === "main" ? "email" : "both"}
                  variant="card"
                  linkClassName={linkClass}
                  iconClassName={iconClass}
                  hiddenLabel="Contact details hidden until you verify."
                />
                {card.instagram && (
                  <a
                    href={`https://www.instagram.com/${card.instagram.slice(1)}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    <span className={iconClass}>
                      <InstagramIcon />
                    </span>
                    {card.instagram}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        </RevealProvider>
      </div>
    </section>
  );
}
