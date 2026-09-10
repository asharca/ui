import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar, ChatThread, ConversationSidebar, Progress, Skeleton, Switch, Tabs, Accordion, WorkspaceTabBar } from '@asharca/ui';
import { WorkspaceTabBar as WorkspaceTabBarExport } from '@asharca/ui/workspace-tab-bar';
import { WorkspaceSidebar } from '@asharca/ui/workspace-sidebar';
import { Avatar as AvatarExport } from '@asharca/ui/avatar';
import { Accordion as AccordionExport } from '@asharca/ui/accordion';
import { Tabs as TabsExport } from '@asharca/ui/navigation';
import { ChatThread as ThreadExport } from '@asharca/ui/chat-thread';
import { ChatComposerToolbar } from '@asharca/ui/chat-composer-toolbar';
import { Button } from '@asharca/ui/controls';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

assert.equal(ChatThread, ThreadExport);
assert.match(renderToStaticMarkup(createElement(ChatComposerToolbar, { tools: [], pinnedIds: [], onPinnedIdsChange() {} })), /data-chat-ui="composer-toolbar"/);
assert.equal(Avatar, AvatarExport);
assert.equal(Accordion, AccordionExport);
assert.equal(Tabs, TabsExport);
assert.equal(WorkspaceTabBar, WorkspaceTabBarExport);
assert.match(renderToStaticMarkup(createElement(WorkspaceSidebar, { brand: 'Workspace', brandIcon: null, brandLabel: 'Home', items: [], collapsed: false, onCollapsedChange() {}, onSelect() {} })), /data-toolplane-ui="workspace-sidebar"/);
assert.match(renderToStaticMarkup(createElement(Switch, { 'aria-label': 'Updates', defaultChecked: true })), /role="switch"/);
assert.match(renderToStaticMarkup(createElement(Progress, { 'aria-label': 'Build', value: 50 })), /value="50"/);
assert.match(renderToStaticMarkup(createElement(Skeleton)), /aria-hidden="true"/);
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
for (const selector of ['.ui-switch', '.ui-slider', '.ui-progress', '.ui-skeleton', '.ui-avatar', '.ui-tabs-list', '.ui-accordion-trigger', '.ui-dropdown-menu']) {
  assert(css.includes(selector), `${selector} missing from published styles`);
}
assert(css.includes(String.raw`.grid-cols-\[0fr\]`), 'Published component utilities missing');
console.log('Tarball imports, component rendering, CSS and Tailwind source scanning passed.');
