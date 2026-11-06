# Asharca Workspace · based on beUI

项目仓库：[asharca/ui](https://github.com/asharca/ui)。项目链接、Star 统计和 Skill 安装均使用此仓库；上游来源与 MIT 署名另行保留。

以 [beUI](https://github.com/starc007/ui-components) 的完整 Next.js / Bun 源码为基础，提供 Asharca 风格的 **Workspace Shell、Workspace Tab Bar 及其侧栏组合**，以及依据公开产品规范独立实现的 Web 组件、业务页面与完整应用。上游 MIT 许可和组件署名保留；不获取付费源码或叠加旧版 Vite/Registry 架构。

第三方依赖不自动适用本仓库的 MIT 许可。现有 `@paper-design/shaders-react` 使用 [PolyForm Shield 1.0.0](https://polyformproject.org/licenses/shield/1.0.0)，包含竞业限制及分发告知义务；发布组件库或商业分发前须核对用途是否获许可。公开预览可见不等于其源码、算法或素材可再分发。

## 本地调试

Node.js 24，Bun 1.3.14：

```bash
bun install --frozen-lockfile
bun run dev
```

打开 **http://localhost:3000/workspace**。

组件文档：`/components/blocks/workspace-shell`、`/components/blocks/workspace-tab-bar`。

需要预先编译整个主站、避免首次访问时开发编译，可运行：

```bash
bun run build
bun run start --port 3100
```

打开 **http://localhost:3100/components/motion**。修改源码后需重新构建并重启生产服务。构建使用 4 个 worker、每个 worker 同时预渲染一个页面，给含完整源码与 Props 文档的多变体页面最多 300 秒；同页重复源码复用高亮结果。四个 `templates/` 独立应用仍需单独运行，不合并到主站端口。

日期时间选择器：`/components/motion/date-time-picker`，源码为 `components/motion/date-time-picker.tsx`。`DateTimePicker` 接受 `value` / `defaultValue` / `onValueChange`，值为本地墙上时间 `YYYY-MM-DDTHH:mm`，不转换时区；`name` 可提交表单值。日历和时间先编辑草稿，点击 Confirm 才提交，Escape 或点击外部丢弃草稿，Now 仅将草稿设为本地当前时间。方向键移动日期，Page Up / Down 切换月份（Shift 切换年份）；减少动态效果时使用原生时间下拉框。

时间滚轮同时向辅助技术暴露当前选项和完整选项列表，键盘可用方向键及 Home / End 调整。

```bash
bun run check
bun test
(cd mcp && bun install --frozen-lockfile && bun run typecheck)
```

单独运行 lint：`bun run lint`。Biome 使用 `recommended` 规则集；formatter 当前禁用，`bun run check` 不检查格式。

代码校验 CI 继续只执行静态检查和测试。独立 Pages 发布流程在 `main` 更新后构建静态站点并自动部署；不启动开发/生产服务，也不运行浏览器或截图。

站点：[asharca.github.io/ui](https://asharca.github.io/ui/)。工作区：[Workspace](https://asharca.github.io/ui/workspace/)。静态发布与服务能力区别见 [Pages 部署说明](docs/pages-deployment.md)。

布局、组件属性、独立窗口、Registry 安装与部署说明见 [docs/workspace.md](docs/workspace.md)。原始 beUI 项目说明见 [README.beui.md](README.beui.md)。

## Web 目录与独立应用

完整范围见 [Web 公开目录实现清单](docs/web-pro-catalog-plan.md)：132 个家族、358 项变体或模板。其中 128 个家族、354 项变体进入现有组件文档、Preview、可复制 Usage 和 Registry；4 个多页面应用从 `/templates` 浏览源码与运行说明。

视觉与交互以 Pro 公开演示为对照目标，保留本仓库品牌并使用合法素材；功能覆盖数量不代表已通过 1:1 验收。逐项验收边界与差异见上述实现清单。

| 独立工程 | 主要工作流 |
| --- | --- |
| [`templates/workflow-studio`](templates/workflow-studio) | 工作流画布、步骤执行、Agent、知识库与运行记录 |
| [`templates/forecast-community`](templates/forecast-community) | 市场发现、模拟买卖、奖励、排名、持仓与草稿 |
| [`templates/asset-workspace`](templates/asset-workspace) | 资产、钱包、模拟换币/质押、关注与助手 |
| [`templates/assistant-workspace`](templates/assistant-workspace) | 多会话、项目、知识与附件、归档和集成 |

在源码根目录安装依赖后，可单独启动任意工程，例如 `bun run --cwd templates/workflow-studio dev`。各目录也可独立复制、安装和运行，包含自己的配置、主题、依赖源码、MIT 许可与 README；`bun run check:templates` 校验四个工程，且已纳入 `bun run check`。

组件业务操作通过宿主回调接入；完整应用明确标注浏览器本地演示。真实认证、模型、支付、链上交易与远端执行仍需接入自己的服务。DOM 交互验证不等于浏览器视觉、真实设备或生产构建验收。

文件工作区的 `WorkspaceFile.captions` 可提供真实 WebVTT 轨道：`{ src, srcLang, label, default? }[]`，用于音频或视频；字幕 URL 及跨域可访问性由宿主负责。没有字幕数据时仍保留媒体播放，不生成空字幕或虚构转写。


## 源码与历史

上游固定提交：`starc007/ui-components@1e23f4b10a404c17d9649086cf561e152527e2de`。

保留当前 GitHub 仓库身份，采用上游源码树重建；这**没有建立 GitHub 原生的 fork-network 关系**。重建前主分支与 Agent 迁移分别保留为：

- `archive/pre-beui-rebuild-main-2026-09-24`
- `archive/pre-beui-rebuild-agents-2026-09-24`

细节见 [UPSTREAM.md](UPSTREAM.md)。不继承 beUI 的线上部署凭据或统计脚本，发布流程只部署当前仓库的 GitHub Pages。工作区示例是本地状态演示，不连接真实模型或 MCP 服务。

## 本仓库的 beUI Skill

从默认分支安装：

```bash
npx skills add asharca/ui --skill beui
```

也可以从本地源码目录安装（在业务项目中执行，替换实际路径）：

```bash
npx skills add /实际路径/asharca-ui-source/skills/beui --skill beui
```

Skill 保留 `beui` 安装名，在官方组件的正常使用说明上，补充 **Workspace Shell、
Workspace Sidebar 和 Workspace Tab Bar** 的安装、API 与组合示例。
官方组件继续使用 `@beui/...` 和官方文档，可以与自定义组件自由组合；
Skill 不设置禁止使用官方组件或强制判断组件归属的规则，也不要求部署网站或 MCP。

在已下载的源码根目录，可导出自定义组件的完整安装 JSON：

```bash
bun install --frozen-lockfile
bun scripts/export-component.ts workspace-shell --out /绝对路径/新目录/workspace-shell.json
```

然后在业务项目中，先用 `shadcn add` 加该 JSON 的 `--dry-run` / `--diff`
检查文件与共享依赖，再确认安装，保留现有主题和业务定制。
导出不启动站点；下载源码和包仍可能需要联网。

自定义组件索引：[source-policy.json](skills/beui/source-policy.json)，仅供源码导出和
查阅，不作为官方组件的使用限制。完整安装与组合示例见
[Skill 工作区说明](skills/beui/references/workspace.md)。
