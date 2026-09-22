import { useEffect, useState } from 'react';
import { publicPath } from './preferences';
import { CodeBlock } from './code';

interface PropDoc { name: string; type: string; required: boolean; defaultValue: string | null; description: string; inherited: boolean }
interface ApiDocument {
  slug: string;
  sourcePath: string;
  components: { name: string; description: string; props: PropDoc[] }[];
  relatedTypes: { name: string; code: string }[];
  helpers: { name: string; code: string }[];
}
function PropsTable({ name, props }: { name: string; props: PropDoc[] }) {
  return <div role="table" aria-label={`${name} props`} className="api-props">
    <div role="row" className="api-props-heading"><span role="columnheader">Prop</span><span role="columnheader">Type / Description</span><span role="columnheader">Default</span></div>
    {props.map((prop) => <div role="row" className="api-prop-row" key={prop.name} data-prop={prop.name}>
      <div role="cell"><code>{prop.name}{prop.required ? '' : '?'}</code>{prop.required && <span className="api-required">必填</span>}</div>
      <div role="cell"><code>{prop.type}</code>{prop.description && <p>{prop.description}</p>}</div>
      <div role="cell" className="api-default"><span className="api-mobile-label">Default: </span><code>{prop.defaultValue ?? '—'}</code></div>
    </div>)}
  </div>;
}
export function ApiReference({ slug }: { slug: string }) {
  const [data, setData] = useState<ApiDocument | null>(null);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setData(null); setError(false);
    fetch(publicPath(`api-reference/${slug}.json`), { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error('API unavailable'); return response.json() as Promise<ApiDocument>; })
      .then((doc) => {
        if (doc.slug !== slug || !Array.isArray(doc.components) || !doc.components.length || !doc.components.every((component) => Array.isArray(component.props))) throw new Error('Invalid API reference');
        if (!controller.signal.aborted) setData(doc);
      }).catch(() => { if (!controller.signal.aborted) setError(true); });
    return () => controller.abort();
  }, [slug, revision]);
  return <section id="api-reference" className="doc-section api-reference" aria-labelledby="api-reference-heading">
    <h2 id="api-reference-heading">API Reference</h2>
    <p className="small-note">根据实际组件类型与默认值生成。继承的原生属性收在下方，不与组件参数混在一起。</p>
    {error ? <p role="alert" className="reading-note">API 文档加载失败。<button type="button" className="text-button" onClick={() => setRevision((value) => value + 1)}>重试加载 API</button></p> : !data ? <p role="status" className="small-note">正在读取 API Reference…</p> : <>
      {data.components.map((component) => {
        const own = component.props.filter((prop) => !prop.inherited);
        const inherited = component.props.filter((prop) => prop.inherited);
        return <div className="api-component" key={component.name} data-api-component={component.name}>
          <h3>{component.name}</h3>
          {component.description && <p className="reading-note">{component.description}</p>}
          {own.length ? <PropsTable name={component.name} props={own} /> : <p className="small-note">没有额外的组件参数。</p>}
          {inherited.length > 0 && <details className="api-inherited"><summary>继承属性 <span>{inherited.length}</span></summary><PropsTable name={`${component.name} inherited`} props={inherited} /></details>}
        </div>;
      })}
      {data.relatedTypes.length + data.helpers.length > 0 && <details className="api-related"><summary>关联类型与辅助函数</summary>{[...data.relatedTypes, ...data.helpers].map((type) => <CodeBlock key={type.name} code={type.code} label={type.name} language="typescript" />)}</details>}
    </>}
  </section>;
}
