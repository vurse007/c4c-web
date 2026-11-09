import type { Metadata } from "next";
import AboutView from "@/components/AboutView";
import GetInvolved from "@/components/GetInvolved";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "About Us | Caring for Caregivers",
  description:
    "Caring for Caregivers is a student-led 501(c)(3) nonprofit supporting healthcare workers and raising awareness about burnout through community events, education, research, and wellness initiatives.",
};

export default function AboutPage() {
  return (
    <>
      <main className="relative w-full bg-black">
        <SiteHeader />
        <AboutView />
        <GetInvolved />
      </main>
      <SiteFooter />
    </>
  );
}
