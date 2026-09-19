# Asharca UI — AI 使用指南

本文件面向在宿主项目中使用 `@asharca/ui` 的 AI 编程助手。修改组件库本身时另读仓库根目录的 AGENTS.md。

## 先确认版本和来源

以目标项目实际安装的 package.json、exports 和 TypeScript 声明为准。ChoiceField、ToolCallCard、ChartContainer 和可选主题属于 0.2.3 的发布范围，不要推断旧 npm 0.2.2 包含这些接口。发布状态以 npm 和 GitHub Release 为准。不要捏造不存在的组件或接口。

开发本仓库使用 Node 24 与 pnpm；消费项目遵守包的 engines/peerDependencies。主要环境是 React 19、React DOM 19 和 Tailwind CSS 4。当前聊天 peer 是 `@assistant-ui/react@^0.15.18`，适配器是 `@assistant-ui/react-streamdown@0.3.13`。已有锁定的 0.15.18 安装仍在兼容范围内；新安装使用本仓库验证的 0.15.20，以对齐上游 core/cloud 依赖。保持严格检查，报告真实错误，不要通过 override 或关闭 peer 检查隐藏问题。

## 安装与样式

```sh
pnpm add @asharca/ui
```

全局 Tailwind 样式中需要同时导入：

```css
@import "tailwindcss";
@import "@asharca/ui/styles.css";
```

这是 npm 分发的 React 组件库，不是 shadcn registry。不要生成 `shadcn add` 命令、components.json 注册表配置或不存在的 MCP 服务。不要从 `@/components/ui/*` 导入本库，除非宿主已经明确创建了这层适配。

## 选择真实的公开入口

```tsx
import { Button, Input, Checkbox, Radio, Switch } from '@asharca/ui/controls';
import { ChoiceField, ChoiceGroup } from '@asharca/ui/choice-field';
import { DataTable } from '@asharca/ui/layout';
import { ChatThread } from '@asharca/ui/chat-thread';
import { ToolCallCard } from '@asharca/ui/tool-call-card';
```

更多入口见 package.json。完整示例使用根入口以便复制；宿主可改成已公开的子路径。不要直接导入 dist 内部文件，也不要无依据地把整个包标记为客户端。

## 原生控件与事件

Checkbox / Radio 是原生 input：`onChange(event)`、`event.target.checked` 或 `event.target.value`。它们不是 Radix Checkbox，不能生成 `onCheckedChange` 或 `checked="indeterminate"`。Switch 才使用 `checked` 和 `onCheckedChange(boolean)`。

Input 和 Select 的视觉尺寸属性是 `controlSize`，Button 的是 `size`。Select / NativeSelect 为原生 select，不支持虚构的 SelectTrigger / SelectContent。需要定制搜索选择时使用宿主已有的真实组件。

ChoiceField 提供标签、描述、错误和整行点击；`type="radio"` 表示单选。`className` 与 ref 指向 input，`wrapperClassName` 指向选项行。说明与错误自动关联 aria-describedby，允许与外部 ID 合并。label / description 不要放嵌套按钮、链接或 label。ChoiceGroup 渲染原生 fieldset 和 legend。

同一组 Radio 使用相同 name，不同组使用不同 name。可用 useId 生成组名，避免页面上多个示例互相取消选中。不要通过空格、绝对定位或固定高度给选项对齐。

## 数据与业务边界

DataTable 的 `rowIds` 必须与当前渲染行顺序一致，使用稳定业务 ID，不要使用数组下标。排序、筛选和分页时设置 strictSelection。selectedRowIds 和回调由宿主控制；全选仅操作当前可见行。仅支持原生 tr、一个 tbody 和内部 Fragment，不能让自定义行组件被任意执行来猜测结构。

ChatThread 需要宿主提供 AssistantRuntime；传输、鉴权、模型调用、持久化、工具执行和权限校验均留在宿主。工具卡片上的“允许”仅发送宿主回调，不构成后端授权。不要自动批准工具，不要将 API key 放进浏览器代码。

ToolCallCard 的准备、运行、待审批、完成、失败、拒绝和取消状态必须反映真实宿主状态。失败不能显示为成功。数据量较大时保留预览限制；必要时提供自定义结果渲染或下载入口。

Dialog、菜单、Tabs 保留 Radix 的焦点与键盘交互，不要覆盖成无语义 div。图标按钮必须命名。移动导航使用可关闭、可恢复焦点的模态抽屉。

## 主题

颜色变量使用 HSL 通道值（如 `0 0% 12%`），而不是完整 hsl() 字符串。全局 `.dark` 切换默认暗色。局部主题不能自动跨越挂载到 body 的 Portal；必须明确 Portal 容器或全局变量。保留 focus-visible、forced-colors 和 prefers-reduced-motion 支持。

## 使用机器可读文档

文档站提供 llms.txt 索引、llms-full.txt 全量参考，以及 ai/components/<id>.md 独立页。独立页包含导入、主要属性、真实示例和边界说明，均从站点同一个已解析目录和 TSX 示例生成。

组件页面的“复制给 AI”提供该组件的 Markdown 上下文；不要把复制整个项目或隐私数据当作使用文档的前提。文档本身不携带任何用户数据或凭据。

### 直接打开文档时出现乱码

生成文件始终使用无 BOM 的 UTF-8。Vite 的开发服务与构建预览通过 `showcase/ai-docs-plugin.ts`，仅为生成的 AI 文档返回 `Content-Type: text/plain; charset=utf-8` 与 `X-Content-Type-Options: nosniff`，不改动 HTML、JavaScript、CSS 或图片的 MIME 类型。Markdown 保留原始文本，不转成 HTML，也不添加 meta 标签。

拉取修复后，停止旧的开发进程，执行 `pnpm docs:ai`，再执行 `pnpm dev`。检查实际启动端口；旧进程占用 5173 时，不要误访问旧服务。可以用以下命令核对响应头：

```sh
curl -I http://localhost:5173/llms.txt
curl -I http://localhost:5173/llms-full.txt
curl -I http://localhost:5173/ai/components/checkbox.md
```

部署 `showcase-dist` 到其他静态服务器或 CDN 时，Vite 插件不会在该服务器运行。需要为这些文本资源单独配置 UTF-8 Content-Type，并保留其他资源原本的 MIME 类型。修改响应头后清理代理/CDN 缓存，确认不存在文档返回 200 HTML 的 SPA 回退。不要把 `Content-Encoding` 设成 utf-8；该字段不是字符集声明。

`node scripts/check-ai-docs-http.mjs` 在构建后检查真实 Vite dev/preview 的根路径与 `/ui/` 子路径，校验响应头和原始字节。CI 的浏览器任务额外使用 `--browser` 检查地址栏直接访问的 `document.characterSet` 与中文正文，而不是只依赖 fetch().text() 或带预设 UTF-8 响应头的测试服务器。

## 生成代码后的检查

检查组件和属性存在；示例能够编译；导入了样式；受控值与回调匹配；控件有可访问名称；禁用项不能操作；长中文文字可以换行；在窄屏、深浅主题和键盘操作下验收。构建成功不等于视觉验收通过，也不等于服务端功能已经实现。


## DataTable 选中态表头（可选）

`selectionToolbar` 接收 ReactNode 或 `(selection: DataTableSelectionContext) => ReactNode`。
不传、null 或 false 时关闭；有效可交互选择且全部已选数量大于零时，操作组覆盖数据列表头。
原生 th 与全选框不会被替换，表头尺寸仍由原内容决定。`headers[].ariaLabel` 可为图标或复杂表头提供明确的列名。

```tsx
<DataTable
  label="项目列表"
  selectable strictSelection
  headers={[{ label: "项目" }]}
  rowIds={rows.map((row) => row.id)}
  selectedRowIds={selected}
  onSelectedRowIdsChange={setSelected}
  selectionToolbar={({ selectedRowIds, clearSelection }) => (
    <>
      <Button size="sm" onClick={() => archive([...selectedRowIds])}>归档</Button>
      <Button size="sm" variant="ghost" onClick={clearSelection}>取消选择</Button>
    </>
  )}
>
  {rows.map((row) => <tr key={row.id}><td>{row.name}</td></tr>)}
</DataTable>
```

上下文：`selectedRowIds` 为去重后的全部选择（含跨页/筛选隐藏项），`selectedVisibleRowIds` 仅含当前可见已选项，`selectedCount` 为去重总数，`clearSelection()` 清空全部选择。上下文数组为只读快照。全选框仍只切换当前可见行，跨页选中仍能显示操作组。
`selectionLabels.selectedCount(count)` 和 `selectionLabels.actions` 可定制计数文案与操作组名称。
使用小号按钮及菜单放置批量动作；操作组不参与表头高度计算，过多按钮在组内横向滚动。普通 Tab 导航保留；隐藏的一侧 inert，不会拦截点击或接收键盘焦点。操作移除自身选择后，仅在焦点仍属该操作区时返回全选框。
动画包含透明度与轻微纵向过渡，并尊重 reduced-motion。不得为表头切换重新渲染整个 table / thead、复制全选框或改变列跨度。
该接口以当前分支源码为准，发布前不要假设已有 npm 版本包含它。
