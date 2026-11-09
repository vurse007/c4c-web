const TESTIMONIALS = [
  {
    name: "Christine Kornu",
    credential: "MD",
    quote:
      "It's nice to be appreciated. To feel recognized by high school students is very neat! It is super thoughtful of your team to come in and give back to us in return. Thank you so much!",
  },
  {
    name: "Elaine Tu",
    credential: "OD",
    quote:
      "You guys totally just brightened our day. Sometimes when we get lots of patients, it can become very stressful and lead to burnout. Small acts of gratitude such as this help us to remember the purpose of being here! What you do truly does help, and we are super grateful.",
  },
  {
    name: "Susie Yim Yeh",
    credential: "MD",
    quote:
      "It was so great meeting the C4C team today! All of our respiratory therapists truly enjoyed the baskets. We greatly appreciate everything you do for the medical community!",
  },
];

export default function Testimonials() {
  return (
    <section className="relative z-10 w-full bg-white">
      <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-black">
          In Their <span className="text-blue-500">Words</span>
        </h2>
        <div
          aria-hidden
          className="mt-16 h-px w-full bg-black/15 sm:mt-20 lg:mt-24"
        />
        <div className="grid grid-cols-1 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className={`flex flex-col justify-between gap-12 py-12 md:px-8 lg:px-10 lg:py-14 ${
                i > 0
                  ? "border-t border-black/15 md:border-t-0 md:border-l"
                  : "md:pl-0 lg:pl-0"
              } ${i === TESTIMONIALS.length - 1 ? "md:pr-0 lg:pr-0" : ""}`}
            >
              <blockquote>
                <span
                  aria-hidden
                  className="block h-[0.45em] text-[5rem] font-regular leading-[0.8] text-blue-500"
                >
                  &ldquo;
                </span>
                <p className="mt-4 text-lg font-light leading-[1.6] text-black sm:text-xl lg:text-2xl lg:leading-[1.5]">
                  {t.quote}
                </p>
              </blockquote>
              <figcaption>
                <p className="text-base font-regular text-black sm:text-lg">
                  {t.name}
                </p>
                <p className="text-sm font-light text-black/50 sm:text-base">
                  {t.credential}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
