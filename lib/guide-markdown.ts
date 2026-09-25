import { GITHUB_SKILL_INSTALL } from "@/lib/repository";
import { SITE_URL } from "@/lib/site";

const guides = {
  "motion-patterns": {
    title: "Motion Guides",
    description:
      "Practical guidance for purposeful animation, timing, easing, springs, and accessible motion in React interfaces.",
    body: `## Decision framework

Ask four questions before choosing a duration or spring:

1. **Check frequency.** Repeated actions should feel nearly instant. Save expressive motion for rare moments.
2. **Name the purpose.** Motion should explain space, confirm input, show state, or soften a change.
3. **Choose the physics.** Use ease-out for entrances and exits, ease-in-out for movement, linear motion for progress, and springs for gestures.
4. **Design the fallback.** Reduced motion should keep useful opacity and color feedback while removing travel, scale, parallax, and overshoot.

## Motion tokens

- \`EASE_OUT\`: entrances and exits that respond immediately, then settle quietly.
- \`EASE_IN_OUT\`: objects already on screen moving between positions.
- \`SPRING_PRESS\`: fast, weighted feedback for pressable surfaces.
- \`SPRING_LAYOUT\`: shared surfaces and indicators that preserve spatial continuity.

## Timing

| Interaction | Range | Desired feel |
| --- | --- | --- |
| Press feedback | 100–160ms | Immediate and physical |
| Tooltip or popover | 125–200ms | Quick and origin-aware |
| Dropdown or select | 150–250ms | Responsive, with no waiting |
| Modal or drawer | 200–500ms | Enough time to explain space |
| Marketing demo | Flexible | Clarity matters more than speed |

Under 300ms is the default for interface motion. Longer motion belongs to explanatory demos, deliberate gestures, and large spatial changes.

## Recipes

### Press feedback

Confirm input before the action finishes. Keep the scale change small and the response immediate.

\`\`\`tsx
const reduce = useReducedMotion();

<motion.button
  whileTap={reduce ? undefined : { scale: 0.97 }}
  transition={SPRING_PRESS}
>
  Continue
</motion.button>
\`\`\`

### Semantic icon motion

Let an icon imitate its real action. Gate decorative hover motion behind pointer capability and reduced-motion preferences.

### Content reveal

Reveal one meaningful surface with a short lift and restrained blur. Finish before the surface becomes the focus.

### Layout continuity

Keep the same surface visible while its footprint changes. Move the shape first, then introduce its label.

### Content swap

For small view changes, let old content leave faster than new content arrives. Keep travel to a few pixels.

## Accessibility

Reduced motion is a designed state. Preserve opacity, color, and instant state changes. Remove parallax, large transforms, repeated scale, and spring overshoot.

\`\`\`tsx
const reduce = useReducedMotion();

const hidden = {
  opacity: 0,
  transform: reduce ? "none" : "translateY(8px)",
};

const visible = {
  opacity: 1,
  transform: "translateY(0px)",
};
\`\`\``,
  },
  "ai-agents": {
    title: "Agent Guide",
    description:
      "Use official beUI components with additional Asharca workspace APIs, installation steps and examples; no self-hosted service is required.",
    body: `## Agent skill

The asharca/ui edition of the beui skill supplements normal beUI usage with WorkspaceShell, WorkspaceSidebar and WorkspaceTabBar installation, APIs and examples. Official beUI components remain available and can be freely combined with these additions. Choose components that fit the interface and the user's preferences.

After the changes are merged into the default branch:

\`\`\`bash
${GITHUB_SKILL_INSTALL}
\`\`\`

## Custom components without deployment

Before this branch is merged, clone it and install the skill from the local checkout:

\`\`\`bash
git clone --single-branch --branch rebuild/beui-workspace https://github.com/asharca/ui.git asharca-ui-source
# Run the next command from the consuming project; adjust the absolute path.
npx skills add /absolute/path/asharca-ui-source/skills/beui --skill beui
\`\`\`

A skill install supplies documentation, not the whole component repository. From the source checkout:

\`\`\`bash
git rev-parse HEAD
bun install --frozen-lockfile
bun scripts/export-component.ts workspace-shell --out /absolute/new-directory/workspace-shell.json
\`\`\`

Then in the configured consumer, review the proposed changes before installing:

\`\`\`bash
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --dry-run
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --diff
npx shadcn@latest add /absolute/new-directory/workspace-shell.json
\`\`\`

The exporter includes all required source files, helpers and the MIT license without starting Next.js or MCP. The custom entry inventory is skills/beui/source-policy.json; APIs and examples are in skills/beui/references/workspace.md. The inventory is reference data, not a restriction on using official components. Review shared-file changes and preserve the consuming project's customizations.

## MCP server (optional)

The official beUI MCP provides discovery and source inspection for its hosted catalog. Connecting it is optional; custom workspace examples and local export work independently. The hosted address is \`https://mcp.beui.dev/mcp\`.

\`\`\`bash
# Claude Code
claude mcp add --transport http beui https://mcp.beui.dev/mcp

# Codex
codex mcp add beui --url https://mcp.beui.dev/mcp

# Amp
amp mcp add beui https://mcp.beui.dev/mcp
\`\`\`

Manual configuration:

\`\`\`json
{
  "mcpServers": {
    "beui": {
      "type": "http",
      "url": "https://mcp.beui.dev/mcp"
    }
  }
}
\`\`\`

Available tools: \`list_components\`, \`search_components\`, \`get_component\`, and \`get_install_command\`.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| \`/llms.txt\` | Markdown discovery index |
| \`/r\` | JSON catalogue of every component |
| \`/r/{slug}\` | Component detail with files, dependencies, and source |
| \`/registry.json\` | shadcn directory-compatible catalogue |
| \`/r/{slug}.json\` | shadcn install item with inline file content |
| \`/r/{slug}/raw\` | Copy-ready plain-text source |
| \`/components/{category}/{slug}.md\` | Component documentation as Markdown |

## Agent flow

Explore official components through their published catalog:

1. Fetch \`https://beui.dev/r\` to discover components.
2. Select an item by its published name and description.
3. Fetch \`https://beui.dev/r/{slug}\` for source, files, and dependencies.
4. Review the files and merge them into the consumer's paths, preserving local changes.
5. Install compatible external dependencies from the response.

For the additional Asharca workspace components, the local export and bundled reference above provide the source and APIs. Compose official and custom components together as needed.

## shadcn flow

\`\`\`bash
# Official beUI component
npx shadcn@latest view @beui/animated-toast-stack
npx shadcn@latest add @beui/animated-toast-stack --dry-run
npx shadcn@latest add @beui/animated-toast-stack

# Official registry URL alternative
npx shadcn@latest add https://beui.dev/r/animated-toast-stack.json
\`\`\`

## Entry shape

Registry detail entries include the component slug, name, description, category, documentation URLs, package dependencies, internal helpers, and every source file required by the install. The local exporter produces a self-contained shadcn install item instead, including alias-aware file targets and provenance metadata.

## Generative UI

To let a model compose beUI components into a live interface, follow the [OpenUI integration guide](${SITE_URL}/docs/openui.md).`,
  },
  openui: {
    title: "Use beUI with OpenUI",
    description:
      "Register beUI components with OpenUI, generate the system prompt, stream OpenUI Lang, and render interactive UI.",
    body: `OpenUI lets a model emit an abstract UI tree instead of Markdown. Its React runtime maps every node to a component you register, so generated responses use only the beUI components you allow.

## Install

\`\`\`bash
npm install @openuidev/react-lang @openuidev/lang-core zod
npm install openai
npx shadcn@latest add @beui/button @beui/animated-badge @beui/animated-number
\`\`\`

## Register components

Use \`defineComponent\` to map an OpenUI Lang node to a beUI component. The Zod schema validates streamed model output, while the description teaches the model when to use the component.

\`\`\`tsx
import { defineComponent, useTriggerAction } from "@openuidev/react-lang";
import { z } from "zod/v4";
import { Button } from "@/components/motion/button";

const BeButton = defineComponent({
  name: "Button",
  description: "Spring-pressed action button.",
  props: z.object({
    label: z.string(),
    action: z.string(),
  }),
  component: ({ props }) => {
    const triggerAction = useTriggerAction();
    return (
      <Button onClick={() => triggerAction(props.action)}>
        {props.label}
      </Button>
    );
  },
});
\`\`\`

## Assemble the library

\`createLibrary\` collects the definitions, names the root node, and groups components with prompt guidance.

\`\`\`tsx
import { createLibrary } from "@openuidev/react-lang";

export const beuiLibrary = createLibrary({
  root: "Stack",
  components: [Stack, BeButton, BeBadge, BeStat],
});
\`\`\`

## Generate the prompt

Generate a serializable library specification whenever the component library changes:

\`\`\`bash
npx @openuidev/cli@latest generate \\
  --spec ./lib/beui-library.tsx \\
  --out ./lib/generated/beui-library.spec.json
\`\`\`

Pass that specification to \`generateSystemPrompt\` in the server route, then stream the model's OpenUI Lang response to the browser.

## Render the stream

\`\`\`tsx
<Renderer
  response={response}
  library={beuiLibrary}
  isStreaming={isStreaming}
  onAction={(event) => onSend(event.humanFriendlyMessage)}
/>
\`\`\`

## Why beUI fits

beUI components own their files and ship through a shadcn-compatible registry. Generated interfaces inherit the host application's semantic color tokens and use real React controls.

## Resources

- [OpenUI](https://www.openui.com)
- [Defining components](https://www.openui.com/docs/openui-lang/defining-components)
- [shadcn chat example](https://www.openui.com/docs/openui-lang/examples/shadcn-chat)`,
  },
} as const;

export type GuideSlug = keyof typeof guides;
export const GUIDE_SLUGS = Object.keys(guides) as GuideSlug[];
export function buildGuideMarkdown(slug: string) {
  const guide = guides[slug as GuideSlug];
  if (!guide) return null;
  const documentation = `${SITE_URL}/docs/${slug}`;
  const markdown = `${documentation}.md`;
  const lines = [
    "---", `title: ${JSON.stringify(guide.title)}`, `description: ${JSON.stringify(guide.description)}`,
    `documentation: ${JSON.stringify(documentation)}`, `markdown: ${JSON.stringify(markdown)}`, "---", "",
    `# ${guide.title}`, "", `> ${guide.description}`, "", guide.body, "",
  ];
  return lines.join("\n");
}
