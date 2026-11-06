import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ForecastProvider } from "@/features/forecast/store";
import { ForecastShell } from "@/features/forecast/shell";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Forecast — an open question", template: "%s · Forecast" }, description: "An independent local prediction community. Practice forecasting with simulated markets, demo funds and thoughtful conversations." };
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="en" suppressHydrationWarning><body><ForecastProvider><ForecastShell>{children}</ForecastShell></ForecastProvider></body></html>; }
