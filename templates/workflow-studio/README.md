# Workflow Studio

An independently installable, static-exportable Next.js 16 / React 19 workflow application. This is an original implementation of the public workflow-builder feature set, not private template source.

## Run and deploy

After the integration owner has materialized the `button` and `input` beUI source closures into this directory:

```sh
bun install
bun run dev
bun run typecheck
bun run build
```

Deploy the resulting `out/` directory to a static host with directory-index support. Routes use trailing slashes. There are no API routes, remote fonts, required environment variables, or parent-directory runtime imports. The source under `features/` is application-owned; `components/` and `lib/` are the copied beUI primitive closure.

## Working routes

- `/`: Create, search, duplicate, and delete workflows.
- `/editor/?id=flow-welcome`: Real React Flow node editor, draggable palette and nodes, handle connections, keyboard-accessible connection inspector, delete, pan, zoom, minimap, auto-layout, 50-entry undo/redo, local recipe chat, workflow JSON export, test input, and per-step I/O.
- `/agents/`: Create/configure/delete agents. Choose a deterministic extractive or brief controller, persona, instructions, knowledge scope, enabled tools, and blocked terms. Test chat shows the configuration and tools used.
- `/chat/`: Separate persistent conversations, agent selection, session deletion, Shift+Enter multiline input, Enter to send, and expandable tool input/output.
- `/knowledge/`: Create/delete/rename bases, choose chunk sizes and overlap, upload readable text, author documents, import authorized connector samples, edit tags/chunks, inspect approximate tokens, and rank chunks with local keyword search. Chunking changes affect new uploads and syncs, not already edited chunks.
- `/connections/`: Explicit local consent, revoke access, and read bundled samples. Imported copies remain after revocation until deleted from knowledge.
- `/runs/`: Search/filter/delete saved executions, inspect measured waterfall timings, errors, estimated token usage, and copyable step I/O.
- `/settings/`: Profile, system/light/dark mode, workspace export/import/reset, local member roster and roles, locally generated demonstration keys and revocation, simulated plan selection, and persisted notification preferences. Completed/error-run switches control in-app run notices; a weekly digest preference is reserved for a host notification adapter and sends nothing in this static app.

The shell includes responsive in-flow mobile navigation, a collapsible desktop sidebar, a keyboard-operable command palette (`⌘K` / `Ctrl+K`), skip navigation, and reduced-motion styling. Native dialogs provide modal focus containment and Escape; close restores the initiating control.

## Local execution and service boundary

All starter records are labeled local demo content. Input, text transformations, required-text conditions, keyword knowledge search, deterministic agent responses, and connector reads actually execute. A topological executor resolves dependencies, joins multiple incoming strings with newlines, records measured timings and step I/O, and records cycle/upstream failures as errors. Conditions fail the step when required text is absent. Missing connectors and revoked permissions are errors, not simulated success. Token estimates are character count ÷ 4, not billed model usage.

No external AI, OAuth, email invitation, billing, authorization, push, or synchronization service is contacted. The local AI controller extracts relevant chunks and citations; natural-language persona/instructions are persisted, passed to the adapter, and included in its trace, but are not interpreted as an actual model prompt. Local API keys cannot authenticate anything. Team plans do not charge or silently constrain data.

Inject a real host adapter at the existing `StudioProvider` boundary; keep credentials on your server. The following is copyable integration code for a host with its own `/api/studio/*` endpoints, **not endpoints bundled in this static template**:

```tsx
"use client";
import { StudioProvider } from "@/features/store";
import type { StudioAdapter } from "@/features/domain";

const adapter: StudioAdapter = {
  async reply(agent, messages, bases) {
    const response = await fetch("/api/studio/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent, messages, bases }),
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
  },
  async readConnection(connection) {
    const response = await fetch(`/api/studio/connections/${encodeURIComponent(connection.id)}`);
    if (!response.ok) throw new Error(await response.text());
    return response.text();
  },
};

export function ConnectedWorkspace({ children }: { children: React.ReactNode }) {
  return <StudioProvider adapter={adapter}>{children}</StudioProvider>;
}
```

An actual remote authorization/member/billing/notification implementation requires host-owned service integration beyond the local template. The current screens explicitly identify those local simulations/preferences; they do not claim server connectivity.

## Data and recovery

Workspace data is saved in `localStorage` under `workflow-studio:v1`, loaded only after mount. Seed identifiers are deterministic for SSR/static export; user-created entities get UUIDs. Every mutation, including graph positions, config, chunks, sessions, traces, and preferences, is persisted. Settings exports the complete versioned JSON workspace and validates imports before replacing current data. A malformed stored record is reported and retained until a user mutation. Storage quota errors are reported; export before closing if storage is unavailable. This app is not suitable for storing sensitive production documents or secrets in browser storage.

## Integration verification handoff

Temporary behavior script from repository root:

```sh
bun tests/web-smoke-AppWorkflow.tsx
```

The script mounts the actual app feature exports and provider; it prepares DOM measurements for React Flow and covers creation/reload, graph state/history/layout, execution/error traces, local agent/chat behavior, chunks/search/sync, authorization, settings, and keyboard command routing. It has not been executed by this slice owner.

A real-browser review must additionally exercise handle drag connections, palette drag/drop, node drag and undo, pan/zoom/minimap gestures, focus containment/Escape/restore in both native dialogs, mobile navigation, keyboard node connection controls, reduced-motion mode, clipboard permissions, file upload/export/import, and persistence after a complete reload in light/dark/system modes. No build, lint, test, formatter, server, or browser was run during collaboration.
