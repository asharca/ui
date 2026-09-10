import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { HighlightedCode } from "../../showcase/HighlightedCode";

afterEach(cleanup);

it("highlights TSX, preserves literal source and updates safely to CSS", async () => {
  const code =
    'const Example = () => <div title="safe">&lt;script&gt;</div>;\n// comment';
  const { container, rerender } = render(
    <HighlightedCode code={code} label="示例代码" />,
  );
  const pre = container.querySelector("pre")!;
  await waitFor(() => expect(pre).toHaveAttribute("data-highlighted", "true"));
  expect(pre.textContent).toBe(code);
  expect(pre.querySelectorAll("span[style]").length).toBeGreaterThan(4);
  expect(pre.querySelector("script")).toBeNull();
  expect(screen.getByRole("region", { name: "示例代码" })).toHaveAttribute(
    "tabindex",
    "0",
  );
  rerender(<HighlightedCode code="body { color: red; }" language="css" />);
  expect(pre.textContent).toBe("body { color: red; }");
  await waitFor(() => expect(pre).toHaveAttribute("data-highlighted", "true"));
  expect(pre).toHaveAttribute("data-language", "css");
});
