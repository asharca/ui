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
