import { useState } from "react";
import { HighlightedCode } from "./HighlightedCode";
import { ArrowRight } from "lucide-react";
import { Button, CopyButton, SearchInput } from "../src/index";
import { peerDependencies, version } from "../package.json";

const sections = [
  {
    id: "start",
    title: "安装与接入",
    keywords: "install css react tailwind runtime",
    paragraphs: [
      `本手册对应当前工作区版本 ${version}。React ${peerDependencies.react}、React DOM ${peerDependencies["react-dom"]}、Tailwind CSS ${peerDependencies.tailwindcss} 是宿主要求；assistant-ui 运行时固定为 ${peerDependencies["@assistant-ui/react"]}。`,
      "pnpm 默认会自动补齐缺少的 peer dependencies。若关闭了自动安装或遇到版本冲突，请查看安装页的依赖排查说明。",
      "在应用的全局样式入口导入下面的 CSS。组件包会通过 @source 扫描发布后的 dist 文件；只导入组件、不导入样式，会缺少工具类。交互组件需要运行在客户端。",
    ],
    snippets: [
      {
        label: "安装依赖",
        language: "shell",
        code: "pnpm add @asharca/ui",
      },
      {
        label: "全局样式",
        language: "css",
        code: '@import "tailwindcss";\n@import "@asharca/ui/styles.css";',
      },
    ],
  },
  {
    id: "workbench",
    title: "展示页操作",
    keywords: "侧边栏 tab 标签 新窗口 折叠 搜索",
    paragraphs: [
      "侧边栏可以折叠为图标，折叠偏好会保存在当前浏览器。手机上通过左上角菜单打开导航。分类页支持按组件名称搜索，示例中的代码可以查看和复制。",
      "点击分类优先切换到已有标签；没有对应标签时，替换当前未固定的标签，或在当前标签已固定时新增标签。固定与未固定标签分别支持拖动排序。最后一个标签不能关闭。",
      "点击标签的“在新窗口打开”，新窗口只初始化该标签，原窗口保持不变。项目、成员和聊天数据都是内存中的演示数据，刷新会重置；工具栏与侧边栏偏好除外。",
    ],
    snippets: [],
  },
  {
    id: "controls",
    title: "基础组件与表单",
    keywords: "button input switch slider accordion tabs avatar",
    paragraphs: [
      "轻量控件可以从 /controls 子路径导入。Button 支持 primary、secondary、outline、ghost、danger、danger-secondary，以及 sm / md / lg 尺寸。loading 时会阻止重复点击。",
      "输入框保留原生 value、onChange、disabled、ref 等属性。为输入框、图标按钮、滑块和开关提供可访问名称。业务校验、提交和错误处理由宿主负责。",
    ],
    snippets: [
      {
        label: "受控表单",
        language: "tsx",
        code: `import { useState } from "react";
import { Button, Input, Switch } from "@asharca/ui/controls";

export function Preferences() {
  const [name, setName] = useState("");
  const [enabled, setEnabled] = useState(true);
  return <>
    <label>名称<Input value={name}
      onChange={(event) => setName(event.target.value)} /></label>
    <Switch aria-label="邮件通知" checked={enabled}
      onCheckedChange={setEnabled} />
    <Button variant="outline" disabled={!name.trim()}
      onClick={() => console.log({ name, enabled })}>保存</Button>
  </>;
}`,
      },
    ],
    demo: "controls",
  },
  {
    id: "workspace",
    title: "工作区标签导航",
    keywords: "WorkspaceTabBar tabs pin reorder detached",
    paragraphs: [
      "WorkspaceTabBar 只负责交互与呈现，不包含路由。宿主管理 tabs、activeTabId，并实现选择、关闭、新建、固定、排序与新窗口回调。每个标签必须有稳定、唯一的 id。",
      "在关闭回调中保留至少一个标签，并更新 activeTabId。排序时维持固定与未固定分组；新窗口应在初始化时只创建目标标签，而不是恢复整套标签状态。",
    ],
    snippets: [
      {
        label: "标签数据与组件契约",
        language: "tsx",
        code: `import { WorkspaceTabBar } from "@asharca/ui/workspace-tab-bar";
import type { WorkspaceTabBarProps } from "@asharca/ui/workspace-tab-bar";

// 由宿主传入状态和回调，不绑定任何路由库。
export function WorkspaceNavigation(props: WorkspaceTabBarProps) {
  return <WorkspaceTabBar {...props} />;
}

// 标签结构：
// { id: "chat", label: "聊天", icon: MessageSquare, pinned: false }
// 必填回调：onSelect, onClose, onNewTab, onTogglePinned,
// onReorder(sourceId, targetId), onOpenInNewWindow`,
      },
    ],
  },
  {
    id: "chat",
    title: "聊天布局与运行时",
    keywords: "ChatShell ChatThread ConversationSidebar runtime 聊天 附件 分支",
    paragraphs: [
      "ChatShell 管理会话栏、聊天区域和可选的右侧面板。sidebarOpen 控制桌面侧栏，mobilePane 控制手机显示列表还是聊天。父容器必须有明确高度，消息区独立滚动。",
      "ChatThread 接收 assistant-ui 的 AssistantRuntime。模型调用、取消生成、会话存储、附件上传及鉴权都由宿主适配器负责，组件本身不会连接模型。",
      "展示页支持会话搜索、新建、重命名、删除、附件、复制、编辑及重新生成。编辑与重新生成会创建分支，保留原会话。回复模式仅切换本地文案，联网搜索未接入。",
    ],
    snippets: [
      {
        label: "组合聊天界面",
        language: "tsx",
        code: `import { useState } from "react";
import { ChatShell, ChatThread, ConversationSidebar } from "@asharca/ui";
import type { ChatThreadProps } from "@asharca/ui";

export function ChatPage({ runtime }: Pick<ChatThreadProps, "runtime">) {
  const [open, setOpen] = useState(true);
  const [pane, setPane] = useState<"sidebar" | "chat">("chat");
  return <div style={{ height: "100dvh" }}>
    <ChatShell sidebarOpen={open} onSidebarOpenChange={setOpen}
      mobilePane={pane} onMobilePaneChange={setPane}
      sidebarLabel="会话" header={<strong>工作助手</strong>}
      sidebar={<ConversationSidebar groups={[]}
        onSelectConversation={() => setPane("chat")} />}>
      <ChatThread runtime={runtime} assistantName="工作助手" />
    </ChatShell>
  </div>;
}`,
      },
    ],
    demo: "chat",
  },
  {
    id: "toolbar",
    title: "自定义输入工具栏",
    keywords: "ChatComposerToolbar + plus 固定 排序 工具 提示词",
    paragraphs: [
      "点击输入框的“+”打开统一工具菜单，选择“自定义工具栏”后，勾选需要固定的工具，使用上下箭头排序，或重置全部快捷工具。固定项移到输入栏，不在菜单里重复显示。",
      "ChatComposerToolbar 的 tools 定义 id、label、icon、onSelect，以及可选的 description、disabled、pressed。pinnedIds 与 onPinnedIdsChange 是受控状态，持久化由宿主实现；展示页将偏好存入 localStorage。",
      "将工具栏传给 ChatThread.composerTools，并设置 showAttachmentPicker={false}，避免出现两个“+”。composerStatus 可显示状态，composerEnd 可放置发送按钮旁的附加控件。自定义附件入口仍需要运行时附件适配器。",
    ],
    snippets: [
      {
        label: "统一工具菜单",
        language: "tsx",
        code: `import { useState } from "react";
import { ScrollText } from "lucide-react";
import { ChatThread, ChatComposerToolbar } from "@asharca/ui";
import type { ChatThreadProps } from "@asharca/ui";

export function CustomChat({ runtime }: Pick<ChatThreadProps, "runtime">) {
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  return <ChatThread runtime={runtime} assistantName="工作助手"
    showAttachmentPicker={false}
    composerTools={<ChatComposerToolbar
      pinnedIds={pinnedIds} onPinnedIdsChange={setPinnedIds}
      labels={{ open: "打开工具", customize: "自定义工具栏" }}
      tools={[{ id: "summary", label: "总结", icon: <ScrollText />,
        onSelect: () => runtime.thread.composer.setText("请总结以下内容：")
      }]} />}
  />;
}`,
      },
    ],
    demo: "chat",
  },
  {
    id: "theme",
    title: "主题与布局",
    keywords: "dark css variables 颜色 圆角 高度",
    paragraphs: [
      '主题变量使用 HSL 通道值，不要写成十六进制颜色。通过祖先元素的 .dark 类或组件的 data-theme="dark" 切换暗色。旧的 --chat-ui-* 变量仍然兼容。',
      "--chat-ui-sidebar-width 与 --chat-ui-right-panel-width 分别控制聊天两侧栏宽度。设置固定视口高度、flex: 1、min-height: 0，并只让消息区滚动，可避免聊天页出现双重滚动条。",
    ],
    snippets: [
      {
        label: "主题覆盖",
        language: "css",
        code: `:root {
  --toolplane-ui-background: 0 0% 100%;
  --toolplane-ui-foreground: 0 0% 12%;
  --toolplane-ui-brand: 158 45% 32%;
  --toolplane-ui-radius: 0.5rem;
  --chat-ui-sidebar-width: 15rem;
  --chat-ui-right-panel-width: 20rem;
}`,
      },
    ],
  },
  {
    id: "faq",
    title: "常见问题与边界",
    keywords: "故障 错误 样式 重置 滚动 模型 服务",
    paragraphs: [
      "组件没有样式：检查全局 CSS 是否导入包样式，以及 Tailwind 4 是否参与构建。聊天上下文报错：检查宿主使用的 assistant-ui 版本是否与 peerDependencies 一致，避免重复安装不兼容版本。",
      "按钮显示但没有业务效果：检查对应回调或运行时能力是否已接入。allowAttachments 只是 UI 开关，不能代替附件适配器；allowEdit / allowRegenerate 同样需要相应运行时或回调。",
      "刷新后演示数据消失是预期行为。路由、鉴权、API、持久化、真实模型、MCP 与联网搜索属于宿主应用，不包含在这个 UI 包里。新增组件请以当前构建/发布版本为准。",
    ],
    snippets: [],
  },
];

export function Manual({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLocaleLowerCase();
  const visible = sections.filter((section) =>
    `${section.title} ${section.keywords} ${section.paragraphs.join(" ")} ${section.snippets.map((item) => item.code).join(" ")}`
      .toLocaleLowerCase()
      .includes(needle),
  );
  return (
    <div className="manual">
      <header className="manual-header">
        <div>
          <span className="eyebrow">ASHARCA UI / {version}</span>
          <h1>使用手册</h1>
          <p>从展示页操作到应用接入。</p>
        </div>
        <SearchInput
          label="搜索使用手册"
          placeholder="搜索组件、配置或问题…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
          clearLabel="清空手册搜索"
        />
      </header>
      <div className="manual-layout">
        <nav className="manual-toc" aria-label="手册目录">
          {visible.map((section) => (
            <a
              key={section.id}
              href={`#manual-${section.id}`}
              onClick={(event) => {
                event.preventDefault();
                const target = document.getElementById(`manual-${section.id}`);
                target?.scrollIntoView({ block: "start" });
                target?.focus({ preventScroll: true });
              }}
            >
              {section.title}
            </a>
          ))}
        </nav>
        <div className="manual-body">
          {visible.length === 0 && (
            <div className="manual-empty">
              <p role="status">没有找到相关内容</p>
              <Button variant="outline" onClick={() => setQuery("")}>
                清除搜索
              </Button>
            </div>
          )}
          {visible.map((section) => (
            <section
              key={section.id}
              id={`manual-${section.id}`}
              tabIndex={-1}
              aria-labelledby={`manual-title-${section.id}`}
            >
              <h2 id={`manual-title-${section.id}`}>{section.title}</h2>
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {section.snippets.map((snippet) => (
                <div className="manual-code" key={snippet.label}>
                  <div>
                    <span>
                      {snippet.label} <small>{snippet.language}</small>
                    </span>
                    <CopyButton
                      text={snippet.code}
                      label={`复制${snippet.label}`}
                      copiedLabel="已复制"
                      failedLabel="复制失败"
                    />
                  </div>
                  <HighlightedCode
                    code={snippet.code}
                    label={snippet.label}
                    language={
                      snippet.language === "shell"
                        ? "bash"
                        : snippet.language === "css"
                          ? "css"
                          : "tsx"
                    }
                  />
                </div>
              ))}
              {section.demo && (
                <Button
                  variant="ghost"
                  onClick={() => onNavigate(section.demo!)}
                >
                  打开对应示例
                  <ArrowRight size={14} />
                </Button>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
