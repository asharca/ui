/*
 * Adapted from beUI (1e23f4b10a404c17d9649086cf561e152527e2de).
 * Upstream path: lib/hooks/use-favicon.ts
 *
 * MIT License
 *
 * Copyright (c) 2026 Saurabh Chauhan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use client";

import { useCallback, useState } from "react";
import { getFaviconUrl } from "./agent-internal-lib-favicon";

/**
 * Resolves a site favicon and drops it once it is known to be unusable, so
 * callers can draw their own glyph instead of a broken image. Plenty of sites
 * answer `/favicon.ico` with a 403 or 404, and `onError` is not enough to catch
 * it: an image the browser starts loading from server-rendered HTML usually
 * fails before React attaches a handler, and that event is never replayed.
 * `decode()` settles on the image's final state instead of relying on an event
 * firing at the right moment.
 */
export function useFavicon(url?: string) {
  const resolved = url ? getFaviconUrl(url) : null;
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = resolved && resolved !== failedSrc ? resolved : null;

  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (!img || !src) return;

      let released = false;
      img.decode().catch(() => {
        if (!released) setFailedSrc(src);
      });

      // The node is going away or the source changed; a late rejection then
      // describes an image we are no longer showing.
      return () => {
        released = true;
      };
    },
    [src],
  );

  return { src, ref };
}
