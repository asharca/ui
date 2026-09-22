import manifest from '../.generated/documents.json';

export interface PageDocument {
  route: string;
  title: string;
  canonicalUrl: string;
  markdownPath: string;
  markdownUrl: string;
  apiPath?: string;
  registryUrl?: string;
}
export type AssistantTarget = 'v0' | 'ChatGPT' | 'Claude';
export function getPageDocument(route: string): PageDocument | undefined {
  return manifest.pages.find((page) => page.route === (route.replace(/\/$/, '') || '/'));
}
function publicAddress(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && !url.username && !url.password && host.includes('.') &&
      !/(^localhost$|\.localhost$|\.local$|\.internal$|\.test$|\.example$|^127\.|^10\.|^192\.168\.|^169\.254\.|^0\.|^172\.(1[6-9]|2\d|3[01])\.)/.test(host);
  } catch { return false; }
}
/** Matches beUI's prompt links; sends public documentation, never preview state. */
export function assistantLink(target: AssistantTarget, page: PageDocument): string | null {
  if (!publicAddress(page.canonicalUrl) || !publicAddress(page.markdownUrl)) return null;
  const prompt = `I'm reading the public Asharca UI documentation for ${page.title}.\nMarkdown: ${page.markdownUrl}\nPage: ${page.canonicalUrl}\nHelp me understand its API and examples, or debug an implementation. If you cannot retrieve the documentation, ask me to paste it rather than inventing props.`;
  const link = new URL({ v0: 'https://v0.dev/', ChatGPT: 'https://chatgpt.com/', Claude: 'https://claude.ai/new' }[target]);
  link.searchParams.set('q', prompt);
  return link.href;
}
