# beUI Agent 组件迁移

本次将 beUI 官方 AI Agents 分类的 **17 项公开 MIT 组件**及其必要的内部依赖移植到 Asharca 源码 Registry。固定来源是 `starc007/ui-components` 的 `1e23f4b10a404c17d9649086cf561e152527e2de`，不是运行时从上游加载，也不包含 beUI Pro 素材。

原有 62 项入口和组件文件保留，新目录合计 79 项。新组件的 Registry 文件名统一为 `agent-*`；其公开导出名沿用上游，实际 API 以各组件页自动生成的 API Reference 为准。

## 17 项对应关系

| beUI 分类 | Asharca 安装名 | 主要能力 |
| --- | --- | --- |
| Message Bubble | `agent-message-bubble` | 气泡层次、对齐、分组、可折叠长正文 |
| Message | `agent-message` | 用户/助手消息、头像、元信息与消息分组 |
| Message Scroller | `agent-message-scroller` | 跟随新回复和保留读者滚动位置 |
| Prompt Input | `agent-prompt-input` | 输入自增高、模型选择、附件动作、提交与停止 |
| Todo List | `agent-todo-list` | 任务状态、计数、列表更新与折叠 |
| Code Block | `agent-code-block` | 流式代码、行号、高亮和复制 |
| Approval Card | `agent-approval-card` | 审核、选择题、自定义回答、多步骤确认 |
| File Diff | `agent-file-diff` | 文件差异、增删统计、逐行显示与复制 |
| Tool Result | `agent-tool-result` | 工具执行状态、输出折叠和复制 |
| Streaming Response | `agent-streaming-response` | 流式正文容器、反馈、重试与来源 |
| Image Generation | `agent-image-generation` | 排队/生成/完成/错误的图像展示容器 |
| Tool Approval | `agent-tool-approval` | 允许一次、记住权限或拒绝的界面 |
| Citations | `agent-citations` | 正文引用标记与来源列表 |
| Agent Activity | `agent-activity` | 步骤、文本、搜索、工具、执行轨迹 |
| Agent Loading States | `agent-loading-states` | 思考微光、轮换提示、计时进度 |
| AI Sidebar | `agent-sidebar` | 资源树、会话/项目布局、重命名和重排 |
| Chat App | `agent-chat-app` | 响应式聊天外壳与侧栏组合 |

## 使用与共存

这些新地址在分支合并并完成网站部署前不会出现在公开安装源。发布后，在配置好的业务项目中安装，例如：

```bash
npx shadcn@latest add https://asharca.github.io/ui/r/agent-chat-app.json
npx shadcn@latest add https://asharca.github.io/ui/r/agent-approval-card.json
```

命名空间 `@asharca` 配置方法见安装指南，不要求同时安装 beUI。自动安装带入完整内部依赖，不手工复制单个文件。按实际 `components.json` 别名导入：

```tsx
import { Message as AgentMessage } from '@/components/asharca/agent-message';
import { Message } from '@/components/asharca/message';
import { PromptInput as AgentPromptInput } from '@/components/asharca/agent-prompt-input';
```

它们是并存的组件 API，不是同名兼容替换。原有 `ChatThread`、`SafeStreamdown` 的表格/Mermaid、DataTable 选中表头、WorkspaceShell 以及侧栏折叠逻辑保持；新 `StreamingResponse` 可组合 `SafeStreamdown` 显示富文本，完整 Chat App 示例演示了这一组合。

同一项目可以保留直接安装的 beUI，但请使用各自独立的安装目录与命名空间，别把同名源文件或全局主题相互覆盖。新组件自有动画名称使用 `asharca-agent-*` 前缀；快捷键限制在本组件外壳内。React/Tailwind/Motion 等依赖仍需满足双方版本要求，不保证任意旧版组合无需测试。

## 本地下游适配

从固定快照读取源码，递归识别本地依赖，保留全部组件实现及动画，不引入 Next.js、旧 npm UI 包或新的模型运行时。依赖文件平铺为 `agent-internal-*`，它们是安装时的实现细节，不加入公开组件列表。每个移植文件都携带完整上游 MIT 许可及来源路径；源文件 SHA-256 和本次适配后的 SHA-256 位于 `beui-agent-manifest.json`，后者描述迁移快照，并不禁止后续有意修改。

交互适配包含：

- 异步发送完成后才清理未受控草稿，失败保留内容并显示错误；阻止重复提交、只读提交与中文输入法组合状态误提交；受控值继续由宿主管理。
- 代码、差异、工具输出和回复的复制失败显示错误，不把权限拒绝显示成复制成功。
- Shiki 高亮失败时保留原始代码；限制流式片段缓存数量。暂停/恢复进度不会从初始时间重置。
- 引用和搜索结果只接受 HTTP/HTTPS 或安全相对链接；不为模型提供的 URL 自动发送 favicon 请求。调用方传入 ReactNode、图片或自定义渲染器时，其内容和资源安全仍由调用方负责。
- 快捷键只处理焦点所在的 Agent 外壳，避免同页两个侧栏或直接安装的 beUI 同时响应。
- 使用项目已有主题变量，不复制上游全局 reset/主题；内部样式和图标仍可在源码中定制。

组件默认文案主要沿用上游英文，示例说明与部分演示按钮为中文。需要完整国际化时，在源文件或支持的 label 属性中设置业务文案。

## 业务和安全边界

所有示例只操作本地状态，不调用真实 AI、终端、文件服务，也不授予实际权限。工具审批的鉴权、许可持久化、操作确认、结果与错误状态由业务端提供；点击“允许”不是后端授权。Activity 的文本内容由宿主提供，应展示适合用户阅读的执行摘要，而不是自动暴露敏感原始日志。

Image Generation 负责生成状态和传入成品的展示；示例里的彩色面板明确是本地视觉占位，不是模型生成图片。Code Block 的动画不是执行代码。文中“全部”指上述固定快照的公开 17 项及本地依赖，不包括 Pro、OpenUI 运行时、未来新增分类或整个 beUI 网站。

更新请遵循 `docs/updating.md`：预览所有关联文件差异后再合并，尤其不要只更新 public 文件而遗漏内部依赖。原有简易 Button 等组件不安装 Shiki/Agent 依赖；只有依赖这些功能的条目才包含它们。

## 分支与追溯

工作分支：`feat/beui-agent-components`；基线 main：`d40773d2c39ddf8b216b9d0851f80eb192b7fc09`。按要求删除 19 个旧分支前，已分别创建 `archive/2026-09-24/<原分支名>` 标签，详见 `branch-archive-2026-09-24.json`。保留 main 和新工作分支，没有覆盖 main，也没有删除原提交历史。

## 验证入口

```bash
pnpm check
pnpm test:consumer
pnpm test:browser
```

目录测试独立核对 17 项覆盖和逐文件 MIT 许可；原有目录、依赖闭包、安装路径和组件交互回归保留。新增测试覆盖发送失败、中文输入法、受控状态、复制失败、审批、引用协议、计时暂停恢复、资源树、滚动及手机布局。最终是否通过以本次提交的实际 CI 为准，截图用于视觉审查而非像素基线断言。

来源： https://beui.dev/components/agents · https://github.com/starc007/ui-components
