# GitHub Pages 发布

当前站点地址为 `https://asharca.github.io/ui/`，工作区为 `/ui/workspace/`。
仓库地址相同不代表页面没有更新；`build-info.json` 记录本次发布的提交。

## 发布流程

`.github/workflows/pages.yml` 在 main 更新或手动触发时执行代码检查、测试、
静态构建与产物校验，通过后使用 GitHub Pages artifact 部署。发布后用 HTTP
验证真实提交、工作区、Markdown、Registry 和 llms.txt。构建失败不会替换线上站点。
涉及发布适配器的 PR 会构建验证，但不会部署到生产。

现有代码校验 CI 继续保留，不启动 Next 开发/生产服务、浏览器或截图。部署本身
需要生产构建；这与交互式运行项目不同。

## 静态适配

`bun scripts/build-pages.ts` 复制当前站点到临时目录，以 `output: export`、
`basePath: /ui`、尾斜杠和不依赖服务器的图片方式生成 `out/`。
源码组件、Next.js 服务端配置、Cloudflare 和 MCP 原实现不被修改。
只在临时目录适配资源路径、原生链接、复制 Markdown 的请求、独立窗口路径、
请求查询参数与静态 API 数据。组件 Registry 中仍提供原始可复用组件源码。

构建时从真实源码图生成完整安装 JSON、API 属性和 Markdown，不依赖旧站或
上游站点提供自有组件。正式地址通过构建环境 `NEXT_PUBLIC_SITE_URL` 设置，
Pages 工作流明确设置为 `https://asharca.github.io/ui`，所以工作区文档不会指向 localhost。

## 地址

- `/ui/llms.txt`：组件与文档索引。
- `/ui/r/index.json`：数据目录；`/ui/r/registry.json`：shadcn 目录。
- `/ui/r/{slug}.json`：自包含组件安装项，CLI 安装方式不变。
- `/ui/r/{slug}/detail.json`：组件详情；`/ui/r/{slug}/raw.txt`：主文件源码。
- `/ui/components/{category}/{slug}.md`：组件 Markdown；图表使用 `/ui/charts/{slug}.md`。
- `/ui/docs/{slug}.md`：已声明的 Agent、Motion 与 OpenUI 指南。

静态站点没有运行时重写；JSON 与纯文本详情使用明确扩展名。生成的目录和
文档链接同步使用静态地址。原本的 Next.js 服务端部署仍支持其原有接口。

## 服务能力

Pages 不运行 MCP、服务端统计和动态 OG 接口。MCP 仍需独立运行；Skill 和本地
组件导出无需 MCP。GitHub 星标数在构建时获取，失败时隐藏数值而保留仓库链接；
分享图使用静态标识图片。组件内部的客户端交互、主题和工作区本地状态仍保留。

部署需要仓库 Pages 的发布来源为 GitHub Actions，并允许工作流获得 pages:write
和 id-token:write；部署环境遵守仓库已有保护规则，不绕过保护。
