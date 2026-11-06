"use client";

import { useState } from "react";
import { FinanceDashboard, type FinanceCard, type FinancePeriod } from "@/components/motion/operations-dashboards";

const incoming = [7800, 8131, 8324, 8365, 8384, 8527, 8830, 9178, 9418, 9494, 9502, 9600];
const outgoing = [3613, 3328, 3303, 3608, 4010, 4186, 4020, 3713, 3594, 3818, 4227, 3409.36];
const months = incoming.map((_, index) => new Date(Date.UTC(2025, index + 9, 1)).toISOString().slice(0, 7));
// Illustrative ledger snapshots, not connected accounts or live bank data.
const ledger = months.flatMap((month, index) => [
  { id: `${month}-rent`, description: "Studio lease", date: `${month}-24`, amount: -(outgoing[index] - 855.31), category: "Workspace", status: "Settled" },
  { id: `${month}-tools`, description: "Papertrail tools", date: `${month}-19`, amount: -855.31, category: "Software", status: "Settled" },
  { id: `${month}-hosting`, description: "Orbit hosting", date: `${month}-14`, amount: -1082.63, category: "Infrastructure", status: "Declined" },
  { id: `${month}-project`, description: "Northline project", date: `${month}-04`, amount: incoming[index], category: "Client payment", status: "Settled" },
]).sort((a, b) => b.date.localeCompare(a.date));
const periods: FinancePeriod[] = [
  { id: "year", label: "Oct 4, 2025 – Sep 30, 2026", currency: "USD", categories: months, series: [{ id: "in", name: "Money in", color: "var(--primary)", values: incoming }, { id: "out", name: "Money out", color: "var(--muted-foreground)", values: outgoing }], transactions: ledger, totals: { moneyIn: incoming.reduce((sum, value) => sum + value, 0), moneyOut: outgoing.reduce((sum, value) => sum + value, 0) } },
  { id: "month", label: "Sep 1 – Sep 30, 2026", currency: "USD", categories: ["September"], series: [{ id: "in", name: "Money in", color: "var(--primary)", values: [9600] }, { id: "out", name: "Money out", color: "var(--muted-foreground)", values: [3409.36] }], transactions: ledger.filter(row => row.date.startsWith("2026-09")), totals: { moneyIn: 9600, moneyOut: 3409.36 } },
  { id: "empty", label: "No movements", categories: [], series: [], transactions: [] },
];
export function FinanceDashboardPreview() {
  const [cards, setCards] = useState<FinanceCard[]>([{ id: "studio", label: "Studio account", lastFour: "4827", frozen: false, availableBalance: 73325, currency: "USD", holderName: "Avery Brooks", expiresLabel: "08/29" }]);
  const [failure, setFailure] = useState(false);
  return <div className="space-y-3"><FinanceDashboard userName="Avery" periods={periods} cards={cards} allowances={[{ id: "month", label: "September spending", spent: 3409.36, limit: 6500, currency: "USD" }]} onCardFreeze={async (id, frozen) => { if (failure) throw new Error("Demo host could not update the card."); setCards(current => current.map(card => card.id === id ? { ...card, frozen } : card)); }} /><p className="px-8 text-xs text-muted-foreground">Sample workspace · Snapshot Sep 30, 2026 · Local ledger only</p><details className="px-8 text-xs text-muted-foreground"><summary>Demo host controls</summary><label className="mt-2 flex gap-2"><input type="checkbox" checked={failure} onChange={event => setFailure(event.target.checked)} />Simulate card update failure</label></details></div>;
}
