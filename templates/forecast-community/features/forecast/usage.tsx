"use client";
import { ForecastProvider } from "@/features/forecast/store";
import { ForecastShell } from "@/features/forecast/shell";
import { DiscoverPage } from "@/features/forecast/discover";
/** Copy into a Next page only when not already inside app/layout.tsx's provider/shell. */
export default function ForecastCommunityUsage() { return <ForecastProvider><ForecastShell><DiscoverPage/></ForecastShell></ForecastProvider>; }
