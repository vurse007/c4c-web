import ContactForm from "@/components/ContactForm";

export default function GetInvolved({
  dark = false,
}: {
  dark?: boolean;
}) {
  return (
    <section
      id="get-involved"
      className={`relative z-10 min-h-screen w-full scroll-mt-24 ${
        dark ? "border-t border-white/30 bg-black" : "bg-blue-500"
      }`}
    >
      <div className="grid min-h-screen grid-cols-1 items-center gap-12 px-6 py-24 sm:px-10 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-14 lg:py-32">
        <div className="lg:col-span-5">
          <h2 className="text-[clamp(5rem,7vw,6rem)] font-regular leading-[1.05] tracking-tight text-white">
            Get {dark ? <span className="text-blue-500">Involved</span> : "Involved"}
          </h2>
          <p className="mt-8 max-w-xl text-base font-light leading-[1.7] text-white/75 sm:text-lg lg:text-xl">
            Start a chapter, volunteer, partner with us, or just say hello —
            we&apos;d love to hear from you.
          </p>
        </div>
        <div className="lg:col-span-7">
          <ContactForm dark={dark} />
        </div>
      </div>
    </section>
  );
}
