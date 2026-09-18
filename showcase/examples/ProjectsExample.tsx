import { useId, useState } from "react";
import { CalendarDays, Plus, X } from "lucide-react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldLabel,
  IconButton,
  Input,
  SearchInput,
  Select,
  StatusBadge,
} from "../../src/index";

const stages = ["待开始", "进行中", "已完成"] as const;
type Task = {
  id: string;
  title: string;
  stage: (typeof stages)[number];
  owner: string;
  due: string;
  priority: string;
};
const initialTasks: Task[] = [
  {
    id: "DS-106",
    title: "梳理移动端导航",
    stage: "待开始",
    owner: "Mia",
    due: "2026-09-22",
    priority: "中",
  },
  {
    id: "DS-105",
    title: "补充订单空状态",
    stage: "待开始",
    owner: "Leo",
    due: "2026-09-21",
    priority: "低",
  },
  {
    id: "DS-104",
    title: "图表主题与可访问性",
    stage: "进行中",
    owner: "Ava",
    due: "2026-09-20",
    priority: "高",
  },
  {
    id: "DS-103",
    title: "设置页表单校验",
    stage: "进行中",
    owner: "Mia",
    due: "2026-09-19",
    priority: "中",
  },
  {
    id: "DS-102",
    title: "统一组件间距",
    stage: "已完成",
    owner: "Leo",
    due: "2026-09-17",
    priority: "中",
  },
  {
    id: "DS-101",
    title: "确认产品色板",
    stage: "已完成",
    owner: "Ava",
    due: "2026-09-16",
    priority: "高",
  },
];

export function ProjectsExample() {
  const id = useId();
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("全部成员");
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const visible = tasks.filter(
    (task) =>
      (owner === "全部成员" || task.owner === owner) &&
      `${task.title} ${task.id}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="example-content">
      <header className="example-heading">
        <div>
          <p className="example-eyebrow">DESIGN / SPRINT 12</p>
          <h1>项目看板</h1>
          <p>设计系统 · 9 月 14 日至 25 日</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">
              <Plus size={16} />
              新建任务
            </Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent className="example-dialog">
              <div className="example-dialog-heading">
                <DialogTitle>新建任务</DialogTitle>
                <DialogClose asChild>
                  <IconButton
                    variant="ghost"
                    label="关闭新建任务"
                    icon={<X size={17} />}
                  />
                </DialogClose>
              </div>
              <DialogDescription>Design System / Sprint 12</DialogDescription>
              <form
                className="example-fields"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const data = new FormData(form);
                  const title = String(data.get("title") ?? "").trim();
                  if (!title) {
                    form.querySelector("input")?.focus();
                    return;
                  }
                  const task: Task = {
                    id: `DS-${Math.max(...tasks.map((item) => Number(item.id.slice(3)))) + 1}`,
                    title,
                    owner: String(data.get("owner")),
                    due: String(data.get("due")),
                    priority: String(data.get("priority")),
                    stage: "待开始",
                  };
                  setTasks((current) => [task, ...current]);
                  setQuery("");
                  setOwner("全部成员");
                  setOpen(false);
                  setNotice(`已创建 ${task.id} ${task.title}`);
                }}
              >
                <Field>
                  <FieldLabel htmlFor={`${id}-title`}>任务名称</FieldLabel>
                  <Input
                    id={`${id}-title`}
                    name="title"
                    required
                    maxLength={100}
                    autoComplete="off"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`${id}-owner`}>负责人</FieldLabel>
                  <Select id={`${id}-owner`} name="owner">
                    {["Ava", "Leo", "Mia"].map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </Select>
                </Field>
                <div className="example-field-pair">
                  <Field>
                    <FieldLabel htmlFor={`${id}-due`}>截止日期</FieldLabel>
                    <Input
                      id={`${id}-due`}
                      name="due"
                      type="date"
                      required
                      defaultValue="2026-09-25"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor={`${id}-priority`}>优先级</FieldLabel>
                    <Select
                      id={`${id}-priority`}
                      name="priority"
                      defaultValue="中"
                    >
                      {["高", "中", "低"].map((priority) => (
                        <option key={priority}>{priority}</option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Button type="submit" variant="primary">
                  <Plus size={15} />
                  创建任务
                </Button>
              </form>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </header>
      <div className="example-project-summary">
        <div className="example-member-stack">
          {["ava", "leo", "mia"].map((name) => (
            <img
              key={name}
              src={`./avatars/${name}.jpg`}
              alt={name}
              width={30}
              height={30}
            />
          ))}
        </div>
        <span>3 位成员</span>
        <span>
          {tasks.filter((task) => task.stage === "已完成").length} /{" "}
          {tasks.length} 已完成
        </span>
        <span className="example-demo-label">本地演示</span>
      </div>
      <div className="example-filterbar">
        <SearchInput
          clearLabel="清除搜索"
          label="搜索任务"
          placeholder="搜索任务或编号…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery("")}
        />
        <Select
          aria-label="按负责人筛选"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
        >
          {["全部成员", "Ava", "Leo", "Mia"].map((name) => (
            <option key={name}>{name}</option>
          ))}
        </Select>
        <span className="example-result-count">{visible.length} 项任务</span>
      </div>
      <div className="example-board">
        {stages.map((stage, index) => (
          <section
            className="example-board-column"
            key={stage}
            aria-label={stage}
          >
            <h2>
              <span className={`example-stage-dot stage-${index}`} />
              {stage}
              <span>
                {visible.filter((task) => task.stage === stage).length}
              </span>
            </h2>
            <div className="example-task-list">
              {visible
                .filter((task) => task.stage === stage)
                .map((task) => (
                  <article className="example-task" key={task.id}>
                    <div className="example-task-meta">
                      <span>{task.id}</span>
                      <StatusBadge
                        tone={task.priority === "高" ? "warning" : "neutral"}
                        label={`${task.priority}优先级`}
                      />
                    </div>
                    <h3>{task.title}</h3>
                    <div className="example-task-person">
                      <span className="example-avatar">
                        {task.owner.slice(0, 1)}
                      </span>
                      {task.owner}
                      <span>
                        <CalendarDays size={13} />
                        {task.due.slice(5)}
                      </span>
                    </div>
                    <Select
                      aria-label={`${task.id} 状态`}
                      controlSize="sm"
                      value={task.stage}
                      onChange={(event) => {
                        const next = event.target.value as Task["stage"];
                        setTasks((current) =>
                          current.map((item) =>
                            item.id === task.id
                              ? { ...item, stage: next }
                              : item,
                          ),
                        );
                        setNotice(`${task.id} 已移至${next}`);
                      }}
                    >
                      {stages.map((value) => (
                        <option key={value}>{value}</option>
                      ))}
                    </Select>
                  </article>
                ))}
              {!visible.some((task) => task.stage === stage) && (
                <p className="example-board-empty">暂无任务</p>
              )}
            </div>
          </section>
        ))}
      </div>
      <p className="example-status" role="status">
        {notice || (!visible.length ? "没有匹配的任务" : "")}
      </p>
    </div>
  );
}
