// import { SystemBanner } from "@/components/system-banner";
import "@/styles/globals.css";
import { cn } from "@midday/ui/cn";
import "@midday/ui/globals.css";
import { Provider as Analytics } from "@midday/events/client";
import { Toaster } from "@midday/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import IntercomClientComponent from "@/components/intercom-client-component";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.solomon-ai.app"),
  title: "Solomon AI | Stress Testing",
  description:
    "Proactive stress testing for your medical practice.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)" },
    { media: "(prefers-color-scheme: dark)" },
  ],
};

export const preferredRegion = ["fra1", "sfo1", "iad1"];

export default function Layout({
  children,
  params,
}: {
  children: ReactElement;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body
        className={cn(
          `${GeistSans.variable} ${GeistMono.variable}`,
          "whitespace-pre-line overscroll-none"
        )}
      >
        {/* <SystemBanner /> */}
        {children}
        <Script
          strategy="afterInteractive"
          id="intercom-settings"
          dangerouslySetInnerHTML={{
            __html: `
                        window.intercomSettings = {
                            api_base: "https://api-iam.intercom.io",
                            app_id: "pezs7zbq",
                        };
                    `
          }}
        />
        <IntercomClientComponent />
        <SpeedInsights />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
