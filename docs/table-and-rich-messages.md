# 表头批量操作与富文本消息

## DataTable

默认 `selectionPresentation="header"`：选择任意行后，列标题在原有高度内淡出，已选数量、`selectionToolbar` 和清空操作在表头原位置进入。不增加一行工具栏，不改变列宽或滚动位置。保留全选本页，跨页及筛选外的选择仍计算在已选数量中。取消最后一项后恢复原列标题和排序状态。若正在操作栏中使用键盘，清空后焦点返回表头全选框；空页则返回表格区域。操作栏支持 Escape 清空。

`selectionToolbar={({ selectedIds, clearSelection }) => ...}` 的接口不变。批量操作的执行、权限、确认及错误反馈由宿主负责；组件不会执行默认删除。演示中的处理所选会实际更新本地行状态，导出仅导出本地选中 JSON。

需要选中时仍从列标题排序，或希望保留旧展示方式，设置 `selectionPresentation="toolbar"`。默认表头模式下列标题的交互暂时隐藏，清空选择后恢复。减少动态效果偏好下关闭位移和模糊过渡。

## 哪个组件展示用户输入和 AI 输出？

| 组件 | 职责 |
| --- | --- |
| ChatThread | 完整消息列表、用户/助手角色、编辑、工具、附件、输入区域 |
| ChatPanel | 轻量会话容器，接收 ReactNode 内容并管理跟随滚动 |
| Message | 单条用户/助手消息的布局和复制操作 |
| SafeStreamdown | Markdown 正文、GFM 表格和可选 Mermaid 图表 |
| PromptInput | 正在编辑的用户输入，提交、中文输入法和停止状态 |

完整对话使用 `ChatThread`，通过 `markdownOptions={{ allowMermaid: true }}` 开启图表。单独展示正文使用 `<SafeStreamdown allowMermaid>{markdown}</SafeStreamdown>`。`allowImages` 控制远程 Markdown 图片；与本地 Mermaid 渲染是两个独立选项，默认都关闭。

## Mermaid 边界

- Mermaid 12 与 DOMPurify 随包管理器安装，但只在启用并实际遇到静态 Mermaid 代码块时动态加载；不从 CDN 加载脚本，不向服务端发送对话。
- `mode="streaming"` 时保留图表源码并提示等待，整个回复转为 static 后再绘图，避免未闭合代码反复报错。
- 纯流程图、时序图、类图、状态图、ER、饼图、甘特图可以尝试渲染；不接收 frontmatter/init 配置、HTML 标签、click/link、外部资源或任意样式指令。超长内容和超过边数限制的图表回退源码。并非 Mermaid 所有扩展语法都被支持。
- 渲染使用 strict、关闭 HTML 标签，SVG 再经 DOMPurify 处理，以静态 SVG 图片展示而非注入交互 SVG；不会调用 bindFunctions。脚本、图内链接、远程图片不可用。宿主 CSP 需要允许本地打包模块及 `img-src data:`；更严格策略下仍可查看源码。
- 图表提供源码切换、复制、缩放及错误回退。读取 `.dark` / `data-theme="dark"` 祖先，或显式设置 `mermaidTheme="light"/"dark"`。主题切换时重新渲染，异步过期结果不会覆盖新内容。
- Mermaid 的执行仍在浏览器主线程，文本和边数限制不是硬 CPU 超时或安全隔离沙箱；高风险不可信来源可保持默认关闭，由应用选择隔离渲染方案。
- Mermaid 12 发布包面向现代浏览器（上游列出的 Safari 17.4+）；业务项目应验证自己的构建目标和运行环境。已有普通 Markdown 用法保持不变。

## 参考

- https://tanstack.com/table/v8/docs/guide/row-selection
- https://motion.dev/docs/react-animate-presence
- https://mermaid.ai/open-source/config/usage.html
- https://github.com/cure53/DOMPurify
- beUI `components/motion/table/table-header.tsx`、`components/motion/table/index.tsx` 的原生表格/选择/动效分层作为设计参考；保留现有第三方 MIT notice。
