# Asharca UI

简约的 React 组件源码。预览、安装，然后在自己的项目中修改。

[组件网站](https://asharca.github.io/ui/) · [安装指南](https://asharca.github.io/ui/docs/installation/) · [llms.txt](https://asharca.github.io/ui/llms.txt)

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

安装路径遵循 `components.json` 的 `aliases.components`，上面的 `@/` 是常用示例别名。每个安装条目包含完整的关联文件和所需依赖，不覆盖已有主题。组件页面提供同源的 CLI、手动安装、用法和源码。

> 以上线上入口须在本次重写合并并部署后使用；PR 构建只生成预览产物，不会自动发布。

## 组件

基础组件：Button、Input、Checkbox、Radio Group、Switch、Select、Tabs、Accordion、Badge。

浮层组件：Dialog、Popover、Tooltip。

AI 组件：Prompt Input、Message、Tool Result、Approval Card、Chat Panel。

AI 组件仅负责界面和交互。模型调用、流式状态、鉴权、持久化和权限校验由宿主应用提供。网站中的对话与工具操作是明确标注的本地演示。

## 开发

Node.js 24，pnpm 10。这个仓库是私有发布标记的站点工程，不发布组件包。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test:consumer
pnpm exec playwright install chromium
pnpm test:browser
```

`pnpm build` 生成站点、静态页面入口、registry JSON 和单一 UTF-8 `llms.txt`。浏览器测试在已构建站点上运行。消费项目测试使用真正的 shadcn CLI，分别验证标准路径和自定义别名，不是迁移工具。

```text
registry/ui/          可直接安装的组件源码
registry/catalog.mjs  唯一组件目录与依赖图
examples/            网站预览及 Usage 的同一份代码
site/                展示站布局与文档界面
scripts/             构建及验证
public/              静态资源与生成的 registry、llms.txt
```

没有兼容包、旧界面、主题实验室、迁移脚本或 Skill 安装流程。公共 AI 文档只有站点的 `llms.txt`，由真实安装清单生成。

## 部署

GitHub 项目 Pages 使用：

```sh
SITE_URL=https://asharca.github.io/ui/ BASE_PATH=/ui/ pnpm build
```

自定义域名使用站点根路径：

```sh
SITE_URL=https://your-domain.example/ BASE_PATH=/ pnpm build
```

部署 `dist/`。每个文档路由有独立 HTML 入口，可直接打开和刷新；registry 与 `llms.txt` 是静态文件，不经过 SPA HTML 回退。`SITE_URL` 必须是对外可访问的完整站点地址。安装命令在浏览器中根据当前站点地址生成，不依赖硬编码的开发端口。

## 设计与许可

展示结构、克制的视觉语言和组件交互参考 [beUI](https://beui.dev/)，保留本项目品牌与独立实现；不包含对方的商业推广或用户评价。

MIT License。参考来源与许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
