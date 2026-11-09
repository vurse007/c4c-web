import PartnersLoop from "@/components/PartnersLoop";
import fs from "node:fs";
import path from "node:path";

function listLogos(folder: string) {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", folder))
      .filter((file) => /\.(jpe?g|png|webp|avif|svg)$/i.test(file))
      .sort()
      .map((file) => `/${folder}/${file}`);
  } catch {
    return [];
  }
}

export default function PartnersLogos({
  folder,
  heading,
  blurb,
}: {
  folder: string;
  heading: React.ReactNode;
  blurb: string;
}) {
  const LOGOS = listLogos(folder);
  // Repeat enough that one half of the track always overflows the viewport.
  const set = LOGOS.length
    ? Array.from({ length: Math.max(1, Math.ceil(8 / LOGOS.length)) }, () => LOGOS).flat()
    : [];

  return (
    <section className="relative z-10 flex min-h-screen w-full flex-col bg-white">
      <div className="flex flex-1 flex-col justify-center px-6 py-32 sm:px-10 sm:py-40 lg:px-14 lg:py-48">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-16 lg:gap-24">
          <h2 className="text-[clamp(4rem,7vw,6rem)] font-regular leading-[1.08] tracking-tight text-black md:col-span-5">
            {heading}
          </h2>
          <p className="max-w-4xl text-lg font-light leading-[1.6] text-black/60 sm:text-xl md:col-span-7 lg:text-2xl">
            {blurb}
          </p>
        </div>

        {set.length > 0 && <PartnersLoop logos={set} />}
      </div>
    </section>
  );
}
