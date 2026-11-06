"use client";

import { useRef, useState } from "react";
import { TeamInvite, type TeamInvitePerson } from "@/components/motion/business-decisions/team-invite";
import { Checkbox } from "@/components/motion/checkbox";

const initialPeople: TeamInvitePerson[] = [
  { id: "owner", email: "ana@example.com", name: "Ana Okafor", role: "Admin", status: "joined", isOwner: true, isOnline: true, lastActive: "Active now", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&fit=crop&auto=format" },
  { id: "jon", email: "jon@example.com", name: "Jon Reyes", role: "Admin", status: "joined", isOnline: true, lastActive: "12m ago", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&fit=crop&auto=format" },
  { id: "lena", email: "lena@example.com", name: "Lena Brandt", role: "Member", status: "joined", lastActive: "2h ago", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&fit=crop&auto=format" },
  { id: "rui", email: "rui@example.com", name: "Rui Tanaka", role: "Member", status: "joined", lastActive: "Yesterday", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&fit=crop&auto=format" },
  { id: "sofia", email: "sofia@example.com", name: "Sofia Marin", role: "Viewer", status: "joined", lastActive: "3d ago", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&fit=crop&auto=format" },
  { id: "pending-1", email: "theo@northwind.studio", role: "member", status: "pending", lastActive: "Invited 2d ago", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=96&h=96&q=80" },
  { id: "pending-2", email: "priya.k@fieldnotes.io", role: "viewer", status: "pending", lastActive: "Invited 5d ago" },
];
export function TeamInviteInviteTeammatesPreview() {
  const [fail, setFail] = useState(false);
  const [notice, setNotice] = useState("");
  const id = useRef(1);
  const [people, setPeople] = useState(initialPeople);
  const [inviteLink, setInviteLink] = useState({ url: "https://example.com/invite/demo-preview-000", enabled: true, role: "member", expiresLabel: "Expires in 7 days" });
  return <div className="relative w-full"><TeamInvite people={people} roles={[{ value: "admin", label: "Admin", description: "Manages billing, seats, and settings" }, { value: "member", label: "Member", description: "Creates and edits projects" }, { value: "viewer", label: "Viewer", description: "Can view and comment only" }]} defaultInviteRole="member" seatLimit={10} inviteLink={inviteLink} onInvite={async (emails, role, note) => { if (fail) throw new Error("Demo rejection"); setPeople(previous => [...emails.map(email => ({ id: `invite-${id.current++}`, email, role, status: "pending" as const, lastActive: "Invited Just now" })), ...previous]); setNotice(`Queued ${emails.length} local invitation(s)${note ? ` with note: ${note}` : ""}. No emails sent.`); }} onPersonRoleChange={async (personId, role) => { if (fail) throw new Error("Demo rejection"); setPeople(previous => previous.map(person => person.id === personId ? { ...person, role } : person)); }} onResend={async personId => { if (fail) throw new Error("Demo rejection"); setNotice(`Resent the local preview invitation to ${people.find(person => person.id === personId)?.email}; no email sent.`); }} onRevoke={async personId => { if (fail) throw new Error("Demo rejection"); setPeople(previous => previous.filter(person => person.id !== personId)); }} onInviteLinkRoleChange={async role => { if (fail) throw new Error("Demo rejection"); setInviteLink(previous => ({ ...previous, role })); }} onInviteLinkChange={async action => { if (fail) throw new Error("Demo rejection"); setInviteLink(previous => action === "reset" ? { ...previous, url: `https://example.com/invite/demo-${crypto.randomUUID()}` } : { ...previous, enabled: action === "enable" }); }} onCopyLink={async url => { await navigator.clipboard.writeText(url); }} />{notice && <p role="status" className="sr-only">{notice}</p>}<details className="absolute left-4 top-full z-10 text-xs text-muted-foreground"><summary>Demo controls</summary><p className="my-2">Local invitation simulation. No emails are sent; example.com links are demonstration data. Stock portraits replace the reference's team photography.</p><Checkbox label="Simulate action failure" checked={fail} onCheckedChange={setFail} /></details></div>;
}
