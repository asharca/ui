# Asharca Workspace · based on beUI

项目仓库：[asharca/ui](https://github.com/asharca/ui)。项目链接、Star 统计和 Skill 安装均使用此仓库；上游来源与 MIT 署名另行保留。

以 [beUI](https://github.com/starc007/ui-components) 的完整 Next.js / Bun 源码为基础，仅增加 Asharca 风格的 **Workspace Shell、Workspace Tab Bar 及其侧栏组合**。上游 MIT 许可和组件实现保留，不再叠加旧版 Vite/Registry 或复制 Agent 组件的架构。

## 本地调试

Node.js 24，Bun 1.3.14：

```bash
bun install --frozen-lockfile
bun run dev
```

打开 **http://localhost:3000/workspace**。

组件文档：`/components/blocks/workspace-shell`、`/components/blocks/workspace-tab-bar`。

```bash
bun run check
bun test
(cd mcp && bun install --frozen-lockfile && bun run typecheck)
```

默认 CI 只执行静态检查和代码测试，不启动站点、生产构建或浏览器，也不截图。浏览器回归脚本保留，仅在明确需要时手动执行。

布局、组件属性、独立窗口、Registry 安装与部署说明见 [docs/workspace.md](docs/workspace.md)。原始 beUI 项目说明见 [README.beui.md](README.beui.md)。

## 源码与历史

上游固定提交：`starc007/ui-components@1e23f4b10a404c17d9649086cf561e152527e2de`。

保留当前 GitHub 仓库身份，采用上游源码树重建；这**没有建立 GitHub 原生的 fork-network 关系**。重建前主分支与 Agent 迁移分别保留为：

- `archive/pre-beui-rebuild-main-2026-09-24`
- `archive/pre-beui-rebuild-agents-2026-09-24`

细节见 [UPSTREAM.md](UPSTREAM.md)。不继承 beUI 的线上部署凭据或统计脚本，当前 CI 只验证，不自动部署。工作区示例是本地状态演示，不连接真实模型或 MCP 服务。

## 本仓库的 beUI Skill

合并到默认分支后，可直接安装：

```bash
npx skills add asharca/ui --skill beui
```

合并前，从当前分支的本地源码目录安装（在业务项目中执行，替换实际路径）：

```bash
npx skills add /实际路径/asharca-ui-source/skills/beui --skill beui
```

Skill 保留 `beui` 安装名，但采用双来源策略：**未修改组件沿用官方
`@beui/...` 安装和使用方式；新增或修改组件使用 asharca/ui 的源码及接口**。
已有业务定制优先保留，不用上游同名组件覆盖。Skill 本身不要求部署网站或 MCP。

在已下载的当前分支源码根目录，可导出自有组件的完整安装 JSON：

```bash
bun install --frozen-lockfile
bun scripts/export-component.ts workspace-shell --out /绝对路径/新目录/workspace-shell.json
```

然后在业务项目中，先用 `shadcn add` 加该 JSON 的 `--dry-run` / `--diff`
检查所有文件和共享依赖，再确认安装。导出不启动站点；下载源码和包仍可能需要联网。

来源清单：[source-policy.json](skills/beui/source-policy.json)。完整安装、组合、
更新和手动复制说明：[Skill 本地参考](skills/beui/references/workspace.md)。
