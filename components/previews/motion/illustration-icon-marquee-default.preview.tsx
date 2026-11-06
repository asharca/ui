"use client";

import { Bell, Boxes, CalendarDays, ChartNoAxesCombined, Cloud, Database, FileText, Globe, MessageSquareText, Search, Settings2, ShieldCheck, Sparkles, Users, WalletCards, Zap } from "lucide-react";
import type { ComponentProps } from "react";
import { IconMarqueeIllustration } from "@/components/motion/illustration-icon-marquee";

const rows: ComponentProps<typeof IconMarqueeIllustration>["rows"] = [
  [{ id: "search", label: "Search", icon: <Search /> }, { id: "files", label: "Documents", icon: <FileText /> }, { id: "messages", label: "Conversations", icon: <MessageSquareText /> }, { id: "modules", label: "Modules", icon: <Boxes /> }, { id: "data", label: "Database", icon: <Database /> }, { id: "security", label: "Security", icon: <ShieldCheck /> }, { id: "calendar", label: "Calendar", icon: <CalendarDays /> }, { id: "notifications", label: "Notifications", icon: <Bell /> }],
  [{ id: "analytics", label: "Analytics", icon: <ChartNoAxesCombined /> }, { id: "ideas", label: "Ideas", icon: <Sparkles /> }, { id: "cloud", label: "Cloud", icon: <Cloud /> }, { id: "wallet", label: "Wallet", icon: <WalletCards /> }, { id: "people", label: "People", icon: <Users /> }, { id: "energy", label: "Energy", icon: <Zap /> }, { id: "world", label: "Publishing", icon: <Globe /> }, { id: "settings", label: "Settings", icon: <Settings2 /> }],
];
export function IllustrationIconMarqueePreview() {
  return <IconMarqueeIllustration rows={rows} />;
}
