# Reference-led rework / 2026-09-21

The first studio pass changed structure without faithfully translating the
references' preview-led presentation. This iteration replaces the marketing
bento with independent interaction stages, shorter introduction, exterior
captions, replay controls and in-place source access.

## Source ledger: implemented versus inspected

| Reference | Inspected | Applied in this iteration |
| --- | --- | --- |
| beUI | `app/globals.css`, `landing-component-card.tsx`, `button/metallic.tsx`, MIT license at pinned revision in THIRD_PARTY_NOTICES.md | Adapted neutral stage/caption layout and actual metallic material implementation. |
| Beautiful UI | Public component collection and `/license` (MIT) | AI conversation/contexts/tool states remain original compositions; no source copied. |
| Transitions.dev | Public collection, repository README | Replayable, isolated motion exhibits; existing sliding Tabs implementation. No free/Pro source copied. |
| Rare UI | Public homepage, categorized collection, repository MIT license | Preview-led discovery and brief captions; no orb, folder, video or other assets copied. |
| shadcn/ui | Public documentation/homepage | Quiet documentation chrome and copyable canonical examples; no source copied. |

This is not a claim that all five libraries were transplanted. Third-party
branding, social proof, paid components and tracking are not imported.

## Reuse in a consumer

Import `@asharca/ui/themes.css` after the normal `styles.css`, then use
`<Button className="ui-material-button">Continue</Button>`. The class is opt-in,
works with Button/asChild, and does not change the Button prop contract.
`showcase/demos/MaterialButtonDemo.tsx` is the self-contained example; its exact
source powers the homepage code view. It is included in public consumer checks.

Eleven high-traffic gallery tiles use dedicated self-contained `Gallery*Demo.tsx`
compositions without documentation debugging controls. Other tiles retain their
canonical demo. Every tile reads its actual rendered composition for source view. A preview
stays mounted while reading its code; only reset/filter/layout changes remount
it. The gallery intentionally keeps interactive previews separate from links.

## Validation

No dependency/version changes, merge, npm publish or deployment are requested.
Existing checks stay enabled, including the previously failing preview unit test.
CI outcomes must be read from the current commit, not inferred from older runs.

## Minimal collection pass

Transitions.dev is the primary layout reference: short centered header, one category row, uniform three-column canvases, and controls beside the component name. The homepage has twelve real examples and no marketing feature/app sections. Home and catalog now share ComponentTile and the exact preview source. beUI remains the attributed source of the metallic material; Beautiful UI informed the compact composer/tool states; RareUI informed isolated interactive previews; shadcn/ui informed the reduced documentation chrome.

The new state swap, accordion, menu/dialog presence and avatar lift CSS is an independent implementation in the shipped optional themes.css. No Transitions recipe, premium content, third-party brand assets or new dependency was copied. Every example imports the public component surface. Keyboard, native form, source/state preservation, reduced-motion and mobile layouts remain required checks.
