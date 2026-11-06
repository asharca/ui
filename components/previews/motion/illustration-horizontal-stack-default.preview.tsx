"use client";

import { Bell, Boxes, Database, FileText, MessageSquare, Search, ShieldCheck } from "lucide-react";
import { HorizontalStackIllustration } from "@/components/motion/illustration-horizontal-stack";

export function IllustrationHorizontalStackPreview() {
  return <HorizontalStackIllustration autoPlay defaultIndex={3} items={[{ id: "search", label: "Search", icon: <Search /> }, { id: "documents", label: "Documents", icon: <FileText /> }, { id: "chat", label: "Conversations", icon: <MessageSquare /> }, { id: "modules", label: "Modular tools", icon: <Boxes /> }, { id: "data", label: "Structured data", icon: <Database /> }, { id: "security", label: "Access control", icon: <ShieldCheck /> }, { id: "notifications", label: "Notifications", icon: <Bell /> }]} />;
}
