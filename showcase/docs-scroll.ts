/** Scroll just one documentation pane. scrollIntoView also scrolls overflow-hidden
 * ancestors, which can move the site header outside the viewport. */
export function scrollWithin(scroller: HTMLElement | null, target: HTMLElement | null, alignment: 'start' | 'nearest' = 'start') {
  if (!scroller || !target || !scroller.contains(target)) return;
  const viewport = scroller.getBoundingClientRect();
  const item = target.getBoundingClientRect();
  if (!viewport.height || !item.height) return;
  const top = viewport.top + scroller.clientTop;
  const bottom = top + scroller.clientHeight;
  let next = scroller.scrollTop;
  if (alignment === 'start') next += item.top - top - 28;
  else if (item.top < top + 8) next += item.top - top - 8;
  else if (item.bottom > bottom - 8) next += item.bottom - bottom + 8;
  else return;
  if (typeof scroller.scrollTo === 'function') scroller.scrollTo({ top: Math.max(0, next), behavior: 'auto' });
  else scroller.scrollTop = Math.max(0, next);
}
