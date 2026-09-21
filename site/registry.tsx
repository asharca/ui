import { useEffect, useState } from 'react';
import { CodeBlock, CopyButton } from './code';
import { managers, publicPath, registryUrl, runners, usePreferences } from './preferences';

export interface RegistryFile { path: string; target: string; content: string }
export interface RegistryPayload { name: string; dependencies: string[]; files: RegistryFile[] }
export function useRegistry(slug: string) {
  const [payload, setPayload] = useState<RegistryPayload | null>(null);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setPayload(null); setError('');
    fetch(publicPath(`r/${slug}.json`), { signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json() as Promise<RegistryPayload>; })
      .then((value) => {
        if (!Array.isArray(value.files) || !Array.isArray(value.dependencies) || !value.files.every((file) => typeof file.content === 'string' && typeof file.target === 'string')) throw new Error('Invalid registry payload');
        if (!controller.signal.aborted) setPayload(value);
      })
      .catch((cause: unknown) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : '请求失败'); });
    return () => controller.abort();
  }, [slug, revision]);
  return { payload, error, retry: () => setRevision((value) => value + 1) };
}
export function RegistryFiles({ payload, slug }: { payload: RegistryPayload; slug: string }) {
  const [path, setPath] = useState('');
  const selected = payload.files.find((file) => file.path === path) ?? payload.files.find((file) => file.path.endsWith(`/${slug}.tsx`)) ?? payload.files[0];
  return <div className="source-files">
    <label className="file-picker">源码文件<select value={selected.path} onChange={(event) => setPath(event.target.value)} aria-label="源码文件">{payload.files.map((file) => <option key={file.path} value={file.path}>{file.target}</option>)}</select></label>
    <CodeBlock code={selected.content} label={selected.target} language={selected.path.endsWith('.tsx') ? 'tsx' : 'typescript'} />
    <p className="small-note">共 {payload.files.length} 个文件。CLI 会安装全部文件；目标目录遵循 components.json。</p>
  </div>;
}
export function InstallCommand({ slug = 'button' }: { slug?: string }) {
  const { manager, setManager } = usePreferences();
  const command = `${runners[manager]} add "${registryUrl(slug)}"`;
  return <div className="install-command"><div className="install-heading"><div className="manager-tabs" role="group" aria-label="包管理器">{managers.map((item) => <button key={item} type="button" aria-pressed={manager === item} onClick={() => setManager(item)}>{item}</button>)}</div><CopyButton text={command} label="复制安装命令" /></div>
    <div className="command-line"><span aria-hidden="true">$</span><code>{command}</code></div>
  </div>;
}
export function Installation({ slug }: { slug: string }) {
  const [manual, setManual] = useState(false);
  const { manager } = usePreferences();
  const { payload, error, retry } = useRegistry(slug);
  const install = `${manager} ${manager === 'npm' ? 'install' : 'add'}`;
  return <div className="installation"><div className="mode-tabs" role="group" aria-label="安装方式"><button type="button" aria-pressed={!manual} onClick={() => setManual(false)}>CLI</button><button type="button" aria-pressed={manual} onClick={() => setManual(true)}>Manual</button></div>
    {!manual ? <InstallCommand slug={slug} /> : error ? <p role="alert">安装清单加载失败：{error} <button type="button" onClick={retry}>重试</button></p> : !payload ? <p role="status" className="small-note">正在读取安装清单…</p> : <div className="manual-install">
      <h3>1. 安装依赖</h3><CodeBlock code={`${install} ${payload.dependencies.join(' ')}`} language="bash" label="终端" />
      <h3>2. 添加所有源码文件</h3><p className="small-note">按下面的目标路径逐个保存。@components 指向你的组件目录；文件之间的相对导入保持不变。</p>
      <RegistryFiles payload={payload} slug={slug} />
      <h3>3. 使用上方的 Usage 示例</h3><p className="small-note">项目需已配置 React 19、TypeScript、Tailwind CSS 4 和 shadcn 主题变量。不会覆盖已有主题。</p>
    </div>}
  </div>;
}
