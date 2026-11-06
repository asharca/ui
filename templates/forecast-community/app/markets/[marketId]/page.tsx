import { notFound } from "next/navigation";
import { MarketPage } from "@/features/forecast/market";
import { markets } from "@/features/forecast/data";
export const dynamicParams = false;
export function generateStaticParams() { return markets.map(market => ({ marketId: market.id })); }
export async function generateMetadata({ params }: { params: Promise<{ marketId: string }> }) { const { marketId } = await params; return { title: markets.find(market => market.id === marketId)?.title ?? "Market not found" }; }
export default async function Page({ params }: { params: Promise<{ marketId: string }> }) { const { marketId } = await params; if (!markets.some(market => market.id === marketId)) notFound(); return <MarketPage key={marketId} marketId={marketId}/>; }
