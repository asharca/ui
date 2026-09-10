import { Plus } from "lucide-react";
import { useState } from "react";
import * as UI from "../src/index";
import { SearchDemo } from "./demos/SearchDemo";
import { WorkspaceSidebarDemo } from "./demos/WorkspaceSidebarDemo";
import { WorkspaceDemo } from "./demos/WorkspaceDemo";
import { ToolbarDemo } from "./demos/ToolbarDemo";
import { ConversationDemo } from "./demos/ConversationDemo";
import { ShellDemo } from "./demos/ShellDemo";
import { ChatThreadDemo } from "./demos/ChatThreadDemo";

const dataTableRows = [
  ["Design System", "已发布", "Ava"],
  ["Mobile App", "进行中", "Leo"],
  ["API Gateway", "风险", "Mia"],
];

function SelectableDataTableDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="docs-demo-stack">
      <div className="row spread table-toolbar">
        <span>{selected.length ? `已选择 ${selected.length} 项` : "选择项目"}</span>
        <UI.Button
          size="sm"
          variant="ghost"
          className={selected.length ? "" : "table-toolbar__hidden-action"}
          aria-hidden={!selected.length}
          tabIndex={selected.length ? 0 : -1}
          onClick={() => setSelected([])}
        >
          清除选择
        </UI.Button>
      </div>
      <UI.DataTable
        label="项目列表"
        headers={[{ label: "项目" }, { label: "状态" }, { label: "负责人" }]}
        rowIds={dataTableRows.map(([name]) => name)}
        rowLabels={dataTableRows.map(([name]) => name)}
        selectedRowIds={selected}
        onSelectedRowIdsChange={setSelected}
        selectable
        minWidth="32rem"
      >
        <tbody>
          {dataTableRows.map(([name, status, owner]) => (
            <tr key={name}>
              <td>{name}</td><td>{status}</td><td>{owner}</td>
            </tr>
          ))}
        </tbody>
      </UI.DataTable>
    </div>
  );
}

export const componentDocs = [
  { id: "workspace-sidebar", name: "WorkspaceSidebar", description: "支持折叠、徽标、底部插槽和移动端开关的受控侧边栏。路由、移动端焦点管理与偏好持久化由宿主负责。", file: "WorkspaceSidebar.tsx", module: "workspace-sidebar", code: "", demoFile: "WorkspaceSidebarDemo.tsx", preview: <WorkspaceSidebarDemo /> },
  {
    id: "submit-button",
    name: "SubmitButton",
    description: "跟随 React 表单提交状态的按钮。",
    file: "Forms.tsx",
    module: "forms",
    code: '<form action={async () => {}}><SubmitButton className="ui-button-primary">保存</SubmitButton></form>',
    preview: (
      <form
        action={async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }}
      >
        <UI.SubmitButton className="ui-button-primary">保存</UI.SubmitButton>
      </form>
    ),
  },
  {
    id: "confirm-submit-button",
    name: "ConfirmSubmitButton",
    description: "提交前进行内联确认的表单操作。",
    file: "Forms.tsx",
    module: "forms",
    code: '<form action={async () => {}}><ConfirmSubmitButton triggerLabel="删除" confirmLabel="确认删除" cancelLabel="取消" prompt="确定删除？" /></form>',
    preview: (
      <form action={async () => {}}>
        <UI.ConfirmSubmitButton
          triggerLabel="删除"
          confirmLabel="确认删除"
          cancelLabel="取消"
          prompt="确定删除？"
        />
      </form>
    ),
  },
  {
    id: "content-page",
    name: "ContentPage",
    description: "标题和正文组成的内容页容器。",
    file: "ContentPage.tsx",
    module: "",
    code: '<ContentPage title="项目说明">这是项目的详细说明。</ContentPage>',
    preview: (
      <UI.ContentPage title="项目说明">这是项目的详细说明。</UI.ContentPage>
    ),
  },
  {
    id: "rotating-headline",
    name: "RotatingHeadline",
    description: "依次展示词语，并尊重减少动态效果偏好。",
    file: "RotatingHeadline.tsx",
    module: "",
    code: '<RotatingHeadline words={["设计", "构建", "交付"]} />',
    preview: <UI.RotatingHeadline words={["设计", "构建", "交付"]} />,
  },
  {
    id: "safe-streamdown",
    name: "SafeStreamdown",
    description: "带受限原始 HTML 处理的 Markdown 渲染器。",
    file: "SafeStreamdown.tsx",
    module: "",
    code: '<SafeStreamdown>{"**发布计划**\\n\\n- 检查组件\\n- 验证构建"}</SafeStreamdown>',
    preview: (
      <UI.SafeStreamdown>
        {"**发布计划**\n\n- 检查组件\n- 验证构建"}
      </UI.SafeStreamdown>
    ),
  },
  {
    id: "sidebar-action-rail",
    name: "SidebarActionRail",
    description: "侧边栏条目的渐进式操作区。",
    file: "Sidebar.tsx",
    module: "",
    code: '<SidebarActionRail active><SidebarActionButton aria-label="添加"><Plus /></SidebarActionButton></SidebarActionRail>',
    preview: (
      <UI.SidebarActionRail active>
        <UI.SidebarActionButton data-active aria-label="添加">
          <Plus size={16} />
        </UI.SidebarActionButton>
      </UI.SidebarActionRail>
    ),
  },
  {
    id: "navigation-tabs",
    name: "NavigationTabs",
    description: "由宿主控制链接与激活状态的导航容器。",
    file: "Navigation.tsx",
    module: "navigation",
    code: '<NavigationTabs><Tab asChild navigation current><a href="#/installation">安装</a></Tab><Tab asChild navigation><a href="#/components/button">组件</a></Tab></NavigationTabs>',
    preview: (
      <UI.NavigationTabs>
        <UI.Tab asChild navigation current>
          <a href="#/installation">安装</a>
        </UI.Tab>
        <UI.Tab asChild navigation>
          <a href="#/components/button">组件</a>
        </UI.Tab>
      </UI.NavigationTabs>
    ),
  },
  {
    id: "card",
    name: "Card",
    description: "用于单个内容项的容器。",
    file: "Layout.tsx",
    module: "layout",
    code: "<Card>设计系统 · 最近更新</Card>",
    preview: <UI.Card>设计系统 · 最近更新</UI.Card>,
  },
  {
    id: "page",
    name: "Page",
    description: "页面容器与页头组合。",
    file: "Layout.tsx",
    module: "layout",
    code: '<Page as="div"><PageHeader title="项目" description="管理工作空间中的项目。" /></Page>',
    preview: (
      <UI.Page as="div">
        <UI.PageHeader title="项目" description="管理工作空间中的项目。" />
      </UI.Page>
    ),
  },
  {
    id: "section",
    name: "Section",
    description: "包含标题和操作区的内容分区。",
    file: "Layout.tsx",
    module: "layout",
    code: '<Section title="团队成员" count={2}>Ava · Leo</Section>',
    preview: (
      <UI.Section title="团队成员" count={2}>
        Ava · Leo
      </UI.Section>
    ),
  },
  {
    id: "panel",
    name: "Panel",
    description: "带标题与说明的工具面板。",
    file: "Layout.tsx",
    module: "layout",
    code: '<Panel title="发布设置" description="当前工作区">生产环境</Panel>',
    preview: (
      <UI.Panel title="发布设置" description="当前工作区">
        生产环境
      </UI.Panel>
    ),
  },
  {
    id: "toolbar",
    name: "Toolbar",
    description: "主内容和动作的水平布局。",
    file: "Layout.tsx",
    module: "layout",
    code: "<Toolbar actions={<Button>新建</Button>}>所有项目</Toolbar>",
    preview: (
      <UI.Toolbar actions={<UI.Button>新建</UI.Button>}>所有项目</UI.Toolbar>
    ),
  },
  {
    id: "empty-state",
    name: "EmptyState",
    description: "无数据时的上下文提示。",
    file: "Layout.tsx",
    module: "layout",
    code: '<EmptyState title="暂无项目" description="创建你的第一个项目。" />',
    preview: (
      <UI.EmptyState title="暂无项目" description="创建你的第一个项目。" />
    ),
  },
  {
    id: "entity",
    name: "Entity",
    description: "紧凑展示实体名称与辅助信息。",
    file: "Layout.tsx",
    module: "layout",
    code: '<Entity title="Design System" description="共享组件库" initials="DS" />',
    preview: (
      <UI.Entity title="Design System" description="共享组件库" initials="DS" />
    ),
  },
  {
    id: "status-badge",
    name: "StatusBadge",
    description: "带状态点与文字的标记。",
    file: "Feedback.tsx",
    module: "feedback",
    code: '<StatusBadge tone="success" label="运行中" />',
    preview: <UI.StatusBadge tone="success" label="运行中" />,
  },
  {
    id: "chip",
    name: "Chip",
    description: "轻量筛选或分类标签。",
    file: "Navigation.tsx",
    module: "navigation",
    code: "<Chip active>全部项目</Chip>",
    preview: <UI.Chip active>全部项目</UI.Chip>,
  },
  {
    id: "breadcrumbs",
    name: "Breadcrumbs",
    description: "用于宿主页面的层级路径导航。",
    file: "Navigation.tsx",
    module: "navigation",
    code: '<Breadcrumbs><BreadcrumbItem>文档</BreadcrumbItem><BreadcrumbItem current separator="/">组件</BreadcrumbItem></Breadcrumbs>',
    preview: (
      <UI.Breadcrumbs>
        <UI.BreadcrumbItem>文档</UI.BreadcrumbItem>
        <UI.BreadcrumbItem current separator="/">
          组件
        </UI.BreadcrumbItem>
      </UI.Breadcrumbs>
    ),
  },
  {
    id: "pagination",
    name: "Pagination",
    description: "页码摘要及上一页、下一页操作槽。",
    file: "Navigation.tsx",
    module: "navigation",
    code: '<Pagination summary="第 1 页 / 共 1 页" previous={<Button disabled>上一页</Button>} next={<Button disabled>下一页</Button>} />',
    preview: (
      <UI.Pagination
        summary="第 1 页 / 共 1 页"
        previous={<UI.Button disabled>上一页</UI.Button>}
        next={<UI.Button disabled>下一页</UI.Button>}
      />
    ),
  },
  {
    id: "hover-card",
    name: "HoverCard",
    description: "链接的补充预览信息。",
    file: "Overlays.tsx",
    module: "overlays",
    code: '<HoverCard><HoverCardTrigger asChild><a href="#/installation">@asharca/ui</a></HoverCardTrigger><HoverCardPortal><HoverCardContent>独立 React 组件库。</HoverCardContent></HoverCardPortal></HoverCard>',
    preview: (
      <UI.HoverCard>
        <UI.HoverCardTrigger asChild>
          <a href="#/installation">@asharca/ui</a>
        </UI.HoverCardTrigger>
        <UI.HoverCardPortal>
          <UI.HoverCardContent>独立 React 组件库。</UI.HoverCardContent>
        </UI.HoverCardPortal>
      </UI.HoverCard>
    ),
  },
  {
    id: "context-menu",
    name: "ContextMenu",
    description: "右键或长按触发的上下文操作。",
    file: "Overlays.tsx",
    module: "overlays",
    code: "<ContextMenu><ContextMenuTrigger>右键打开菜单</ContextMenuTrigger><ContextMenuPortal><ContextMenuContent><ContextMenuItem>查看详情</ContextMenuItem></ContextMenuContent></ContextMenuPortal></ContextMenu>",
    preview: (
      <UI.ContextMenu>
        <UI.ContextMenuTrigger
          style={{ padding: 48, border: "1px dashed currentColor" }}
        >
          右键打开菜单
        </UI.ContextMenuTrigger>
        <UI.ContextMenuPortal>
          <UI.ContextMenuContent>
            <UI.ContextMenuItem>查看详情</UI.ContextMenuItem>
          </UI.ContextMenuContent>
        </UI.ContextMenuPortal>
      </UI.ContextMenu>
    ),
  },
  {
    id: "button",
    name: "Button",
    description: "用于触发操作的按钮，支持尺寸、变体和加载状态。",
    file: "Controls.tsx",
    module: "controls",
    code: '<Button variant="outline">保存更改</Button>',
    preview: (
      <UI.Button
        variant="outline"
        onClick={(e) => {
          e.currentTarget.textContent = "已保存";
        }}
      >
        保存更改
      </UI.Button>
    ),
  },
  {
    id: "icon-button",
    name: "IconButton",
    description: "带可访问名称的图标按钮。",
    file: "Controls.tsx",
    module: "controls",
    code: '<IconButton label="添加" icon={<Plus />} />',
    preview: <UI.IconButton label="添加" icon={<Plus />} />,
  },
  {
    id: "input",
    name: "Input",
    description: "支持原生输入属性与受控状态的文本框。",
    file: "Controls.tsx",
    module: "controls",
    code: '<Input aria-label="邮箱" placeholder="name@example.com" />',
    preview: <UI.Input aria-label="邮箱" placeholder="name@example.com" />,
  },
  {
    id: "textarea",
    name: "Textarea",
    description: "用于多行文本的输入控件。",
    file: "Controls.tsx",
    module: "controls",
    code: '<Textarea aria-label="备注" placeholder="输入备注…" />',
    preview: <UI.Textarea aria-label="备注" placeholder="输入备注…" />,
  },
  {
    id: "select",
    name: "Select",
    description: "保留原生键盘交互的选项选择器。",
    file: "Controls.tsx",
    module: "controls",
    code: '<Select aria-label="环境"><option>开发环境</option><option>生产环境</option></Select>',
    preview: (
      <UI.Select aria-label="环境">
        <option>开发环境</option>
        <option>生产环境</option>
      </UI.Select>
    ),
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "用于独立选项的复选框。",
    file: "Controls.tsx",
    module: "controls",
    code: "<label><Checkbox defaultChecked /> 接收邮件通知</label>",
    preview: (
      <label>
        <UI.Checkbox defaultChecked /> 接收邮件通知
      </label>
    ),
  },
  {
    id: "radio",
    name: "Radio",
    description: "用于互斥选项的单选按钮。",
    file: "Controls.tsx",
    module: "controls",
    code: '<label><Radio name="plan" value="monthly" defaultChecked /> 月付</label>\n<label><Radio name="plan" value="yearly" /> 年付</label>',
    preview: (
      <div className="docs-demo-row">
        <label>
          <UI.Radio name="plan" value="monthly" defaultChecked /> 月付
        </label>
        <label>
          <UI.Radio name="plan" value="yearly" /> 年付
        </label>
      </div>
    ),
  },
  {
    id: "switch",
    name: "Switch",
    description: "用于即时开关设置的二态控件。",
    file: "Controls.tsx",
    module: "controls",
    code: '<Switch aria-label="邮件通知" defaultChecked />',
    preview: <UI.Switch aria-label="邮件通知" defaultChecked />,
  },
  {
    id: "slider",
    name: "Slider",
    description: "在连续数值范围内选择一个值。",
    file: "Controls.tsx",
    module: "controls",
    code: '<Slider aria-label="音量" defaultValue={45} min={0} max={100} />',
    preview: (
      <UI.Slider aria-label="音量" defaultValue={45} min={0} max={100} />
    ),
  },
  {
    id: "search-input",
    name: "SearchInput",
    description: "包含搜索图标的输入框，可通过 onClear 接入清除操作。",
    file: "Controls.tsx",
    module: "controls",
    code: "", demoFile: "SearchDemo.tsx",
    preview: <SearchDemo />,
  },
  {
    id: "field",
    name: "Field",
    description: "组合表单标签、描述与错误提示。",
    file: "Controls.tsx",
    module: "controls",
    code: '<Field><FieldLabel htmlFor="title">标题</FieldLabel><Input id="title" /><FieldDescription>请输入项目名称。</FieldDescription></Field>',
    preview: (
      <UI.Field>
        <UI.FieldLabel htmlFor="demo-title">标题</UI.FieldLabel>
        <UI.Input id="demo-title" />
        <UI.FieldDescription>请输入项目名称。</UI.FieldDescription>
      </UI.Field>
    ),
  },
  {
    id: "accordion",
    name: "Accordion",
    description: "按需展开的内容区域，支持键盘操作。",
    file: "Accordion.tsx",
    module: "accordion",
    code: '<Accordion type="single" collapsible><AccordionItem value="one"><AccordionTrigger>支持键盘操作吗？</AccordionTrigger><AccordionContent>支持焦点导航和展开/收起。</AccordionContent></AccordionItem></Accordion>',
    preview: (
      <UI.Accordion type="single" collapsible>
        <UI.AccordionItem value="one">
          <UI.AccordionTrigger>支持键盘操作吗？</UI.AccordionTrigger>
          <UI.AccordionContent>支持焦点导航和展开/收起。</UI.AccordionContent>
        </UI.AccordionItem>
      </UI.Accordion>
    ),
  },
  {
    id: "avatar",
    name: "Avatar",
    description: "展示头像并在图片不可用时提供回退内容。",
    file: "Avatar.tsx",
    module: "avatar",
    code: '<Avatar><AvatarImage src="/avatars/ava.jpg" alt="Ava" /><AvatarFallback>AV</AvatarFallback></Avatar>',
    preview: (
      <UI.Avatar>
        <UI.AvatarImage src="/avatars/ava.jpg" alt="Ava" />
        <UI.AvatarFallback>AV</UI.AvatarFallback>
      </UI.Avatar>
    ),
  },
  {
    id: "badge",
    name: "Badge",
    description: "紧凑的分类或状态标记。",
    file: "Feedback.tsx",
    module: "feedback",
    code: '<Badge tone="success">已发布</Badge>',
    preview: (
      <div className="docs-demo-row">
        <UI.Badge>默认</UI.Badge>
        <UI.Badge tone="success">已发布</UI.Badge>
        <UI.Badge tone="warning">待处理</UI.Badge>
      </div>
    ),
  },
  {
    id: "alert",
    name: "Alert",
    description: "展示与当前操作相关的状态信息。",
    file: "Feedback.tsx",
    module: "feedback",
    code: '<Alert tone="success">更改已保存。</Alert>',
    preview: <UI.Alert tone="success">更改已保存。</UI.Alert>,
  },
  {
    id: "progress",
    name: "Progress",
    description: "展示任务完成比例。",
    file: "Feedback.tsx",
    module: "feedback",
    code: '<Progress aria-label="上传进度" value={65} />',
    preview: <UI.Progress aria-label="上传进度" value={65} />,
  },
  {
    id: "skeleton",
    name: "Skeleton",
    description: "加载期间的布局占位。",
    file: "Feedback.tsx",
    module: "feedback",
    code: "<Skeleton style={{ width: 240, height: 24 }} />",
    preview: (
      <div style={{ display: "grid", gap: 12 }}>
        <UI.Skeleton style={{ width: 240, height: 24 }} />
        <UI.Skeleton style={{ width: 180, height: 16 }} />
      </div>
    ),
  },
  {
    id: "spinner",
    name: "Spinner",
    description: "不确定进度的加载状态。",
    file: "Feedback.tsx",
    module: "feedback",
    code: '<Spinner label="正在加载" />',
    preview: <UI.Spinner label="正在加载" />,
  },
  {
    id: "tabs",
    name: "Tabs",
    description: "同一区域中的多视图切换。",
    file: "Navigation.tsx",
    module: "navigation",
    code: '<Tabs defaultValue="account"><TabsList><TabsTrigger value="account">账号</TabsTrigger><TabsTrigger value="security">安全</TabsTrigger></TabsList><TabsContent value="account">账号设置</TabsContent><TabsContent value="security">安全设置</TabsContent></Tabs>',
    preview: (
      <UI.Tabs defaultValue="account">
        <UI.TabsList>
          <UI.TabsTrigger value="account">账号</UI.TabsTrigger>
          <UI.TabsTrigger value="security">安全</UI.TabsTrigger>
        </UI.TabsList>
        <UI.TabsContent value="account">账号设置</UI.TabsContent>
        <UI.TabsContent value="security">安全设置</UI.TabsContent>
      </UI.Tabs>
    ),
  },
  {
    id: "dialog",
    name: "Dialog",
    description: "需要用户注意或确认的模态对话框。",
    file: "Dialog.tsx",
    module: "dialog",
    code: '<Dialog><DialogTrigger asChild><Button>编辑资料</Button></DialogTrigger><DialogPortal><DialogOverlay /><DialogContent><DialogTitle>编辑资料</DialogTitle><DialogDescription>更新你的显示名称。</DialogDescription><Input aria-label="名称" /><DialogClose asChild><Button>完成</Button></DialogClose></DialogContent></DialogPortal></Dialog>',
    preview: (
      <UI.Dialog>
        <UI.DialogTrigger asChild>
          <UI.Button>编辑资料</UI.Button>
        </UI.DialogTrigger>
        <UI.DialogPortal>
          <UI.DialogOverlay />
          <UI.DialogContent>
            <UI.DialogTitle>编辑资料</UI.DialogTitle>
            <UI.DialogDescription>更新你的显示名称。</UI.DialogDescription>
            <UI.Input aria-label="名称" />
            <UI.DialogClose asChild>
              <UI.Button>完成</UI.Button>
            </UI.DialogClose>
          </UI.DialogContent>
        </UI.DialogPortal>
      </UI.Dialog>
    ),
  },
  {
    id: "dropdown-menu",
    name: "DropdownMenu",
    description: "支持键盘导航的操作菜单。",
    file: "Overlays.tsx",
    module: "overlays",
    code: "<DropdownMenu><DropdownMenuTrigger asChild><Button>更多操作</Button></DropdownMenuTrigger><DropdownMenuPortal><DropdownMenuContent><DropdownMenuItem>复制</DropdownMenuItem><DropdownMenuItem disabled>删除</DropdownMenuItem></DropdownMenuContent></DropdownMenuPortal></DropdownMenu>",
    preview: (
      <UI.DropdownMenu>
        <UI.DropdownMenuTrigger asChild>
          <UI.Button>更多操作</UI.Button>
        </UI.DropdownMenuTrigger>
        <UI.DropdownMenuPortal>
          <UI.DropdownMenuContent>
            <UI.DropdownMenuItem>复制</UI.DropdownMenuItem>
            <UI.DropdownMenuItem disabled>删除</UI.DropdownMenuItem>
          </UI.DropdownMenuContent>
        </UI.DropdownMenuPortal>
      </UI.DropdownMenu>
    ),
  },
  {
    id: "popover",
    name: "Popover",
    description: "与触发元素关联的轻量浮层。",
    file: "Overlays.tsx",
    module: "overlays",
    code: '<Popover><PopoverTrigger asChild><Button>设置尺寸</Button></PopoverTrigger><PopoverPortal><PopoverContent><Input aria-label="宽度" defaultValue="240" /></PopoverContent></PopoverPortal></Popover>',
    preview: (
      <UI.Popover>
        <UI.PopoverTrigger asChild>
          <UI.Button>设置尺寸</UI.Button>
        </UI.PopoverTrigger>
        <UI.PopoverPortal>
          <UI.PopoverContent>
            <UI.Input aria-label="宽度" defaultValue="240" />
          </UI.PopoverContent>
        </UI.PopoverPortal>
      </UI.Popover>
    ),
  },
  {
    id: "tooltip",
    name: "Tooltip",
    description: "鼠标悬停或键盘聚焦时展示补充信息。",
    file: "Overlays.tsx",
    module: "overlays",
    code: "<TooltipProvider><Tooltip><TooltipTrigger asChild><Button>悬停查看</Button></TooltipTrigger><TooltipPortal><TooltipContent>保存当前更改</TooltipContent></TooltipPortal></Tooltip></TooltipProvider>",
    preview: (
      <UI.TooltipProvider>
        <UI.Tooltip>
          <UI.TooltipTrigger asChild>
            <UI.Button>悬停查看</UI.Button>
          </UI.TooltipTrigger>
          <UI.TooltipPortal>
            <UI.TooltipContent>保存当前更改</UI.TooltipContent>
          </UI.TooltipPortal>
        </UI.Tooltip>
      </UI.TooltipProvider>
    ),
  },
  {
    id: "data-table",
    name: "DataTable",
    description: "支持可滚动容器、行多选和全选的数据表格。",
    file: "Layout.tsx",
    module: "layout",
    code: '<DataTable selectable rowIds={rows.map((row) => row.id)} selectedRowIds={selected} onSelectedRowIdsChange={setSelected} headers={headers}><tbody>{rows.map((row) => <tr key={row.id}><td>{row.name}</td><td>{row.status}</td></tr>)}</tbody></DataTable>',
    preview: <SelectableDataTableDemo />,
  },
  {
    id: "copy-button",
    name: "CopyButton",
    description: "复制文本并展示成功或失败状态。",
    file: "Forms.tsx",
    module: "forms",
    code: '<CopyButton text="pnpm add @asharca/ui" label="复制命令" />',
    preview: <UI.CopyButton text="pnpm add @asharca/ui" label="复制命令" />,
  },
  {
    id: "workspace-tab-bar",
    name: "WorkspaceTabBar",
    description: "支持固定、关闭和排序的工作区标签导航。",
    file: "WorkspaceTabBar.tsx",
    module: "workspace-tab-bar",
    code: "", demoFile: "WorkspaceDemo.tsx",
    preview: <WorkspaceDemo />,
  },
  {
    id: "conversation-sidebar",
    name: "ConversationSidebar",
    description: "按助手分组的可搜索会话列表。",
    file: "ConversationSidebar.tsx",
    module: "conversation-sidebar",
    code: "", demoFile: "ConversationDemo.tsx",
    preview: <ConversationDemo />,
  },
  {
    id: "chat-shell",
    name: "ChatShell",
    description: "适配桌面和手机的聊天布局。",
    file: "ChatShell.tsx",
    module: "chat-shell",
    code: "", demoFile: "ShellDemo.tsx",
    preview: <ShellDemo />,
  },
  {
    id: "chat-composer-toolbar",
    name: "ChatComposerToolbar",
    description: "统一工具菜单及可配置的快捷工具栏。",
    file: "ChatComposerToolbar.tsx",
    module: "chat-composer-toolbar",
    code: "", demoFile: "ToolbarDemo.tsx",
    preview: <ToolbarDemo />,
  },
  {
    id: "chat-thread",
    name: "ChatThread",
    description: "接收 assistant-ui 运行时的完整聊天线程。",
    file: "ChatThread.tsx",
    module: "chat-thread",
    code: "", demoFile: "ChatThreadDemo.tsx",
    preview: <ChatThreadDemo />,
  },
].sort((a, b) => a.name.localeCompare(b.name));
