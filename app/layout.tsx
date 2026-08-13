import Script from "next/script";
import type { Metadata } from "next";
import Script from "next/script";
import {
  fraunces,
  handlee,
  lora,
  merriweather,
  sourceSans,
} from "@/app/fonts";
import { CustomCursor } from "@/components/custom-cursor";
import { SoundProvider } from "@/components/sound-context";
import { SITE } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  icons: {
    icon: "/images/cursor-light.png",
    apple: "/images/cursor-light.png",
  },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} ${lora.variable} ${handlee.variable} ${merriweather.variable} h-full antialiased`}
    >
      <head>
        {/* Google tag (gtag.js) — G-03PTJD6QGR */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-03PTJD6QGR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-03PTJD6QGR');
          `}
        </Script>
      </head>
      <body className="min-h-full overflow-x-hidden bg-paper font-sans text-ink">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-03PTJD6QGR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-03PTJD6QGR');
          `}
        </Script>
        <SoundProvider>
          <div className="grain" aria-hidden />
          <CustomCursor />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}
