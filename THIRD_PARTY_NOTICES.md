# Third-party notices

## beUI design and interaction reference

Source: https://github.com/starc007/ui-components
Website: https://beui.dev/

Asharca UI's site organization, restrained visual language and component interaction direction reference beUI. The existing components are rewritten for this source registry. The new agent-* family and agent-internal-* dependencies are adapted directly from the public beUI source at commit 1e23f4b10a404c17d9649086cf561e152527e2de; they are not claimed as original Asharca implementations. See docs/beui-agent-manifest.json for file-level provenance. Each installed adapted file also includes the full MIT notice. No beUI branding, sponsored content, endorsements or Pro assets are included. The upstream MIT notice is retained for reference-derived implementation patterns.

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

## Dependencies

React, Radix Primitives, Motion, Tailwind CSS, shadcn, Lucide, React Router,
Prism, clsx and tailwind-merge remain under their respective upstream licenses.
The development lockfile records the exact dependency versions used by CI.

## Documentation UI reference

The fixed independent navigation rail, Copy Page split-button / provider marks,
and API extraction approach reference beUI at commit
`6ece797917b1365764ce5f339641d641f10ea2c2`:
`components/app/chrome/three-column-layout.tsx`,
`components/app/docs/copy-page.tsx`, `components/app/docs/props-table.tsx`,
and `lib/props-extractor.ts`. The upstream MIT notice above also applies to
these adapted patterns and SVG marks. Provider links do not imply endorsement
or an API integration.

## Rich message diagrams and selection header

Mermaid and DOMPurify are used under their upstream MIT licenses. Their package notices remain part of distributed dependencies. The diagram renderer uses local dependencies, not third-party hosted rendering. beUI table/index.tsx (blob e2f73fa90f854cbe2f85faa536d5cd83e60403b9) and table/table-header.tsx (blob 05cd0be8594e22a6c9161bb824008ffa59c43bd5) were consulted for table structure and interaction direction; Asharca retains its TanStack implementation. The existing beUI MIT notice above applies to reference-derived patterns.

## Shiki

The Agent code surfaces use Shiki (MIT). Shiki and its grammar/theme data retain their respective upstream licenses.
