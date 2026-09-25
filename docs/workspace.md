# Workspace Shell 与 Tab Bar

本仓库现在以 beUI 的 Next.js / Bun 工程为基础，不再采用旧版 Vite 站点和扁平化 Registry。仅把 Asharca 原工作区的布局与标签行为适配为 beUI 组件组合。beUI 其他组件、示例和依赖图沿用上游结构；无需保留或安装旧版 `@asharca/ui`。

## 本地运行

使用 Node.js 24 与 Bun 1.3.14。安装 Bun 后：

```bash
git clone https://github.com/asharca/ui.git
cd ui
bun install --frozen-lockfile
bun run dev
```

在浏览器打开 `http://localhost:3000/workspace`。这是去除文档站点导航的独立演示页。

两个组件的文档页面是：

- `/components/blocks/workspace-shell`
- `/components/blocks/workspace-tab-bar`

已有旧工作目录时，先提交或备份本地改动，再执行：

```bash
git fetch origin
git switch main
git pull --ff-only
bun install --frozen-lockfile
bun run dev
```

旧的 `pnpm dev`、`registry/ui/*`、`examples/*` 和 Vite 端口说明不再适用。重建已经合并到 main，日常开发使用当前默认分支。

## 修改位置

| 路径 | 作用 |
| --- | --- |
| `components/workspace/workspace-shell.tsx` | 共享底色、内嵌圆角内容面板、标题/底部/移动入口及滚动槽位 |
| `components/workspace/workspace-sidebar.tsx` | 复用 beUI AnimatedSidebar 的工作区导航组合 |
| `components/workspace/workspace-tab-bar.tsx` | 与内容面板衔接的浏览器式标签栏 |
| `components/previews/blocks/workspace-shell.preview.tsx` | 可交互的演示状态、便签和独立窗口 |
| `components/previews/blocks/workspace-tab-bar.preview.tsx` | 单独标签栏示例 |
| `app/workspace/page.tsx` | 独立工作区路由 |

Shell 直接使用 beUI `AnimatedSidebarProvider`；侧栏使用其菜单、折叠和移动抽屉；标签操作使用 beUI `Button`、`ContextMenu`、`MorphPopover`。没有继续复制另一份 beUI 引擎，也没有把所有旧组件改名后塞入依赖目录。

## 布局与行为

Shell 默认共享 muted 底色和 12px 内容圆角。标签与正文使用相同的左右对齐线；首个标签激活时，对应的正文左上角取消圆角，使标签与面板连成一个面。侧栏展开 224px、收起 64px，可通过 provider 样式覆盖 `--sidebar-width` / `--sidebar-width-icon`。`--workspace-gap`、`--workspace-radius`、`--workspace-shell-background`、`--workspace-surface` 控制工作区外观。

`WorkspaceShell` 必须有明确的外部高度；全屏示例使用 `h-dvh`。`scroll="content"` 让内容独立滚动，`scroll="none"` 把滚动交给编辑器或聊天组件。标签激活状态、排序、数据和保存逻辑都由宿主控制。

`WorkspaceTabBar` 支持固定/取消固定、关闭、新建、拖动重排、中键关闭、可选双击关闭、方向键/Home/End/Delete，以及 Alt+方向键排序。重排不跨越固定分组，固定或不可关闭标签、最后一个标签不触发关闭回调。减少动态效果偏好下关闭跨标签的选中面移动。标签按钮与关闭/更多按钮是兄弟节点，不嵌套交互控件。

演示页把各面板保留在 DOM 中并使用 `hidden` / `inert` 切换；切换标签或折叠侧栏不丢失便签。未保存确认只是示例宿主行为，不在通用组件中弹出业务确认。

## 独立窗口

`onOpenInNewWindow` 只发出宿主回调；`openWorkspaceWindow` 辅助函数仅允许同源 HTTP(S) 地址，需在用户点击的同步回调中调用。被拦截时返回 `null`，不要移除原标签。

演示会清理子窗口自动继承的 sessionStorage，再写入当前标签的最小 `{id,title,note,version}` 快照；打开后清除 opener，刷新仍可恢复该快照。主窗口原标签保留。浏览器最终可能选择新标签页而不是独立窗口。不得直接复制认证凭据、整个应用 store 或敏感后台状态。

示例没有真实 MCP、模型调用、文件服务或用户管理，入口只用于展示 Shell、Tab Bar 与 beUI 的组合方式。

## Skill 与无需部署的源码安装

本仓库的 `skills/beui/SKILL.md` 保留 beUI 的正常安装与使用方式，补充自定义
Shell、Sidebar 和 Tab Bar 的 API、源码安装与组合示例。
官方组件可以照常使用，也可以放进工作区的内容和操作区域。
`skills/beui/source-policy.json` 是自定义组件导出的入口索引，不设置官方组件禁用规则。

不部署本站或 MCP 也能导出组件。在本仓库根目录执行：

```bash
bun install --frozen-lockfile
bun scripts/export-component.ts workspace-shell --out /绝对路径/新目录/workspace-shell.json
```

然后在已配置 shadcn 的业务项目里，先用同一本地 JSON 的 `--dry-run`、
`--diff` 检查文件和依赖，再执行安装。审查 `lib/utils`、`lib/ease`、
Motion 组件等共享文件的差异，保留业务定制及现有主题。
完整示例和手动复制方式见 [Skill 使用说明](../skills/beui/references/workspace.md)。
导出只生成源码 JSON，不启动 Next.js 或 MCP；下载源码和依赖可能仍需联网。

## Registry 安装（可选的服务方式）

本地服务启动后，在已初始化 shadcn 的消费项目中也可以安装：

```bash
npx shadcn@latest add http://localhost:3000/r/workspace-shell.json
npx shadcn@latest add http://localhost:3000/r/workspace-tab-bar.json
```

Registry 会解析 beUI 源码依赖并一并安装。这里的 `@beui/workspace-shell` **不是**官方 beUI 已发布的命名空间条目。部署自有域名时设置 `NEXT_PUBLIC_SITE_URL=https://你的域名` 后重新构建，工作区文档会使用自有 Registry 地址。原上游组件入口仍保留 `@beui` 官方地址。

Pages 发布完成后可直接使用：

```bash
npx shadcn@latest add https://asharca.github.io/ui/r/workspace-shell.json
npx shadcn@latest add https://asharca.github.io/ui/r/workspace-tab-bar.json
```

### llms.txt 中的工作区链接

这两个 Markdown 路径保持固定：

```text
/components/blocks/workspace-shell.md
/components/blocks/workspace-tab-bar.md
```

域名由 `lib/signature.ts` 的 `pageUrlFor()` 读取 `NEXT_PUBLIC_SITE_URL` 后拼接；
工作区条目未配置该变量时，回退到 `http://localhost:3000`。
**它不会根据访问者的域名、Host 请求头或部署平台自动切换地址。**

Pages 工作流明确设置：

```dotenv
NEXT_PUBLIC_SITE_URL=https://asharca.github.io/ui
```

`app/llms.txt/route.ts` 使用 `force-static`；
更换部署地址后需重新构建并部署，不能只给已生成的产物修改运行时环境变量。
这不影响无需站点的 Skill 和本地 JSON 导出。

这是项目基线更换，不承诺旧版 `@asharca` 的全部组件路径/API 不变；已安装在其他业务项目的旧源码不会自动被替换。先审查依赖和导入路径，不用全量覆盖升级旧项目。

## 验证与发布

日常代码检查不启动项目：

```bash
bun run check
bun test
(cd mcp && bun install --frozen-lockfile && bun run typecheck)
```

完整测试保留上游测试；其中联网测试需要访问 beui.dev。仅在明确要求浏览器验证时，再手动生产构建、安装 Chromium 并运行 `bun run test:workspace:browser`；这不是 Skill 安装或本地组件导出的前提。

旧 Vite 发布流程已替换为独立的 Next.js 静态 Pages 发布流程。`main` 更新后自动构建并部署到 `https://asharca.github.io/ui/`，包括工作区、组件文档、Markdown 和安装 JSON。该流程不启动服务或浏览器。普通 `bun run build` 仍保留 Next.js 服务端部署方式；Pages 与服务端能力区别见 [Pages 部署说明](pages-deployment.md)。
