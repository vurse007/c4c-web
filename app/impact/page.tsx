import type { Metadata } from "next";
import ImpactView from "@/components/ImpactView";
import GetInvolved from "@/components/GetInvolved";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Impact | Caring for Caregivers",
  description:
    "Healthcare burnout remains elevated across the United States. Caring for Caregivers works to support providers through community events, education, research, and wellness initiatives.",
};

export default function ImpactPage() {
  return (
    <>
      <main className="relative w-full bg-black">
        <SiteHeader />
        <ImpactView />
        <GetInvolved />
      </main>
      <SiteFooter />
    </>
  );
}
