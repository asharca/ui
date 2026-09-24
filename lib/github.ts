import { GITHUB_REPOSITORY_API_URL } from "@/lib/repository";

export async function getGithubStarCount(): Promise<number | null> {
  try {
    const response = await fetch(GITHUB_REPOSITORY_API_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "asharca-ui-star-count",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      return null;
    }
    const data: unknown = await response.json();
    if (typeof data === "object" && data !== null && "stargazers_count" in data &&
        typeof data.stargazers_count === "number" &&
        Number.isSafeInteger(data.stargazers_count) && data.stargazers_count >= 0) {
      return data.stargazers_count;
    }
  } catch {
    return null;
  }
  return null;
}
