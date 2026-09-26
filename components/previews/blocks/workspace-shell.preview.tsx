"use client";

import { Bot, Boxes, Check, ChevronsUpDown, CircleUserRound, Command, FileText, LayoutDashboard, LogOut, Menu, Moon, Plug, Settings2, Sun } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/motion/button/base";
import { AnimatedSidebarTrigger, useAnimatedSidebar } from "@/components/motion/animated-sidebar";
import { Popover, PopoverContent, PopoverTrigger, usePopoverContext } from "@/components/motion/popover";
import { cn } from "@/lib/utils";
import { WorkspaceShell, openWorkspaceWindow } from "@/components/workspace/workspace-shell";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { WorkspaceTabBar, type WorkspaceTab } from "@/components/workspace/workspace-tab-bar";

const destinations = [
  { id: "overview", label: "概览", icon: <LayoutDashboard /> },
  { id: "agents", label: "Agents", icon: <Bot /> },
  { id: "mcp", label: "MCP 服务", icon: <Plug /> },
  { id: "files", label: "项目文件", icon: <FileText /> },
];
const groups = [
  { id: "work", title: "工作台", items: destinations },
  { id: "manage", title: "管理", items: [{ id: "settings", label: "工作区设置", icon: <Settings2 /> }] },
];
const initial: WorkspaceTab[] = destinations.slice(0, 3).map((item, i) => ({ id: item.id, title: item.label, icon: item.icon, pinned: i === 0 }));
const defaultNotes = { overview: "整理本周的工作区任务" };
const storagePrefix = "asharca:beui-workspace:";
interface Snapshot { version: 1; id: string; title: string; note: string }
function readSnapshot(key: string): Snapshot | null {
  if (!/^[a-f\d-]{36}$/.test(key)) return null;
  try {
    const raw = sessionStorage.getItem(storagePrefix + key);
    if (!raw || raw.length > 30000) return null;
    const value: Partial<Snapshot> = JSON.parse(raw);
    if (value.version !== 1 || typeof value.id !== "string" || value.id.length > 128 || typeof value.title !== "string" || value.title.length > 128 || typeof value.note !== "string" || value.note.length > 20000) return null;
    return value as Snapshot;
  } catch { return null; }
}

const workspaces = [
  { id: "local", name: "本地工作区", hint: "个人 · 免费", mark: <Command className="size-3.5" /> },
  { id: "acme", name: "Acme 团队", hint: "12 名成员", mark: <Boxes className="size-3.5" /> },
  { id: "solo", name: "独立项目", hint: "个人 · Pro", mark: <FileText className="size-3.5" /> },
];
type WorkspaceOption = (typeof workspaces)[number];

/** Sidebar footer: workspace switcher + avatar, both goo Popovers like the
 *  animated-sidebar sample. Lives in the preview so the reusable sidebar
 *  never invents business data. */
function WorkspaceFooter({ compact }: { compact: boolean }) {
  const [current, setCurrent] = useState<WorkspaceOption | undefined>(workspaces[0]);
  if (!current) return null;
  return (
    <div className="flex w-full flex-col gap-1">
      <Popover side="top" align="start">
        <PopoverTrigger>
          <button type="button" aria-label="切换工作区" className="flex h-9 w-full items-center gap-2 overflow-hidden rounded-lg px-1 py-1 text-left text-xs text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-background text-foreground">{current.mark}</span>
            {!compact && <span className="min-w-0 flex-1 truncate">{current.name}</span>}
            {!compact && <ChevronsUpDown className="size-3.5 shrink-0" />}
          </button>
        </PopoverTrigger>
        <WorkspaceSwitcherContent workspaces={workspaces} currentId={current.id} onPick={setCurrent} />
      </Popover>
      <Popover side="top" align="start">
        <PopoverTrigger>
          <button type="button" aria-label="账户菜单" className="flex h-9 w-full items-center gap-2 overflow-hidden rounded-lg px-1 py-1 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#d5ff66] text-[11px] font-semibold text-[#172000]">AS</span>
            {!compact && <span className="min-w-0 flex-1"><span className="block truncate text-xs leading-4 font-medium text-foreground">Ava Stone</span><span className="block truncate text-[10px] leading-3 text-muted-foreground">ava@solace.app</span></span>}
          </button>
        </PopoverTrigger>
        <AccountMenuContent />
      </Popover>
    </div>
  );
}

function WorkspaceSwitcherContent({ workspaces, currentId, onPick }: {
  workspaces: WorkspaceOption[];
  currentId: string;
  onPick: (workspace: WorkspaceOption) => void;
}) {
  const { setOpen } = usePopoverContext("PopoverContent");
  return <PopoverContent className="w-60 p-1.5">
    <p className="px-2.5 pb-1 pt-2 text-[10px] font-medium text-muted-foreground">工作区</p>
    {workspaces.map((workspace) => (
      <button key={workspace.id} type="button" onClick={() => { onPick(workspace); setOpen(false); }}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted/60">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-foreground">{workspace.mark}</span>
        <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium text-foreground">{workspace.name}</span><span className="block truncate text-[10px] text-muted-foreground">{workspace.hint}</span></span>
        {currentId === workspace.id && <Check className="size-3.5 shrink-0 text-foreground" />}
      </button>
    ))}
  </PopoverContent>;
}

const ACCOUNT_ITEMS = [["个人资料", CircleUserRound], ["偏好设置", Settings2], ["退出登录", LogOut]] as const;

function AccountMenuContent() {
  const { setOpen } = usePopoverContext("PopoverContent");
  return <PopoverContent className="w-56 p-1.5">
    <p className="px-2.5 pb-1 pt-2 text-xs font-medium text-foreground">Ava Stone</p>
    <p className="px-2.5 pb-1.5 text-[10px] text-muted-foreground">ava@solace.app</p>
    <div className="my-1 h-px bg-border" />
    {ACCOUNT_ITEMS.map(([label, Icon]) => (
      <button key={label} type="button" onClick={() => setOpen(false)}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs text-foreground outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted/60">
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />{label}
      </button>
    ))}
  </PopoverContent>;
}

/** WorkspaceSidebar renders its footer inside the AnimatedSidebar tree, so the
 *  bridge can read the collapse state there and hand it to the demo footer. */
function WorkspaceSidebarFooterBridge(props: { title: string; logo?: ReactNode; groups: typeof groups; activeId: string; onSelect: (id: string) => void }) {
  const { open, isMobile } = useAnimatedSidebar();
  return <WorkspaceSidebar {...props} footer={<WorkspaceFooter compact={!open && !isMobile} />} />;
}

/** This demo owns all sample state; reusable components never invent business data. */
export function WorkspaceDemo({ fullPage = false, detachedKey }: { fullPage?: boolean; detachedKey?: string }) {
  const instance = useId();
  const sequence = useRef(0);
  const [tabs, setTabs] = useState<WorkspaceTab[]>(initial);
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>(defaultNotes);
  const [saved, setSaved] = useState<Record<string, string>>(defaultNotes);
  const [loaded, setLoaded] = useState(!detachedKey);
  const [invalid, setInvalid] = useState(false);
  const [error, setError] = useState("");
  const { resolvedTheme, setTheme } = useTheme();
  const [themeReady, setThemeReady] = useState(false);
  useEffect(() => setThemeReady(true), []);
  useEffect(() => {
    if (!detachedKey) return;
    const snapshot = readSnapshot(detachedKey);
    if (snapshot) {
      setTabs([{ id: snapshot.id, title: snapshot.title, icon: <Boxes /> }]);
      setActive(snapshot.id); setNotes({ [snapshot.id]: snapshot.note }); setSaved({ [snapshot.id]: snapshot.note });
    } else setInvalid(true);
    setLoaded(true);
  }, [detachedKey]);
  useEffect(() => {
    if (!detachedKey || !loaded || invalid) return;
    const current = tabs.find((item) => item.id === active);
    if (!current) return;
    try {
      sessionStorage.setItem(storagePrefix + detachedKey, JSON.stringify({ version: 1, id: current.id, title: current.title, note: notes[current.id] ?? "" } satisfies Snapshot));
      document.title = `${current.title} — Asharca Workspace`;
    } catch { setError("无法保存窗口状态，请在刷新前复制便签。"); }
  }, [active, detachedKey, invalid, loaded, notes, tabs]);
  const panelId = (id: string) => `${instance}-panel-${id}`;
  const tabId = (id: string) => `${instance}-tab-${id}`;
  const isDirty = (id: string) => (notes[id] ?? "") !== (saved[id] ?? "");
  function select(id: string) {
    const item = groups.flatMap((group) => group.items).find((candidate) => candidate.id === id);
    if (!item) return;
    setTabs((current) => current.some((tab) => tab.id === id) ? current : [...current, { id, title: item.label, icon: item.icon }]);
    setActive(id);
  }
  function close(id: string) {
    const target = tabs.find((tab) => tab.id === id);
    if (!target || target.pinned || target.closable === false || tabs.length === 1) return;
    if (isDirty(id) && !window.confirm(`“${target.title}”有未保存内容，仍要关闭吗？`)) return;
    const remaining = tabs.filter((tab) => tab.id !== id);
    if (active === id) setActive(remaining[Math.min(tabs.indexOf(target), remaining.length - 1)].id);
    setTabs(remaining);
  }
  function reorder(sourceId: string, targetId: string) {
    setTabs((current) => {
      const result = [...current]; const a = result.findIndex((tab) => tab.id === sourceId); const b = result.findIndex((tab) => tab.id === targetId);
      if (a < 0 || b < 0 || Boolean(result[a].pinned) !== Boolean(result[b].pinned)) return current;
      result.splice(b, 0, result.splice(a, 1)[0]); return result;
    });
  }
  function pin(id: string, pinned: boolean) {
    setTabs((current) => current.map((tab) => tab.id === id ? { ...tab, pinned } : tab).sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))));
  }
  function add() {
    const id = `note-${++sequence.current}`;
    setTabs((current) => [...current, { id, title: `新标签 ${sequence.current}`, icon: <FileText /> }]); setActive(id);
  }
  function openWindow(id: string) {
    const tab = tabs.find((item) => item.id === id);
    if (!tab) return;
    setError("");
    try {
      const key = crypto.randomUUID();
      const url = new URL("/workspace", window.location.href); url.searchParams.set("window", key);
      const snapshot: Snapshot = { version: 1, id, title: tab.title, note: notes[id] ?? "" };
      const popup = openWorkspaceWindow(url, (child) => { child.sessionStorage.clear(); child.sessionStorage.setItem(storagePrefix + key, JSON.stringify(snapshot)); });
      if (!popup) setError("新窗口被浏览器拦截；原标签和便签已保留。");
    } catch { setError("无法打开独立窗口；原标签和便签已保留。"); }
  }
  if (!loaded) return <p role="status" className="p-6 text-sm">正在读取此窗口的便签…</p>;
  if (invalid) return <div className="grid h-dvh place-content-center gap-3 p-6"><h1 className="text-lg font-semibold">此窗口的本地状态已不可用</h1><p className="text-sm text-muted-foreground">原工作区未受影响。</p><a href="/workspace" className="underline underline-offset-4">返回工作区</a></div>;
  return <WorkspaceShell className={fullPage ? "h-dvh" : "h-[640px] rounded-2xl"} open={open} onOpenChange={setOpen} openMobile={mobileOpen} onOpenMobileChange={setMobileOpen}
    sidebar={detachedKey ? undefined : <WorkspaceSidebarFooterBridge title="Asharca Workspace" logo={<Image src="/beui-mark.png" alt="" aria-hidden="true" width={28} height={28} className="size-7 rounded-lg" />} groups={groups} activeId={active} onSelect={select} />}
    mobileHeader={detachedKey ? undefined : <><AnimatedSidebarTrigger aria-label="打开工作区导航" className="size-8"><Menu className="size-4" /></AnimatedSidebarTrigger><span className="text-xs font-medium">Asharca Workspace</span></>}
    tabBar={<WorkspaceTabBar tabs={tabs.map((tab) => ({ ...tab, dirty: isDirty(tab.id), tabId: tabId(tab.id), panelId: panelId(tab.id) }))} activeTabId={active} onSelect={setActive} onClose={close} onReorder={reorder} onPinnedChange={pin} onNewTab={add} onOpenInNewWindow={openWindow}
      actions={<Button variant="ghost" size="icon" aria-label="切换深浅主题" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>{themeReady && resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}</Button>} />}
    footer={<div className="flex h-8 items-center justify-between gap-2 border-t border-border/50 px-5 text-[11px] text-muted-foreground"><span>基于 beUI · 本地示例</span><span>{tabs.length} 个标签</span></div>}>
    {error && <p role="alert" className="mx-5 mt-3 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">{error}</p>}
    {tabs.map((tab) => (
      // biome-ignore lint/a11y/noNoninteractiveTabindex: ARIA tabpanels need a keyboard entry point for their content.
      <div key={tab.id} role="tabpanel" id={panelId(tab.id)} aria-labelledby={tabId(tab.id)} hidden={active !== tab.id} inert={active !== tab.id} tabIndex={0} className="min-h-full p-5 outline-none md:p-7">
      <div className="mb-6 flex items-center justify-between gap-3"><div><p className="mb-1 text-[11px] text-muted-foreground">工作台</p><h1 className="text-xl font-semibold tracking-tight">{tab.title}</h1></div><Button variant="outline" size="sm" onClick={() => setSaved((value) => ({ ...value, [tab.id]: notes[tab.id] ?? "" }))}><Check className="size-3.5" />保存便签</Button></div>
      <div className="grid gap-3 sm:grid-cols-3">{["项目管理", "Agent 对话", "资源连接"].map((label, i) => <button key={label} type="button" onClick={() => select(["files", "agents", "mcp"][i])} className="group rounded-xl border border-border/70 p-4 text-left transition-colors hover:bg-muted/40"><span className="mb-4 inline-flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">{i === 0 ? <Boxes className="size-4" /> : i === 1 ? <Bot className="size-4" /> : <Plug className="size-4" />}</span><span className="block text-sm font-medium">{label}</span><span className="mt-1 block text-xs text-muted-foreground">在工作区标签中打开</span></button>)}</div>
      <section className="mt-6 rounded-xl border border-border/70 p-4"><div className="mb-3 flex items-center justify-between"><label htmlFor={`${instance}-note-${tab.id}`} className="text-sm font-medium">工作便签</label><span role="status" className="text-[11px] text-muted-foreground">{isDirty(tab.id) ? "未保存" : "已保存"}</span></div>
        <textarea id={`${instance}-note-${tab.id}`} aria-label={`${tab.title}便签`} value={notes[tab.id] ?? ""} maxLength={20000} onChange={(event) => setNotes((current) => ({ ...current, [tab.id]: event.target.value }))} placeholder="写下当前任务，切换标签后内容仍会保留。" className="min-h-36 w-full resize-y rounded-lg bg-muted/35 p-3 text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </section>
    </div>))}
  </WorkspaceShell>;
}

export function WorkspaceShellPreview() { return <div className="w-full min-w-0"><WorkspaceDemo /><a href="/workspace" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-muted-foreground underline underline-offset-4">打开独立工作区演示</a></div>; }
