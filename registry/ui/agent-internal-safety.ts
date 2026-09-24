"use client";
/** Untrusted Agent output is a link only when its protocol is safe. */
export function safeAgentHref(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try { const url = new URL(value, 'https://local.invalid'); return ['https:', 'http:'].includes(url.protocol) ? value : undefined; }
  catch { return undefined; }
}
