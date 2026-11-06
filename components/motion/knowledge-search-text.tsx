import { Fragment } from "react";

/** Literal, case-insensitive full-text highlighting, not semantic/vector retrieval. */
export function KnowledgeSearchText({ text, query }: { text: string; query: string }) {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return <>{text}</>;
  const haystack = text.toLocaleLowerCase();
  const parts = [];
  let start = 0;
  let match = haystack.indexOf(needle);
  while (match !== -1) {
    parts.push(<Fragment key={`${start}-text`}>{text.slice(start, match)}</Fragment>);
    parts.push(<mark key={`${match}-mark`} className="rounded bg-primary/15 text-inherit">{text.slice(match, match + needle.length)}</mark>);
    start = match + needle.length;
    match = haystack.indexOf(needle, start);
  }
  parts.push(<Fragment key={`${start}-end`}>{text.slice(start)}</Fragment>);
  return <>{parts}</>;
}
