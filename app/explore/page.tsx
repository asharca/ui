import type { Metadata } from "next";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { ExploreBrowser } from "@/components/app/explore/explore-browser";
import { getExploreItems } from "@/lib/catalog-taxonomy";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Live previews of every animated React block, page, and template grouped by product domain.",
  alternates: { canonical: "/explore" },
};

export default function ExplorePage() {
  const items = getExploreItems();

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-sm text-muted-foreground">Explore</p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-foreground">
            Explore blocks by what you&apos;re building
          </h1>
          <p className="mt-2 text-muted-foreground">
            Live previews of every block, page, and template, grouped by
            product. Pick a domain to see what fits.
          </p>
        </header>

        <ExploreBrowser items={items} />
      </div>
      <SiteFooter />
    </>
  );
}
