"use client";

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
  return (
    <div className="w-full py-2">
      <DiffReview
        files={files}
        subtitle="Atlas · Add rate limits to the API"
        onDecision={async () => {}}
        onComment={async () => {}}
        onCommit={async () => {}}
      />
    </div>
  );
}
