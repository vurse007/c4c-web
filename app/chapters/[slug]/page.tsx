import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GetInvolved from "@/components/GetInvolved";
import { PeopleList } from "@/components/PeopleList";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { CHAPTERS, getChapter, getChapterBoard } from "@/lib/chapters";

export async function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: "Chapter" };
  return {
    title: `${chapter.name} | Caring for Caregivers`,
    description: `Meet the Caring for Caregivers chapter in ${chapter.name}.`,
  };
}

export default async function ChapterBoardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();
  const board = getChapterBoard(chapter);

  return (
    <>
      <main className="relative w-full bg-black">
        <SiteHeader />
        <section className="relative min-h-[52vh] w-full overflow-hidden bg-black">
          <Image
            src={chapter.image}
            alt={chapter.imageAlt}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-black/40" />
          <div className="relative flex min-h-[52vh] flex-col justify-end px-6 pb-12 pt-32 sm:px-10 sm:pb-16 sm:pt-36 lg:px-14 lg:pb-20">
            <Link
              href="/chapters"
              className="w-fit text-sm font-light text-white/70 transition-colors hover:text-white"
            >
              Chapters
            </Link>
            <h1 className="mt-4 text-[clamp(3rem,5vw,4.5rem)] font-regular leading-[1.08] tracking-tight text-white">
              {chapter.name}
            </h1>
          </div>
        </section>
        <section className="relative z-10 w-full bg-white">
          <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            {board.length > 0 ? (
              <PeopleList people={board} />
            ) : (
              <p className="text-lg font-light text-black/50 sm:text-xl">
                This chapter board will be listed here soon.
              </p>
            )}
          </div>
        </section>
        <GetInvolved />
      </main>
      <SiteFooter />
    </>
  );
}
