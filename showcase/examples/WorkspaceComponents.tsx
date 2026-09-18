import { useEffect, useState, type ReactNode } from "react";
import { HighlightedCode } from "../HighlightedCode";
import {
  Bell,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  Ellipsis,
  FolderPlus,
  Mail,
  Plus,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Checkbox,
  CopyButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Field,
  FieldLabel,
  IconButton,
  Input,
  Progress,
  Select,
  Skeleton,
  Slider,
  StatusBadge,
  SubmitButton,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "../../src/index";

type DemoProps = { notify: (message: string) => void; onCreate: () => void };

export const examples = [
  {
    id: "notifications",
    category: "forms",
    name: "Switch",
    title: "通知偏好",
    component: Notifications,
    code: '<Switch id="email" defaultChecked />\n<label htmlFor="email">邮件通知</label>',
  },
  {
    id: "team",
    category: "data",
    name: "Avatar · Select",
    title: "团队成员",
    component: Team,
    code: '<Avatar>\n  <AvatarImage src="/avatar.jpg" alt="Ava" />\n  <AvatarFallback>AV</AvatarFallback>\n</Avatar>',
  },
  {
    id: "buttons",
    category: "controls",
    name: "Button",
    title: "按钮与操作",
    component: Buttons,
    code: '<Button variant="primary">创建项目</Button>\n<Button variant="outline">取消</Button>\n<Button loading>处理中</Button>',
  },
  {
    id: "account",
    category: "forms",
    name: "Tabs · Input",
    title: "工作空间",
    component: Account,
    code: '<Tabs defaultValue="account">\n  <TabsList aria-label="设置">\n    <TabsTrigger value="account">账户</TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">账户设置</TabsContent>\n</Tabs>',
  },
  {
    id: "progress",
    category: "feedback",
    name: "Slider · Progress",
    title: "发布进度",
    component: Deployment,
    code: '<Progress aria-label="发布进度" value={72} />\n<Slider aria-label="并发任务" defaultValue={4} min={1} max={8} />',
  },
  {
    id: "accordion",
    category: "overlays",
    name: "Accordion",
    title: "常见问题",
    component: Questions,
    code: '<Accordion type="single" collapsible>\n  <AccordionItem value="access">\n    <AccordionTrigger>项目访问权限</AccordionTrigger>\n    <AccordionContent>仅项目成员可访问。</AccordionContent>\n  </AccordionItem>\n</Accordion>',
  },
  {
    id: "feedback",
    category: "feedback",
    name: "Skeleton · Badge",
    title: "活动动态",
    component: Activity,
    code: '<Skeleton style={{ width: 160, height: 16 }} />\n<StatusBadge tone="success" label="已发布" />',
  },
  {
    id: "menu",
    category: "overlays",
    name: "DropdownMenu",
    title: "项目操作",
    component: Actions,
    code: '<DropdownMenu>\n  <DropdownMenuTrigger asChild>\n    <Button variant="outline">项目操作</Button>\n  </DropdownMenuTrigger>\n  <DropdownMenuPortal>\n    <DropdownMenuContent>\n      <DropdownMenuItem onSelect={onEdit}>编辑</DropdownMenuItem>\n    </DropdownMenuContent>\n  </DropdownMenuPortal>\n</DropdownMenu>',
  },
  {
    id: "request",
    category: "forms",
    name: "Textarea · Checkbox",
    title: "提交反馈",
    component: FeedbackForm,
    code: '<Field>\n  <FieldLabel htmlFor="feedback">反馈</FieldLabel>\n  <Textarea id="feedback" required />\n</Field>\n<Checkbox id="updates" defaultChecked />',
  },
];

export function Example({
  item,
  notify,
  onCreate,
}: DemoProps & { item: (typeof examples)[number] }) {
  const [showCode, setShowCode] = useState(false);
  const Demo = item.component;
  return (
    <article className={`example example-${item.id}`}>
      <header className="example-label">
        <span>{item.name}</span>
        <IconButton
          size="sm"
          variant="ghost"
          label={`${showCode ? "预览" : "查看代码"} ${item.name}`}
          aria-pressed={showCode}
          icon={<Code2 size={14} />}
          onClick={() => setShowCode(!showCode)}
        />
      </header>
      <div className="example-surface">
        {showCode ? (
          <div className="code-preview">
            <div className="row spread">
              <span>{item.name}</span>
              <CopyButton
                text={item.code}
                iconOnly
                label="复制代码"
                copiedLabel="已复制"
                failedLabel="复制失败"
              />
            </div>
            <HighlightedCode code={item.code} label={`${item.name} 示例代码`} />
          </div>
        ) : (
          <Demo notify={notify} onCreate={onCreate} />
        )}
      </div>
    </article>
  );
}

function Heading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="demo-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function Notifications({ notify }: DemoProps) {
  return (
    <>
      <Heading
        title="通知偏好"
        subtitle="只接收与你相关的消息。"
        action={<Bell size={17} />}
      />
      <div className="settings-list">
        {[
          {
            id: "email",
            title: "邮件通知",
            text: "项目更新与每周摘要",
            checked: true,
          },
          {
            id: "mentions",
            title: "提及与评论",
            text: "有人需要你的关注时",
            checked: true,
          },
          {
            id: "newsletter",
            title: "产品动态",
            text: "新功能与产品公告",
            checked: false,
          },
        ].map(({ id, title, text, checked }) => (
          <div className="setting-row" key={id}>
            <label htmlFor={id}>
              <strong>{title}</strong>
              <span>{text}</span>
            </label>
            <Switch id={id} defaultChecked={checked} />
          </div>
        ))}
      </div>
      <Button
        className="full-width"
        variant="outline"
        onClick={() => notify("通知偏好已保存")}
      >
        <Check size={15} />
        保存偏好
      </Button>
    </>
  );
}

const initialMembers = [
  {
    name: "Ava Chen",
    email: "ava@example.com",
    image: "ava",
    initials: "AC",
    role: "owner",
  },
  {
    name: "Leo Zhang",
    email: "leo@example.com",
    image: "leo",
    initials: "LZ",
    role: "editor",
  },
  {
    name: "Mia Lin",
    email: "mia@example.com",
    image: "mia",
    initials: "ML",
    role: "viewer",
  },
];

function Team({ notify }: DemoProps) {
  const [members, setMembers] = useState(initialMembers);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <>
      <Heading
        title="团队成员"
        subtitle={`${members.length} 位成员，共同创造。`}
        action={<Users size={17} />}
      />
      <div className="member-list">
        {members.map((member) => (
          <div key={member.email} className="member-row">
            <Avatar>
              <AvatarImage
                src={member.image ? `./avatars/${member.image}.jpg` : undefined}
                alt={member.name}
              />
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <div className="member-name">
              <strong>{member.name}</strong>
              <span>{member.email}</span>
            </div>
            <Select
              aria-label={`${member.name} 的角色`}
              value={member.role}
              disabled={member.role === "owner"}
              onChange={(event) =>
                setMembers(
                  members.map((item) =>
                    item.email === member.email
                      ? { ...item, role: event.target.value }
                      : item,
                  ),
                )
              }
            >
              <option value="owner" disabled>
                所有者
              </option>
              <option value="editor">编辑者</option>
              <option value="viewer">查看者</option>
            </Select>
          </div>
        ))}
      </div>
      {inviting ? (
        <form
          className="invite-form"
          onSubmit={(event) => {
            event.preventDefault();
            const address = email.trim().toLowerCase();
            if (members.some((member) => member.email === address)) {
              notify("该成员已在团队中");
              return;
            }
            setMembers([
              ...members,
              {
                name: address.split("@")[0],
                email: address,
                image: "",
                initials: address.slice(0, 2).toUpperCase(),
                role: "viewer",
              },
            ]);
            setEmail("");
            setInviting(false);
            notify("已添加演示成员");
          }}
        >
          <Input
            aria-label="受邀成员邮箱"
            type="email"
            required
            autoFocus
            placeholder="name@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" variant="primary">
            添加
          </Button>
          <IconButton
            label="取消邀请"
            variant="ghost"
            icon={<X size={15} />}
            onClick={() => setInviting(false)}
          />
        </form>
      ) : (
        <Button
          className="full-width"
          variant="outline"
          onClick={() => setInviting(true)}
        >
          <Plus size={15} />
          邀请成员
        </Button>
      )}
    </>
  );
}

function Buttons({ notify, onCreate }: DemoProps) {
  return (
    <>
      <Heading title="按钮与操作" subtitle="从一个小小的行动开始。" />
      <div className="button-samples">
        <div className="row">
          <Button variant="primary" onClick={onCreate}>
            <Plus size={15} />
            新建项目
          </Button>
          <Button variant="outline" onClick={() => notify("更改已保存")}>
            保存更改
          </Button>
        </div>
        <div className="row">
          <Button onClick={() => notify("已选择次要操作")}>次要操作</Button>
          <Button variant="ghost" onClick={() => notify("已取消操作")}>
            取消
          </Button>
          <Button disabled>不可用</Button>
        </div>
        <div className="row">
          <Button loading>处理中</Button>
          <Button
            variant="danger-secondary"
            onClick={() => notify("删除操作演示，未删除数据")}
          >
            <Trash2 size={14} />
            删除
          </Button>
        </div>
      </div>
      <div className="demo-bottom row spread">
        <div className="row tight">
          <CopyButton
            iconOnly
            text="pnpm add @asharca/ui"
            label="复制安装命令"
            copiedLabel="已复制"
            failedLabel="复制失败"
          />
          <IconButton
            variant="outline"
            label="重置"
            icon={<RotateCcw size={15} />}
            onClick={() => notify("已重置")}
          />
        </div>
        <div className="row tight">
          <Button size="sm" variant="outline" onClick={() => notify("Small")}>
            S
          </Button>
          <Button variant="outline" onClick={() => notify("Medium")}>
            M
          </Button>
        </div>
      </div>
    </>
  );
}

function Account({ notify }: DemoProps) {
  return (
    <>
      <Heading title="工作空间" subtitle="属于你和团队的协作空间。" />
      <Tabs defaultValue="general">
        <TabsList className="full-width" aria-label="工作空间设置">
          <TabsTrigger value="general">基本信息</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
        </TabsList>
        <form
          action={async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            notify("工作空间设置已保存");
          }}
        >
          <TabsContent value="general" className="account-panel">
            <Field>
              <FieldLabel htmlFor="workspace">工作空间名称</FieldLabel>
              <Input
                id="workspace"
                name="workspace"
                defaultValue="Asharca Studio"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-url">空间标识</FieldLabel>
              <Input
                id="workspace-url"
                defaultValue="asharca-studio"
                name="slug"
                required
                pattern="[a-z0-9-]+"
              />
            </Field>
          </TabsContent>
          <TabsContent value="security" className="account-panel">
            <div className="setting-row">
              <label htmlFor="two-factor">
                <strong>双重验证</strong>
                <span>为账户增加一层保护</span>
              </label>
              <Switch id="two-factor" defaultChecked />
            </div>
            <Field>
              <FieldLabel htmlFor="session">会话有效期</FieldLabel>
              <Select id="session" defaultValue="7">
                <option value="1">1 天</option>
                <option value="7">7 天</option>
                <option value="30">30 天</option>
              </Select>
            </Field>
          </TabsContent>
          <SubmitButton
            className="ui-button-primary full-width"
            pendingLabel="保存中"
            savedLabel="已保存"
          >
            保存设置
          </SubmitButton>
        </form>
      </Tabs>
    </>
  );
}

function Deployment() {
  const [value, setValue] = useState(72);
  const [concurrency, setConcurrency] = useState(4);
  return (
    <>
      <Heading
        title="发布进度"
        subtitle="Production / main"
        action={
          <StatusBadge
            label={value === 100 ? "已完成" : "进行中"}
            tone={value === 100 ? "success" : "neutral"}
          />
        }
      />
      <div className="progress-number">
        <span>
          {value}
          <small>%</small>
        </span>
        <span className="muted">
          {value === 100 ? "准备就绪" : "构建与验证"}
        </span>
      </div>
      <Progress aria-label="发布进度" value={value} />
      <div className="build-steps">
        <span>
          <Check size={14} />
          依赖检查
        </span>
        <span>
          <Check size={14} />
          编译完成
        </span>
        <span className={value === 100 ? "" : "muted"}>
          {value === 100 ? <Check size={14} /> : <span className="step-dot" />}
          部署资源
        </span>
      </div>
      <div className="slider-field">
        <div className="row spread">
          <label htmlFor="deployment-progress">发布进度</label>
          <output htmlFor="deployment-progress">{value}%</output>
        </div>
        <Slider
          id="deployment-progress"
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
      </div>
      <div className="slider-field">
        <div className="row spread">
          <label htmlFor="concurrency">并发任务</label>
          <output htmlFor="concurrency">{concurrency} / 8</output>
        </div>
        <Slider
          id="concurrency"
          min={1}
          max={8}
          value={concurrency}
          onChange={(event) => setConcurrency(Number(event.target.value))}
        />
      </div>
    </>
  );
}

function Questions() {
  return (
    <>
      <Heading title="常见问题" subtitle="关于项目与团队协作。" />
      <Accordion type="single" collapsible defaultValue="access">
        <AccordionItem value="access">
          <AccordionTrigger>谁可以访问这个项目？</AccordionTrigger>
          <AccordionContent>
            只有受邀的团队成员可以访问。你可以为每位成员分别设置编辑或查看权限。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="invite">
          <AccordionTrigger>如何邀请新的团队成员？</AccordionTrigger>
          <AccordionContent>
            在团队成员中填写对方的邮箱，选择对应角色后添加成员。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="archive">
          <AccordionTrigger>项目归档后还能恢复吗？</AccordionTrigger>
          <AccordionContent>
            可以。归档只会暂停项目活动，项目内容与成员设置都会保留。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}

function Activity() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, [loading]);
  return (
    <>
      <Heading
        title="活动动态"
        subtitle="工作空间的最新进展。"
        action={
          <IconButton
            label="刷新动态"
            variant="ghost"
            size="sm"
            loading={loading}
            icon={<RotateCcw size={15} />}
            onClick={() => setLoading(true)}
          />
        }
      />
      <div className="activity-list" aria-busy={loading} aria-live="polite">
        {loading ? (
          <>
            <span className="sr-only">正在加载动态</span>
            {[0, 1, 2].map((index) => (
              <div className="activity-row" key={index}>
                <Skeleton className="skeleton-avatar" />
                <div className="skeleton-lines">
                  <Skeleton />
                  <Skeleton />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {[
              ["AC", "Ava 更新了设计规范", "5 分钟前", "已发布"],
              ["LZ", "Leo 完成了组件评审", "28 分钟前", "已完成"],
              ["ML", "Mia 加入了工作空间", "1 小时前", "新成员"],
            ].map(([initials, title, time, status]) => (
              <div className="activity-row" key={initials}>
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="activity-name">
                  <strong>{title}</strong>
                  <span>{time}</span>
                </div>
                <Badge tone={status === "新成员" ? "neutral" : "success"}>
                  {status}
                </Badge>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="status-line">
        <span className="online-dot" />
        所有更改已同步
      </div>
    </>
  );
}

function Actions({ notify, onCreate }: DemoProps) {
  return (
    <>
      <Heading
        title="项目操作"
        subtitle="Design System / Workspace"
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                variant="ghost"
                size="sm"
                label="更多项目操作"
                icon={<Ellipsis size={18} />}
              />
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Design System</DropdownMenuLabel>
                <DropdownMenuItem onSelect={onCreate}>
                  <FolderPlus size={15} />
                  新建项目
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => notify("项目已复制（演示）")}>
                  <Copy size={15} />
                  复制项目
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <Trash2 size={15} />
                  删除受保护项目
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        }
      />
      <div className="project-stamp">
        <div className="project-symbol">
          <Code2 size={25} />
        </div>
        <div>
          <strong>Design System</strong>
          <span>组件、样式与设计规范</span>
        </div>
        <StatusBadge tone="success" label="已发布" />
      </div>
      <div className="project-facts">
        <span>
          最近更新<strong>今天，09:41</strong>
        </span>
        <span>
          可见性
          <strong>
            <ShieldCheck size={13} />
            团队内部
          </strong>
        </span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="full-width" variant="outline">
            <Settings2 size={15} />
            项目操作
            <ChevronDown size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>工作空间操作</DropdownMenuLabel>
            <DropdownMenuItem onSelect={onCreate}>
              <Plus size={15} />
              新建项目
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                try {
                  await navigator.clipboard.writeText("Design System");
                  notify("项目名称已复制");
                } catch {
                  notify("剪贴板不可用");
                }
              }}
            >
              <Copy size={15} />
              复制项目名称
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                const url = URL.createObjectURL(
                  new Blob(
                    [
                      JSON.stringify(
                        { name: "Design System", version: "1.0" },
                        null,
                        2,
                      ),
                    ],
                    { type: "application/json" },
                  ),
                );
                const link = document.createElement("a");
                link.href = url;
                link.download = "design-system.json";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download size={15} />
              导出项目
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </>
  );
}

function FeedbackForm({ notify }: DemoProps) {
  return (
    <>
      <Heading
        title="提交反馈"
        subtitle="每个想法都值得被认真对待。"
        action={<Mail size={17} />}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          notify("反馈已提交（本地演示）");
          event.currentTarget.reset();
        }}
      >
        <Field>
          <FieldLabel htmlFor="feedback">你的想法</FieldLabel>
          <Textarea
            id="feedback"
            required
            name="feedback"
            placeholder="有什么可以做得更好？"
            rows={4}
          />
        </Field>
        <label className="checkbox-label">
          <Checkbox defaultChecked name="followup" />
          有进展时通知我
        </label>
        <Button type="submit" variant="primary" className="full-width">
          提交反馈
        </Button>
      </form>
      <Alert className="quiet-alert" tone="info">
        反馈仅用于当前演示，不会发送到服务器。
      </Alert>
    </>
  );
}
