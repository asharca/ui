import { ArrowRight, ChevronRight, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { CopyPage } from "@/components/app/docs/copy-page";
import { KeepInMind } from "@/components/app/docs/keep-in-mind";
import { MobileCatalogBrowser } from "@/components/app/mobile/mobile-catalog-browser";
import { NATIVE_PATH } from "@/lib/component-paths";
import {
  MOBILE_SCREEN_GROUPS,
  MOBILE_SCREEN_VARIANT_COUNT,
  MOBILE_SCREENS_PATH,
} from "@/lib/mobile-screens";
import summary from "@/lib/native/summary.json";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mobile Screens for React Native",
  description:
    "Browse 35 mobile screen groups and 66 interactive React Native variants for Expo, covering finance, AI agents, auth, settings, social, and commerce.",
  alternates: { canonical: MOBILE_SCREENS_PATH },
};

export default function MobileScreensIndexPage() {
  return (
    <div className="min-w-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "beUI", path: "/" },
            { name: "Components", path: "/components" },
            { name: "Mobile", path: MOBILE_SCREENS_PATH },
          ]),
        ]}
      />

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <Link
          href="/components"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Components
        </Link>
        <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-medium text-foreground">Mobile</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Mobile screens for React Native
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {MOBILE_SCREEN_GROUPS.length} screen families and{" "}
            {MOBILE_SCREEN_VARIANT_COUNT} interactive Expo views with Reanimated
            motion, haptic patterns, and light/dark tokens built in.
          </p>
        </div>
        <CopyPage
          pageUrl={`${SITE_URL}${MOBILE_SCREENS_PATH}`}
          markdownPath="/llms.txt"
          componentName="Mobile Screens"
        />
      </div>

      <Link
        href={NATIVE_PATH}
        className="group mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Smartphone aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1">
          <span className="font-medium text-foreground">
            Also explore {summary.components} foundational touch primitives.
          </span>{" "}
          <span className="text-muted-foreground">
            Buttons, selects, OTP inputs, and sheets with iOS Simulator clips.
          </span>
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </Link>

      <MobileCatalogBrowser />

      <KeepInMind />
    </div>
  );
}
