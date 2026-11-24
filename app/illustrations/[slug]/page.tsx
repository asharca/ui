import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { IllustrationDetail } from "@/components/app/illustrations/illustration-detail";
import {
  findIllustrationCollection,
  ILLUSTRATION_COLLECTIONS,
} from "@/lib/catalog-taxonomy";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ILLUSTRATION_COLLECTIONS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = findIllustrationCollection(slug);
  if (!collection) return {};

  return {
    title: collection.name,
    description: collection.description,
    alternates: { canonical: `/illustrations/${collection.slug}` },
  };
}

export default async function IllustrationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = findIllustrationCollection(slug);
  if (!collection) notFound();

  return (
    <>
      <IllustrationDetail collection={collection} />
      <SiteFooter />
    </>
  );
}
