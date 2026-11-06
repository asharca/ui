"use client";

import { useState } from "react";
import { SupportDashboard, type SupportPeriod, type SupportTicket } from "@/components/motion/operations-dashboards";

const titles = ["Seat count did not update", "Shared inbox is not appearing", "Weekly digest has incorrect totals", "Verification link has expired", "Notifications are arriving twice", "Question about storage allowance"];
const accounts = ["Brightside", "Fieldnote", "Tandem", "Harbor", "Looma", "Juniper"];
const owners = ["Nina Patel", "Owen Reed", "Avery Brooks", "Theo Park"];
const tickets: SupportTicket[] = Array.from({ length: 30 }, (_, index) => ({ id: `RQ-${5101 + index}`, title: titles[index % 6], customer: accounts[index % 6], owner: owners[index % 4], priority: index % 3 === 0 ? "urgent" : "normal", priorityLabel: ["High", "Medium", "Low"][index % 3], state: index % 6 === 3 ? "resolved" : "open", stageLabel: ["Under review", "Being handled", "Awaiting reply", "Closed"][index % 4], openedAt: `2026-09-${String(30 - Math.floor(index / 3)).padStart(2, "0")}`, responseMinutes: index % 6 === 4 ? 90 : 15, targetMinutes: index % 6 === 1 ? 60 : 135 }));
const updates = [
  { id: "seat", author: "Nina Patel", title: "Seat adjustment verified", at: "Sep 30, 11:20 AM", message: "Nina compared Brightside’s invoice with their member count. RQ-5101 is ready for the account lead to review." },
  { id: "setup", author: "Owen Reed", title: "Fieldnote setup completed", at: "Sep 30, 11:15 AM", message: "Owen confirmed Fieldnote’s inbox permissions and routing preferences. Their team can now work from the shared queue." },
  { id: "digest", author: "Avery Brooks", title: "Digest check handed to Avery", at: "Sep 30, 11:00 AM", message: "Avery is comparing Tandem’s weekly digest with the reporting dates on RQ-5103." },
  { id: "reply", author: "Team inbox", title: "First reply due soon", at: "Sep 30, 10:45 AM", message: "Fieldnote is waiting on RQ-5102. Send the account lead an update within the next 45 minutes." },
  { id: "guide", author: "Team inbox", title: "Inbox access guide added", at: "Sep 30, 10:30 AM", message: "The team documented how to check shared inbox permissions, invite members, and confirm routing." },
  { id: "handoff", author: "Theo Park", title: "Verification handoff complete", at: "Sep 30, 10:15 AM", message: "Harbor’s verification request is ready for review." },
  { id: "storage", author: "Owen Reed", title: "Storage guidance shared", at: "Sep 30, 10:00 AM", message: "Juniper received the workspace storage guide." },
  { id: "delivery", author: "Nina Patel", title: "Notification delivery reviewed", at: "Sep 30, 9:45 AM", message: "Looma’s delivery preferences are being checked." },
  { id: "triage", author: "Avery Brooks", title: "Morning triage finished", at: "Sep 30, 9:30 AM", message: "Every open request now has an assigned owner." },
];
const initial: SupportPeriod[] = [
  { id: "month", label: "Sep 1 – Sep 30, 2026", days: ["Sep 1", "Sep 4", "Sep 7", "Sep 10", "Sep 13", "Sep 16", "Sep 19", "Sep 22", "Sep 25", "Sep 28"], incoming: [520, 340, 500, 440, 460, 540, 350, 510, 360, 490], resolved: [520, 310, 486, 415, 425, 540, 330, 500, 340, 462], tickets, updates, summary: { newRequests: 4510, firstReplyMinutes: 18.4, replyTargetsMetPercent: 96.2, customerRating: 4.78, ratingMaximum: 5, changes: { newRequestsPercent: 7.1, firstReplyPercent: -1.7, targetsMetPercent: .4, ratingPercent: .4 } } },
  { id: "week", label: "Sep 24 – Sep 30, 2026", days: ["Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29", "Sep 30"], incoming: [55, 64, 20, 18, 82, 71, 65], resolved: [51, 62, 18, 22, 77, 74, 60], tickets: tickets.slice(0, 6), updates: updates.slice(0, 3) },
  { id: "empty", label: "No observations", days: [], incoming: [], resolved: [], tickets: [], updates: [] },
];
export function SupportDashboardPreview() {
  const [periods, setPeriods] = useState(initial); const [failure, setFailure] = useState(false);
  return <div className="space-y-3"><SupportDashboard userName="Avery" periods={periods} onResolve={async id => { if (failure) throw new Error("Demo service could not resolve the request."); setPeriods(current => current.map(period => ({ ...period, tickets: period.tickets.map(ticket => ticket.id === id ? { ...ticket, state: "resolved" as const, stageLabel: "Closed" } : ticket) }))); }} /><p className="px-8 text-xs text-muted-foreground">Sample inbox · Snapshot Sep 30, 11:30 AM UTC · No live customer data</p><details className="px-8 text-xs text-muted-foreground"><summary>Demo host controls</summary><label className="mt-2 flex gap-2"><input type="checkbox" checked={failure} onChange={event => setFailure(event.target.checked)} />Simulate resolution failure</label></details></div>;
}
