# ToolPlane 富文本展示与 beUI 侧栏选中动画

本轮继续 PR #18：DataTable 的选中表头保留；改变的是消息正文里的 Markdown 表格、Mermaid 操作区，以及侧栏选中背景。仍然使用现有 ReactMarkdown + GFM 和显式启用的 Mermaid，不重新依赖旧版 @asharca/ui，不迁移 ToolPlane 的业务代码。

## 源码参考

- ToolPlane `src/components/dashboard/MermaidAssistantMarkdown.tsx`，blob `223d15e192f0521daf0fb5d68abba90e8b8fdb6a`：其 Mermaid 来源是 Streamdown 插件，strict 配置。
- ToolPlane `src/components/dashboard/ConversationMessage.tsx`，blob `8e53a6f1f2a7b788c74b26be226d9b4c0bf508fb`：紧凑正文、按内容加载 Mermaid，以及受约束的消息宽度。
- Streamdown `packages/streamdown/lib/table/index.tsx`，blob `ae4a9ee7e8552fe98889ef6d8254f0c31c8e82ea`：工具区与独立内嵌表格的层次、复制/导出/展开。
- Streamdown `packages/streamdown/lib/mermaid/index.tsx`，blob `dad1230a388568a761d34e5ad199bc29802bb119`：适应画布、平移、缩放与展开的展示方向。这里没有照搬上游向宿主 DOM 注入 SVG 的做法。
- beUI `components/motion/animated-sidebar.tsx`，blob `2a990c90cf979b23b51a0a4cc1193141fbbb2a9c`：共享 layoutId 的选中背景。
- beUI `components/motion/shared-layout-bg.tsx`，blob `eb9dcec399430eddea0521f0801715251cd1f00c`：每个列表独立标识及滚动祖先的布局范围。

原 beUI MIT notice 继续保留。参考仅用于展示和交互设计，不复制品牌、商业素材或用户评价。

## Markdown 表格

表格使用紧凑图标工具栏、浅底色外壳与独立滚动的内嵌表格。保留原生 table、表头、GFM 对齐与文本选择。窄屏优先横向滚动，不把短列标题和姓名挤成多行。复制读取实际单元格并输出制表符分隔文本，公式样式内容作为文本粘贴；CSV 导出带 UTF-8 BOM、正确引用与公式起始字符保护。展开视图使用已有 Dialog，复制和导出继续可用；Escape 或关闭按钮关闭，焦点返回展开按钮。

## Mermaid 图表

顶部保留图表/源码切换与复制、导出 SVG、展开按钮；画布按可用宽高适配，普通视图高度随图表比例收敛在 224–384px，底部提供缩小、复位、放大。鼠标拖动平移，触屏保留原生滚动；画布聚焦时 + / - 缩放，0 复位。100% 指当前画布的适应比例，不是源 SVG 的一像素对应一屏幕像素。

展开视图复用已经清理好的静态图像，不再次调用 Mermaid 渲染器。下载内容也是同一份经过 DOMPurify 清理的 SVG。原有 allowMermaid 默认关闭、流式完成后才绘制、受限语法回退、主题切换和过期结果保护不变；这不是硬 CPU 隔离沙箱。

## 侧栏

官网文档导航、WorkspaceSidebar 和 ConversationSidebar 都使用移动的圆角背景标记选中项。文字与图标留在原位，activeId / activeConversationId 仍由宿主控制；悬停不改变选中状态。每个实例、桌面和手机导航的 layoutId 隔离。保留侧栏宽度/行高同步折叠、操作菜单、拖动重排、手机关闭与焦点逻辑；减少动态效果偏好下不做跨项移动。

## 更新与验证

SafeStreamdown 的 Registry 现在包含内部的 rich-content-view.tsx 及 Dialog 依赖闭包。更新不能只替换 safe-streamdown.tsx：按更新指南逐文件查看差异，保留本地定制。新增辅助文件不是新的公开组件入口，公开目录仍为 62 项。

新增测试覆盖实际复制/CSV 内容、展开焦点恢复、图表适配/平移/下载、侧栏动画中间帧、图标固定及减少动态效果。实际结果以本次提交的 CI 为准，录像用于视觉审查，不是像素基线测试。
