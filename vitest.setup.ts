import '@testing-library/jest-dom/vitest';

// jsdom has no layout engine; real scroll sizing is verified in the browser.
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
