import { Check, Moon, Sun } from 'lucide-react';
import { Button, Select } from '../src/Controls';
import { CopyButton } from '../src/Forms';
import { DesignShowcase } from './DesignShowcase';
import { DocCode } from './DocCode';
import { designStyles, normalizeDensity, themeSetup, type DesignStyle, type DesignDensity } from './design-settings';

export type ThemeStudioProps = {
  dark: boolean; style: DesignStyle; density: DesignDensity;
  onDarkChange: (dark: boolean) => void; onStyleChange: (style: DesignStyle) => void; onDensityChange: (density: DesignDensity) => void;
};
export function ThemeStudio({ dark, style, density, onDarkChange, onStyleChange, onDensityChange }: ThemeStudioProps) {
  const code = themeSetup(dark, style, density);
  return <><div className="docs-page-heading design-studio-heading"><span className="design-kicker">DESIGN SYSTEM / 01</span><h1>不止换色，是不同的表达。</h1><p>在同一个可交互界面里，比较三套风格。主题、明暗和密度各自独立，输入状态保持不变。</p></div><section className="design-skin-grid" aria-label="选择视觉风格">{designStyles.map((skin) => <button type="button" className="design-skin-card" key={skin.id} aria-pressed={style === skin.id} onClick={() => onStyleChange(skin.id)}><span className="design-skin-preview" data-ui-style={skin.id} data-ui-mode={dark ? 'dark' : 'light'} aria-hidden="true"><span className="design-skin-sidebar"><i /><i /><i /></span><span className="design-skin-content"><i /><span><b /><b /></span><i /><em /></span></span><span className="design-skin-name">{skin.name}{style === skin.id && <Check size={16} aria-hidden="true" />}</span><span className="design-skin-description">{skin.description}</span></button>)}</section><div className="design-studio-toolbar"><div role="group" aria-label="主题明暗"><Button size="sm" variant={!dark ? 'primary' : 'ghost'} aria-pressed={!dark} onClick={() => onDarkChange(false)}><Sun size={14} />浅色模式</Button><Button size="sm" variant={dark ? 'primary' : 'ghost'} aria-pressed={dark} onClick={() => onDarkChange(true)}><Moon size={14} />深色模式</Button></div><label>界面密度<Select aria-label="界面密度" controlSize="sm" value={density} onChange={(event) => onDensityChange(normalizeDensity(event.target.value))}><option value="comfortable">舒适</option><option value="compact">紧凑</option></Select></label><CopyButton text={code} label="复制主题配置" copiedLabel="已复制主题" failedLabel="复制失败" /></div><DesignShowcase /><section className="design-integration" id="theme-integration"><div><span className="design-kicker">USE IT IN YOUR APP</span><h2>把这套风格带进你的应用。</h2><p>额外导入主题样式，并给根元素设置属性。移除 data-ui-style 即恢复原来的组件外观，不需要迁移组件事件。</p><p>浮层挂在 body 时，全局主题最可靠。局部主题需要为 Portal 指定同一容器；主题属性不会跨越 DOM 自动传播。</p></div><DocCode code={code} label="主题配置 CSS" language="css" /></section><div className="design-contract-grid"><div><h3>颜色是语义，不是装饰</h3><p>主操作、辅助信息、成功和错误各有职责；每种状态也保留文字和图标。</p></div><div><h3>玻璃效果不过界</h3><p>仅标记的容器使用轻透明；输入、菜单、代码和阅读区保持实色。减少透明度偏好下自动降级。</p></div><div><h3>动效服从操作</h3><p>短促反馈，不持续漂浮。保留键盘焦点与减少动画偏好，不让视觉影响任务。</p></div></div></>;
}
