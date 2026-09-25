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

代码校验 CI 继续只执行静态检查和测试。独立 Pages 发布流程在 `main` 更新后构建静态站点并自动部署；不启动开发/生产服务，也不运行浏览器或截图。

站点：[asharca.github.io/ui](https://asharca.github.io/ui/)。工作区：[Workspace](https://asharca.github.io/ui/workspace/)。静态发布与服务能力区别见 [Pages 部署说明](docs/pages-deployment.md)。

布局、组件属性、独立窗口、Registry 安装与部署说明见 [docs/workspace.md](docs/workspace.md)。原始 beUI 项目说明见 [README.beui.md](README.beui.md)。

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
