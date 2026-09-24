/** Downstream repository identity. Upstream provenance remains in UPSTREAM.md. */
export const GITHUB_REPOSITORY = "asharca/ui";
export const GITHUB_REPOSITORY_URL = `https://github.com/${GITHUB_REPOSITORY}`;
export const GITHUB_REPOSITORY_API_URL = `https://api.github.com/repos/${GITHUB_REPOSITORY}`;
export const GITHUB_LICENSE_URL = `${GITHUB_REPOSITORY_URL}/blob/main/LICENSE`;
export const GITHUB_SKILL_INSTALL = `npx skills add ${GITHUB_REPOSITORY} --skill beui`;
