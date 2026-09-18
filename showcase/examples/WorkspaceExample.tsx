import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  Menu,
  Moon,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {
  IconButton,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
  ToolPlaneLogo,
  WorkspaceSidebar,
  WorkspaceTabBar,
} from "../../src/index";
import { version } from "../../package.json";
import {
  WorkspaceViewContent,
  workspaceViews,
} from "./WorkspaceComponents";

const ChatExample = lazy(() => import("./WorkspaceChat"));

export function WorkspaceExample({ embedded = false }: { embedded?: boolean }) {
  const params = new URLSearchParams(window.location.search);
  const detached = params.get("detached") === "1";
  const [workspace, setWorkspace] = useState(() => {
    const requested = params.get("view");
    const view = workspaceViews.some((item) => item.id === requested)
      ? requested!
      : "chat";
    if (detached) {
      return {
        tabs: [{ id: "requested", view, pinned: false }],
        activeId: "requested",
      };
    }
    const tabs = [
      { id: "assistant", view: "chat", pinned: true },
      { id: "agents", view: "work", pinned: false },
      { id: "knowledge", view: "knowledge", pinned: false },
    ];
    const existing = tabs.find((tab) => tab.view === view);
    if (!existing) tabs.push({ id: "requested", view, pinned: false });
    return { tabs, activeId: existing?.id ?? "requested" };
  });
  const activeView =
    workspace.tabs.find((tab) => tab.id === workspace.activeId)?.view ?? "chat";
  const current =
    workspaceViews.find((item) => item.id === activeView) ?? workspaceViews[0];
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
      const first = controls[0];
      const last = controls[controls.length - 1];
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
    setWorkspace((state) => {
      const existing = state.tabs.find((tab) => tab.view === view);
      if (existing) return { ...state, activeId: existing.id };
      const active = state.tabs.find((tab) => tab.id === state.activeId)!;
      if (!active.pinned) {
        return {
          ...state,
          tabs: state.tabs.map((tab) =>
            tab.id === active.id ? { ...tab, view } : tab,
          ),
        };
      }
      const tab = { id: crypto.randomUUID(), view, pinned: false };
      return { tabs: [...state.tabs, tab], activeId: tab.id };
    });
    setQuery("");
    setMenuOpen(false);
  }

  function closeTab(id: string) {
    setWorkspace((state) => {
      const index = state.tabs.findIndex((tab) => tab.id === id);
      if (index < 0 || state.tabs.length === 1) return state;
      const fallback = state.tabs[index + 1] ?? state.tabs[index - 1];
      return {
        tabs: state.tabs.filter((tab) => tab.id !== id),
        activeId: state.activeId === id ? fallback.id : state.activeId,
      };
    });
    setQuery("");
  }

  function openTabInNewWindow(id: string) {
    const tab = workspace.tabs.find((item) => item.id === id);
    if (!tab) return;
    const popup = window.open("about:blank", "_blank", "popup");
    if (!popup) return;
    const url = new URL(window.location.href);
    url.searchParams.set("view", tab.view);
    url.searchParams.set("detached", "1");
    popup.opener = null;
    popup.location.replace(url.href);
    if (workspace.tabs.length === 1) {
      const replacement = {
        id: crypto.randomUUID(),
        view: "chat",
        pinned: false,
      };
      setWorkspace({ tabs: [replacement], activeId: replacement.id });
      setQuery("");
    } else {
      closeTab(id);
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className="workbench"
        data-toolplane-ui="showcase"
        data-sidebar-collapsed={collapsed}
        data-detached={detached || undefined}
      >
        {!detached && (
          <>
            <a className="skip-link" href="#content">
              跳转到内容
            </a>
            <WorkspaceSidebar
              ref={sidebarRef}
              id="showcase-sidebar"
              aria-label="工作台导航"
              role={menuOpen ? "dialog" : undefined}
              aria-modal={menuOpen || undefined}
              brand={
                <>
                  Tool
                  <span className="font-medium text-muted-foreground">Plane</span>
                </>
              }
              brandIcon={<ToolPlaneLogo svgSize={30} showWordmark={false} />}
              brandLabel="ToolPlane 工作区首页"
              onBrandClick={() => navigate("chat")}
              collapsed={collapsed}
              onCollapsedChange={setCollapsed}
              mobileOpen={menuOpen}
              onMobileOpenChange={setMenuOpen}
              mobileCloseRef={mobileClose}
              labels={{
                collapse: "折叠侧边栏",
                expand: "展开侧边栏",
                close: "收起导航",
              }}
              navigationLabel="工作区导航"
              activeId={activeView}
              onSelect={navigate}
              items={workspaceViews.map(({ id, label, icon: Icon }) => ({
                id,
                label,
                icon: <Icon size={18} />,
              }))}
              workspace={{
                icon: "DW",
                name: "Design workspace",
                description: "所有者",
                badge: <ChevronsUpDown size={16} />,
              }}
              footer={
                <>
                  <UserRound size={18} />
                  <span>
                    <strong>Asharca Studio</strong>
                  </span>
                </>
              }
            />
            {menuOpen && (
              <button
                className="sidebar-scrim"
                tabIndex={-1}
                aria-label="关闭导航"
                onClick={() => setMenuOpen(false)}
              />
            )}
          </>
        )}
        <div className="main-column" ref={mainRef}>
          {!detached && (
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
              {!embedded && (
                <a className="workbench-return" href="#/examples">
                  <ArrowLeft size={15} />
                  <span>返回示例区</span>
                </a>
              )}
              <WorkspaceTabBar
                actions={
                  !embedded && (
                    <div className="topbar-actions">
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
                        <FaGithub size={18} />
                      </a>
                    </div>
                  )
                }
                activeTabId={workspace.activeId}
                tabs={workspace.tabs.map((tab) => {
                  const definition = workspaceViews.find(
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
                  openInNewWindow: (label) => `单独打开 ${label}`,
                }}
                onSelect={(id) => {
                  setWorkspace((state) => ({ ...state, activeId: id }));
                  setQuery("");
                }}
                onClose={closeTab}
                onNewTab={() => {
                  const tab = {
                    id: crypto.randomUUID(),
                    view: "chat",
                    pinned: false,
                  };
                  setWorkspace((state) => ({
                    tabs: [...state.tabs, tab],
                    activeId: tab.id,
                  }));
                  setQuery("");
                }}
                onTogglePinned={(id) =>
                  setWorkspace((state) => ({
                    ...state,
                    tabs: state.tabs
                      .map((tab) =>
                        tab.id === id ? { ...tab, pinned: !tab.pinned } : tab,
                      )
                      .sort((a, b) => Number(b.pinned) - Number(a.pinned)),
                  }))
                }
                onReorder={(sourceId, targetId) =>
                  setWorkspace((state) => {
                    const source = state.tabs.findIndex(
                      (tab) => tab.id === sourceId,
                    );
                    const target = state.tabs.findIndex(
                      (tab) => tab.id === targetId,
                    );
                    if (
                      source < 0 ||
                      target < 0 ||
                      source === target ||
                      state.tabs[source].pinned !== state.tabs[target].pinned
                    ) {
                      return state;
                    }
                    const tabs = [...state.tabs];
                    const [moved] = tabs.splice(source, 1);
                    tabs.splice(target, 0, moved);
                    return { ...state, tabs };
                  })
                }
                onOpenInNewWindow={openTabInNewWindow}
              />
            </header>
          )}
          <main
            id="content"
            className="content"
            data-view={activeView}
            aria-labelledby={
              activeView === "chat" ? undefined : `workspace-view-${activeView}`
            }
            tabIndex={-1}
          >
            {activeView === "chat" ? (
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
              <WorkspaceViewContent
                view={current}
                query={query}
                onQueryChange={setQuery}
                onNotify={setNotice}
              />
            )}
          </main>
        </div>
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
    </TooltipProvider>
  );
}
