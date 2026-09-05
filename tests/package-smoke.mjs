import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChatThread, ConversationSidebar } from '@asharca/ui';
import { ChatThread as ThreadExport } from '@asharca/ui/chat-thread';
import { Button } from '@asharca/ui/controls';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

assert.equal(ChatThread, ThreadExport);
assert.equal(typeof ConversationSidebar, 'function');
const html = renderToStaticMarkup(createElement(Button, { variant: 'primary' }, 'Package check'));
assert.match(html, /data-toolplane-ui="button"/);
assert.match(html, /ui-button-primary/);

const stylesheet = import.meta.resolve('@asharca/ui/styles.css');
assert(readFileSync(new URL(stylesheet), 'utf8').includes('@source'));
const { css } = await postcss([tailwindcss()]).process(
  '@import "tailwindcss";\n@import "@asharca/ui/styles.css";',
  { from: resolve('smoke.css') },
);
assert(css.includes('.ui-button-primary'), 'Component styles missing');
assert(css.includes('.tp-chat-shell'), 'Chat shell styles missing');
assert(css.includes(String.raw`.grid-cols-\[0fr\]`), 'Published component utilities missing');
console.log('Tarball imports, component rendering, CSS and Tailwind source scanning passed.');
