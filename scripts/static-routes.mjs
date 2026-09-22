import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { catalog } from '../registry/catalog.mjs';
const html = await readFile('dist/index.html', 'utf8');
const { pages } = JSON.parse(await readFile('.generated/documents.json', 'utf8'));
const routes = [ ['components', '组件'], ['docs/installation', '安装'], ...catalog.map((item) => [`components/${item.slug}`, item.name]) ];
for (const [path, title] of routes) {
  await mkdir(`dist/${path}`, { recursive: true });
  const doc = pages.find((page) => page.route === `/${path}`);
  const alternate = doc ? `<link rel="alternate" type="text/markdown" href="${doc.markdownUrl}" />` : '';
  await writeFile(`dist/${path}/index.html`, html.replace(/<title>.*?<\/title>/, `<title>${title} — Asharca UI</title>`).replace('</head>', `${alternate}</head>`));
}
await writeFile('dist/404.html', html);
console.log(`Created ${routes.length} static route entries for direct navigation and refresh.`);
