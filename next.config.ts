import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// Every image dropped into public/spiral-gallery feeds the Impact page's
// spiral animation — no code edit needed, just restart the dev server / rebuild.
const spiralPhotos = fs
  .readdirSync(path.join(process.cwd(), "public/spiral-gallery"))
  .filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file))
  .sort()
  .map((file) => `/spiral-gallery/${file}`);

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SPIRAL_PHOTOS: JSON.stringify(spiralPhotos),
  },
  images: {
    // AVIF is ~20-50% smaller than WebP at the same visual quality; browsers
    // without AVIF support fall back to WebP. Each is encoded once and cached.
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
  },
};

export default nextConfig;
