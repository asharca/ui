# Application examples

Run `pnpm dev` from the repository root and open `#/examples` on the printed
local URL. Data is fictional and lives in React state; reloading resets it.
There is no authentication, backend, payment processing or real AI request.

| Route | Entry file | Additional source |
| --- | --- | --- |
| `#/examples/admin` | `AdminExample.tsx` | Order search, selection, sorting, CSV export and details |
| `#/examples/analytics` | `AnalyticsExample.tsx` | `../../src/Chart.tsx`, Recharts |
| `#/examples/projects` | `ProjectsExample.tsx` | Native task forms and status controls |
| `#/examples/workspace` | `WorkspaceExample.tsx` | `WorkspaceComponents.tsx`, `WorkspaceChat.tsx`, `../styles.css`, `../HighlightedCode.tsx` |
| `#/examples/settings` | `SettingsExample.tsx` | Settings draft, save and undo |

`examples.css` is the shared example layout, not package CSS. `ExamplePage.tsx`
supplies the preview/source tabs; source is loaded from the actual files with
Vite raw imports. Switching style, mode or density does not remount the demo.
The workspace uses `embedded` to let this shared toolbar own the theme.

For a consuming app, change `../../src/index` to `@asharca/ui`, include the
example CSS and import the package's styles and optional themes as described
in the canonical installation page. The workspace also needs its local helper
files, `../highlighted-code.css`, and `public/avatars/` assets. Apps that import
Recharts directly must declare `recharts` and its `react-is` peer themselves;
this repository uses Recharts 3 and React 19.

Charts follow shadcn's compositional approach: `ChartContainer`,
`ChartTooltipContent` and `ChartLegendContent` supply sizing and presentation,
while axes, series, data and interactions remain Recharts primitives. The
implementation uses scoped CSS properties, not dynamically injected styles.
The component's canonical API and runnable minimal example live at
`#/components/chart-container`; the analytics app also includes underlying
tables for all three charts.
