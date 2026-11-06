import { notFound } from "next/navigation";
import { assets, findAsset } from "@/features/portfolio/model";
import { AssetDetailScreen } from "@/features/portfolio/asset-screens";
export const dynamicParams = false;
export function generateStaticParams() { return assets.map(asset => ({ asset: asset.id })); }
export default async function Page({ params }: { params: Promise<{ asset: string }> }) {
  const { asset: id } = await params;
  const asset = findAsset(id);
  if (!asset) notFound();
  return <AssetDetailScreen id={asset.id} />;
}
