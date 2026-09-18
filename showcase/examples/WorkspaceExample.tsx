import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Box,
  Check,
  Code2,
  Component,
  LayoutGrid,
  Menu,
  MessageSquare,
  Moon,
  MousePointer2,
  Plus,
  Search,
  SlidersHorizontal,
  Sun,
  Table2,
  X,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Chip,
  CopyButton,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  EmptyState,
  Entity,
  Field,
  FieldDescription,
  FieldLabel,
  IconButton,
  Input,
  Pagination,
  SearchInput,
  Skeleton,
  StatusBadge,
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
  WorkspaceTabBar,
  WorkspaceSidebar,
} from "../../src/index";
import { version } from "../../package.json";
import { Example, examples } from "./WorkspaceComponents";

const ChatExample = lazy(() => import("./WorkspaceChat"));
const categories = [
  { id: "all", label: "全部组件", icon: LayoutGrid },
  { id: "controls", label: "基础控件", icon: MousePointer2 },
  { id: "forms", label: "表单输入", icon: SlidersHorizontal },
  { id: "data", label: "数据展示", icon: Table2 },
  { id: "feedback", label: "状态反馈", icon: Bell },
  { id: "overlays", label: "浮层交互", icon: Component },
  { id: "chat", label: "聊天界面", icon: MessageSquare },
];
const projects = [
  {
    name: "Design System",
    detail: "设计规范与组件",
    initials: "DS",
    status: "已发布",
    tone: "success" as const,
    date: "09 / 09",
  },
  {
    name: "Workspace",
    detail: "团队协作空间",
    initials: "WS",
    status: "进行中",
    tone: "neutral" as const,
    date: "09 / 08",
  },
  {
    name: "Assistant",
    detail: "智能对话体验",
    initials: "AI",
    status: "待审核",
    tone: "warning" as const,
    date: "09 / 07",
  },
  {
    name: "Analytics",
    detail: "数据分析面板",
    initials: "AN",
    status: "已归档",
    tone: "neutral" as const,
    date: "09 / 06",
  },
];

export function WorkspaceExample({ embedded = false }: { embedded?: boolean }) {
  const [workspace, setWorkspace] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("view");
    const view = categories.some((item) => item.id === requested)
      ? requested!
      : "all";
    if (params.get("detached") === "1") {
      return {
        tabs: [{ id: "requested", view, pinned: false }],
        activeId: "requested",
      };
    }
    const tabs = [
      { id: "overview", view: "all", pinned: true },
      { id: "projects", view: "data", pinned: false },
      { id: "assistant", view: "chat", pinned: false },
    ];
    const existing = tabs.find((tab) => tab.view === view);
    if (!existing) tabs.push({ id: "requested", view, pinned: false });
    return { tabs, activeId: existing?.id ?? "requested" };
  });
  const category = workspace.tabs.find(
    (tab) => tab.id === workspace.activeId,
  )!.view;
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("asharca-ui:sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("全部");
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [items, setItems] = useState(projects);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const mobileClose = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem("asharca-ui:sidebar-collapsed", String(collapsed));
    } catch {
      /* Folding works without storage. */
    }
  }, [collapsed]);
  useEffect(() => {
    if (embedded) return;
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark, embedded]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!menuOpen) return;
    mobileClose.current?.focus();
    const main = mainRef.current;
    const trigger = mobileTrigger.current;
    const previousOverflow = document.body.style.overflow;
    main?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    const close = () => setMenuOpen(false);
    const desktop = window.matchMedia("(min-width: 851px)");
    desktop.addEventListener("change", close);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const controls = Array.from(
        sidebarRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not(:disabled)",
        ) ?? [],
      ).filter((element) => element.offsetParent !== null);
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      main?.removeAttribute("inert");
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", close);
      trigger?.focus();
    };
  }, [menuOpen]);

  function navigate(view: string) {
    setWorkspace((current) => {
      const existing = current.tabs.find((tab) => tab.view === view);
      if (existing) return { ...current, activeId: existing.id };
      const active = current.tabs.find((tab) => tab.id === current.activeId)!;
      if (!active.pinned)
        return {
          ...current,
          tabs: current.tabs.map((tab) =>
            tab.id === active.id ? { ...tab, view } : tab,
          ),
        };
      const tab = { id: crypto.randomUUID(), view, pinned: false };
      return { tabs: [...current.tabs, tab], activeId: tab.id };
    });
    setQuery("");
    setMenuOpen(false);
  }

  function closeTab(id: string) {
    setWorkspace((current) => {
      const index = current.tabs.findIndex((tab) => tab.id === id);
      if (index < 0 || current.tabs.length === 1) return current;
      const fallback = current.tabs[index + 1] ?? current.tabs[index - 1];
      return {
        tabs: current.tabs.filter((tab) => tab.id !== id),
        activeId: current.activeId === id ? fallback.id : current.activeId,
      };
    });
    setQuery("");
  }
  const current = categories.find((item) => item.id === category)!;
  const matching = examples.filter(
    (item) =>
      (category === "all" || category === item.category) &&
      `${item.name} ${item.title} ${item.category}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const filtered = items.filter(
    (item) => filter === "全部" || item.status === filter,
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 3));
  const activePage = Math.min(page, pages - 1);

  return (
    <TooltipProvider delayDuration={200}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <div
          className="workbench"
          data-toolplane-ui="showcase"
          data-sidebar-collapsed={collapsed}
        >
          <a className="skip-link" href="#content">
            跳转到内容
          </a>
          <WorkspaceSidebar
            ref={sidebarRef}
            id="showcase-sidebar"
            aria-label="工作台导航"
            role={menuOpen ? "dialog" : undefined}
            aria-modal={menuOpen || undefined}
            brand={<>asharca<span className="brand-ui"> / ui</span></>}
            brandIcon={<Box size={23} strokeWidth={1.8} />}
            brandLabel="Asharca UI 首页"
            onBrandClick={() => navigate("all")}
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            mobileOpen={menuOpen}
            onMobileOpenChange={setMenuOpen}
            mobileCloseRef={mobileClose}
            labels={{ collapse: "折叠侧边栏", expand: "展开侧边栏", close: "收起导航" }}
            sectionLabel="组件库"
            navigationLabel="组件分类"
            activeId={category}
            onSelect={navigate}
            items={categories.map(({ id, label, icon: Icon }) => ({ id, label, icon: <Icon size={17} strokeWidth={1.7} />, badge: id === "all" ? examples.length : undefined }))}
            workspace={{ icon: "A", name: "Design workspace", description: "Personal workspace", badge: <Badge>Free</Badge> }}
            footer={<>
              <Avatar>
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <span>
                <strong>Asharca Studio</strong>
                <small>本地演示空间</small>
              </span>
              <span className="online-dot" />
            </>}
          />
          {menuOpen && (
            <button
              className="sidebar-scrim"
              tabIndex={-1}
              aria-label="关闭导航"
              onClick={() => setMenuOpen(false)}
            />
          )}
          <div className="main-column" ref={mainRef}>
            <header className="workspace-topbar">
              <IconButton
                ref={mobileTrigger}
                className="mobile-menu"
                label="打开导航"
                aria-controls="showcase-sidebar"
                aria-expanded={menuOpen}
                icon={<Menu size={18} />}
                variant="ghost"
                onClick={() => setMenuOpen(true)}
              />
              {!embedded && <a className="workbench-return" href="#/examples">
                <ArrowLeft size={15} />
                <span>返回示例区</span>
              </a>}
              <WorkspaceTabBar
                actions={
                  !embedded && <div className="topbar-actions">
                    <span className="topbar-version">v{version}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <IconButton
                          label={dark ? "切换浅色主题" : "切换深色主题"}
                          icon={dark ? <Sun size={17} /> : <Moon size={17} />}
                          variant="ghost"
                          onClick={() => setDark(!dark)}
                        />
                      </TooltipTrigger>
                      <TooltipPortal>
                        <TooltipContent>
                          {dark ? "浅色模式" : "深色模式"}
                        </TooltipContent>
                      </TooltipPortal>
                    </Tooltip>
                    <a
                      className="source-link"
                      href="https://github.com/asharca/ui"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub 源码"
                    >
                      <Code2 size={18} />
                    </a>
                  </div>
                }
                activeTabId={workspace.activeId}
                tabs={workspace.tabs.map((tab) => {
                  const definition = categories.find(
                    (item) => item.id === tab.view,
                  )!;
                  return {
                    ...tab,
                    label: definition.label,
                    icon: definition.icon,
                  };
                })}
                labels={{
                  navigation: "工作区标签页",
                  newTab: "新建标签页",
                  close: (label) => `关闭 ${label}`,
                  pin: (label) => `固定 ${label}`,
                  unpin: (label) => `取消固定 ${label}`,
                  openInNewWindow: (label) => `在新窗口打开 ${label}`,
                }}
                onSelect={(id) => {
                  setWorkspace((current) => ({ ...current, activeId: id }));
                  setQuery("");
                }}
                onClose={closeTab}
                onNewTab={() => {
                  const tab = {
                    id: crypto.randomUUID(),
                    view: "all",
                    pinned: false,
                  };
                  setWorkspace((current) => ({
                    tabs: [...current.tabs, tab],
                    activeId: tab.id,
                  }));
                  setQuery("");
                }}
                onTogglePinned={(id) =>
                  setWorkspace((current) => ({
                    ...current,
                    tabs: current.tabs
                      .map((tab) =>
                        tab.id === id ? { ...tab, pinned: !tab.pinned } : tab,
                      )
                      .sort((a, b) => Number(b.pinned) - Number(a.pinned)),
                  }))
                }
                onReorder={(sourceId, targetId) =>
                  setWorkspace((current) => {
                    const source = current.tabs.findIndex(
                      (tab) => tab.id === sourceId,
                    );
                    const target = current.tabs.findIndex(
                      (tab) => tab.id === targetId,
                    );
                    if (
                      source < 0 ||
                      target < 0 ||
                      source === target ||
                      current.tabs[source].pinned !==
                        current.tabs[target].pinned
                    )
                      return current;
                    const tabs = [...current.tabs];
                    const [moved] = tabs.splice(source, 1);
                    tabs.splice(target, 0, moved);
                    return { ...current, tabs };
                  })
                }
                onOpenInNewWindow={(id) => {
                  const tab = workspace.tabs.find((item) => item.id === id);
                  if (!tab) return;
                  const url = new URL(window.location.href);
                  url.searchParams.set("view", tab.view);
                  url.searchParams.set("detached", "1");
                  window.open(url.href, "_blank", "popup,noopener,noreferrer");
                }}
              />
            </header>
            <main
              id="content"
              className="content"
              data-view={category}
              tabIndex={-1}
            >
              {category !== "chat" && (
                <>
                  <div className="page-heading">
                    <div>
                      <div className="eyebrow">
                        ASHARCA UI <span>/</span> COMPONENT LIBRARY
                      </div>
                      <h1>
                        {category === "all" ? "组件工作台" : current.label}
                      </h1>
                      <p>细节就位，专注创造。</p>
                    </div>
                    <div className="heading-actions">
                      <CopyButton
                        text="pnpm add @asharca/ui"
                        label="安装组件库"
                        copiedLabel="已复制"
                        failedLabel="复制失败"
                        className="ui-button-secondary ui-button-outline"
                      />
                      <DialogTrigger asChild>
                        <Button variant="primary">
                          <Plus size={15} />
                          新建项目
                        </Button>
                      </DialogTrigger>
                    </div>
                  </div>
                  <div className="catalog-toolbar">
                    <div className="catalog-label">
                      <span>{query ? "搜索结果" : "组件示例"}</span>
                      <Badge>{matching.length}</Badge>
                    </div>
                    <SearchInput
                      ref={searchRef}
                      label="搜索组件"
                      clearLabel="清空关键词"
                      placeholder="搜索组件…"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onClear={() => setQuery("")}
                    />
                  </div>
                </>
              )}
              {category === "chat" ? (
                <section className="chat-workspace" aria-label="聊天界面">
                  <div className="chat-content">
                    <Suspense
                      fallback={
                        <div className="chat-loading">
                          <Skeleton />
                          <Skeleton />
                          <Skeleton />
                        </div>
                      }
                    >
                      <ChatExample />
                    </Suspense>
                  </div>
                </section>
              ) : (
                <>
                  <div className="example-grid">
                    {matching.map((item) => (
                      <Example
                        key={item.id}
                        item={item}
                        notify={setNotice}
                        onCreate={() => setDialogOpen(true)}
                      />
                    ))}
                  </div>
                  {!matching.length && (
                    <EmptyState
                      icon={Search}
                      title="没有匹配的组件"
                      description={`未找到“${query}”`}
                      actions={
                        <Button
                          variant="outline"
                          onClick={() => {
                            setQuery("");
                            searchRef.current?.focus();
                          }}
                        >
                          清除搜索
                        </Button>
                      }
                    />
                  )}
                  {category === "data" && !query && (
                    <section className="project-section">
                      <div className="section-heading">
                        <div>
                          <h2>所有项目</h2>
                          <p>工作空间中的项目与发布状态。</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const url = URL.createObjectURL(
                              new Blob([JSON.stringify(items, null, 2)], {
                                type: "application/json",
                              }),
                            );
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = "projects.json";
                            link.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <ArrowDownToLine size={14} />
                          导出
                        </Button>
                      </div>
                      <div className="row spread table-toolbar">
                        <div className="row tight">
                          {["全部", "已发布", "进行中"].map((label) => (
                            <Chip
                              asChild
                              key={label}
                              active={filter === label}
                              aria-pressed={filter === label}
                              onClick={() => {
                                setFilter(label);
                                setPage(0);
                              }}
                            >
                              <button type="button">{label}</button>
                            </Chip>
                          ))}
                        </div>
                        <span className="muted">{filtered.length} 个项目</span>
                      </div>
                      <DataTable
                        panel={false}
                        label="项目列表"
                        minWidth="36rem"
                        headers={[
                          { label: "项目名称" },
                          { label: "状态" },
                          { label: "更新时间" },
                          { label: "操作", align: "right" },
                        ]}
                      >
                        {filtered
                          .slice(activePage * 3, activePage * 3 + 3)
                          .map((item) => (
                            <tr key={item.name}>
                              <td>
                                <Entity
                                  title={item.name}
                                  description={item.detail}
                                  initials={item.initials}
                                />
                              </td>
                              <td>
                                <StatusBadge
                                  label={item.status}
                                  tone={item.tone}
                                />
                              </td>
                              <td className="muted">{item.date}</td>
                              <td className="cell-action">
                                <IconButton
                                  label={`查看 ${item.name}`}
                                  variant="ghost"
                                  icon={<ArrowUpRight size={16} />}
                                  onClick={() =>
                                    setNotice(
                                      `${item.name} · ${item.detail} · ${item.status}`,
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))}
                      </DataTable>
                      <Pagination
                        className="table-pagination"
                        summary={`第 ${activePage + 1} / ${pages} 页`}
                        previous={
                          <IconButton
                            label="上一页"
                            icon={<ArrowLeft size={15} />}
                            variant="outline"
                            disabled={activePage === 0}
                            onClick={() => setPage(activePage - 1)}
                          />
                        }
                        next={
                          <IconButton
                            label="下一页"
                            icon={<ArrowRight size={15} />}
                            variant="outline"
                            disabled={activePage === pages - 1}
                            onClick={() => setPage(activePage + 1)}
                          />
                        }
                      />
                    </section>
                  )}
                </>
              )}
              {category !== "chat" && (
                <footer className="page-footer">
                  <span>
                    <Box size={14} />
                    asharca / ui
                  </span>
                  <span>
                    Crafted with care. <span className="footer-dot">·</span> MIT
                    License
                  </span>
                </footer>
              )}
            </main>
          </div>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="project-dialog">
              <div className="row spread">
                <DialogTitle>新建项目</DialogTitle>
                <DialogClose asChild>
                  <IconButton
                    variant="ghost"
                    label="关闭"
                    icon={<X size={17} />}
                  />
                </DialogClose>
              </div>
              <DialogDescription>为工作空间添加一个新项目。</DialogDescription>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const name = projectName.trim();
                  if (!name || items.some((item) => item.name === name)) return;
                  setItems([
                    ...items,
                    {
                      name,
                      detail: "新建工作空间项目",
                      initials: name.slice(0, 2),
                      status: "进行中",
                      tone: "neutral",
                      date: new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                      }).format(new Date()),
                    },
                  ]);
                  setProjectName("");
                  setDialogOpen(false);
                  setNotice("项目已创建");
                  navigate("data");
                  setFilter("全部");
                  setPage(Math.floor(items.length / 3));
                }}
              >
                <Field>
                  <FieldLabel htmlFor="project-name">项目名称</FieldLabel>
                  <Input
                    id="project-name"
                    required
                    maxLength={60}
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    aria-describedby="project-hint"
                  />
                  <FieldDescription id="project-hint">
                    {items.some((item) => item.name === projectName.trim())
                      ? "项目名称已存在"
                      : "名称需要唯一，最多 60 个字符。"}
                  </FieldDescription>
                </Field>
                <div className="dialog-actions">
                  <DialogClose asChild>
                    <Button variant="outline">取消</Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={
                      !projectName.trim() ||
                      items.some((item) => item.name === projectName.trim())
                    }
                  >
                    创建项目
                    <ArrowRight size={15} />
                  </Button>
                </div>
              </form>
            </DialogContent>
          </DialogPortal>
          {notice && (
            <div className="toast" role="status">
              <span className="toast-icon">
                <Check size={15} />
              </span>
              <span>{notice}</span>
              <IconButton
                label="关闭通知"
                variant="ghost"
                size="sm"
                icon={<X size={14} />}
                onClick={() => setNotice("")}
              />
            </div>
          )}
        </div>
      </Dialog>
    </TooltipProvider>
  );
}
