import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import DonateView from "@/components/DonateView";
import GetInvolved from "@/components/GetInvolved";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Donate | Caring for Caregivers",
  description:
    "Give back to those who care. Your donation helps Caring for Caregivers deliver care packages to healthcare providers, host community events, and raise awareness.",
};

// The slideshow beside the form cycles through the site's event photos (not
// logos, headshots, or the chapter location shots in public/chapters).
// stack_gallery is the same set as partnergallery/spiral-gallery.
const PHOTO_FOLDERS = ["stack_gallery"];
const HERO_PHOTOS = ["/about-hero.JPG", "/impact.jpeg", "/partner-hero.jpeg"];
const FIRST_PHOTO = "/stack_gallery/IMG_4191.JPG";

function slideshowPhotos() {
  const fromFolders = PHOTO_FOLDERS.flatMap((folder) => {
    try {
      return fs
        .readdirSync(path.join(process.cwd(), "public", folder))
        .filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file))
        .sort()
        .map((file) => `/${folder}/${file}`);
    } catch {
      return [];
    }
  });
  const all = [...new Set([FIRST_PHOTO, ...fromFolders, ...HERO_PHOTOS])];
  return all.filter((src) =>
    fs.existsSync(path.join(process.cwd(), "public", src)),
  );
}

export default function DonatePage() {
  return (
    <>
      <main className="relative w-full bg-white">
        <SiteHeader light />
        <DonateView photos={slideshowPhotos()} />
        <GetInvolved />
      </main>
      <SiteFooter />
    </>
  );
}
