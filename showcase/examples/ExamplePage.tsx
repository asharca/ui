import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { ArrowLeft, ArrowUpRight, Code2, Moon, Sun } from "lucide-react";
import {
  Button,
  IconButton,
  Select,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../src/index";
import { DesignControls } from "../DesignControls";
import { DocCode } from "../DocCode";
import {
  normalizeDensity,
  type DesignDensity,
  type DesignStyle,
} from "../design-settings";
import { appExamples, type AppExample } from "./registry";
import "./examples.css";

type DesignProps = {
  style: DesignStyle;
  onStyleChange: (style: DesignStyle) => void;
};
const loaders = import.meta.glob<
  Record<string, ComponentType<{ embedded?: boolean }>>
>("./*Example.tsx");
const components = Object.fromEntries(
  appExamples.map((example) => [
    example.id,
    lazy(async () => ({
      default: (await loaders[`./${example.component}.tsx`]())[
        example.component
      ],
    })),
  ]),
);
const sources = import.meta.glob<string>(
  [
    "./*.tsx",
    "./*.css",
    "../../src/Chart.tsx",
    "../styles.css",
    "../HighlightedCode.tsx",
    "../highlighted-code.css",
  ],
  { query: "?raw", import: "default" },
);

class ExampleBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="example-load-error" role="alert">
        <p>示例加载失败</p>
        <Button onClick={() => window.location.reload()}>重新加载</Button>
      </div>
    ) : (
      this.props.children
    );
  }
}

export function ExampleGallery({ style, onStyleChange }: DesignProps) {
  return (
    <>
      <div className="example-gallery-heading">
        <div className="docs-page-heading">
          <span className="docs-eyebrow">组合示例</span>
          <h1>示例</h1>
        </div>
        <DesignControls style={style} onStyleChange={onStyleChange} />
      </div>
      <div className="example-gallery">
        {appExamples.map((example) => (
          <a
            key={example.id}
            href={`#/examples/${example.id}`}
            className="example-gallery-item"
            aria-label={`打开${example.name}示例`}
          >
            <div className="example-gallery-image">
              <img
                src={`./${example.image}`}
                alt={`${example.name}示例`}
                width={1440}
                height={900}
                loading="lazy"
              />
            </div>
            <div className="example-gallery-title">
              <h2>{example.name}</h2>
              <ArrowUpRight size={17} />
            </div>
            <p>{example.description}</p>
            <code>showcase/examples/{example.component}.tsx</code>
          </a>
        ))}
      </div>
    </>
  );
}

export function ExamplePage({
  example,
  style,
  onStyleChange,
  dark,
  onDarkChange,
  density,
  onDensityChange,
}: DesignProps & {
  example: AppExample;
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
  density: DesignDensity;
  onDensityChange: (density: DesignDensity) => void;
}) {
  const [view, setView] = useState("preview");
  const [file, setFile] = useState<string>(example.files[0]);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (view !== "source") return;
    let active = true;
    setCode("");
    setError(false);
    Promise.resolve()
      .then(() => sources[file.startsWith(".") ? file : `./${file}`]())
      .then((value) => {
        if (active) setCode(value);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [file, view, retry]);
  const Demo = components[example.id];
  const sourcePath = file.startsWith("../../")
    ? file.slice(6)
    : file.startsWith("../")
      ? `showcase/${file.slice(3)}`
      : `showcase/examples/${file}`;
  return (
    <div className="example-page" data-toolplane-ui="examples">
      <Tabs value={view} onValueChange={setView}>
        <header className="example-preview-toolbar">
          <div className="example-preview-location">
            <a href="#/examples" aria-label="返回示例" title="返回示例">
              <ArrowLeft size={18} />
            </a>
            <Select
              aria-label="选择示例"
              controlSize="sm"
              value={example.id}
              onChange={(event) => {
                window.location.hash = `#/examples/${event.target.value}`;
              }}
            >
              {appExamples.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </div>
          <TabsList data-variant="underline" aria-label="示例视图">
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="source">
              <Code2 size={14} />
              源码
            </TabsTrigger>
          </TabsList>
          <div className="example-preview-actions">
            <DesignControls style={style} onStyleChange={onStyleChange} />
            <Select
              aria-label="示例密度"
              controlSize="sm"
              value={density}
              onChange={(event) =>
                onDensityChange(normalizeDensity(event.target.value))
              }
            >
              <option value="comfortable">舒适</option>
              <option value="compact">紧凑</option>
            </Select>
            <IconButton
              size="sm"
              variant="ghost"
              label={dark ? "切换浅色主题" : "切换深色主题"}
              icon={dark ? <Sun size={16} /> : <Moon size={16} />}
              onClick={() => onDarkChange(!dark)}
            />
          </div>
        </header>
        <TabsContent
          value="preview"
          forceMount
          aria-hidden={view !== "preview"}
          inert={view !== "preview"}
          style={{ visibility: view === "preview" ? "visible" : "hidden" }}
          className="example-preview-body"
        >
          <ExampleBoundary>
            <Suspense fallback={<Spinner label="加载示例" />}>
              <Demo embedded />
            </Suspense>
          </ExampleBoundary>
        </TabsContent>
        <TabsContent value="source" className="example-source-body">
          <div className="example-source-heading">
            <label htmlFor="example-source-file">源码文件</label>
            <Select
              id="example-source-file"
              value={file}
              onChange={(event) => setFile(event.target.value)}
            >
              {example.files.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <code>{sourcePath}</code>
          </div>
          {error ? (
            <div role="alert">
              源码加载失败
              <Button onClick={() => setRetry(retry + 1)}>重试</Button>
            </div>
          ) : code ? (
            <DocCode
              code={code}
              label={sourcePath}
              language={file.endsWith(".css") ? "css" : "tsx"}
            />
          ) : (
            <Spinner label="加载源码" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
