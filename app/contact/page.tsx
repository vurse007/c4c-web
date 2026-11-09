import type { Metadata } from "next";
import ContactView from "@/components/ContactView";
import GetInvolved from "@/components/GetInvolved";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact | Caring for Caregivers",
  description:
    "Reach Caring for Caregivers and our chapters in Irvine, New York, the Bay Area, Toronto, and Mission Viejo.",
};

export default function ContactPage() {
  return (
    <>
      <main className="relative w-full bg-black">
        <SiteHeader />
        <ContactView />
        <GetInvolved dark />
      </main>
      <SiteFooter />
    </>
  );
}
