import type { MetadataRoute } from "next";
import { CHAPTERS } from "@/lib/chapters";

const SITE_URL = "https://caring4caregivers.org";

// Static routes found in app/: /, /about, /chapters, /contact, /donate, /impact, /partners
const STATIC_ROUTES = ["", "/about", "/chapters", "/impact", "/partners", "/donate", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...STATIC_ROUTES,
    ...CHAPTERS.map((c) => `/chapters/${c.slug}`),
  ].map((path) => ({ url: `${SITE_URL}${path}`, lastModified }));
}
