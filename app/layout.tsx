import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import TerrainShell from "./components/terrain-shell";
import GaOptOut from "./components/ga-optout";
import JsonLd from "./components/json-ld";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  personJsonLd,
  webSiteJsonLd,
} from "./lib/seo";

const GA_MEASUREMENT_ID = "G-PTLDE59E1B";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Michael Fernandes",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Michael Fernandes",
    "data visualization developer",
    "data viz developer",
    "data visualization design engineer",
    "data viz design engineer",
    "design engineer",
    "UX engineer",
    "D3.js developer",
    "dataviz portfolio",
    "uncertainty visualization",
    "data visualization developer Seattle",
  ],
  authors: [{ name: "Michael Fernandes", url: SITE_URL }],
  creator: "Michael Fernandes",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={[personJsonLd(), webSiteJsonLd()]} />
        <div className="relative min-h-screen bg-[#241d18] text-[#f4ece0] font-sans overflow-x-hidden">
          <TerrainShell>{children}</TerrainShell>
        </div>
      </body>
      {process.env.NODE_ENV === "production" && (
        <>
          <GaOptOut gaId={GA_MEASUREMENT_ID} />
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
        </>
      )}
    </html>
  );
}
