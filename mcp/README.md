# beUI MCP server

Remote [MCP](https://modelcontextprotocol.io) server for the public beUI component registry, running on a Cloudflare Worker. It lets AI agents discover, inspect, and install open-source components without authentication.

It owns no component data: it reads the live `REGISTRY_URL/r/*` endpoints at runtime with short-lived edge caching.

## Connect

The upstream public service is available at `https://mcp.beui.dev/mcp`. For your own deployment, use `https://<your-worker-host>/mcp`. Streamable HTTP is recommended; `/sse` remains available for legacy clients.

Only `/`, `/mcp`, `/mcp/*`, `/sse`, and `/sse/*` are served. Other paths return 404. No license token, OAuth provider, or authorization-storage binding is required.

## Tools

| tool | input | returns |
|---|---|---|
| `list_components` | `category?` | components (slug, name, category, description) |
| `search_components` | `query` | best-matching components |
| `get_component` | `slug` | description, dependencies, all source files, install command |
| `get_install_command` | `slug`, `packageManager?` | shadcn CLI command per package manager |

## Code checks

From this directory:

```bash
bun install --frozen-lockfile
bun run typecheck
```

Public transport routing is covered by the repository's `bun test` suite. Tests use in-memory requests and transport stubs, not a running Worker.

## Manual development and deployment

```bash
bun run dev       # optional local Worker at http://localhost:8787
bun run deploy    # explicit deployment only
```

Before deploying your own Worker, replace the upstream custom domain in `wrangler.jsonc` with one you control, or remove `routes` to use a workers.dev address. The existing `mcp.beui.dev` route is an upstream example, not an authorization to deploy there. `REGISTRY_URL` defaults to the public upstream registry. This repository's CI never starts or deploys the Worker.
