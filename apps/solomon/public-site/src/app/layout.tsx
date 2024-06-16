import { DevMessage } from "@/components/dev-message";
import { Footer } from "@/components/footer";
import { FooterCTA } from "@/components/footer-cta";
import { Header } from "@/components/header";
import "@/styles/globals.css";
import { Provider as Analytics } from "@midday/events/client";
import { cn } from "@midday/ui/cn";
import "@midday/ui/globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import { baseUrl } from "./sitemap";

const PublicBetaBanner = dynamic(
  () =>
    import("@/components/public-beta-banner").then(
      (mod) => mod.PublicBetaBanner
    ),
  {
    ssr: false,
    loading: () => null,
  }
);

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Solomon AI | Proactive Stress Testing For Your Practice",
    template: "%s | Solomon AI",
  },
  description:
    "Solomon AI equips your practice with advanced tools designed to conduct thorough financial stress tests.",
  openGraph: {
    title: "Solomon AI | Proactive Stress Testing For Your Practice",
    description: "This is my portfolio.",
    url: baseUrl,
    siteName:
      "Solomon AI equips your practice with advanced tools designed to conduct thorough financial stress tests.",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)" }],
};

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} ${GeistMono.variable}`,
          "bg-[#0C0C0C] overflow-x-hidden dark antialiased"
        )}
      >
        <Header />
        <main className="container mx-auto px-4 overflow-hidden md:overflow-visible">
          {children}
        </main>
        <FooterCTA />
        <Footer />
        <Analytics />
        <DevMessage />
        <PublicBetaBanner />
      </body>
    </html>
  );
}
