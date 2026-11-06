import { notFound } from "next/navigation";
import { SettingsScreen } from "@/features/portfolio/settings";
export const dynamicParams = false;
export function generateStaticParams() { return ["appearance", "notifications", "data"].map(section => ({ section })); }
export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!["appearance", "notifications", "data"].includes(section)) notFound();
  return <SettingsScreen />;
}
