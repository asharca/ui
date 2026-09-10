/// <reference types="vite/client" />
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Code2,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import {
  CopyButton,
  IconButton,
  SearchInput,
  Select,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../src/index";
import { componentDocs } from "./ComponentDemos";
import { Manual } from "./Manual";
import { HighlightedCode, type CodeLanguage } from "./HighlightedCode";
import { version } from "../package.json";
import "./docs.css";

const sources = import.meta.glob<string>("../src/*.{tsx,ts,css}", {
  query: "?raw",
  import: "default",
});
const demos = import.meta.glob<string>("./demos/*.tsx", {
  query: "?raw",
  import: "default",
});
const Workbench = lazy(() =>
  import("./App").then((module) => ({ default: module.App })),
);

function CodeBlock({
  code,
  label,
  language = "tsx",
}: {
  code: string;
  label: string;
  language?: CodeLanguage;
}) {
  return (
    <div className="docs-code">
      <header>
        <span>{label}</span>
        <CopyButton
          text={code}
          label={`复制 ${label}`}
          copiedLabel="已复制"
          failedLabel="复制失败"
        />
      </header>
      <HighlightedCode code={code} language={language} label={label} />
    </div>
  );
}

function ComponentPage({ id }: { id: string }) {
  const doc = componentDocs.find((item) => item.id === id)!;
  const [sourceFile, setSourceFile] = useState(doc.file);
  const [source, setSource] = useState("");
  const [demoSource, setDemoSource] = useState("");
  const demoFile = "demoFile" in doc ? doc.demoFile : undefined;
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setSource("");
    setError("");
    sources[`../src/${sourceFile}`]()
      .then((text) => {
        if (active) setSource(text);
      })
      .catch(() => {
        if (active) setError("源码加载失败，请刷新重试。");
      });
    return () => {
      active = false;
    };
  }, [sourceFile]);
  useEffect(() => {
    let active = true;
    setDemoSource("");
    if (!demoFile) return;
    demos[`./demos/${demoFile}`]()
      .then((text) => {
        if (active) setDemoSource(text.replaceAll('"../../src/index"', '"@asharca/ui"'));
      })
      .catch(() => {
        if (active) setDemoSource("// 演示源码加载失败，请刷新重试。");
      });
    return () => {
      active = false;
    };
  }, [demoFile]);
  const index = componentDocs.indexOf(doc);
  const imports = [
    ...new Set(
      [...doc.code.matchAll(/<([A-Z][A-Za-z]+)/g)].map((match) => match[1]),
    ),
  ];
  const code = doc.code.startsWith("//")
    ? doc.code
    : `import { ${imports.filter((name) => name !== "Plus").join(", ")} } from "@asharca/ui";\n${imports.includes("Plus") ? 'import { Plus } from "lucide-react";\n' : ""}\nexport function Example() {\n  return <>${doc.code}</>;\n}`;
  return (
    <>
      <div className="docs-page-heading">
        <span className="docs-eyebrow">组件</span>
        <h1>{doc.name}</h1>
        <p>{doc.description}</p>
        <span className="docs-meta">React · TypeScript · {doc.module}</span>
      </div>
      <section id="preview">
        <Tabs defaultValue="preview">
          <TabsList aria-label="组件示例视图">
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="code">用法代码</TabsTrigger>
          </TabsList>
          <TabsContent value="preview">
            <div
              className={`docs-preview ${id.startsWith("chat") || id === "workspace-tab-bar" ? "docs-preview-wide" : ""}`}
            >
              <div className="docs-preview-inner">
                {doc.preview}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code">
            {demoFile ? (
              <CodeBlock
                code={demoSource || "// 正在加载示例…"}
                label="用法 TSX"
              />
            ) : (
              <CodeBlock code={code} label="用法 TSX" />
            )}
          </TabsContent>
        </Tabs>
      </section>
      <section id="installation">
        <h2>安装</h2>
        <p>
          使用 npm 包接入；这不是 shadcn CLI 注册表。样式配置见
          <a href="#/installation">安装指南</a>。
        </p>
        <CodeBlock
          code="pnpm add @asharca/ui"
          label="终端"
          language="bash"
        />
        <CodeBlock
          code={`import { ${doc.name} } from "@asharca/ui${doc.module ? `/${doc.module}` : ""}";`}
          label="按需导入"
        />
      </section>
      <section id="source">
        <h2>组件源码</h2>
        <p>
          下方直接读取当前仓库的实现文件。共享模块会包含相关组件；复制实现时还需保留其本地依赖及样式。
        </p>
        <label className="docs-source-select">
          源码文件
          <Select
            aria-label="源码文件"
            value={sourceFile}
            onChange={(event) => setSourceFile(event.target.value)}
          >
            {[
              doc.file,
              ...Object.keys(sources)
                .map((path) => path.replace("../src/", ""))
                .filter((file) => file !== doc.file)
                .sort(),
            ].map((file) => (
              <option key={file}>{file}</option>
            ))}
          </Select>
        </label>
        {error ? (
          <p role="alert">{error}</p>
        ) : (
          <CodeBlock
            code={source || "// 正在加载…"}
            label={`src/${sourceFile}`}
            language={
              sourceFile.endsWith(".css")
                ? "css"
                : sourceFile.endsWith(".ts")
                  ? "typescript"
                  : "tsx"
            }
          />
        )}
      </section>
      <section id="api">
        <h2>API 与接入边界</h2>
        <p>
          属性类型、默认值和组件组合方式以源码中的 TypeScript
          定义为准。原生控件保留对应 HTML 属性；带状态组件通过 value、回调或
          runtime 接入宿主状态。
        </p>
        <p>
          路由、鉴权、模型服务、持久化和业务 API 不包含在组件包内。交互详情见
          <a href="#/guide">使用手册</a>。
        </p>
      </section>
      <footer className="docs-pager">
        {index > 0 ? (
          <a href={`#/components/${componentDocs[index - 1].id}`}>
            <ArrowLeft size={15} />
            {componentDocs[index - 1].name}
          </a>
        ) : (
          <span />
        )}
        {index < componentDocs.length - 1 && (
          <a href={`#/components/${componentDocs[index + 1].id}`}>
            {componentDocs[index + 1].name}
            <ArrowRight size={15} />
          </a>
        )}
      </footer>
    </>
  );
}

function Installation() {
  const [manager, setManager] = useState("pnpm");
  return (
    <>
      <div className="docs-page-heading">
        <span className="docs-eyebrow">开始使用</span>
        <h1>安装</h1>
        <p>将 Asharca UI 接入你的 React 项目。</p>
        <span className="docs-meta">当前工作区 v{version}</span>
      </div>
      <section id="requirements">
        <h2>环境要求</h2>
        <p>
          React 19、React DOM 19、Tailwind CSS 4。assistant-ui 固定使用
          0.15.18。开发本仓库使用 Node 24 和 pnpm。
        </p>
        <p>
          本组件库通过 npm 包分发，保留 ToolPlane 的组件行为；无需安装 Next.js
          或 ToolPlane。
        </p>
      </section>
      <section id="dependencies">
        <h2>1. 安装依赖</h2>
        <label className="docs-source-select">
          包管理器
          <Select
            aria-label="包管理器"
            value={manager}
            onChange={(event) => setManager(event.target.value)}
          >
            {["pnpm", "npm", "yarn", "bun"].map((name) => (
              <option key={name}>{name}</option>
            ))}
          </Select>
        </label>
        <CodeBlock
          label="安装命令"
          language="bash"
          code={`${manager} ${manager === "npm" ? "install" : "add"} @asharca/ui`}
        />
        <p>pnpm 默认会自动补齐缺少的 peer dependencies。安装后仍需配置下方的全局样式。</p>
        <details>
          <summary>依赖未自动安装或版本冲突？</summary>
          <p>若关闭了自动安装，或包管理器未补齐依赖，可显式安装下列版本。已有依赖发生冲突时，请先确认项目及其他依赖兼容这些版本。</p>
          <CodeBlock
            label="完整依赖安装命令"
            language="bash"
            code={`${manager} ${manager === "npm" ? "install" : "add"} @asharca/ui @assistant-ui/react@0.15.18 react@^19 react-dom@^19 tailwindcss@^4`}
          />
        </details>
      </section>
      <section id="styles">
        <h2>2. 导入全局样式</h2>
        <p>
          在已配置 Tailwind 4 构建流程的全局 CSS 中导入。包样式通过 @source
          扫描发布的组件文件。
        </p>
        <CodeBlock
          label="app.css"
          language="css"
          code={'@import "tailwindcss";\n@import "@asharca/ui/styles.css";'}
        />
      </section>
      <section id="first-component">
        <h2>3. 使用第一个组件</h2>
        <CodeBlock
          label="App.tsx"
          code={
            'import { Button } from "@asharca/ui/controls";\nimport "./app.css";\n\nexport default function App() {\n  return <Button variant="outline">开始使用</Button>;\n}'
          }
        />
        <a className="docs-next-link" href="#/components/button">
          查看 Button 预览和源码
          <ArrowRight size={16} />
        </a>
      </section>
      <section id="theme">
        <h2>4. 配置主题</h2>
        <p>颜色变量使用 HSL 通道值。在祖先元素添加 .dark 可切换暗色模式。</p>
        <CodeBlock
          label="主题变量 CSS"
          language="css"
          code={
            ":root {\n  --toolplane-ui-brand: 0 0% 12%;\n  --toolplane-ui-radius: 0.5rem;\n}\n.dark {\n  --toolplane-ui-brand: 0 0% 95%;\n}"
          }
        />
      </section>
    </>
  );
}

export function DocsApp() {
  const readRoute = () => window.location.hash || "#/installation";
  const [route, setRoute] = useState(readRoute);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute());
      setOpen(false);
      setSearch("");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    main.current?.scrollTo?.(0, 0);
  }, [route]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark, route]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  if (route === "#workbench" || route === "#/examples/workspace")
    return (
      <>
        <Suspense fallback={<p>加载工作区…</p>}>
          <Workbench />
        </Suspense>
      </>
    );
  const id = route.startsWith("#/components/")
    ? route.slice("#/components/".length)
    : "";
  const doc = componentDocs.find((item) => item.id === id);
  const guide = route === "#/guide";
  const examples = route === "#/examples";
  const missing = route !== "#/installation" && route !== "#" && !doc && !guide && !examples;
  const toc = doc
    ? [
        ["preview", "预览与用法"],
        ["installation", "安装"],
        ["source", "组件源码"],
        ["api", "API 与接入边界"],
      ]
    : [
        ["requirements", "环境要求"],
        ["dependencies", "安装依赖"],
        ["styles", "全局样式"],
        ["first-component", "第一个组件"],
        ["theme", "主题"],
      ];
  return (
    <div className="docs-site">
      <header className="docs-top">
        <a href="#/installation" className="docs-brand">
          <Box size={21} />
          <strong>asharca/ui</strong>
        </a>
        <nav aria-label="站点导航">
          <a href="#/installation">文档</a>
          <a href="#/examples" aria-current={examples ? "page" : undefined}>示例</a>
        </nav>
        <div className="docs-top-actions">
          <span>v{version}</span>
          <a
            href="https://github.com/asharca/ui"
            aria-label="GitHub 源码"
            title="GitHub 源码"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 size={18} />
          </a>
          <IconButton
            variant="ghost"
            label={dark ? "切换浅色主题" : "切换深色主题"}
            icon={dark ? <Sun size={17} /> : <Moon size={17} />}
            onClick={() => setDark(!dark)}
          />
          <IconButton
            className="docs-mobile-toggle"
            variant="ghost"
            label={open ? "关闭文档导航" : "打开文档导航"}
            aria-expanded={open}
            aria-controls="docs-navigation"
            icon={open ? <X size={18} /> : <Menu size={18} />}
            onClick={() => setOpen(!open)}
          />
        </div>
      </header>
      <div className="docs-body">
        {open && (
          <button
            className="docs-scrim"
            aria-label="关闭文档导航遮罩"
            onClick={() => setOpen(false)}
          />
        )}
        <aside
          id="docs-navigation"
          className={`docs-sidebar ${open ? "is-open" : ""}`}
          aria-label="文档导航"
        >
          <SearchInput
            label="搜索组件文档"
            placeholder="搜索组件…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onClear={() => setSearch("")}
          />
          <h2>开始使用</h2>
          <a
            href="#/installation"
            aria-current={!doc && !guide && !examples && !missing ? "page" : undefined}
          >
            安装
          </a>
          <a href="#/guide" aria-current={guide ? "page" : undefined}>
            使用手册
          </a>
          <h2>组件</h2>
          <nav aria-label="组件目录">
            {componentDocs
              .filter((item) =>
                `${item.name} ${item.description}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map((item) => (
                <a
                  href={`#/components/${item.id}`}
                  key={item.id}
                  aria-current={id === item.id ? "page" : undefined}
                >
                  {item.name}
                </a>
              ))}
          </nav>
          {!componentDocs.some((item) =>
            `${item.name} ${item.description}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          ) && <p role="status">没有匹配的组件</p>}
        </aside>
        <main className="docs-main" ref={main}>
          <div className={`docs-content ${guide ? "docs-guide" : ""}`}>
            {missing ? (
              <>
                <h1>页面不存在</h1>
                <a href="#/installation">返回安装页</a>
              </>
            ) : examples ? (
              <>
                <div className="docs-page-heading">
                  <span className="docs-eyebrow">EXAMPLES</span>
                  <h1>示例</h1>
                  <p>使用 Asharca UI 构建的完整界面。</p>
                </div>
                <a className="docs-example" href="#/examples/workspace" aria-label="打开工作区示例">
                  <img src="./workspace-preview.png" alt="工作区示例：可折叠侧边栏、标签导航和组件工作台" width={1440} height={900} />
                  <div><div><h2>工作区</h2><p>侧边栏、标签导航、项目管理与聊天界面。</p></div><ArrowRight size={20} aria-hidden="true" /></div>
                </a>
              </>
            ) : doc ? (
              <ComponentPage key={id} id={id} />
            ) : guide ? (
              <Manual
                onNavigate={(view) => {
                  window.location.hash =
                    view === "chat"
                      ? "#/components/chat-thread"
                      : "#/components/button";
                }}
              />
            ) : (
              <Installation />
            )}
          </div>
        </main>
        {!guide && !missing && !examples && (
          <aside className="docs-toc">
            <span>本页目录</span>
            {toc.map(([target, label]) => (
              <button
                key={target}
                onClick={() =>
                  document
                    .getElementById(target)
                    ?.scrollIntoView({ block: "start" })
                }
              >
                {label}
              </button>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}
