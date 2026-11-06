# Fieldwork — conversational AI workspace

An original standalone implementation of the public Pair AI Workspace feature surface. The running application itself is the interactive preview; no registry token, paid source, hosted AI, authentication, or account connection is used.

## Run and deploy

Once the integration owner has materialized the declared beUI source bundles, this directory is independently installable:

```sh
bun install
bun run dev
```

The package is `@asharca/assistant-workspace-template`. It uses Next 16, React 19, strict TypeScript, Tailwind 4, and local system fonts. No source imports or symlinks point to a parent project. Main copies the complete source closure for `workspace-shell`, `animated-sidebar`, `button`, `command-palette`, `morphing-modal`, `prompt-input`, and `message` into the corresponding local `components/` and `lib/` paths.

```sh
bun run typecheck
bun run build
bun run deploy
```

`next.config.mjs` produces a static export with trailing slashes. `wrangler.jsonc` deploys `out/` as Cloudflare Worker assets with real 404 handling. Any static host that serves route `index.html` files works. No backend is bundled. After building, `bun run start` serves the exported assets through the local Wrangler runtime.

## Routes and behavior

- `/` and `/chat/`: full composer, deterministic local assistant, model and skill selection, credit allowance, references, attachment previews, saved drafts, copy messages, and automatic live-edge scrolling.
- `/chat/?session=<id>`: persistent session URLs; unknown local IDs have an explicit missing-session screen. New sessions are created on first send. URLs identify browser-local data, not server resources.
- `/chat/?project=<id>`: start a conversation in a project.
- `/projects/` and `/projects/?project=<id>`: create/edit/delete projects, view project sessions, start new sessions, move conversations between projects. Deleting a project preserves all conversations.
- `/archive/`: search/filter, open, and restore archived conversations. Archive and restore are confirmed in shared focus-managed dialogs.
- `/knowledge/`: create, edit, preview, search, filter, remove notes and HTTP(S) reference links. Links are not fetched. Select saved references in the composer.
- `/integrations/`: searchable local integration directory; confirmed connect/disconnect state and editable demonstration references. No OAuth or external account access.
- `/settings/`: greeting, instructions, default model/skill, light/dark/system theme, reset local credits, export/import workspace, raw saved-data recovery export, confirmed destructive reset.
- `/help/`: keyboard guide, behavior documentation, FAQ disclosure controls, and copyable host-adapter example.

Sidebar uses beUI's responsive mobile drawer, focus handling, and Ctrl/Cmd+B. The shared command palette opens with Ctrl/Cmd+K, searches sessions/projects/pages, and supports arrow keys, Enter, and Escape. Dialogs reuse beUI focus trapping and restoration. Semantic color tokens cover light and dark themes; reduced-motion preferences are respected by shared motion primitives and app scrolling.

## Local persistence and privacy

The versioned `fieldwork.workspace.v1` record stores conversations, sent file attachments, projects, knowledge, settings, connections, drafts, and credit allowance. Updates save synchronously before navigation. Storage failures display a visible error and retain in-memory data for export. Invalid saved records are not silently overwritten: export the saved data or explicitly clear it in Settings. Other-tab storage events refresh the current view.

Attachments support PNG, JPEG, GIF, WebP, plain text, and PDF, up to three files of 1 MB each. Images and text preview inline; PDF files can be saved for inspection. Sent files persist with messages; unsent files remain temporary and are discarded on conversation change. The local assistant does not read binary content. Browser storage limits vary, so large files can exhaust quota. No service worker or network simulation pretends files were uploaded.

## Host adapter usage

The default `localAssistant` explicitly composes deterministic text from actual prompt, skill, selected notes/links, attachment metadata, and instructions. It is not an AI model, and changing the displayed model selects a local cost tier, not an external provider. Its responses are labeled accordingly. Credits are an entirely local demonstration counter (Fast: 1, Focus: 3), deducted only on successful response; stop/error keeps the sent prompt but does not spend credits.

Use a client component to inject your own adapter at the existing provider boundary. The host must provide the endpoint below; it is not included in this static template. Keep credentials on your server and explicitly decide what local data may leave the device.

```tsx
"use client";
import { WorkspaceProvider } from "@/features/workspace/store";
import { ChatWorkspace } from "@/features/workspace/chat";
import type { AssistantAdapter } from "@/features/workspace/domain";

const adapter: AssistantAdapter = {
  label: "Your assistant service",
  async respond(request) {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: request.signal,
      body: JSON.stringify({
        prompt: request.prompt,
        model: request.model,
        skill: request.skill,
        knowledge: request.knowledge,
        instructions: request.instructions,
        attachments: request.attachments,
      }),
    });
    if (!response.ok) throw new Error("Assistant request failed.");
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("text" in data) || typeof data.text !== "string") {
      throw new Error("Invalid assistant response.");
    }
    return data.text;
  },
};

export function ConnectedWorkspace() {
  return <WorkspaceProvider adapter={adapter}><ChatWorkspace /></WorkspaceProvider>;
}
```

For the full application, replace the existing layout provider with a small client provider wrapper passing this adapter; do not nest a second provider around the chat inside the existing provider. Integrations currently have deliberately local controllers in `features/workspace/knowledge.tsx`; replace those handlers with explicit host-owned service calls if production connections are needed.

## Prepared verification

No builds, typechecks, tests, formatters, servers, or browser runs were performed during implementation. The integration owner should run:

```sh
bun tests/web-smoke-AppAssistant.tsx
bun run --filter @asharca/assistant-workspace-template typecheck
bun run --filter @asharca/assistant-workspace-template build
```

The temporary smoke mounts actual source exports and exercises prompt submission, each skill, credits, a rejected host adapter, attachment preview, project CRUD, rename/archive/restore, knowledge CRUD, integration connect/disconnect, settings/theme/persistence, unknown session routing, and keyboard dialog dismissal. Real browser verification remains necessary for layout, mobile drawer geometry, animation, command-palette keyboard focus, clipboard permissions, downloads, native PDF behavior, and static-host direct URL reloads.
