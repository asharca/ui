import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PortfolioProvider } from "@/features/portfolio/provider";
import { Workspace } from "@/features/portfolio/workspace";
import "./globals.css";
export const metadata: Metadata = { title: "Orbit — Asset workspace", description: "An independent, local-first crypto portfolio demo. No live prices or on-chain execution." };
export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body><PortfolioProvider><Workspace>{children}</Workspace></PortfolioProvider></body></html>;
}
