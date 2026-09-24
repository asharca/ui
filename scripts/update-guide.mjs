/** One Markdown source feeds the website, Copy Page and the AI document. */
export function renderUpdateGuide(template, siteUrl, runner = 'npx shadcn@latest') {
  const site = new URL(siteUrl);
  if (!['https:', 'http:'].includes(site.protocol) || site.search || site.hash || site.username || site.password) {
    throw new Error('Update guide requires an HTTP(S) deployment root without credentials, query or hash.');
  }
  if (!site.pathname.endsWith('/')) site.pathname += '/';
  const tokens = {
    RUNNER: runner,
    BUTTON_URL: new URL('r/button.json', site).href,
    REGISTRY_PATTERN: `${new URL('r/', site).href}{name}.json`,
  };
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, name) => {
    if (!(name in tokens)) throw new Error(`Unknown update-guide token: ${name}`);
    return tokens[name];
  });
}

/** Stable ASCII anchors live beside their headings, not in a second TOC. */
export function splitUpdateGuide(markdown) {
  const lines = markdown.trimEnd().split('\n');
  const title = lines.shift()?.match(/^# (.+)$/)?.[1];
  if (!title) throw new Error('Update guide requires a single H1.');
  const intro = [];
  const sections = [];
  const ids = new Set();
  let body = intro;
  let fence = '';
  for (const line of lines) {
    const marker = line.match(/^(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = '';
    }
    const heading = !fence && line.match(/^## (.+?) <!-- ([a-z][a-z0-9-]*) -->\s*$/);
    if (heading) {
      if (ids.has(heading[2])) throw new Error(`Duplicate guide anchor: ${heading[2]}`);
      ids.add(heading[2]);
      const section = { id: heading[2], title: heading[1], lines: [] };
      sections.push(section);
      body = section.lines;
    } else {
      body.push(line);
    }
  }
  if (fence || !sections.length) throw new Error('Update guide has an unclosed code fence or no sections.');
  return { title, intro: intro.join('\n').trim(), sections: sections.map(({ id, title, lines }) => ({ id, title, markdown: lines.join('\n').trim() })) };
}
