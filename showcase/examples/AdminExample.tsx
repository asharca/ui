import { useState } from "react";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Download,
  Eye,
  FolderKanban,
  Package,
  Search,
  Settings2,
  ShoppingBag,
  X,
} from "lucide-react";
import {
  Button,
  DataTable,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  EmptyState,
  IconButton,
  Pagination,
  SearchInput,
  Select,
  StatusBadge,
} from "../../src/index";

type Order = {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: "待处理" | "已完成" | "已退款";
  date: string;
};
const initialOrders: Order[] = [
  {
    id: "ORD-2408",
    customer: "林夕",
    email: "lin@example.com",
    product: "团队专业版 · 年付",
    amount: 2399,
    status: "待处理",
    date: "2026-09-18",
  },
  {
    id: "ORD-2407",
    customer: "Alex Chen",
    email: "alex@example.com",
    product: "团队专业版 · 月付",
    amount: 299,
    status: "已完成",
    date: "2026-09-18",
  },
  {
    id: "ORD-2406",
    customer: "陈一",
    email: "chen@example.com",
    product: "团队专业版 · 年付",
    amount: 2399,
    status: "待处理",
    date: "2026-09-17",
  },
  {
    id: "ORD-2405",
    customer: "王晓",
    email: "wang@example.com",
    product: "个人版 · 年付",
    amount: 599,
    status: "已完成",
    date: "2026-09-17",
  },
  {
    id: "ORD-2404",
    customer: "Mia Wilson",
    email: "mia@example.com",
    product: "团队专业版 · 月付",
    amount: 299,
    status: "已退款",
    date: "2026-09-16",
  },
  {
    id: "ORD-2403",
    customer: "周雨",
    email: "zhou@example.com",
    product: "团队专业版 · 年付",
    amount: 2399,
    status: "已完成",
    date: "2026-09-16",
  },
  {
    id: "ORD-2402",
    customer: "Leo Park",
    email: "leo@example.com",
    product: "个人版 · 年付",
    amount: 599,
    status: "待处理",
    date: "2026-09-15",
  },
  {
    id: "ORD-2401",
    customer: "许然",
    email: "xu@example.com",
    product: "个人版 · 年付",
    amount: 599,
    status: "已完成",
    date: "2026-09-15",
  },
];
const money = (value: number) =>
  new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" }).format(
    value,
  );
const tone = (status: Order["status"]) =>
  status === "已完成" ? "success" : status === "待处理" ? "warning" : "neutral";

export function AdminExample() {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("全部状态");
  const [sort, setSort] = useState<"newest" | "ascending" | "descending">(
    "newest",
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [detail, setDetail] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const matching = orders
    .filter(
      (order) =>
        (status === "全部状态" || order.status === status) &&
        `${order.id} ${order.customer} ${order.email}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "newest"
        ? b.id.localeCompare(a.id)
        : sort === "ascending"
          ? a.amount - b.amount
          : b.amount - a.amount,
    );
  const pages = Math.max(1, Math.ceil(matching.length / 5));
  const activePage = Math.min(page, pages - 1);
  const visible = matching.slice(activePage * 5, activePage * 5 + 5);
  const order = orders.find((item) => item.id === detail);
  const actionable = orders.filter(
    (item) => selected.includes(item.id) && item.status === "待处理",
  );
  function complete(ids: string[]) {
    const count = orders.filter(
      (item) => ids.includes(item.id) && item.status === "待处理",
    ).length;
    setOrders((current) =>
      current.map((item) =>
        ids.includes(item.id) && item.status === "待处理"
          ? { ...item, status: "已完成" }
          : item,
      ),
    );
    setSelected([]);
    setNotice(`已完成 ${count} 笔订单`);
  }
  function download() {
    const rows = [
      ["订单编号", "客户", "商品", "金额", "状态", "日期"],
      ...matching.map((item) => [
        item.id,
        item.customer,
        item.product,
        item.amount,
        item.status,
        item.date,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`已导出 ${matching.length} 笔订单`);
  }
  return (
    <div className="example-admin">
      <aside className="example-app-nav">
        <div className="example-app-brand">
          <ShoppingBag size={21} />
          <strong>
            Aster <small>运营中心</small>
          </strong>
        </div>
        <nav aria-label="后台导航">
          <a href="#/examples/analytics">
            <BarChart3 size={17} />
            数据概览
          </a>
          <a href="#/examples/admin" aria-current="page">
            <Package size={17} />
            订单管理
            <span>
              {orders.filter((item) => item.status === "待处理").length}
            </span>
          </a>
          <a href="#/examples/projects">
            <FolderKanban size={17} />
            团队项目
          </a>
          <a href="#/examples/settings">
            <Settings2 size={17} />
            工作区设置
          </a>
        </nav>
        <p className="example-nav-footer">
          <span className="example-avatar">AC</span>
          <span>
            Asharca Studio<small>演示工作区</small>
          </span>
        </p>
      </aside>
      <div className="example-content">
        <header className="example-heading">
          <div>
            <p className="example-eyebrow">COMMERCE / ORDERS</p>
            <h1>订单管理</h1>
            <p>2026 年 9 月 15 日至 18 日</p>
          </div>
          <Button
            variant="outline"
            onClick={download}
            disabled={!matching.length}
          >
            <Download size={15} />
            导出订单
          </Button>
        </header>
        <dl className="example-metrics">
          <div>
            <dt>订单总额</dt>
            <dd>
              {money(
                orders
                  .filter((item) => item.status !== "已退款")
                  .reduce((sum, item) => sum + item.amount, 0),
              )}
            </dd>
            <small>不包含已退款订单</small>
          </div>
          <div>
            <dt>全部订单</dt>
            <dd>
              {orders.length}
              <small>笔</small>
            </dd>
            <small>当前工作区</small>
          </div>
          <div>
            <dt>待处理</dt>
            <dd>
              {orders.filter((item) => item.status === "待处理").length}
              <small>笔</small>
            </dd>
            <small>等待确认交付</small>
          </div>
          <div>
            <dt>已完成</dt>
            <dd>
              {orders.filter((item) => item.status === "已完成").length}
              <small>笔</small>
            </dd>
            <small>已确认交付</small>
          </div>
        </dl>
        <section className="example-section" aria-labelledby="orders-title">
          <div className="example-section-heading">
            <h2 id="orders-title">
              所有订单 <span>{matching.length}</span>
            </h2>
            <span className="example-demo-label">本地演示</span>
          </div>
          <div className="example-filterbar">
            <SearchInput
              clearLabel="清除搜索"
              label="搜索订单"
              placeholder="搜索编号、客户或邮箱…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              onClear={() => {
                setQuery("");
                setPage(0);
              }}
            />
            <Select
              aria-label="订单状态"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(0);
              }}
            >
              {["全部状态", "待处理", "已完成", "已退款"].map((value) => (
                <option key={value}>{value}</option>
              ))}
            </Select>
          </div>
          <DataTable
            panel={false}
            label="订单列表"
            minWidth="700px"
            selectable
            strictSelection
            rowIds={visible.map((item) => item.id)}
            rowLabels={visible.map((item) => item.id)}
            selectedRowIds={selected}
            onSelectedRowIdsChange={setSelected}
            selectionLabels={{ selectedCount: (count) => `已选择 ${count} 笔`, actions: "订单批量操作" }}
            selectionToolbar={({ selectedRowIds, clearSelection }) => (
              <>
                <Button size="sm" disabled={!actionable.length} onClick={() => complete([...selectedRowIds])}>
                  <Check size={14} />标记已完成
                </Button>
                <IconButton size="sm" variant="ghost" label="清除订单选择" icon={<X size={14} />} onClick={clearSelection} />
              </>
            )}
            headers={[
              { label: "订单 / 客户" },
              { label: "商品" },
              { label: "状态" },
              {
                label: (
                  <button
                    className="example-sort"
                    onClick={() => {
                      setSort(
                        sort === "descending" ? "ascending" : "descending",
                      );
                      setPage(0);
                    }}
                    aria-label={
                      sort === "descending" ? "按金额升序" : "按金额降序"
                    }
                  >
                    金额
                    <ArrowDownUp size={13} />
                  </button>
                ),
                align: "right",
              },
              { label: "日期" },
              { label: "操作", align: "right" },
            ]}
          >
            {visible.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong className="example-table-primary">{item.id}</strong>
                  <span className="example-table-secondary">
                    {item.customer}
                  </span>
                </td>
                <td>{item.product}</td>
                <td>
                  <StatusBadge label={item.status} tone={tone(item.status)} />
                </td>
                <td className="example-number">{money(item.amount)}</td>
                <td>{item.date.slice(5)}</td>
                <td className="example-number">
                  <IconButton
                    size="sm"
                    variant="ghost"
                    label={`查看订单 ${item.id}`}
                    icon={<Eye size={16} />}
                    onClick={() => setDetail(item.id)}
                  />
                </td>
              </tr>
            ))}
          </DataTable>
          {!matching.length && (
            <EmptyState
              icon={Search}
              title="没有匹配的订单"
              actions={
                <Button
                  onClick={() => {
                    setQuery("");
                    setStatus("全部状态");
                    setPage(0);
                  }}
                >
                  清除筛选
                </Button>
              }
            />
          )}
          <Pagination
            className="example-pagination"
            summary={`共 ${matching.length} 笔 · 第 ${activePage + 1} / ${pages} 页`}
            previous={
              <IconButton
                label="上一页订单"
                icon={<ArrowLeft size={15} />}
                disabled={activePage === 0}
                onClick={() => setPage(activePage - 1)}
              />
            }
            next={
              <IconButton
                label="下一页订单"
                icon={<ArrowRight size={15} />}
                disabled={activePage + 1 >= pages}
                onClick={() => setPage(activePage + 1)}
              />
            }
          />
          <p className="example-status" role="status">
            {notice}
          </p>
        </section>
      </div>
      <Dialog
        open={Boolean(order)}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="example-dialog">
            {order && (
              <>
                <div className="example-dialog-heading">
                  <DialogTitle>订单 {order.id}</DialogTitle>
                  <DialogClose asChild>
                    <IconButton
                      label="关闭订单详情"
                      variant="ghost"
                      icon={<X size={17} />}
                    />
                  </DialogClose>
                </div>
                <DialogDescription>{order.product}</DialogDescription>
                <dl className="example-detail">
                  <div>
                    <dt>客户</dt>
                    <dd>{order.customer}</dd>
                  </div>
                  <div>
                    <dt>邮箱</dt>
                    <dd>{order.email}</dd>
                  </div>
                  <div>
                    <dt>订单日期</dt>
                    <dd>{order.date}</dd>
                  </div>
                  <div>
                    <dt>状态</dt>
                    <dd>
                      <StatusBadge
                        label={order.status}
                        tone={tone(order.status)}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt>实付金额</dt>
                    <dd>{money(order.amount)}</dd>
                  </div>
                </dl>
                {order.status === "待处理" && (
                  <Button
                    variant="primary"
                    onClick={() => complete([order.id])}
                  >
                    <Check size={15} />
                    确认完成
                  </Button>
                )}
              </>
            )}
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
