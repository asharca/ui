/** Markdown and docgen normalization shared by the static builder and tests. */
const common = new Set(['children', 'className', 'ref', 'disabled']);
const origins = (prop) => [prop.parent, ...(prop.declarations || [])].filter(Boolean);
const local = (prop) => origins(prop).some(({ fileName }) => fileName.replaceAll('\\', '/').includes('/registry/ui/'));
const semanticLibrary = (prop) => origins(prop).some(({ fileName }) => {
  const path = fileName.replaceAll('\\', '/');
  // Recharts' util/types defines adapted DOM events, not chart-specific APIs.
  return /\/node_modules\/(?:@radix-ui\/|radix-ui\/|recharts\/types\/component\/)/.test(path);
});
export function isPrimaryProp(prop) {
  return local(prop) || semanticLibrary(prop) || common.has(prop.name);
}
export function formatPropType(prop) {
  return prop.type?.name === 'enum' && Array.isArray(prop.type.value)
    ? prop.type.value.map(({ value }) => value).join(' | ')
    : prop.type?.name || 'unknown';
}
export function formatDefault(prop, explicit) {
  if (explicit !== undefined) return explicit;
  if (prop.defaultValue?.value == null) return null;
  const value = String(prop.defaultValue.value);
  return prop.type?.name === 'string' || prop.type?.value?.some((item) => item.value === JSON.stringify(value)) ? JSON.stringify(value) : value;
}
export function normalizeProps(doc, defaults = {}) {
  const props = Object.values(doc.props);
  const hasOrigins = props.some((prop) => origins(prop).length);
  const rank = (prop) => common.has(prop.name) ? 3 : local(prop) ? 0 : Object.hasOwn(defaults, prop.name) ? 1 : semanticLibrary(prop) ? 2 : 4;
  return props.sort((a, b) => rank(a) - rank(b)).map((prop) => ({
    name: prop.name,
    type: formatPropType(prop),
    required: prop.required,
    defaultValue: formatDefault(prop, defaults[prop.name]),
    description: prop.description || '',
    inherited: hasOrigins && !isPrimaryProp(prop) && !Object.hasOwn(defaults, prop.name),
  }));
}
export function fence(code, language = '') {
  const ticks = '`'.repeat(Math.max(3, ...Array.from(code.matchAll(/`+/g), (match) => match[0].length + 1)));
  return `${ticks}${language}\n${code.trimEnd()}\n${ticks}`;
}
export function cell(value) {
  return String(value ?? '—').replaceAll('\\', '\\\\').replaceAll('|', '\\|').replace(/\r?\n/g, '<br />');
}
export function propsMarkdown(props) {
  if (!props.length) return 'No additional props.';
  return ['| Prop | Type | Required | Default | Description |', '| --- | --- | --- | --- | --- |', ...props.map((prop) => `| ${cell(prop.name)} | ${cell(prop.type)} | ${prop.required ? 'Yes' : 'No'} | ${cell(prop.defaultValue)} | ${cell(prop.description || '—')} |`)].join('\n');
}
