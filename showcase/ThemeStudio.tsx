import { Check, Moon, Sun } from 'lucide-react';
import { Button, Select } from '../src/Controls';
import { CopyButton } from '../src/Forms';
import { DesignControls } from './DesignControls';
import './exhibit-specimens.css';
import { DesignShowcase } from './DesignShowcase';
import { DesignSpecimens } from './DesignSpecimens';
import { DocCode } from './DocCode';
import { designStyles, normalizeDensity, themeSetup, type DesignStyle, type DesignDensity } from './design-settings';

export type ThemeStudioProps = {
  dark: boolean;
  style: DesignStyle;
  density: DesignDensity;
  onDarkChange: (dark: boolean) => void;
  onStyleChange: (style: DesignStyle) => void;
  onDensityChange: (density: DesignDensity) => void;
};

export function ThemeStudio({ dark, style, density, onDarkChange, onStyleChange, onDensityChange }: ThemeStudioProps) {
  const code = themeSetup(dark, style, density);
  return <>
    <header className="ex-page-title"><h1>主题</h1><p>同一套组件，三种表达。</p></header>
    <section className="design-skin-grid" aria-label="选择视觉风格">
      {designStyles.map((skin) => <button type="button" className="design-skin-card" key={skin.id} aria-pressed={style === skin.id} onClick={() => onStyleChange(skin.id)}>
        <span className="design-skin-preview" data-ui-style={skin.id} data-ui-mode={dark ? 'dark' : 'light'} aria-hidden="true">
          <span className="design-skin-sidebar"><i /><i /><i /></span>
          <span className="design-skin-content"><i /><span><b /><b /></span><i /><em /></span>
        </span>
        <span className="design-skin-name">{skin.name}{style === skin.id && <Check size={16} aria-hidden="true" />}</span>

      </button>)}
    </section>
    <div className="design-studio-toolbar"><DesignControls style={style} onStyleChange={onStyleChange} />
      <div role="group" aria-label="主题明暗">
        <Button size="sm" variant={!dark ? 'primary' : 'ghost'} aria-pressed={!dark} onClick={() => onDarkChange(false)}><Sun size={14} aria-hidden="true" />浅色模式</Button>
        <Button size="sm" variant={dark ? 'primary' : 'ghost'} aria-pressed={dark} onClick={() => onDarkChange(true)}><Moon size={14} aria-hidden="true" />深色模式</Button>
      </div>
      <label>界面密度<Select aria-label="界面密度" controlSize="sm" value={density} onChange={(event) => onDensityChange(normalizeDensity(event.target.value))}><option value="comfortable">舒适</option><option value="compact">紧凑</option></Select></label>
      <CopyButton text={code} label="复制主题配置" copiedLabel="已复制主题" failedLabel="复制失败" />
    </div>
    <DesignShowcase />
    <DesignSpecimens />
    <section className="design-integration" id="theme-integration">
      <h2>主题配置</h2>
      <DocCode code={code} label="主题配置 CSS" language="css" />
    </section>
  </>;
}
