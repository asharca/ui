import { useEffect, useState } from 'react';

export const designStyles = [
  { id: 'minimal', name: 'Minimal Pro', description: '克制的中性色、轻阴影与清晰的信息层级。适合文档、表单和企业应用。' },
  { id: 'tech', name: 'Tech Noir', description: '蓝黑底色、冷色强调与精确边界。为 AI 工具、Agent 与工作台设计。' },
  { id: 'glass', name: 'Glass', description: '柔和紫色、通透容器与更舒展的圆角。保留清晰的阅读表面。' },
] as const;
export type DesignStyle = typeof designStyles[number]['id'];
export type DesignDensity = 'comfortable' | 'compact';
export const STYLE_KEY = 'asharca-ui-docs-style';
export const DENSITY_KEY = 'asharca-ui-docs-density';
export function normalizeStyle(value: unknown): DesignStyle {
  return value === 'minimal' || value === 'glass' || value === 'tech' ? value : 'minimal';
}
export function normalizeDensity(value: unknown): DesignDensity { return value === 'compact' ? 'compact' : 'comfortable'; }
function readPreference(key: string) { try { return localStorage.getItem(key); } catch { return null; } }

export function previewHref(id: string, dark: boolean, style: DesignStyle, density: DesignDensity) {
  return `#/preview/${encodeURIComponent(id)}?${new URLSearchParams({ theme: dark ? 'dark' : 'light', style, density })}`;
}

export function themeSetup(dark: boolean, style: DesignStyle, density: DesignDensity) {
  return `/* app.css — import in this order */\n@import "tailwindcss";\n@import "@asharca/ui/styles.css";\n@import "@asharca/ui/themes.css";\n\n/* Root HTML (or equivalent attributes in your framework):\n<html class="${dark ? 'dark' : ''}" data-ui-style="${style}" data-ui-density="${density}">\n*/\n\n/* Optional project overrides; HSL channel values, not hsl(...).\n:root[data-ui-style="${style}"] {\n  --toolplane-ui-radius: 0.75rem;\n}\n*/`;
}

/** The document root also themes body-mounted Portals. Preview URLs override
 * preferences without persisting changes into their parent's localStorage. */
export function useDesignSettings(previewQuery: string | null) {
  const [style, setStyle] = useState<DesignStyle>(() => normalizeStyle(readPreference(STYLE_KEY)));
  const [density, setDensity] = useState<DesignDensity>(() => normalizeDensity(readPreference(DENSITY_KEY)));
  const query = new URLSearchParams(previewQuery ?? '');
  const effectiveStyle = previewQuery === null ? style : normalizeStyle(query.get('style'));
  const effectiveDensity = previewQuery === null ? density : normalizeDensity(query.get('density'));
  useEffect(() => {
    const root = document.documentElement;
    const previousStyle = root.getAttribute('data-ui-style');
    const previousDensity = root.getAttribute('data-ui-density');
    root.dataset.uiStyle = effectiveStyle;
    root.dataset.uiDensity = effectiveDensity;
    return () => {
      if (previousStyle === null) root.removeAttribute('data-ui-style'); else root.setAttribute('data-ui-style', previousStyle);
      if (previousDensity === null) root.removeAttribute('data-ui-density'); else root.setAttribute('data-ui-density', previousDensity);
    };
  }, [effectiveStyle, effectiveDensity]);
  useEffect(() => {
    if (previewQuery !== null) return;
    try { localStorage.setItem(STYLE_KEY, style); localStorage.setItem(DENSITY_KEY, density); } catch { /* Still usable without storage. */ }
  }, [style, density, previewQuery]);
  return { style: effectiveStyle, density: effectiveDensity, setStyle, setDensity };
}
