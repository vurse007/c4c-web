import { Mail, MapPin, Phone } from "lucide-react";

type Card = {
  title: string;
  lines?: string[];
  phone?: string;
  email?: string;
  instagram?: string;
  span?: string;
};

const CARDS: Card[] = [
  {
    title: "Main",
    email: "wearecaringforcaregivers@gmail.com",
    instagram: "@caring.forcaregivers",
    span: "lg:col-span-2",
  },
  {
    title: "Irvine Chapter",
    lines: ["Irvine, CA 92602"],
    phone: "(631) 417-5779",
    email: "joshualin0511@gmail.com",
  },
  {
    title: "New York Chapter",
    lines: ["Jericho, NY 11753"],
    phone: "(949) 664-1230",
    email: "reneeboalee@gmail.com",
  },
  {
    title: "Bay Area Chapter",
    lines: ["Los Altos, CA 94022"],
    phone: "(949) 512-0645",
    email: "cw.301135@gmail.com",
  },
  {
    title: "Toronto Chapter",
    lines: ["Toronto, Canada"],
    phone: "(949) 469-8195",
    email: "ayushppatel@outlook.com",
  },
  {
    title: "Mission Viejo Chapter",
    lines: ["Mission Viejo, CA 92691"],
    phone: "(949) 302-6351",
    email: "georgeypan1@gmail.com",
  },
  {
    title: "Website Designer: Ayush Patel",
    lines: ["Irvine, California"],
    phone: "(949) 469-8195",
    email: "ayushppatel@outlook.com",
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

const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, "")}`;

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

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                {card.phone && (
                  <a href={telHref(card.phone)} className={linkClass}>
                    <Phone className={iconClass} aria-hidden />
                    {card.phone}
                  </a>
                )}
                {card.email && (
                  <a href={`mailto:${card.email}`} className={linkClass}>
                    <Mail className={iconClass} aria-hidden />
                    {card.email}
                  </a>
                )}
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
      </div>
    </section>
  );
}
