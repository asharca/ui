# Asharca Workspace · based on beUI

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
bun run build
bunx playwright install chromium
bun run test:workspace:browser
```

布局、组件属性、独立窗口、Registry 安装与部署说明见 [docs/workspace.md](docs/workspace.md)。原始 beUI 项目说明见 [README.beui.md](README.beui.md)。

## 源码与历史

上游固定提交：`starc007/ui-components@1e23f4b10a404c17d9649086cf561e152527e2de`。

保留当前 GitHub 仓库身份，采用上游源码树重建；这**没有建立 GitHub 原生的 fork-network 关系**。重建前主分支与 Agent 迁移分别保留为：

- `archive/pre-beui-rebuild-main-2026-09-24`
- `archive/pre-beui-rebuild-agents-2026-09-24`

细节见 [UPSTREAM.md](UPSTREAM.md)。不继承 beUI 的线上部署凭据或统计脚本，当前 CI 只验证，不自动部署。工作区示例是本地状态演示，不连接真实模型或 MCP 服务。

## beUI 官方 Skill

```bash
npx skills add starc007/ui-components --skill beui
```

上游 Skill 提供 beUI 组件知识；新增工作区接口请同时阅读本仓库 docs/workspace.md。
