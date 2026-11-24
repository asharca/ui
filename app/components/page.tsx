import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/app/catalog/catalog-browser";
import { CopyPage } from "@/components/app/docs/copy-page";
import { PlatformSwitch } from "@/components/app/docs/native/platform-switch";
import { WEB_CATALOG_ITEMS } from "@/lib/catalog-taxonomy";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Animated blocks, page sections, AI agent interfaces, charts, and landing page templates for production React and Next.js interfaces.",
  alternates: { canonical: "/components" },
};

export default function ComponentsIndexPage() {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <span className="font-medium text-foreground">Components</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground">
            Components
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Animated blocks, page sections, components, and full landing page
            templates for production React interfaces.
          </p>
        </div>
        <CopyPage
          pageUrl={`${SITE_URL}/components`}
          markdownPath="/llms.txt"
          componentName="Components Catalog"
        />
      </div>

      <div className="mt-6">
        <PlatformSwitch />
      </div>

      <CatalogBrowser items={WEB_CATALOG_ITEMS} />
    </div>
  );
}
