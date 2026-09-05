# @asharca/ui

Standalone React UI package extracted from ToolPlane. Use pnpm and Node 24 for
development. Published component imports, CSS variables, and runtime peer
requirements are public contracts; keep migrations backward-compatible unless
the release explicitly changes them.

Commands: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`,
`pnpm test`, and `pnpm test:package` (run after building).

Components live in `src/`; routing, authentication, persistence, and API clients
belong to consuming applications. Do not add ToolPlane or Next.js dependencies.
Keep the CSS `@source` paths compatible with the published tarball.

All changes to `main` go through PR validation. To release, update the version
in a PR, merge it, then push the matching `ui-vX.Y.Z` tag from `main`.
The npm package stays named `@asharca/ui`. Publishing uses GitHub Actions OIDC;
never add npm tokens to the repository.
