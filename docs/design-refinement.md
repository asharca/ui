# Existing component refinement

This pass refines the existing source registry; it does not introduce a second component library or replace the host theme.

## Source references

The beUI public React repository is https://github.com/starc007/ui-components (not a similarly named Flutter port). Sources consulted:

- `lib/ease.ts`, blob `c46f60b7399b5166cf90413970b4bcd4f8e2ce29`: separate press, shared-layout and disclosure timing.
- `components/motion/checkbox.tsx`, blob `3101ab96bd57183efbd91a205810e9a55b88a2f3`: drawn checkmark, indeterminate state and reduced-motion handling.
- `components/motion/tabs.tsx`, blob `a6a05ef7b2ca8039ac6f43f3bd5fdaa214b3d3d9`: local indicator identity and soft/underline/pill visual hierarchy.

The existing upstream MIT notice in `THIRD_PARTY_NOTICES.md` remains applicable. No Pro assets or branding were copied.

## Changes

- Button: subtle surface hierarchy and press feedback; loading overlays the in-flow label instead of inserting an icon into layout. The label stays accessible. When the host changes label text between states, provide a suitable minimum width, as demonstrated in `button-states.tsx`.
- Input/Textarea: one shared native-field treatment for spacing, focus, invalid, disabled and readonly states.
- Checkbox/Radio: identical 18px controls centered on the first 24px text line; checkbox stroke drawing and radio dot feedback. Native inputs own selection, form data and reset. Forced-colors uses native appearance.
- RadioGroup: compose Radio instead of maintaining a second radio design.
- Switch: Radix remains the only checked-state owner; the thumb follows logical flex alignment with position-only layout motion, including RTL.
- Tabs: keep the existing soft default and add optional underline/pill list variants. Each list owns its indicator identity. Reduced-motion disables shared-layout projection.
- Accordion: preserve the existing single/multiple/controlled/uncontrolled API and Radix keyboard behavior; animate measured disclosure height and opacity. Exiting content is inert and hidden from assistive technology until it unmounts.
- Documentation previews: one bordered workbench with a quiet toolbar, width controls and reset feedback. The 360px option constrains the content container; it is not an iframe or device/media-query emulator. Preview state is preserved across Preview/Usage/Code switches.

## Verification

Run `pnpm check`, `pnpm test:consumer` and `pnpm test:browser`. The new unit suite covers native semantics and controlled state. Browser coverage checks the actual checkbox stroke, stable example button width, inert accordion exits, preview state and narrow-page overflow. Review screenshots are emitted through the existing CI artifact workflow; screenshot files alone are not pixel-baseline assertions.

No claim is made that every registry component has been individually redesigned. WorkspaceShell, workspace navigation and the host-owned AI conversation contracts remain in place.
