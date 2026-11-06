"use client";

import { ConversionFunnel } from "@/components/motion/conversion-funnel";

export function ConversionFunnelPreview() {
  return <ConversionFunnel periods={[
    { id: "7 days", stages: [
      { id: "visits", label: "Visitors", count: 12840, detail: "Unique people who visited your website." },
      { id: "signup", label: "Sign-ups", count: 6420, detail: "Visitors who created a workspace." },
      { id: "active", label: "Activated", count: 3852, detail: "Workspaces that completed their first project." },
      { id: "paid", label: "Customers", count: 1541, detail: "Activated workspaces that chose a paid plan." },
    ] },
    { id: "30 days", stages: [
      { id: "visits", label: "Visitors", count: 52680, detail: "Unique people who visited your website." },
      { id: "signup", label: "Sign-ups", count: 23706, detail: "Visitors who created a workspace." },
      { id: "active", label: "Activated", count: 14224, detail: "Workspaces that completed their first project." },
      { id: "paid", label: "Customers", count: 5932, detail: "Activated workspaces that chose a paid plan." },
    ] },
  ]} />;
}
