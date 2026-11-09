import Image from "next/image";
import Link from "next/link";
import { CHAPTERS } from "@/lib/chapters";

export default function ChapterBoards() {
  return (
    <section id="chapters" className="relative z-10 w-full bg-white">
      <div className="px-6 py-16 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
        <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-black">
          Chapters
        </h2>
        <div
          aria-hidden
          className="mt-16 h-px w-full bg-black/15 sm:mt-20 lg:mt-24"
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/chapters/${chapter.slug}`}
              className="group relative block aspect-[16/9] overflow-hidden bg-black/80"
            >
              <Image
                src={chapter.image}
                alt={chapter.imageAlt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-black/25 transition-colors duration-300 ease-out group-hover:bg-black/55"
              />
              <h3 className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-regular tracking-tight text-white sm:left-6 sm:text-4xl">
                {chapter.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
