# Showcase rewrite

This change replaces the showcase presentation instead of applying another
stylesheet over the old one. The reference is https://transitions.dev/ together
with its installation page (`detail.html?doc=installation`), component detail
(`detail.html?t=card-resize`) and `skill.html`.

The new shell uses a narrow header, a centered short introduction, category pills
and equal-width inset preview cards. Component code opens in a focused modal.
Details use Preview / React / CSS / Install tabs; API and implementation sections
start collapsed. Installation uses four package-manager tabs, working package
commands, stylesheet ordering, the first component and optional theme settings.

`docs.css`, `ui-polish.css`, `design-experience.css`, `site-redesign.css`,
`reference-gallery.css` and the old ReferenceShowroom are removed. The new
`exhibit.css` owns the site shell. Only actual theme specimens retain their
independent layout in `exhibit-specimens.css`. Existing component behavior and
application demos are retained, not copied from Transitions.

The documented skill is included at `skills/asharca-ui/SKILL.md` for discovery by
`npx skills add asharca/ui` after this change reaches the default branch. Installing
it does not install npm dependencies or grant extra tool permissions. There is no
fabricated registry, dedicated package CLI or copied paid component. The existing
beUI MIT material-button attribution remains unchanged.

Source modals preserve live preview state and use Radix's focus restoration.
Tests cover real install commands and clipboard output, stylesheet order, the
skill path, collapsed API sections, demo persistence across tabs and the absence
of retired style imports. Existing table, sidebar, application, contrast,
reduced-motion and UTF-8 regression checks remain enabled. Actual test results
belong to the PR and CI runs; this file does not assume they passed.

No package-version bump, dependency change, merge or publication is part of this
rewrite. Reference screenshots are design evidence, not distributed site assets.
