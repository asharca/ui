# Asharca UI

简约的 React 组件源码。预览、安装，然后在自己的项目中修改。

[组件网站](https://asharca.github.io/ui/) · [安装指南](https://asharca.github.io/ui/docs/installation/) · [更新指南](https://asharca.github.io/ui/docs/updating/) · [llms.txt](https://asharca.github.io/ui/llms.txt)

## 使用

需要 React 19、TypeScript、Tailwind CSS 4，以及已初始化的 shadcn 项目。

```sh
npx shadcn@latest init
npx shadcn@latest add https://asharca.github.io/ui/r/button.json
```

```tsx
import { Button } from "@/components/asharca/button";

export function Example() {
  return <Button>开始使用</Button>;
}
```

安装路径遵循 `components.json` 的 `aliases.components`，上面的 `@/` 是示例别名。每个安装条目包含完整的关联文件和所需依赖，不覆盖已有主题。组件页面提供同源的 CLI、手动安装、用法和源码。

分支新加入的组件需要合并并部署后才会出现在上述线上安装源；PR 构建不会自动部署。

## 更新已安装的组件

源码属于业务项目，升级 Motion、Radix 等 npm 依赖不会自动更新本地组件的样式、布局或动画。`shadcn@latest` 是 CLI 版本，不是 Asharca 组件版本。

先保存现有工作、确认工作区干净，在**业务项目中**创建更新分支。已有 `components.json` 不要重新初始化，不要为了更新组件重置主题或切换预设。

```sh
git status --short
git switch -c chore/update-asharca-ui
git rev-parse HEAD

npx shadcn@latest add https://asharca.github.io/ui/r/button.json --dry-run
npx shadcn@latest add https://asharca.github.io/ui/r/button.json --diff button.tsx
npx shadcn@latest add https://asharca.github.io/ui/r/button.json --diff utils.ts
npx shadcn@latest add https://asharca.github.io/ui/r/button.json --view button.tsx
```

根据项目包管理器，也可用 `pnpm dlx shadcn@latest`、现代 Yarn 的 `yarn dlx shadcn@latest` 或 `bunx --bun shadcn@latest`。配置过 `registries.@asharca` 后可将完整 URL 换成 `@asharca/button`；不要省略来源写成官方的 `add button`。

**检查整个依赖闭包，而不只看一个组件文件。** Button 包含 `utils.ts`，WorkspaceShell 包含侧栏、标签栏及其关联组件。限定 `--diff` 的文件，不会限定随后安装的覆盖范围。

有定制时，逐文件合并上游变更，保留业务 API、事件、状态、主题和布局；没有基线或冲突无法确定时，先人工确认。只有确认完整影响范围都可以覆盖、并获得明确许可后，才使用 `add <同一条目地址> --overwrite`。它是覆盖，不是自动合并，不应出现在默认更新命令中。

检查 `package.json`、锁文件与新增文件，运行业务项目已有的类型检查、测试和构建，保留独立更新提交。回退时同时考虑源码、依赖和锁文件，避免丢弃其他业务修改。当前 HTTP Registry 跟随部署变化，不提供不可变版本快照；请保留安装后的源码及锁文件以便复现。

[完整更新指南](https://asharca.github.io/ui/docs/updating/)包括无定制更新、保留定制、可复制的 Agent 提示词、验证、回退和常见问题。网页与导出的 Markdown 来自同一份 `docs/updating.md` 模板，构建时解析安装源。工具行为参考 [官方 CLI](https://ui.shadcn.com/docs/cli) 和 [官方更新工作流](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md#updating-components)。

## 组件

当前目录包含 **79 项**：恢复重写前全部 55 项组件入口，保留源码站新增的 6 项组件，并新增 WorkspaceShell 与 17 项 beUI Agent 组件。组件统一使用当前的中性色、圆角、边框与交互风格，不加载旧展示站样式。

| 分类 | 数量 | 内容 |
| --- | ---: | --- |
| 基础组件 | 14 | 按钮、图标按钮、输入、多行输入、搜索、单选、多选、选项卡片、开关、选择器、滑块、Tabs、Accordion |
| 表单与反馈 | 10 | Field、提交与确认提交、复制、徽标、状态徽标、Alert、进度、Skeleton、Spinner |
| 数据与布局 | 12 | Card、Page、Section、Panel、Toolbar、EmptyState、Entity、Avatar、DataTable、ChartContainer、ContentPage、RotatingHeadline |
| 导航与浮层 | 10 | NavigationTabs、Chip、Breadcrumbs、Pagination、Dialog、DropdownMenu、ContextMenu、HoverCard、Popover、Tooltip |
| AI 组件 | 28 | PromptInput、Message、ToolResult、ApprovalCard、ChatPanel、SafeStreamdown、ToolCallCard、ChatComposerToolbar、ConversationSidebar、ChatShell、ChatThread |
| 工作区 | 5 | WorkspaceShell、WorkspaceTabBar、WorkspaceSidebar、SidebarActionRail、ToolPlaneLogo |

表格、图表、聊天与工作区使用适合复杂内容的宽画布；预览和安装源码一致，Usage 读取实际示例。

WorkspaceShell 提供 ToolPlane 式内嵌布局：侧栏与外壳共享底色，活动标签与圆角正文同色衔接，无贯穿式分隔线。搭配 WorkspaceSidebar / WorkspaceTabBar 的 `variant="inset"`，现有默认外观不变。外层需明确高度；`scroll="content"` 只滚动正文，`scroll="none"` 由子区域管理滚动。支持固定标题、底部、移动导航入口与可访问性关联，路由和状态仍由应用管理。`--workspace-shell-background`、`--workspace-surface`、`--workspace-gap`、`--workspace-radius` 可局部自定义，不改写全局主题。安装 `workspace-shell` 会包含侧栏、标签栏及其依赖，示例含完整工作台和不带标签栏的轻量消息布局。

DataTable 通过 TanStack Table 提供排序、搜索、分页和稳定 ID 选择。ChartContainer 可组合 Recharts 的图表、提示和图例。这些依赖只进入需要它们的安装条目，不随 Button 等基础组件安装。

AI 组件仅负责界面和交互。模型调用、流式状态、鉴权、持久化和权限校验由宿主应用提供。完整聊天组件恢复工具记录、审批、思考折叠、附件、编辑、重新生成和分支回调；网页示例均为本地模拟，不执行真实工具。

SafeStreamdown 保留原来的组件名称，源码版使用 react-markdown + GFM 重新实现，默认忽略原始 HTML，图片须显式启用。恢复的是原有组件能力和目录入口，不是旧 npm 包的 API 兼容层。

## 开发

Node.js 24，pnpm 10。仓库保留 `private: true`，仅维护网站与源码安装清单，不发布组件包。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test:consumer
pnpm exec playwright install chromium
pnpm test:browser
```

`pnpm build` 生成站点、静态路由、registry JSON 和单一 UTF-8 `llms.txt`。浏览器测试在已构建站点上运行。消费项目测试使用真实 shadcn CLI，验证标准目录、自定义别名，以及更新预览不写入项目文件；不是自动迁移工具。

```text
registry/ui/          可直接安装的组件源码
registry/catalog.mjs  唯一组件目录与依赖图
examples/            网站预览及 Usage 的同一份代码
docs/updating.md      官网与 Markdown 同源的更新指南模板
site/                展示站布局与文档界面
scripts/             构建及验证
public/              静态资源及生成的 registry、llms.txt
```

`tests/restored-inventory.test.mjs` 保存重写前的独立 55 项目录基线，防止后续整理时误删组件；同时检查每个 Usage 引用的本地文件与外部依赖都包含在安装清单里。

不提供兼容包、旧界面、主题实验室、迁移脚本或自有 Skill 安装流程。公共 AI 文档仅有 `llms.txt` 作为入口，更新指南是其索引的页面文档。

## 部署

GitHub 项目 Pages：

```sh
SITE_URL=https://asharca.github.io/ui/ BASE_PATH=/ui/ pnpm build
```

自定义域名：

```sh
SITE_URL=https://your-domain.example/ BASE_PATH=/ pnpm build
```

部署 `dist/`。每个文档路由有独立 HTML 入口，可直接打开和刷新；registry 与 `llms.txt` 是静态文件，不经过 SPA HTML 回退。`SITE_URL` 是对外可访问的完整地址；浏览器中的安装和更新命令根据当前站点生成。

## 设计与许可

展示结构、克制的视觉语言和组件交互参考 [beUI](https://beui.dev/)，保留本项目品牌与独立实现，不包含对方的商业推广或用户评价。

MIT License。参考来源与许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 表头批量操作与富文本消息

DataTable 默认勾选后在表头原位置展示数量和批量操作，取消选择后恢复；selectionToolbar 接口不变，selectionPresentation="toolbar" 可保留旧展示方式。

用户输入与 AI 输出的完整组件是 ChatThread，正文渲染是 SafeStreamdown，输入编辑器是 PromptInput。正文支持 GFM 表格；通过 SafeStreamdown 的 allowMermaid 或 ChatThread 的 markdownOptions={{ allowMermaid: true }} 启用本地 Mermaid 图表。图表支持源码切换、复制、缩放和失败回退；流式回复结束后绘制。远程图片仍单独 opt-in。详情见 [设计与边界](docs/table-and-rich-messages.md)。

- [DataTable 演示](https://asharca.github.io/ui/components/data-table/)
- [完整富文本对话](https://asharca.github.io/ui/components/chat-thread/)
- [表格、流程图与时序图](https://asharca.github.io/ui/components/safe-streamdown/)


## beUI Agent 组件

已从固定的公开 MIT 快照适配全部 17 项 AI Agents 组件，使用独立 `agent-*` 入口，不替换现有聊天或审批 API。包含消息/输入/滚动、计划与代码、文件差异与工具结果、两类审批、来源、活动、加载、图像状态、资源侧栏和 Chat App。

[迁移清单与使用边界](docs/beui-agent-migration.md) · [逐文件源码出处](docs/beui-agent-manifest.json)

每项均提供预览、Usage、API 和 Registry 完整依赖。示例没有真实模型或工具执行；Image Generation 示例明确使用本地占位。新入口只有在合并及部署后才出现在公开站点。已经安装同名旧组件的项目请保留原导入，对新增导出使用 `as AgentMessage` 等别名。
