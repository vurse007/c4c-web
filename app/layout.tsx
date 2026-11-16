import type { Metadata } from "next";
import { Stack_Sans_Headline } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { cn } from "@/lib/utils";

const stackSansHeadline = Stack_Sans_Headline({
  subsets: ["latin"],
  weight: ["200", "400"],
  variable: "--font-sans",
});

const SITE_URL = "https://caring4caregivers.org";
const SITE_TITLE = "Caring for Caregivers";
const SITE_DESCRIPTION = "Supporting the people who care for everyone else.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "./" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_TITLE,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE_TITLE,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  nonprofitStatus: "501c3",
  sameAs: ["https://www.instagram.com/caring.forcaregivers/"],
};


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", stackSansHeadline.variable)}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
