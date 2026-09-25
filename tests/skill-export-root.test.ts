import { expect, test } from "bun:test";
import os from "node:os";
import path from "node:path";
import { assertSourceCheckout } from "@/scripts/export-component";
import { buildGuideMarkdown } from "@/lib/guide-markdown";

test("the exporter cannot mistake a consumer or unrelated directory for its source", () => {
  expect(() => assertSourceCheckout(path.resolve(import.meta.dir, ".."))).not.toThrow();
  expect(() => assertSourceCheckout(os.tmpdir())).toThrow("source checkout");
});

test("the downloadable agent guide supplements official use with custom components", () => {
  const guide = buildGuideMarkdown("ai-agents");
  expect(guide).toContain("Official beUI components remain available");
  expect(guide).toContain("source-policy.json");
  expect(guide).toContain("bun scripts/export-component.ts workspace-shell");
  expect(guide).toContain("MCP server (optional)");
  expect(guide).toContain("--dry-run");
  expect(guide).toContain("--diff");
  expect(guide).not.toContain("Choose component ownership first");
  expect(guide).not.toContain("do not substitute a similar official component");
});
