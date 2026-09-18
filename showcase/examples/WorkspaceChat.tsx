import { useRef, useState } from "react";
import {
  Bot,
  Database,
  Eraser,
  GitBranch,
  Globe2,
  Paperclip,
  Plus,
  ScrollText,
  Settings2,
} from "lucide-react";
import {
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
  useExternalStoreRuntime,
  type AppendMessage,
  type AssistantRuntime,
  type CompleteAttachment,
  type ThreadMessageLike,
} from "@assistant-ui/react";
import { ChatThread } from "../../src/ChatThread";
import { ChatComposerToolbar } from "../../src/ChatComposerToolbar";
import { ChatShell, type ChatShellMobilePane } from "../../src/ChatShell";
import { ConversationSidebar } from "../../src/ConversationSidebar";
import { Button, IconButton, Input, Select } from "../../src/Controls";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogDescription,
} from "../../src/Dialog";

type Conversation = {
  id: string;
  title: string;
  messages: ThreadMessageLike[];
  parentId?: string;
};
const attachments = new CompositeAttachmentAdapter([
  new SimpleImageAttachmentAdapter(),
  new SimpleTextAttachmentAdapter(),
]);

function SentAttachment({ attachment }: { attachment: CompleteAttachment }) {
  const image = attachment.content.find((part) => part.type === "image");
  return image ? (
    <a
      className="chat-sent-image"
      href={image.image}
      download={attachment.name}
    >
      <img src={image.image} alt={attachment.name} />
      <span>{attachment.name}</span>
    </a>
  ) : (
    <span className="chat-sent-file">{attachment.name}</span>
  );
}

export default function ChatExample() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "welcome",
      title: "工作空间设计",
      messages: [
        {
          id: "welcome-message",
          role: "assistant",
          content: [
            {
              type: "text",
              text: "你好，我是 Asharca。\n\n我们可以从工作区的结构开始：\n\n- 会话列表：整理讨论主题\n- 消息区域：专注当前任务\n- 输入工具：补充图片和文本材料\n\n**今天想从哪里开始？**",
            },
          ],
        },
      ],
    },
    {
      id: "dashboard",
      title: "本周数据概览",
      messages: [
        { id: "dashboard-user", role: "user", content: [{ type: "text", text: "整理一下本周的项目数据。" }] },
        { id: "dashboard-assistant", role: "assistant", content: [{ type: "text", text: "下面是本周的项目概览：\n\n| 项目 | 状态 | 完成度 | 负责人 |\n| --- | --- | ---: | --- |\n| Design System | 已发布 | 100% | Ava |\n| Mobile App | 进行中 | 72% | Leo |\n| API Gateway | 风险 | 48% | Mia |\n\n> API Gateway 需要在周五前完成接口回归。" }] },
      ],
    },
    {
      id: "architecture",
      title: "服务架构流程",
      messages: [
        { id: "architecture-user", role: "user", content: [{ type: "text", text: "画一下从客户端到 API 的请求流程。" }] },
        { id: "architecture-assistant", role: "assistant", content: [{ type: "text", text: "请求经过网关后进入应用服务，失败时回退到重试队列。\n\n```mermaid\ngraph LR\n  Client[客户端] --> Gateway[API Gateway]\n  Gateway --> Auth[鉴权服务]\n  Auth --> App[应用服务]\n  App --> DB[(数据库)]\n  App --> Queue[重试队列]\n```" }] },
      ],
    },
    {
      id: "review",
      title: "组件代码审查",
      messages: [
        { id: "review-user", role: "user", content: [{ type: "text", text: "帮我看一下这个按钮状态的实现。" }] },
        { id: "review-assistant", role: "assistant", content: [{ type: "text", text: "建议把异步状态集中管理，并在提交期间禁用按钮：\n\n```tsx\nfunction SaveButton({ pending, onSave }) {\n  return (\n    <button type=\"button\" disabled={pending} onClick={onSave}>\n      {pending ? \"保存中…\" : \"保存更改\"}\n    </button>\n  );\n}\n```\n\n这样可以避免重复提交，也能让屏幕阅读器读到明确的状态。" }] },
      ],
    },
    {
      id: "plan",
      title: "发布计划讨论",
      messages: [
        { id: "plan-user", role: "user", content: [{ type: "text", text: "把发布工作拆成几个步骤。" }] },
        { id: "plan-assistant-1", role: "assistant", content: [{ type: "text", text: "可以按下面的顺序执行：\n\n1. 完成组件测试\n2. 构建并检查产物\n3. 发布预览环境\n4. 确认回滚方案" }] },
        { id: "plan-user-2", role: "user", content: [{ type: "text", text: "优先处理哪些风险？" }] },
        { id: "plan-assistant-2", role: "assistant", content: [{ type: "text", text: "优先确认 peer dependencies 版本、样式入口和移动端布局，这三项最容易在宿主项目中产生差异。" }] },
      ],
    },
  ]);
  const [activeId, setActiveId] = useState("welcome");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobilePane, setMobilePane] = useState<ChatShellMobilePane>("chat");
  const [assistantName, setAssistantName] = useState("Asharca");
  const [model, setModel] = useState("简洁回复");
  const [editor, setEditor] = useState<{
    kind: "rename" | "delete" | "settings" | "branches";
    id?: string;
    value: string;
  } | null>(null);
  const active = conversations.find((item) => item.id === activeId)!;
  const select = (id: string) => {
    setActiveId(id);
    setMobilePane("chat");
  };
  const create = (messages: ThreadMessageLike[] = [], parentId?: string) => {
    const id = crypto.randomUUID();
    setConversations((items) => [
      ...items,
      {
        id,
        title: parentId ? `${active.title} · 分支` : "新会话",
        messages,
        parentId,
      },
    ]);
    select(id);
  };
  const updateMessages = (messages: ThreadMessageLike[]) =>
    setConversations((items) =>
      items.map((item) =>
        item.id === activeId
          ? {
              ...item,
              messages,
              title:
                item.title === "新会话" ? messageTitle(messages) : item.title,
            }
          : item,
      ),
    );

  return (
    <>
      <ChatShell
        className="showcase-chat"
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={setSidebarOpen}
        mobilePane={mobilePane}
        onMobilePaneChange={setMobilePane}
        sidebarLabel="聊天会话"
        labels={{ showSidebar: "显示会话列表", hideSidebar: "隐藏会话列表" }}
        sidebar={
          <ConversationSidebar
            groups={[{ id: "assistant", name: assistantName, conversations }]}
            activeGroupId="assistant"
            activeConversationId={activeId}
            onConversationOrderChange={(_, ids) => setConversations((items) => [...items].sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)))}
            labels={{
              groups: "助手",
              searchPlaceholder: "搜索助手和会话",
              clearSearch: "清除搜索",
              newConversation: "新建会话",
              untitledConversation: "新会话",
              noConversations: "暂无会话",
              noResults: "没有匹配的会话",
              renameConversation: "重命名会话",
              deleteConversation: "删除会话",
              showConversations: "展开会话",
              hideConversations: "收起会话",
              moveUp: "上移会话",
              moveDown: "下移会话",
            }}
            onSelectConversation={(item) => select(item.id)}
            onCreateConversation={() => create()}
            onRenameConversation={(item) =>
              setEditor({
                kind: "rename",
                id: item.id,
                value: item.title ?? "",
              })
            }
            onDeleteConversation={(item) =>
              setEditor({
                kind: "delete",
                id: item.id,
                value: item.title ?? "",
              })
            }
          />
        }
        header={
          <>
            <button
              className="chat-assistant-button"
              title="助手设置"
              aria-label="助手设置"
              onClick={() =>
                setEditor({ kind: "settings", value: assistantName })
              }
            >
              <Bot size={16} />
              <span>{assistantName}</span>
              <Settings2 size={13} />
            </button>
            <div className="chat-header-actions">
              <Select
                aria-label="本地演示回复模式"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              >
                <option>简洁回复</option>
                <option>详细回复</option>
              </Select>
              <IconButton
                icon={<GitBranch size={16} />}
                label="会话分支"
                variant="ghost"
                onClick={() => setEditor({ kind: "branches", value: "" })}
              />
              <IconButton
                icon={<Plus size={16} />}
                label="新建会话"
                variant="ghost"
                onClick={() => create()}
              />
            </div>
          </>
        }
      >
        <DemoThread
          key={activeId}
          conversation={active}
          assistantName={assistantName}
          model={model}
          updateMessages={updateMessages}
          onBranch={(messages) => create(messages, activeId)}
          onNewConversation={() => create()}
        />
      </ChatShell>
      <Dialog
        open={Boolean(editor)}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>
              {editor?.kind === "settings"
                ? "助手设置"
                : editor?.kind === "delete"
                  ? "删除会话"
                  : editor?.kind === "branches"
                    ? "会话分支"
                    : "重命名会话"}
            </DialogTitle>
            <DialogDescription>
              {editor?.kind === "delete"
                ? `删除“${editor.value}”及其消息？此操作无法撤销。`
                : editor?.kind === "settings"
                  ? "本地演示，不连接模型服务。"
                  : editor?.kind === "branches"
                    ? "从消息创建的分支会保留原会话。"
                    : "修改当前会话的名称。"}
            </DialogDescription>
            {editor?.kind === "branches" ? (
              <div className="chat-branch-list">
                {conversations.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      select(item.id);
                      setEditor(null);
                    }}
                  >
                    <GitBranch size={14} />
                    {item.title}
                    {item.parentId ? " · 分支" : ""}
                  </Button>
                ))}
              </div>
            ) : editor?.kind !== "delete" ? (
              <label>
                名称
                <Input
                  maxLength={80}
                  value={editor?.value ?? ""}
                  onChange={(event) =>
                    setEditor(
                      (current) =>
                        current && { ...current, value: event.target.value },
                    )
                  }
                />
              </label>
            ) : null}
            <div className="dialog-actions">
              <Button variant="outline" onClick={() => setEditor(null)}>
                {editor?.kind === "branches" ? "关闭" : "取消"}
              </Button>
              {editor?.kind !== "branches" && (
                <Button
                  disabled={editor?.kind !== "delete" && !editor?.value.trim()}
                  onClick={() => {
                    if (!editor) return;
                    if (editor.kind === "settings")
                      setAssistantName(editor.value.trim());
                    if (editor.kind === "rename")
                      setConversations((items) =>
                        items.map((item) =>
                          item.id === editor.id
                            ? { ...item, title: editor.value.trim() }
                            : item,
                        ),
                      );
                    if (editor.kind === "delete") {
                      const remaining = conversations.filter(
                        (item) => item.id !== editor.id,
                      );
                      if (!remaining.length)
                        remaining.push({
                          id: crypto.randomUUID(),
                          title: "新会话",
                          messages: [],
                        });
                      setConversations(remaining);
                      if (activeId === editor.id) select(remaining[0].id);
                    }
                    setEditor(null);
                  }}
                >
                  {editor?.kind === "delete" ? "确认删除" : "保存"}
                </Button>
              )}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

function messageTitle(messages: ThreadMessageLike[]) {
  const content = messages.find((item) => item.role === "user")?.content;
  return (
    (typeof content === "string"
      ? content
      : content?.find((part) => part.type === "text")?.text
    )
      ?.trim()
      .slice(0, 24) || "附件讨论"
  );
}

function DemoComposerTools({
  runtime,
  onNewConversation,
}: {
  runtime: AssistantRuntime;
  onNewConversation: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState<
    "prompts" | "resources" | "clear" | null
  >(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem("asharca-ui:composer-toolbar") ?? "[]",
      );
      return Array.isArray(saved)
        ? saved.filter((id): id is string => typeof id === "string")
        : [];
    } catch {
      return [];
    }
  });
  const insert = (text: string) => {
    const draft = runtime.thread.composer.getState().text;
    runtime.thread.composer.setText(draft ? `${draft}\n\n${text}` : text);
    setPicker(null);
  };
  return (
    <>
      <ChatComposerToolbar
        pinnedIds={pinnedIds}
        onPinnedIdsChange={(ids) => {
          setPinnedIds(ids);
          setError("");
          try {
            localStorage.setItem(
              "asharca-ui:composer-toolbar",
              JSON.stringify(ids),
            );
          } catch {
            setError("工具栏已更新，但浏览器未允许保存偏好。");
          }
        }}
        labels={{
          open: "打开工具",
          customize: "自定义工具栏",
          close: "关闭",
          reset: "重置工具栏",
          moveUp: (name) => `上移 ${name}`,
          moveDown: (name) => `下移 ${name}`,
        }}
        tools={[
          {
            id: "attachments",
            label: "添加图片或文本",
            icon: <Paperclip />,
            onSelect: () => input.current?.click(),
          },
          {
            id: "prompts",
            label: "提示词模板",
            icon: <ScrollText />,
            onSelect: () => setPicker("prompts"),
          },
          {
            id: "resources",
            label: "本地参考资料",
            icon: <Database />,
            onSelect: () => setPicker("resources"),
          },
          {
            id: "clear",
            label: "清除上下文",
            icon: <Eraser />,
            onSelect: () => setPicker("clear"),
          },
          {
            id: "web",
            label: "联网搜索",
            description: "未连接搜索服务",
            icon: <Globe2 />,
            disabled: true,
            onSelect: () => {},
          },
        ]}
      />
      <input
        ref={input}
        type="file"
        accept="image/*,text/*,.md,.txt,.csv,.json"
        multiple
        hidden
        onChange={async (event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = "";
          setError("");
          for (const file of files) {
            try {
              if (file.size > 10 * 1024 * 1024)
                throw new Error(`${file.name} 超过 10 MB`);
              await runtime.thread.composer.addAttachment(file);
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : "添加附件失败");
            }
          }
        }}
      />
      {error && (
        <span role="alert" className="chat-toolbar-error">
          {error}
        </span>
      )}
      <Dialog
        open={picker !== null}
        onOpenChange={(open) => {
          if (!open) setPicker(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>
              {picker === "prompts"
                ? "提示词模板"
                : picker === "resources"
                  ? "本地参考资料"
                  : "清除上下文"}
            </DialogTitle>
            <DialogDescription>
              {picker === "clear"
                ? "开始一个空会话，原会话及消息仍会保留。"
                : "将所选内容插入当前草稿。"}
            </DialogDescription>
            {picker !== "clear" && (
              <div className="chat-branch-list">
                {(picker === "prompts"
                  ? [
                      {
                        title: "代码审查",
                        text: "请检查以下代码的正确性、边界条件和可访问性，并按优先级给出修改建议：",
                      },
                      {
                        title: "工作计划",
                        text: "请把下面的目标整理成可执行的任务，分别列出优先级和验收标准：",
                      },
                      {
                        title: "内容总结",
                        text: "请总结以下内容，列出关键结论、待办事项和需要确认的问题：",
                      },
                    ]
                  : [
                      {
                        title: "组件检查清单",
                        text: "组件检查清单：键盘导航、焦点可见性、无障碍名称、加载与错误状态、移动端溢出。",
                      },
                      {
                        title: "工作区布局约定",
                        text: "工作区布局：侧边栏可折叠；标签导航只横向滚动；消息区独立纵向滚动；输入框保持可见。",
                      },
                    ]
                ).map((item) => (
                  <Button
                    key={item.title}
                    variant="outline"
                    onClick={() => insert(item.text)}
                  >
                    {item.title}
                  </Button>
                ))}
              </div>
            )}
            <div className="dialog-actions">
              <Button variant="outline" onClick={() => setPicker(null)}>
                取消
              </Button>
              {picker === "clear" && (
                <Button
                  onClick={() => {
                    setPicker(null);
                    onNewConversation();
                  }}
                >
                  开始新会话
                </Button>
              )}
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}

function DemoThread({
  conversation,
  assistantName,
  model,
  updateMessages,
  onBranch,
  onNewConversation,
}: {
  conversation: Conversation;
  assistantName: string;
  model: string;
  updateMessages: (messages: ThreadMessageLike[]) => void;
  onBranch: (messages: ThreadMessageLike[]) => void;
  onNewConversation: () => void;
}) {
  const reply = (): ThreadMessageLike => ({
    id: crypto.randomUUID(),
    role: "assistant",
    content: [
      {
        type: "text",
        text:
          model === "详细回复"
            ? "这是本地演示回复，未调用模型服务。\n\n### 下一步\n\n1. 明确当前任务的目标。\n2. 整理输入材料与约束。\n3. 按优先级逐项验证。\n\n你可以编辑消息、重新生成回复，或从这里创建分支。"
            : "消息已收到。这是本地演示回复，未调用模型服务。\n\n我们可以继续细化这个主题。",
      },
    ],
  });
  const append = async (message: AppendMessage, editing = false) => {
    const end = editing
      ? conversation.messages.findIndex(
          (item) => item.id === message.parentId,
        ) + 1
      : conversation.messages.length;
    const messages: ThreadMessageLike[] = [
      ...conversation.messages.slice(0, end),
      {
        id: crypto.randomUUID(),
        role: "user",
        content: message.content,
        attachments: message.attachments,
      },
      reply(),
    ];
    if (editing) onBranch(messages);
    else updateMessages(messages);
  };
  const runtime = useExternalStoreRuntime<ThreadMessageLike>({
    messages: conversation.messages,
    isRunning: false,
    convertMessage: (message) => message,
    onNew: append,
    onEdit: (message) => append(message, true),
    adapters: { attachments },
  });
  return (
    <ChatThread
      components={{ SentAttachment }}
      runtime={runtime}
      assistantName={assistantName}
      allowAttachments
      allowEdit
      showAttachmentPicker={false}
      composerTools={
        <DemoComposerTools
          runtime={runtime}
          onNewConversation={onNewConversation}
        />
      }
      composerStatus={<span className="chat-local-status">本地演示</span>}
      onRegenerateMessage={(id) => {
        const index = conversation.messages.findIndex((item) => item.id === id);
        if (index >= 0)
          onBranch([...conversation.messages.slice(0, index), reply()]);
      }}
      onBranchStart={(id) => {
        const index = conversation.messages.findIndex((item) => item.id === id);
        if (index >= 0) onBranch(conversation.messages.slice(0, index + 1));
      }}
      emptyState={
        <div className="chat-empty">
          <Bot size={32} />
          <h2>有什么新想法？</h2>
          <div>
            {["整理今天的工作计划", "检查组件的可访问性", "讨论工作区布局"].map(
              (text) => (
                <Button
                  variant="outline"
                  key={text}
                  onClick={() => runtime.thread.composer.setText(text)}
                >
                  {text}
                </Button>
              ),
            )}
          </div>
        </div>
      }
      labels={{
        messagePlaceholder: "输入一条消息…",
        send: "发送",
        openComposerTools: "打开工具",
        composerTools: "输入工具",
        copy: "复制",
        edit: "编辑消息",
        regenerate: "重新生成",
        startBranch: "从此处创建分支",
        expandComposer: "展开输入框",
        restoreComposer: "收起输入框",
        save: "保存并创建分支",
        cancel: "取消",
        addAttachment: "添加图片或文本",
        attachment: "附件",
        attachmentsUnavailable: "附件不可用",
        removeAttachment: (name) => `移除 ${name}`,
        processing: "处理中",
        startConversation: "开始新会话",
        scrollToLatestMessage: "回到最新消息",
        user: "你",
      }}
    />
  );
}
