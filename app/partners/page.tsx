import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import GetInvolved from "@/components/GetInvolved";
import PartnersLogos from "@/components/PartnersLogos";
import PartnersView from "@/components/PartnersView";
import StackGallery from "@/components/StackGallery";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Partners | Caring for Caregivers",
  description:
    "Caring for Caregivers partners with organizations around the world to expand our reach through community events, giving back, research, and fundraisers.",
};

function galleryPhotos() {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public/partnergallery"))
      .filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file))
      .sort()
      .map((file) => `/partnergallery/${file}`);
  } catch {
    return [];
  }
}

export default function PartnersPage() {
  const photos = galleryPhotos();
  return (
    <>
      <main className="relative w-full bg-black">
        <SiteHeader />
        <PartnersView />
        <PartnersLogos
          folder="partners_loop"
          heading={
            <>
              Stronger <span className="text-blue-500">together</span>
            </>
          }
          blurb="We work alongside organizations and institutions that share our mission, joining forces on research, outreach, partnerships, and local expansion. Each collaboration extends our reach and opens the door to new initiatives that serve more people, with greater impact. We believe in making a bigger difference together, through shared empowerment."
        />
        {photos.length > 0 && <StackGallery photos={photos} />}
        <PartnersLogos
          folder="support_loop"
          heading={
            <>
              Powered by <span className="text-blue-500">generosity</span>
            </>
          }
          blurb="Our work is made possible by the donors, foundations, and community supporters who believe in caring for those who care for others. Their generosity funds our chapters, our events, and every thank-you we deliver to healthcare workers. To everyone who has given their time, resources, or voice: thank you for standing with us."
        />
        <GetInvolved />
      </main>
      <SiteFooter />
    </>
  );
}
