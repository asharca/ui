"use client";
import { ForecastProvider } from "./store";
import { ForecastShell } from "./shell";
import { DiscoverPage } from "./discover";
/** Interactive full-app composition. Requires a Next router, like the real app. */
export function ForecastCommunityPreview() { return <ForecastProvider><ForecastShell><DiscoverPage/></ForecastShell></ForecastProvider>; }
