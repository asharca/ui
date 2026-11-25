/** Canonical site origin. Override per environment via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://beui.dev"
).replace(/\/$/, "");

/** Optional repository/deployment base path derived from SITE_URL ("" at root, e.g. "/ui"). */
export const SITE_BASE_PATH = (() => {
  try {
    const pathname = new URL(SITE_URL).pathname.replace(/\/+$/, "");
    return pathname === "/" ? "" : pathname;
  } catch {
    return "";
  }
})();

export function demoUrlFor(slug: string): string {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
  return `${SITE_BASE_PATH}/demos/${cleanSlug}/`;
}
