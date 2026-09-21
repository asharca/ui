import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { catalog } from '../registry/catalog.mjs';
const html = await readFile('dist/index.html', 'utf8');
const routes = [ ['components', '组件'], ['docs/installation', '安装'], ...catalog.map((item) => [`components/${item.slug}`, item.name]) ];
for (const [path, title] of routes) {
  await mkdir(`dist/${path}`, { recursive: true });
  await writeFile(`dist/${path}/index.html`, html.replace(/<title>.*?<\/title>/, `<title>${title} — Asharca UI</title>`));
}
await writeFile('dist/404.html', html);
console.log(`Created ${routes.length} static route entries for direct navigation and refresh.`);
