"use client";

import { useRef, useState } from "react";
import { DiffReview, type ReviewFile } from "@/components/agents/diff-review";

const files: ReviewFile[] = [
  { id: "limit", path: "src/middleware/rate-limit.ts", versions: [
    { id: "draft", label: "Draft", hunks: [{ id: "limiter", label: "@@ -0 +1 @@", lines: [
      { id: "1", type: "added", newLine: 1, content: "// 120 requests a minute for each API key" },
      { id: "2", type: "added", newLine: 2, content: "export const rateLimit = limiter({" },
      { id: "3", type: "added", newLine: 3, content: "  window: 60_000," },
      { id: "4", type: "added", newLine: 4, content: "  max: 120," },
      { id: "5", type: "added", newLine: 5, content: '  key: (req) => req.headers.get("x-api-key"),' },
      { id: "6", type: "added", newLine: 6, content: "});" },
    ] }] },
    { id: "revised", label: "Revised", hunks: [{ id: "limiter", label: "@@ -0 +1 @@", lines: [
      { id: "1", type: "added", newLine: 1, content: "export const rateLimit = limiter({" },
      { id: "2", type: "added", newLine: 2, content: "  window: 60_000," },
      { id: "3", type: "added", newLine: 3, content: "  max: 100," },
      { id: "4", type: "added", newLine: 4, content: '  key: (req) => req.headers.get("x-api-key"),' },
      { id: "5", type: "added", newLine: 5, content: "});" },
    ] }] },
  ] },
  { id: "orders", path: "src/routes/orders.ts", versions: [{ id: "draft", label: "Draft", hunks: [
    { id: "import", label: "@@ -1 +1 @@", lines: [{ id: "1", type: "added", newLine: 1, content: 'import { rateLimit } from "../middleware/rate-limit";' }] },
    { id: "route", label: "@@ -12 +13 @@", lines: [{ id: "1", type: "removed", oldLine: 12, content: 'router.get("/orders", listOrders);' }, { id: "2", type: "added", newLine: 13, content: 'router.use("/orders", rateLimit);' }, { id: "3", type: "added", newLine: 14, content: 'router.get("/orders", listOrders);' }] },
  ] }] },
  { id: "config", path: "src/config.ts", versions: [{ id: "draft", label: "Draft", hunks: [{ id: "config", label: "@@ -3 +3 @@", lines: [{ id: "1", type: "removed", oldLine: 3, content: "export const legacyThrottle = true;" }, { id: "2", type: "added", newLine: 3, content: "export const rateLimiting = true;" }] }] }] },
  { id: "legacy", path: "src/legacy/throttle.ts", versions: [{ id: "draft", label: "Draft", hunks: [{ id: "remove", label: "@@ -1 +0 @@", lines: [{ id: "1", type: "removed", oldLine: 1, content: "export function throttle(request) {" }, { id: "2", type: "removed", oldLine: 2, content: "  const key = request.ip;" }, { id: "3", type: "removed", oldLine: 3, content: "  return legacyLimiter.check(key);" }, { id: "4", type: "removed", oldLine: 4, content: "}" }] }] }] },
];

export function DiffReviewFileReviewPreview() {
  const [events, setEvents] = useState<{ id: number; label: string }[]>([]);
  const eventId = useRef(0);
  const [rejectNext, setRejectNext] = useState(false);
  const [run, setRun] = useState(0);
  async function save(label: string) {
    if (rejectNext) { setRejectNext(false); throw new Error("Demo persistence rejected this action. Your decision was not changed; try again."); }
    const event = { id: eventId.current, label };
    eventId.current += 1;
    setEvents((current) => [event, ...current].slice(0, 4));
  }
  return <div className="w-full py-6">
    <DiffReview key={run} files={files} onDecision={(target, decision) => save(`${decision}: ${target.fileId}/${target.versionId}/${target.hunkId ?? "whole file"}`)} onComment={(target, body) => save(`Comment on ${target.hunkId}: ${body}`)} onCommit={(message, reviewed) => save(`Committed “${message}” with ${reviewed.reduce((sum, file) => sum + file.acceptedHunkIds.length, 0)} accepted hunks`)} />
    <details className="mx-auto mt-4 max-w-md text-[10px] text-muted-foreground"><summary className="cursor-pointer">Local demo controls</summary><p className="mt-2">Decisions, comments and commits are recorded locally; no repository is changed.</p><div className="mt-2 flex gap-3"><button type="button" className="underline" aria-pressed={rejectNext} onClick={() => setRejectNext(!rejectNext)}>{rejectNext ? "Next save will fail" : "Fail next save"}</button><button type="button" className="underline" onClick={() => { setRun(run + 1); setEvents([]); setRejectNext(false); }}>Reset review</button></div><section aria-label="Demo callback log" className="mt-2">{events.length ? <ul className="space-y-1">{events.map((event) => <li key={event.id}>{event.label}</li>)}</ul> : <p>No actions recorded yet.</p>}</section></details>
  </div>;
}
