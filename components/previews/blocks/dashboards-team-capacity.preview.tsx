"use client";

import { TeamCapacityDashboard, type CapacityMember, type CapacityPeriod } from "@/components/motion/operations-dashboards";

const members: CapacityMember[] = [
  { id: "milo", name: "Milo Grant", crew: "Operations", role: "Operations lead", availableHours: 40, allocations: [{ project: "Workspace operations", hours: 28 }, { project: "Team onboarding", hours: 15 }] },
  { id: "jules", name: "Jules Ortega", crew: "Customer care", role: "Customer specialist", availableHours: 32, allocations: [{ project: "Response queue", hours: 12 }, { project: "Help center", hours: 8 }] },
  { id: "ari", name: "Ari Chen", crew: "Product", role: "Product designer", availableHours: 40, allocations: [{ project: "First-run experience", hours: 24 }, { project: "Research", hours: 12 }] },
  { id: "remy", name: "Remy Brooks", crew: "Operations", role: "Operations analyst", availableHours: 40, allocations: [{ project: "Setup automation", hours: 20 }, { project: "Reporting", hours: 10 }] },
  { id: "noor", name: "Noor Ellis", crew: "Customer care", role: "Customer specialist", availableHours: 32, allocations: [{ project: "Quality review", hours: 18 }, { project: "Response queue", hours: 10 }] },
  { id: "sasha", name: "Sasha Rao", crew: "Product", role: "Product engineer", availableHours: 36, allocations: [{ project: "First-run experience", hours: 16 }, { project: "Maintenance", hours: 6 }] },
];
// Apportioned sample observations, never presented as live staff activity.
function activity(total: number, weeks: number) {
  const weights = Array.from({ length: weeks * 7 }, (_, index) => index % 7 < 5 && index < weeks * 7 - 4 ? [1, .7, .85, 1.25, .95][index % 5] : 0);
  const scale = weights.reduce((sum, value) => sum + value, 0);
  const counts = weights.map(value => Math.min(48, Math.floor(total * value / scale)));
  let remainder = total - counts.reduce((sum, value) => sum + value, 0);
  for (let index = 0; remainder > 0; index = (index + 1) % counts.length) {
    if (weights[index] > 0 && counts[index] < 48) { counts[index]++; remainder--; }
  }
  return Array.from({ length: weeks }, (_, week) => counts.slice(week * 7, week * 7 + 7).map(value => value / 48));
}
const focus = [
  { id: "operations", name: "Operations", color: "var(--primary)", values: [22, 25, 28, 26, 24, 28, 26, 20.8] },
  { id: "care", name: "Customer care", color: "var(--muted-foreground)", values: [35, 31, 27, 28, 23, 26, 23, 21.9] },
  { id: "product", name: "Product", color: "var(--foreground)", values: [43, 44, 45, 46, 53, 46, 51, 57.3] },
];
function snapshot(weeks: number): CapacityPeriod {
  const crewTotals = weeks === 26 ? [1371, 1832, 1621] : [651, 842, 745];
  const total = crewTotals.reduce((sum, value) => sum + value, 0);
  return { id: `weeks-${weeks}`, label: `Last ${weeks} weeks`, endDate: "2026-09-30T12:00:00Z", activity: activity(total, weeks), activityUnit: "items finished", activityMaxCount: 48, focus, days: ["Aug 10", "Aug 17", "Aug 24", "Aug 31", "Sep 7", "Sep 14", "Sep 21", "Sep 28"], members, summary: { workFinished: 165, focusHours: 94, activityTotal: total, windowLabel: "Across the last 7 days" }, workloadWindowLabel: "Sep 28 – Oct 4", crewSnapshots: ["Operations", "Customer care", "Product"].map((crew, index) => ({ crew, activity: activity(crewTotals[index], weeks), focus: [focus[index]], summary: { workFinished: [42, 56, 67][index], focusHours: [26, 28.5, 39.5][index], activityTotal: crewTotals[index], windowLabel: "Across the last 7 days" } })) };
}
const periods = [snapshot(26), snapshot(12)];
export function TeamCapacityDashboardPreview() { return <div className="space-y-3"><TeamCapacityDashboard userName="Avery" periods={periods} /><p className="px-8 text-xs text-muted-foreground">Sample workspace · Snapshot Sep 30, 2026 · Illustrative staffing observations</p></div>; }
