/** Static hosts cannot apply Next rewrites or return a JSON file and a raw
 * subdirectory at the same path. Give data endpoints explicit safe extensions. */
export function staticResourcePath(value: string): string {
  if (value === "/r") return "/r/index.json";
  if (value === "/api/github-stars") return "/api/github-stars.json";
  if (value.startsWith("/api/og")) return "/api/og.png";
  if (/^\/r\/[^/.]+\/raw$/.test(value)) return `${value}.txt`;
  if (/^\/r\/[^/.]+$/.test(value)) return `${value}/detail.json`;
  return value;
}

export function withBasePath(value: string, basePath: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return value;
  if (basePath && (value === basePath || value.startsWith(`${basePath}/`))) return value;
  return `${basePath}${value}`;
}

export function pagesConfiguration(siteUrl: string) {
  const url = new URL(siteUrl);
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error("Pages site URL must be an HTTP(S) URL without credentials, query or fragment.");
  }
  const basePath = url.pathname.replace(/\/+$/, "");
  if (!/^(?:\/[A-Za-z0-9._-]+)*$/.test(basePath)) throw new Error("Unsupported Pages base path.");
  return { siteUrl: `${url.origin}${basePath}`, basePath };
}
