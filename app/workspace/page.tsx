import type { Metadata } from "next";
import { WorkspaceDemo } from "@/components/previews/blocks/workspace-shell.preview";
export const metadata: Metadata = { title: "Asharca Workspace", robots: { index: false, follow: false } };
export default async function WorkspacePage({ searchParams }: { searchParams: Promise<{ window?: string }> }) {
  const { window: detachedKey } = await searchParams;
  return <WorkspaceDemo fullPage detachedKey={detachedKey} />;
}
