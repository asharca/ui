"use client";

import { CalendarDays, Cloud, Database, FileText, Mail, Webhook } from "lucide-react";
import { ArcStackIllustration } from "@/components/motion/illustration-arc-stack";

export function IllustrationArcStackConnectorsPreview() {
  return <ArcStackIllustration variant="connectors" label="Bring your tools into orbit" autoPlay items={[{ id: "files", label: "Files", description: "Your documents in one place", icon: <FileText /> }, { id: "calendar", label: "Calendar", description: "Give every project a little time", icon: <CalendarDays /> }, { id: "mail", label: "Inbox", description: "Keep the right conversations close", icon: <Mail /> }, { id: "data", label: "Database", description: "Build on structured information", icon: <Database /> }, { id: "storage", label: "Storage", description: "Space for the things you create", icon: <Cloud /> }, { id: "hooks", label: "Events", description: "Connect the moments that matter", icon: <Webhook /> }]} />;
}
