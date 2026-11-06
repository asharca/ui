"use client";

import { FileText, Folder, KeyRound, Settings2 } from "lucide-react";
import { AuditTrail, type AuditEvent } from "@/components/motion/audit-trail";

const portrait = (photo: string) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=96&q=80`;
const maya = portrait("photo-1494790108377-be9c29b29330");
const leo = portrait("photo-1500648767791-00dcc994a43e");
const nina = portrait("photo-1534528741775-53994a69daeb");
const events: AuditEvent[] = [
  { id: "role", timestamp: "2026-10-07T10:42:00Z", actor: "Maya Chen", avatarUrl: maya, dayLabel: "Today", action: "changed the role for", target: "Leo Martin", icon: <KeyRound/>, description: "Leo can now edit documents and manage project content in the design workspace.", category: "Access", before: { Role: "Viewer" }, after: { Role: "Editor" }, details: { Workspace: "Product design", Source: "Web app", Request: "REQ-029", "IP address": "192.0.2.24" } },
  { id: "publish", timestamp: "2026-10-07T10:18:00Z", actor: "Nina Brooks", avatarUrl: nina, dayLabel: "Today", action: "published", target: "Getting started guide", icon: <FileText/>, description: "The updated setup guide is available to everyone in the workspace.", category: "Content", before: { Status: "Draft" }, after: { Status: "Published" }, details: { Collection: "Help center", Revision: "12", Source: "Web app" } },
  { id: "settings", timestamp: "2026-10-07T09:56:00Z", actor: "Leo Martin", avatarUrl: leo, dayLabel: "Today", action: "updated", target: "Workspace settings", icon: <Settings2/>, description: "Default preferences for new project members were updated.", category: "Workspace", before: { "Default role": "Editor", "Join requests": "Off", "Project visibility": "Workspace" }, after: { "Default role": "Viewer", "Join requests": "On", "Project visibility": "Private" }, details: { Workspace: "Product design", Source: "Web app" } },
  { id: "archive", timestamp: "2026-10-07T09:30:00Z", actor: "Workspace automation", dayLabel: "Today", action: "archived", target: "Spring research", icon: <Folder/>, actorKind: "system", description: "The project was archived after its completion window. Its documents remain available.", category: "Workspace", before: { Status: "Completed" }, after: { Status: "Archived" }, details: { Source: "Scheduled workflow", Rule: "Archive completed projects after 30 days" } },
  { id: "invite", timestamp: "2026-10-06T16:32:00Z", actor: "Maya Chen", avatarUrl: maya, dayLabel: "Yesterday", action: "invited", target: "Sam Rivera", icon: <KeyRound/>, description: "A new invitation was issued for the release project.", category: "Access", before: null, after: { Access: "Guest" }, details: { Project: "Autumn release", Duration: "30 days", Source: "Web app" } },
  { id: "document", timestamp: "2026-10-06T15:10:00Z", actor: "Nina Brooks", avatarUrl: nina, dayLabel: "Yesterday", action: "updated", target: "Release checklist", icon: <FileText/>, category: "Content", before: { Owner: "Maya Chen", "Due date": "Oct 10" }, after: { Owner: "Nina Brooks", "Due date": "Oct 12" }, details: { Project: "Autumn release", Revision: "08" } },
  { id: "revoke", timestamp: "2026-10-06T14:05:00Z", actor: "Workspace automation", dayLabel: "Yesterday", action: "removed expired access to", target: "Partner workspace", icon: <KeyRound/>, actorKind: "system", description: "The time-limited workspace permission ended at its scheduled expiry.", category: "Access", before: { Permission: "Guest" }, after: null, details: { Source: "Scheduled workflow", Policy: "Time-limited partner access" } },
];

export function AuditTrailWorkspaceHistoryPreview() {
  return <div className="w-full"><AuditTrail events={events}/></div>;
}
