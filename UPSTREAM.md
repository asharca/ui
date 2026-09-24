# Asharca workspace on beUI

Source baseline: starc007/ui-components@1e23f4b10a404c17d9649086cf561e152527e2de (MIT).
This replaces the previous Vite/Registry application with the upstream Next.js/Bun project.
The GitHub repository identity is retained; importing a source tree does not establish GitHub's fork-network metadata.
The workspace additions will be kept under components/workspace and the existing beUI catalog.

Previous snapshots:
- archive/pre-beui-rebuild-main-2026-09-24: d40773d2c39ddf8b216b9d0851f80eb192b7fc09
- archive/pre-beui-rebuild-agents-2026-09-24: a2a90e5879e05378a661ca8ec0b6c8ea8a56c4ab

Upstream deployment workflows are intentionally not enabled in this repository.

## Downstream changes

- `components/workspace/*`: only the custom workspace shell, tabs and native beUI sidebar composition.
- `app/workspace`: independent demo without documentation chrome.
- beUI catalog/previews: two new block entries with self-hosted install URLs.
- Root layout uses the existing bundled Geist font package instead of build-time Google font downloads, and does not load upstream analytics.
- `.github/workflows/ci.yml`: validation only; original production deployment workflows remain disabled.
- The previous `registry/ui`, Vite `site`, `agent-internal-*` migration and their build pipeline are not carried over.

Read `docs/workspace.md` for development, changed entry points and deployment requirements.
