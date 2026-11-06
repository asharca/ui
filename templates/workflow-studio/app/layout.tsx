import type { Metadata } from "next";
import { StudioProvider } from "@/features/store";
import { StudioShell } from "@/features/shell";
import "@xyflow/react/dist/style.css";
import "./globals.css";
export const metadata: Metadata = { title: "Workflow Studio", description: "A browser-local automation workshop" };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en" suppressHydrationWarning><body><StudioProvider><StudioShell>{children}</StudioShell></StudioProvider></body></html>; }
