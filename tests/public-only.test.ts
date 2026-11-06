import { describe, expect, test } from "bun:test";
const forbidden = /pro\.beui\.dev|beui-pro|BEUI_PRO_TOKEN|PRO_(?:REGISTRY|API)_URL|\b(?:FreeAndPro|ProCard)\b|(?:Get|Explore|beUI) Pro|free_to_pro/;

describe("public-only distribution", () => {

  test("the application no longer redirects to the removed sales site", async () => {
    const { default: config } = await import("../next.config.mjs");
    if (!config.redirects) throw new Error("Redirect configuration is missing.");
    const redirects = await config.redirects();
    expect(redirects.some((item) => item.source === "/pro" || forbidden.test(item.destination))).toBe(false);
    expect(redirects.some((item) => item.source === "/components/charts")).toBe(true);
  });

});
