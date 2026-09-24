import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/app/chrome/theme-provider";
import { PreferencesProvider } from "@/components/app/preferences/preferences-provider";
import { JsonLd } from "@/components/app/analytics/json-ld";
import {
  AUTHOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  siteJsonLd,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { WorkspaceAwareFrame } from "@/components/app/chrome/workspace-aware-frame";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_TITLE} · beUI`,
    template: "%s · beUI",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: AUTHOR, url: "https://github.com/starc007" }],
  creator: AUTHOR,
  publisher: SITE_NAME,
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    types: {
      "application/json": "/registry.json",
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    title: `${SITE_TITLE} · beUI`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: `${SITE_TITLE} · beUI`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TITLE} · beUI`,
    description: SITE_DESCRIPTION,
    images: ["/api/og"],
  },
  keywords: [
    "React motion components",
    "best motion components",
    "free motion components",
    "open source motion components",
    "open source React components",
    "free React components",
    "Tailwind CSS components",
    "Next.js components",
    "shadcn registry",
    "shadcn-compatible components",
    "framer motion components",
    "best framer motion components",
    "framer motion templates",
    "framer motion components and templates",
    "animated UI components",
    "component library",
    "copy paste components",
    "free",
    "open source",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfcfc" },
    { media: "(prefers-color-scheme: dark)", color: "#151515" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(GeistSans.variable, GeistMono.variable)}
    >
      <head>
        <link rel="icon" type="image/png" href="/beui-mark.png" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
        <link rel="alternate" type="application/json" title="Component registry" href="/r" />
        <link rel="alternate" type="application/json" title="shadcn registry" href="/registry.json" />
      </head>
      <body className="min-h-screen antialiased">
        <JsonLd data={siteJsonLd()} />
        <ThemeProvider>
          <PreferencesProvider>
            <WorkspaceAwareFrame>{children}</WorkspaceAwareFrame>
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
