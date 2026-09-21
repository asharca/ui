# Third-party notices

## beUI / starc007/ui-components

Source: https://github.com/starc007/ui-components
Pinned revision: `6ece797917b1365764ce5f339641d641f10ea2c2`.

Adapted files:

- `components/motion/button/metallic.tsx` → `src/material-button.css`.
  Preserves the chrome gradient, layered inner surface and reflective shadow.
  Motion spans become CSS pseudo-elements on the existing Button; no Motion
  dependency. Reflection is hover/focus-driven, with disabled/reduced-motion guards.
- `components/app/landing/landing-component-card.tsx` and `app/globals.css`
  → `showcase/reference-gallery.css`: stage/caption separation, neutral stage
  palette and rounded surfaces. The full-card link overlay was not retained:
  previews stay interactive and have their own separate documentation links.

MIT License

Copyright (c) 2026 Saurabh Chauhan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
