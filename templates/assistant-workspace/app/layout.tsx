import type { Metadata } from "next";
import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/features/workspace/store";
import { AppShell } from "@/features/workspace/shell";
import "./globals.css";
export const metadata: Metadata = { title: "Fieldwork · AI Workspace", description: "A browser-local conversational workspace with projects and knowledge." };
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="en" suppressHydrationWarning><body><WorkspaceProvider><AppShell>{children}</AppShell></WorkspaceProvider></body></html>; }
