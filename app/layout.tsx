import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TerrainShell from "./components/terrain-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://mferns.com";
const SITE_TITLE = "Michael Fernandes — UX Engineer & Data Visualization";
const SITE_DESCRIPTION =
  "Portfolio of Michael Fernandes, a Seattle-based UX engineer and data visualization designer. Case studies include the IHME COVID-19 forecast dashboard and a CHI-published uncertainty display for transit.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Michael Fernandes",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Michael Fernandes",
    "UX engineer",
    "data visualization",
    "dataviz portfolio",
    "uncertainty visualization",
    "design systems",
    "front-end developer Seattle",
  ],
  authors: [{ name: "Michael Fernandes", url: SITE_URL }],
  creator: "Michael Fernandes",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Michael Fernandes",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.ico",
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
        <div className="relative min-h-screen bg-[#1f1a16] text-[#ebe2d4] font-sans overflow-x-hidden">
          <TerrainShell>{children}</TerrainShell>
        </div>
      </body>
    </html>
  );
}
