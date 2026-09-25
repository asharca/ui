import { GITHUB_REPOSITORY } from "@/lib/repository";
import { getGithubStarCount } from "@/lib/github";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Ignore visitor query strings and isolate caches by repository identity.
  // An old beUI count must not survive a repository change on the same domain.
  const url = new URL("/api/github-stars", request.url);
  url.searchParams.set("repository", GITHUB_REPOSITORY);
  const key = new Request(url);
  const cache = typeof caches !== "undefined"
    ? (caches as CacheStorage & { default?: Cache }).default
    : undefined;
  try {
    const cached = await cache?.match(key);
    if (cached) return cached;
  } catch (error) {
    console.error("GitHub star cache read failed", error);
  }

  const count = await getGithubStarCount();
  // Cache unavailable results briefly as well: upstream failures must not cause
  // every visitor to retry GitHub. No polling or background revalidation.
  const ttl = count === null ? 300 : 3600;
  const response = Response.json({ count }, {
    status: count === null ? 503 : 200,
    headers: {
      "Cache-Control": `public, max-age=${ttl}`,
      ...(count === null ? { "Retry-After": String(ttl) } : {}),
    },
  });
  if (cache) {
    try {
      await cache.put(key, response.clone());
    } catch (error) {
      console.error("GitHub star cache write failed", error);
    }
  }
  return response;
}
