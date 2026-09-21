---
name: asharca-ui
description: Build React interfaces with @asharca/ui, including forms, tables, accessible overlays and AI chat/tool approval. Use when a project uses this package or asks to install its components or reproduce its component demos.
license: MIT
---

# Asharca UI

## Read the actual contract

Inspect the project's package.json and lockfile before editing. Read the installed
@asharca/ui package exports and declarations. Its generated AI reference is at
node_modules/@asharca/ui/dist/ai/llms.txt and llms-full.txt. Follow component links
relative to those files. In this library's repository, use docs/ai/README.md,
docs/ai/PATTERNS.md and showcase/catalog-data.ts instead.

The installed version is authoritative. Do not invent props from other UI
libraries, silently upgrade packages, or install a registry that does not exist.

## Install and style

Follow the project's package manager. The npm package is @asharca/ui. It requires
React 19, Tailwind CSS 4 and its declared assistant-ui peer. Diagnose peer conflicts
rather than disabling strict checking.

Global stylesheet, in order:

```css
@import "tailwindcss";
@import "@asharca/ui/styles.css";
@import "@asharca/ui/themes.css";
```

The last import enables optional skins. Set data-ui-style="minimal", "tech" or
"glass" on the document root; data-ui-density accepts "comfortable" or "compact".
Use the root .dark class for dark mode. Root attributes also theme body Portals.
Tokens use HSL channel values, not wrapped hsl() expressions.

```tsx
import { Button } from '@asharca/ui/controls';

export function SaveAction() {
  return <Button type="submit" variant="primary">保存</Button>;
}
```

## Interaction

Use ChoiceField/ChoiceGroup for labeled native choices. Checkbox, Radio, Input
and Select use native onChange(event). Switch uses onCheckedChange(boolean).
Preserve label/description associations, native form values, keyboard operation,
focus return, disabled fieldsets and reduced-motion preferences.

Keep authentication, model/network transport, business permissions and persistent
storage in the host application. ChatThread needs the host's runtime. Tool approval
UI is not an authorization boundary; validate permissions on the server. Never
pretend a local demonstration called a real tool or model.

## Verify

Copy from the matching installed-version example, not an unrelated component.
Run the project's type checks, tests and build. For visual work verify mobile and
desktop, dark and light, keyboard focus, and loading/error states. Report actual
results and unresolved failures. Do not merge, publish or deploy without user
approval. Installing this skill grants no additional tool permissions.
