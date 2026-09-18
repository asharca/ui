import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { preview } from "vite";

const require = createRequire(
  resolve(process.env.UI_BROWSER_ROOT || ".", "package.json"),
);
const { chromium } = require("playwright");
const server = process.env.UI_BASE_URL
  ? null
  : await preview({
      configFile: resolve("showcase/vite.config.ts"),
      preview: { host: "127.0.0.1", port: 0, open: false },
    });
const url = process.env.UI_BASE_URL || server.resolvedUrls.local[0];
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (
    message.type() === "error" ||
    (message.type() === "warning" &&
      message.text().includes("of chart should be greater than 0"))
  )
    errors.push(message.text());
});
const output = resolve("ui-browser-artifacts/examples");
mkdirSync(output, { recursive: true });
if (process.env.UI_UPDATE_PREVIEWS)
  mkdirSync(resolve("showcase/public/examples"), { recursive: true });
const examples = [
  ["admin", "订单管理", "AdminExample"],
  ["analytics", "数据分析", "AnalyticsExample"],
  ["projects", "项目看板", "ProjectsExample"],
  ["settings", "工作区偏好", "SettingsExample"],
  ["workspace", "组件工作台", "WorkspaceExample"],
];

async function checkLayout(label) {
  const result = await page.evaluate(() => {
    const root = document.querySelector(".example-preview-body");
    const toolbar = document.querySelector(".example-preview-toolbar");
    const controls = [...toolbar.querySelectorAll("button,a,select")].map(
      (node) => {
        const rect = node.getBoundingClientRect();
        return {
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        };
      },
    );
    return {
      viewport: innerWidth,
      width: document.documentElement.scrollWidth,
      contentWidth: root.scrollWidth,
      bodyWidth: root.clientWidth,
      contentHeight: root.clientHeight,
      top: root.getBoundingClientRect().top,
      toolbarBottom: toolbar.getBoundingClientRect().bottom,
      controls,
    };
  });
  assert(result.width <= result.viewport, `${label}: page overflow`);
  assert(
    result.contentWidth <= result.bodyWidth + 1,
    `${label}: preview overflow`,
  );
  assert(result.contentHeight > 400, `${label}: collapsed preview`);
  assert(result.top >= result.toolbarBottom - 1, `${label}: toolbar overlap`);
  for (const rect of result.controls)
    assert(
      rect.left >= 0 && rect.right <= result.viewport + 1,
      `${label}: clipped toolbar control`,
    );
}

try {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [id, heading, component] of examples) {
      await page.goto(`${url}#/examples/${id}`);
      await page
        .getByRole("heading", { name: heading, exact: true, level: 1 })
        .waitFor();
      await page
        .getByRole("combobox", { name: "示例密度" })
        .selectOption("comfortable");
      if (id === "settings")
        await page
          .getByRole("textbox", { name: "工作区名称" })
          .fill("保留测试输入");
      if (id === "admin")
        await page
          .getByRole("searchbox", { name: "搜索订单" })
          .fill("ORD-2408");
      for (const style of ["minimal", "tech", "glass"]) {
        await page
          .getByRole("combobox", { name: "视觉风格" })
          .selectOption(style);
        for (const dark of [false, true]) {
          const currentDark = await page
            .locator("html")
            .evaluate((node) => node.classList.contains("dark"));
          if (currentDark !== dark)
            await page
              .getByRole("button", {
                name: dark ? "切换深色主题" : "切换浅色主题",
              })
              .click();
          const label = `${id}-${width}-${style}-${dark ? "dark" : "light"}`;
          await checkLayout(label);
          assert.equal(
            await page.locator("html").getAttribute("data-ui-style"),
            style,
          );
          if (id === "analytics") {
            await page.locator(".recharts-area-curve").first().waitFor();
            const charts = await page
              .locator(".ui-chart")
              .evaluateAll((nodes) =>
                nodes.map((node) => ({
                  width: node.clientWidth,
                  height: node.clientHeight,
                  series: [
                    ...node.querySelectorAll(
                      ".recharts-area-curve,.recharts-bar-rectangle path,.recharts-pie-sector path",
                    ),
                  ].map((path) => ({
                    box: path.getBBox().width * path.getBBox().height,
                    color:
                      getComputedStyle(path).fill === "none"
                        ? getComputedStyle(path).stroke
                        : getComputedStyle(path).fill,
                  })),
                })),
              );
            assert.equal(charts.length, 3);
            for (const chart of charts) {
              assert(
                chart.width > 200 && chart.height >= 250,
                `${label}: chart dimensions`,
              );
              assert(
                chart.series.some(
                  (series) =>
                    series.box > 100 &&
                    series.color !== "none" &&
                    series.color !== "rgba(0, 0, 0, 0)",
                ),
                `${label}: blank chart`,
              );
            }
          }
          await page.screenshot({ path: resolve(output, `${label}.png`) });
          if (
            process.env.UI_UPDATE_PREVIEWS &&
            width === 1440 &&
            style === "minimal" &&
            !dark
          ) {
            // Use a clean initial state for the gallery's actual product screenshots.
            if (id === "admin")
              await page.getByRole("button", { name: "清除搜索" }).click();
            if (id === "settings")
              await page.getByRole("button", { name: "撤销更改" }).click();
            await page.screenshot({
              path: resolve(
                "showcase/public",
                id === "workspace"
                  ? "workspace-preview.png"
                  : `examples/${id}.png`,
              ),
            });
            if (id === "admin")
              await page
                .getByRole("searchbox", { name: "搜索订单" })
                .fill("ORD-2408");
            if (id === "settings")
              await page
                .getByRole("textbox", { name: "工作区名称" })
                .fill("保留测试输入");
          }
        }
      }
      await page
        .getByRole("combobox", { name: "示例密度" })
        .selectOption("compact");
      await checkLayout(`${id}-${width}-compact`);
      await page.getByRole("tab", { name: "源码", exact: true }).click();
      const source = page.getByRole("region", {
        name: `showcase/examples/${component}.tsx`,
        exact: true,
      });
      await source.waitFor();
      assert.equal(
        await source.locator("code").textContent(),
        readFileSync(resolve("showcase/examples", `${component}.tsx`), "utf8"),
      );
      const files = await page
        .locator("#example-source-file option")
        .evaluateAll((nodes) => nodes.map((node) => node.value));
      if (width === 1440)
        for (const file of files) {
          await page
            .getByRole("combobox", { name: "源码文件" })
            .selectOption(file);
          const label = file.startsWith("../../")
            ? file.slice(6)
            : file.startsWith("../")
              ? `showcase/${file.slice(3)}`
              : `showcase/examples/${file}`;
          const region = page.getByRole("region", { name: label, exact: true });
          await region.waitFor();
          assert.equal(
            await region.locator("code").textContent(),
            readFileSync(resolve("showcase/examples", file), "utf8"),
          );
        }
      await page.getByRole("tab", { name: "预览", exact: true }).click();
      if (id === "settings")
        assert.equal(
          await page.getByRole("textbox", { name: "工作区名称" }).inputValue(),
          "保留测试输入",
        );
      if (id === "admin")
        assert.equal(
          await page.getByRole("searchbox", { name: "搜索订单" }).inputValue(),
          "ORD-2408",
        );
      await checkLayout(`${id}-${width}-restored`);
      console.log(
        `PASS ${id} ${width}px: 3 styles, light/dark, density, exact source and preserved state`,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${url}#/examples/analytics`);
  const surface = page.locator('.recharts-surface[tabindex="0"]').first();
  await surface.focus();
  await page.keyboard.press("ArrowRight");
  await page.locator(".ui-chart-tooltip").first().waitFor({ state: "visible" });
  await page.getByRole("combobox", { name: "统计周期" }).selectOption("14");
  await page.getByRole("tab", { name: "数据明细" }).click();
  assert.equal(
    await page
      .getByRole("region", { name: "每日数据明细" })
      .getByRole("row")
      .count(),
    15,
  );
  await page.goto(`${url}#/components/chart-container`);
  await page.locator(".recharts-bar-rectangle").first().waitFor();
  await page.getByRole("tab", { name: "用法代码" }).click();
  await page.getByRole("region", { name: "用法 TSX" }).waitFor();
  await page.getByRole("tab", { name: "预览", exact: true }).click();
  await page.locator(".recharts-bar-rectangle").first().waitFor();
  await page.goto(`${url}#/examples/admin`);
  await page.getByRole("checkbox", { name: "选择ORD-2408" }).check();
  await page.getByRole("button", { name: "标记已完成" }).click();
  await page.getByRole("button", { name: "查看订单 ORD-2408" }).click();
  await page.getByRole("dialog").getByText("已完成", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出订单" }).click();
  assert.equal((await downloading).suggestedFilename(), "orders.csv");
  await page.goto(`${url}#/examples/projects`);
  await page.getByRole("button", { name: "新建任务" }).click();
  await page.getByRole("textbox", { name: "任务名称" }).fill("浏览器回归任务");
  await page.getByRole("button", { name: "创建任务" }).click();
  await page
    .getByRole("combobox", { name: "DS-107 状态" })
    .selectOption("已完成");
  await page
    .getByRole("region", { name: "已完成" })
    .getByText("浏览器回归任务")
    .waitFor();
  await page.goto(`${url}#/examples`);
  assert.equal(await page.locator(".example-gallery-item").count(), 5);
  await page.locator(".example-gallery-item").last().scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".example-gallery img")].every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );
  assert.deepEqual(errors, [], "Browser runtime errors");
  console.log(
    "PASS chart keyboard tooltip, accessible data, order completion, CSV export, task creation, gallery assets",
  );
} finally {
  await browser.close();
  await new Promise((done) =>
    server ? server.httpServer.close(done) : done(),
  );
}
