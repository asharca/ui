"use client";

import { useState } from "react";
import { NotificationDropdown, type CenterNotification } from "@/components/motion/business-decisions/notification-center";
import { Checkbox } from "@/components/motion/checkbox";
import { Button } from "@/components/motion/button";
import { RotateCcw } from "lucide-react";

const initialNotifications: CenterNotification[] = [
  { id: "review", title: "Review requested", summary: "Maya shared the revised navigation for your feedback.", details: "Review the revised navigation and share feedback with the team.", category: "reviews", group: "Today", createdAt: "4m ago", read: false, href: "/guides", actionLabel: "Review", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&fit=crop&auto=format" },
  { id: "export", title: "Your export is ready", summary: "The latest project files are ready to download.", category: "system", group: "Today", createdAt: "8m ago", read: false },
  { id: "invite", title: "Invitation needs approval", summary: "Jordan requested access to the design workspace.", category: "action", group: "Today", createdAt: "12m ago", read: false, href: "/guides", actionLabel: "View request", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&fit=crop&auto=format" },
  { id: "comment", title: "New comment on your draft", summary: "Alex left a note on the account menu.", category: "reviews", group: "Today", createdAt: "26m ago", read: false, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&fit=crop&auto=format" },
  { id: "sync", title: "Files are up to date", summary: "All changes have been synced to your workspace.", category: "system", group: "Today", createdAt: "1h ago", read: true },
  { id: "access", title: "Access request approved", summary: "Sam can now view the project brief.", category: "action", group: "Earlier", createdAt: "Yesterday", read: true, avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&fit=crop&auto=format" },
];
export function NotificationCenterNotificationDropdownPreview() {
  const [fail, setFail] = useState(false);
  const [notice, setNotice] = useState("");
  const [notifications, setNotifications] = useState(initialNotifications);
  return <div className="relative flex w-full flex-col items-center gap-4 h-[36rem] p-6"><div className="flex w-full max-w-md items-center justify-between gap-3"><Button size="sm" variant="ghost" className="text-xs" onClick={() => { setNotifications(initialNotifications); setNotice(""); }}><RotateCcw className="size-3" />Reset demo</Button><NotificationDropdown notifications={notifications} onRead={async (ids, read) => { if (fail) throw new Error("Demo rejection"); setNotifications(previous => previous.map(item => ids.includes(item.id) ? { ...item, read } : item)); }} onArchive={async ids => { if (fail) throw new Error("Demo rejection"); setNotifications(previous => previous.filter(item => !ids.includes(item.id))); }} onClear={async ids => { if (fail) throw new Error("Demo rejection"); setNotifications(previous => previous.filter(item => !ids.includes(item.id))); }} onSnooze={async (id, until) => { if (fail) throw new Error("Demo rejection"); setNotifications(previous => previous.filter(item => item.id !== id)); setNotice(`Snoozed in this local demo until ${until.toLocaleTimeString()}; no reminder scheduled.`); }} /></div><output className="text-center text-xs text-muted-foreground">{notice}</output><details className="absolute left-6 top-full z-10 text-xs text-muted-foreground"><summary>Demo controls</summary><p className="my-2">Local preview only. Review links open the real beUI guides.</p><Checkbox label="Simulate action failure" checked={fail} onCheckedChange={setFail} /></details></div>;
}
