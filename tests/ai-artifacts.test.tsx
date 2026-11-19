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
