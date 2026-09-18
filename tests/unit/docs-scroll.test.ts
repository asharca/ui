import { afterEach, expect, it, vi } from 'vitest';
import { scrollWithin } from '../../showcase/docs-scroll';

afterEach(() => { document.body.replaceChildren(); });

function pane(top: number, height: number, itemTop: number, itemHeight: number) {
  const scroller = document.createElement('div');
  const target = document.createElement('section');
  scroller.append(target); document.body.append(scroller);
  scroller.getBoundingClientRect = () => new DOMRect(0, top, 800, height);
  target.getBoundingClientRect = () => new DOMRect(0, itemTop, 400, itemHeight);
  Object.defineProperty(scroller, 'clientHeight', { value: height });
  scroller.scrollTop = 100;
  scroller.scrollTo = vi.fn();
  return { scroller, target };
}

it('aligns a section inside its pane without scrolling the surrounding document', () => {
  const { scroller, target } = pane(68, 900, 500, 200);
  scrollWithin(scroller, target);
  expect(scroller.scrollTo).toHaveBeenCalledWith({ top: 504, behavior: 'auto' });
  expect(document.documentElement.scrollTop).toBe(0);
  expect(document.body.scrollTop).toBe(0);
});

it('reveals the nearest sidebar item without moving an already visible item', () => {
  const { scroller, target } = pane(68, 400, 430, 50);
  scrollWithin(scroller, target, 'nearest');
  expect(scroller.scrollTo).toHaveBeenCalledWith({ top: 120, behavior: 'auto' });
  vi.mocked(scroller.scrollTo).mockClear();
  target.getBoundingClientRect = () => new DOMRect(0, 180, 100, 30);
  scrollWithin(scroller, target, 'nearest');
  expect(scroller.scrollTo).not.toHaveBeenCalled();
});

it('does not scroll hidden or unrelated navigation containers', () => {
  const { scroller, target } = pane(68, 0, 300, 30);
  scrollWithin(scroller, target);
  scrollWithin(scroller, document.createElement('section'));
  scrollWithin(null, target);
  expect(scroller.scrollTo).not.toHaveBeenCalled();
});

it('clamps the scroll position at the beginning of the pane', () => {
  const { scroller, target } = pane(68, 900, 70, 40);
  scroller.scrollTop = 0;
  scrollWithin(scroller, target);
  expect(scroller.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
});
