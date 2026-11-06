"use client";

import { useState } from "react";
import { SLAMonitoringTable, type SLARow } from "@/components/motion/commerce-data-tables";

export function SLAMonitoringTablePreview() {
  const [tickets, setTickets] = useState<SLARow[]>(() => Array.from({ length: 36 }, (_, i) => ({ id: `#${2319 + i}`, subject: ["Payment failed on invoice generation", "Login issue on the main dashboard", "Feature request: export account data", "Contract renewal approval", "Driver location tracking delay", "API rate limit exceeded"][i % 6], customer: ["Domora", "NexRoute", "CloudGuard", "Splitly", "Foresight", "Northstar"][i % 6], priority: (["urgent", "low", "normal"] as const)[i % 3], status: (["at risk", "resolved", "open"] as const)[i % 3], assignee: ["John Doe", "Michael Wong", "Ana Silva"][i % 3], remainingMinutes: 180 - i * 7 })));
  return <div className="w-full"><SLAMonitoringTable tickets={tickets} onAssign={async ticket => { setTickets(rows => rows.map(r => r.id === ticket.id ? { ...r, assignee: "You" } : r)); }} onResolve={async selected => { setTickets(rows => rows.map(r => selected.some(s => s.id === r.id) ? { ...r, status: "resolved" } : r)); }} /><p className="text-center text-[10px] text-muted-foreground">Local service-operations demo. No external tickets are modified.</p></div>;
}
