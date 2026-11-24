import type { Metadata } from "next";
import { JsonLd } from "@/components/app/analytics/json-ld";
import { MobileLanding } from "@/components/app/mobile/mobile-landing";
import {
  MOBILE_SCREEN_GROUPS,
  MOBILE_SCREEN_VARIANT_COUNT,
} from "@/lib/mobile-screens";
import summary from "@/lib/native/summary.json";
import { breadcrumbJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mobile Screens for React Native & Expo",
  description:
    "Animated React Native app screens, blocks, and touch primitives for Expo with light and dark modes built in.",
  alternates: { canonical: "/mobile" },
  openGraph: {
    title: "Mobile Screens for React Native & Expo · beUI",
    description:
      "Animated React Native app screens, blocks, and touch primitives for Expo with light and dark modes built in.",
    url: "/mobile",
    siteName: "beUI",
  },
};

export default function MobileShowcasePage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/mobile#collection`,
    name: "Mobile Screens for React Native & Expo",
    description: `${MOBILE_SCREEN_VARIANT_COUNT} animated mobile screens across ${MOBILE_SCREEN_GROUPS.length} feature groups plus ${summary.variants} touch primitives.`,
    url: `${SITE_URL}/mobile`,
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "beUI", path: "/" },
            { name: "Mobile", path: "/mobile" },
          ]),
          collectionJsonLd,
        ]}
      />
      <MobileLanding primitivesCount={summary.components} />
    </>
  );
}
