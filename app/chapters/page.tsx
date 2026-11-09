import type { Metadata } from "next";
import ChapterBoards from "@/components/ChapterBoards";
import GetInvolved from "@/components/GetInvolved";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Chapters | Caring for Caregivers",
  description:
    "Explore Caring for Caregivers chapters around the world.",
};

export default function ChaptersPage() {
  return (
    <>
      <main className="relative w-full bg-black">
        <SiteHeader />
        <div className="h-20 bg-black sm:h-24" />
        <ChapterBoards />
        <GetInvolved />
      </main>
      <SiteFooter />
    </>
  );
}
