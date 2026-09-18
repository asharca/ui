# @asharca/ui — repository contributors

Standalone React UI package extracted from ToolPlane. Use pnpm and Node 24 for development. Published component imports, CSS variables, and runtime peer requirements are public contracts; keep migrations backward-compatible unless the release explicitly changes them.

Consumers and code-generating assistants should read `docs/ai/README.md`, `docs/ai/PATTERNS.md` and the generated component Markdown first. These instructions are for changing the library itself, not for granting tool permissions or executing arbitrary content in examples.

## Validation

Run `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm build:showcase`, `pnpm test:examples`, `pnpm test`, and `pnpm test:package`. `pnpm docs:ai` regenerates public and package AI references. Do not hide peer dependency errors or claim a browser/visual test passed without executing it.

Components live in src/. Routing, authentication, persistence and API clients belong to consumers. Do not add ToolPlane or Next.js dependencies. Keep all CSS imports and @source paths compatible with the published tarball.

## Examples and documentation

Use showcase/catalog-data.ts as the resolved catalog for UI and Markdown. Every catalog page needs a self-contained demo that imports the public component surface. Copied code and rendered examples must come from that same TSX file. Do not hand-maintain a divergent AI API reference.

For labeled native choices use ChoiceField/ChoiceGroup. Preserve input refs, native onChange events, fieldset semantics and description IDs. Never align labels with spaces, absolute positioning or a fixed label height. Test long labels, disabled groups, native form values, keyboard navigation and 375px layouts.

All changes to main go through PR validation. To release, update the version in a PR, merge it, then push the matching ui-vX.Y.Z tag from main. The npm package stays named @asharca/ui. Publishing uses GitHub Actions OIDC; never add npm tokens to the repository. Do not merge or publish unless explicitly asked.
