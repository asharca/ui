# Contributing

beUI is a React, TypeScript, Framer Motion and Tailwind CSS component library.

## Before You Open a PR

Run the project checks:

```bash
bun install
bun run check
```

`bun run check` typechecks the app and verifies every registry component can publish its source files.

## Motion Conventions

Every component follows the same motion language:

- Import easing curves and spring presets from `lib/ease.ts` (`EASE_OUT`, `SPRING_PRESS`, `SPRING_SWAP`, `SPRING_PANEL`, `SPRING_LAYOUT`, `SPRING_MOUSE`). Do not inline `cubic-bezier` values or one-off spring configs unless the tuning is genuinely component-specific, and leave a comment when it is.
- Gate transform-based motion behind `useReducedMotion()`. Reduced motion keeps opacity and color transitions for comprehension and drops movement.
- Gate decorative hover effects (magnetic pull, tilt) behind `useHoverCapable()` so touch devices never get sticky phantom-hover states.
- Animate `transform` and `opacity`; avoid animating layout properties. Keep blur under 10px and exits faster than entrances.

Internal imports are safe: the registry build follows `@/lib` and relative imports and bundles them with the component.

## Site Scrollbars

`app/globals.css` styles visible native scrollbars to match Selector: thin tracks, transparent track backgrounds and theme-aware translucent thumbs that darken on hover. Both scroll axes are covered. Keep intentional scrollbar-hiding utilities; the base styles do not override them or reserve extra gutter space. Selector retains its own styles for standalone registry installs; other copied components use the consuming application's scrollbar styles.

## Selector

`components/motion/selector.tsx` exports `Selector`, `SelectorOption`, `SelectorProps` and `SelectorClassNames`. The Selector page demonstrates model selection, people single- and multi-selection, workspace switching and visual resource grids. Options use `id` and `name`; optional `group`, `description`, `metadata`, `keywords`, `icon`, `preview`, `details` and `disabled` fields adapt the same surface to different data.

Use `value`/`defaultValue` with a string for single selection, or set `multiple` and pass an array of IDs. `onValueChange` receives IDs rather than domain objects. `triggerVariant` supports `pill`, `field` and `workspace`; `layout="grid"` renders option previews. The consuming application owns persistence and footer `action.onSelect` behavior. Single selection initially picks the first enabled option unless an explicit value is supplied; pass `defaultValue=""` for an empty initial field.

There are no `size` presets. `className` styles the outer wrapper. `classNames` accepts `trigger`, `content` (popover panel), `list` (scroll area), `option` (each row/card), `icon` (trigger and row icon wrappers), `search` (search field container) and `details` (floating detail card). Each override is merged after the slot's defaults via `cn()`, so Tailwind width, height, spacing and typography utilities replace defaults independently. For example, `classNames={{ trigger: "min-h-9 px-2 text-xs", content: "w-[28rem]", list: "max-h-80", option: "min-h-10 py-1", icon: "size-6" }}`. The content and details retain viewport maximum widths unless explicitly overridden; application-specific avatar or thumbnail sizes belong to the supplied `icon`/`preview` content.

Default field/workspace triggers are 16rem wide; pill triggers fit their content. The default popover is 22rem wide, with viewport bounds; visual-resource demos can set their own wider panel. The disclosure chevron rotates on open/close with `SPRING_PRESS`, switching instantly under reduced motion.

Install with `@beui/selector`. The published `@beui/model-selector` endpoint remains valid and ships the same source; migrate imports from `ModelSelector`/`ModelOption` to `Selector`/`SelectorOption`, replace `models` with `options`, replace `provider` with `group`, and render domain-specific detail content through `details`.


## Pull Requests

1. Open or comment on an issue before starting larger work.
2. Create a fork or feature branch.
3. Keep changes focused and include the component source, preview and registry entry together.
4. Open a pull request against `main`.

Agents working in this repository should follow [`skills/beui/SKILL.md`](./skills/beui/SKILL.md) and `AGENTS.md`.
