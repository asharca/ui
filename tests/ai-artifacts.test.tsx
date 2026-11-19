import { afterEach, expect, mock, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { AIArtifact } from "@/components/agents/ai-artifacts";

afterEach(cleanup);

test("an empty artifact snapshot disables content export", () => {
  const onCopy = mock(async (_content: string) => {});
  const { getByRole } = render(
    <AIArtifact title="Generated code" filename="result.ts" kind="code" versions={[]} onCopy={onCopy} />,
  );
  const copy = getByRole("button", { name: /^Copy / }) as HTMLButtonElement;
  const download = getByRole("button", { name: /^Download / }) as HTMLButtonElement;
  expect(copy.disabled).toBe(true);
  expect(download.disabled).toBe(true);
  fireEvent.click(copy);
  expect(onCopy).not.toHaveBeenCalled();
});

test("labels localize the controls and status text", () => {
  const { getByRole, getByText } = render(
    <AIArtifact
      title="说明"
      filename="notes.md"
      kind="document"
      versions={[{ id: "v1", label: "当前", content: "# 标题\n\n正文" }]}
      labels={{ copy: () => "复制", versionHistory: "版本历史", words: (count) => `${count} 词` }}
    />,
  );
  expect(getByRole("button", { name: "复制" })).toBeDefined();
  expect(getByRole("button", { name: "版本历史" })).toBeDefined();
  expect(getByText("3 词")).toBeDefined();
  expect(getByText("Markdown document")).toBeDefined();
});

test("documents render lists, tables, code blocks and links as Markdown", () => {
  const content = [
    "Intro with [docs](https://example.com) and `code`.",
    "",
    "- [x] shipped",
    "- nested",
    "  1. first",
    "",
    "| Name | Size |",
    "| :--- | ---: |",
    "| a.md | 2 KB |",
    "",
    "```ts",
    "const quota = 1;",
    "```",
  ].join("\n");
  const { container, getByRole, getByText } = render(
    <AIArtifact title="Notes" filename="notes.md" kind="document" versions={[{ id: "v1", label: "v1", content }]} />,
  );
  expect(getByRole("link", { name: "docs" }).getAttribute("href")).toBe("https://example.com");
  expect(container.querySelector("ul ol li")?.textContent).toBe("first");
  expect(getByText("Done")).toBeDefined();
  expect(getByRole("columnheader", { name: "Size" }).className).toContain("text-right");
  expect(container.querySelector("figure pre")?.textContent).toBe("const quota = 1;");
  expect(getByRole("button", { name: "Copy" })).toBeDefined();
});

test("unsafe link schemes and raw HTML stay inert text", () => {
  const content = "[run](javascript:alert(1)) [tab](java\tscript:alert(1)) <JavaScript:alert(1)> <img src=x onerror=alert(1)> ![pic](data:image/png;base64,AA)";
  const { container } = render(
    <AIArtifact title="Notes" filename="notes.md" kind="document" versions={[{ id: "v1", label: "v1", content }]} />,
  );
  expect(container.querySelector("a")).toBeNull();
  expect(container.querySelector("img")).toBeNull();
  expect(container.textContent).toContain("<img src=x onerror=alert(1)>");
});
