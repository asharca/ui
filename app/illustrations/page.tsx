import type { Metadata } from "next";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { IllustrationsGrid } from "@/components/app/illustrations/illustrations-grid";
import {
  ILLUSTRATION_COLLECTIONS,
  ILLUSTRATION_VARIANT_COUNT,
} from "@/lib/catalog-taxonomy";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Animated Illustrations",
  description:
    "Animated React product illustrations for feature cards, security sections, metrics, and empty states.",
  alternates: { canonical: "/illustrations" },
};

export default function IllustrationsPage() {
  return (
    <>
      <IllustrationsGrid
        collections={ILLUSTRATION_COLLECTIONS}
        totalVariants={ILLUSTRATION_VARIANT_COUNT}
      />
      <SiteFooter />
    </>
  );
}
