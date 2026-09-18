import {
  ArrowUpRight,
  Box,
  FileText,
  LibraryBig,
  MessageSquare,
  Plug,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TerminalSquare,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Chip,
  DataTable,
  EmptyState,
  Entity,
  IconButton,
  Panel,
  Progress,
  SearchInput,
  StatusBadge,
} from "../../src/index";

type Tone = "neutral" | "success" | "warning" | "danger";

type WorkspaceRecord = {
  name: string;
  description: string;
  initials: string;
  status: string;
  tone: Tone;
  detail: string;
  tags?: readonly string[];
  progress?: number;
};

export type WorkspaceView = {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  actionLabel?: string;
  records: readonly WorkspaceRecord[];
};

export const workspaceViews: readonly WorkspaceView[] = [
  {
    id: "chat",
    label: "助手",
    icon: MessageSquare,
    description: "与工作区助手协作处理当前任务。",
    records: [],
  },
  {
    id: "work",
    label: "智能体",
    icon: TerminalSquare,
    description: "创建、运行并检查工作区中的智能体。",
    actionLabel: "新建智能体",
    records: [
      { name: "发布检查", description: "执行测试、构建与发布前检查", initials: "RC", status: "运行中", tone: "success", detail: "2 分钟前更新", progress: 72 },
      { name: "依赖审计", description: "识别依赖风险与版本漂移", initials: "DA", status: "待命", tone: "neutral", detail: "今天 18:40", progress: 100 },
      { name: "文档同步", description: "同步组件文档与示例索引", initials: "DS", status: "需要关注", tone: "warning", detail: "1 项待处理", progress: 42 },
    ],
  },
  {
    id: "knowledge",
    label: "知识库",
    icon: LibraryBig,
    description: "管理供助手检索的文档、规范与项目资料。",
    actionLabel: "添加知识库",
    records: [
      { name: "产品文档", description: "设计规范与组件使用说明", initials: "PD", status: "已索引", tone: "success", detail: "128 个片段" },
      { name: "工程手册", description: "架构约束、发布流程与排障记录", initials: "EH", status: "已索引", tone: "success", detail: "86 个片段" },
      { name: "会议记录", description: "产品评审与技术决策摘要", initials: "MN", status: "同步中", tone: "warning", detail: "最后同步 09:18" },
    ],
  },
  {
    id: "members",
    label: "成员",
    icon: Users,
    description: "管理工作区成员、角色与访问权限。",
    actionLabel: "邀请成员",
    records: [
      { name: "Ava Chen", description: "ava@example.com", initials: "AC", status: "所有者", tone: "neutral", detail: "刚刚活跃" },
      { name: "Leo Zhang", description: "leo@example.com", initials: "LZ", status: "管理员", tone: "success", detail: "12 分钟前活跃" },
      { name: "Mia Wang", description: "mia@example.com", initials: "MW", status: "成员", tone: "neutral", detail: "昨天活跃" },
    ],
  },
  {
    id: "market",
    label: "市场",
    icon: Store,
    description: "发现并安装可复用的工作区能力。",
    actionLabel: "浏览市场",
    records: [
      { name: "代码审查助手", description: "检查变更风险并生成审查摘要", initials: "CR", status: "已安装", tone: "success", detail: "v1.4.2", tags: ["审查", "智能体"] },
      { name: "发布协调器", description: "汇总检查结果并生成发布说明", initials: "RC", status: "可安装", tone: "neutral", detail: "v2.1.0", tags: ["发布", "自动化"] },
      { name: "文档整理器", description: "清理、分类并索引项目文档", initials: "DO", status: "可更新", tone: "warning", detail: "v1.8.0", tags: ["知识库", "文档"] },
    ],
  },
  {
    id: "mcp",
    label: "MCP",
    icon: Plug,
    description: "连接并监控工作区可用的 MCP 服务。",
    actionLabel: "添加服务器",
    records: [
      { name: "代码仓库", description: "读取提交、议题与合并请求", initials: "GR", status: "在线", tone: "success", detail: "12 个工具", tags: ["只读", "OAuth"] },
      { name: "项目数据库", description: "查询只读项目数据", initials: "DB", status: "在线", tone: "success", detail: "7 个工具", tags: ["只读", "内网"] },
      { name: "浏览器自动化", description: "执行页面检查与截图", initials: "BA", status: "需配置", tone: "warning", detail: "缺少凭据", tags: ["浏览器", "本地"] },
    ],
  },
];

function notifyRecord(item: WorkspaceRecord, onNotify: (message: string) => void) {
  onNotify(`${item.name} · ${item.status} · ${item.detail}`);
}

function AgentsContent({ items, onNotify }: ContentProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3" data-workspace-layout="agents">
      {items.map((item) => (
        <Card key={item.name} className="flex min-h-56 flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-brand-soft text-accent-foreground">
              <TerminalSquare size={19} />
            </span>
            <StatusBadge label={item.status} tone={item.tone} />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">{item.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="mt-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>最近一次执行</span>
              <span>{item.progress}%</span>
            </div>
            <Progress aria-label={`${item.name} 执行进度`} value={item.progress} />
            <Button size="sm" variant="ghost" onClick={() => notifyRecord(item, onNotify)}>
              查看运行
              <ArrowUpRight size={14} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function KnowledgeContent({ items, onNotify }: ContentProps) {
  return (
    <Panel
      title="知识源"
      description="已连接到当前工作区的检索内容。"
      padded={false}
      bodyClassName="divide-y divide-border"
      data-workspace-layout="knowledge"
    >
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-4 px-5 py-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-muted/40 text-muted-foreground">
            <FileText size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-foreground">{item.name}</h2>
              <StatusBadge appearance="plain" label={item.status} tone={item.tone} />
            </div>
            <p className="truncate text-xs text-muted-foreground">{item.description}</p>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:block">{item.detail}</span>
          <IconButton label={`查看 ${item.name}`} variant="ghost" icon={<ArrowUpRight size={16} />} onClick={() => notifyRecord(item, onNotify)} />
        </div>
      ))}
    </Panel>
  );
}

function MembersContent({ items, onNotify }: ContentProps) {
  return (
    <DataTable
      panel={false}
      label="成员与权限"
      minWidth="36rem"
      data-workspace-layout="members"
      headers={[
        { label: "成员" },
        { label: "角色" },
        { label: "最近活动" },
        { label: "操作", align: "right" },
      ]}
    >
      {items.map((item) => (
        <tr key={item.name}>
          <td><Entity title={item.name} description={item.description} initials={item.initials} /></td>
          <td><StatusBadge label={item.status} tone={item.tone} /></td>
          <td className="muted">{item.detail}</td>
          <td className="cell-action"><IconButton label={`管理 ${item.name}`} variant="ghost" icon={<ShieldCheck size={16} />} onClick={() => notifyRecord(item, onNotify)} /></td>
        </tr>
      ))}
    </DataTable>
  );
}

function MarketContent({ items, onNotify }: ContentProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-workspace-layout="market">
      {items.map((item) => (
        <Card key={item.name} className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <span className="grid size-10 place-items-center rounded-md border border-border bg-background"><Sparkles size={18} /></span>
            <span className="text-xs text-muted-foreground">{item.detail}</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{item.name}</h2>
            <p className="mt-1 min-h-10 text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">{item.tags?.map((tag) => <Chip key={tag}>{tag}</Chip>)}</div>
          <Button className="mt-auto" variant={item.status === "已安装" ? "outline" : "primary"} onClick={() => notifyRecord(item, onNotify)}>
            {item.status === "已安装" ? "打开" : item.status === "可更新" ? "更新" : "安装"}
          </Button>
        </Card>
      ))}
    </div>
  );
}

function McpContent({ items, onNotify }: ContentProps) {
  return (
    <div className="space-y-3" data-workspace-layout="mcp">
      {items.map((item) => (
        <div key={item.name} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground"><Plug size={18} /></span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-foreground">{item.name}</h2>
              <StatusBadge appearance="plain" label={item.status} tone={item.tone} />
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">{item.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
          <Button size="sm" variant="outline" onClick={() => notifyRecord(item, onNotify)}>{item.detail}</Button>
        </div>
      ))}
    </div>
  );
}

type ContentProps = {
  items: readonly WorkspaceRecord[];
  onNotify: (message: string) => void;
};

function WorkspaceBody({ view, items, onNotify }: ContentProps & { view: WorkspaceView }) {
  switch (view.id) {
    case "work": return <AgentsContent items={items} onNotify={onNotify} />;
    case "knowledge": return <KnowledgeContent items={items} onNotify={onNotify} />;
    case "members": return <MembersContent items={items} onNotify={onNotify} />;
    case "market": return <MarketContent items={items} onNotify={onNotify} />;
    case "mcp": return <McpContent items={items} onNotify={onNotify} />;
    default: return null;
  }
}

export function WorkspaceViewContent({
  view,
  query,
  onQueryChange,
  onNotify,
}: {
  view: WorkspaceView;
  query: string;
  onQueryChange: (query: string) => void;
  onNotify: (message: string) => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const matching = view.records.filter((item) =>
    `${item.name} ${item.description} ${item.status} ${item.detail} ${item.tags?.join(" ") ?? ""}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">TOOLPLANE <span>/</span> WORKSPACE</div>
          <h1 id={`workspace-view-${view.id}`}>{view.label}</h1>
          <p>{view.description}</p>
        </div>
        {view.actionLabel && <div className="heading-actions"><Button variant="primary" onClick={() => onNotify(`${view.actionLabel}：演示操作已触发`)}>{view.actionLabel}</Button></div>}
      </div>
      <div className="catalog-toolbar">
        <div className="catalog-label"><span>{query ? "搜索结果" : `${view.label}概览`}</span><Badge>{matching.length}</Badge></div>
        <SearchInput label={`搜索${view.label}`} clearLabel="清空关键词" placeholder={`搜索${view.label}…`} value={query} onChange={(event) => onQueryChange(event.target.value)} onClear={() => onQueryChange("")} />
      </div>
      {matching.length ? <WorkspaceBody view={view} items={matching} onNotify={onNotify} /> : <EmptyState icon={Search} title={`没有匹配的${view.label}`} description={`未找到“${query}”`} actions={<Button variant="outline" onClick={() => onQueryChange("")}>清除搜索</Button>} />}
      <footer className="page-footer"><span><Box size={14} />ToolPlane workspace</span><span>当前标签内容独立呈现</span></footer>
    </>
  );
}
