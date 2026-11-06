"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Check, Copy, LoaderCircle } from "lucide-react";
import { CodeBlock, type CodeBlockProps } from "@/components/agents/code-block";

/** Adds explicit denied/unavailable clipboard states while reusing the library renderer. */
export function ProductPageCode({ code, filename, header, ...props }: Pick<CodeBlockProps, "code" | "language" | "filename" | "showLineNumbers" | "className"> & { header?: ReactNode }) {
  const [state, setState] = useState<"idle" | "pending" | "copied" | "error">("idle");
  const [error, setError] = useState("");
  const request = useRef(0);
  const previousCode = useRef(code);
  useEffect(() => { if (previousCode.current !== code) { previousCode.current = code; request.current += 1; setState("idle"); setError(""); } return () => { request.current += 1; }; }, [code]);
  return <div className="overflow-hidden rounded-2xl border border-border bg-background"><div className="flex min-h-10 items-center justify-between gap-3 border-b border-border px-3"><div className="min-w-0 flex-1 font-mono text-xs text-muted-foreground">{header ?? filename}</div><button type="button" aria-label={state === "copied" ? "Copied" : "Copy code"} disabled={state === "pending"} className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" onClick={async () => {
    const token = ++request.current; setState("pending"); setError("");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard is unavailable. Select and copy the code instead.");
      await navigator.clipboard.writeText(code);
      if (token === request.current) setState("copied");
    } catch (cause) {
      if (token !== request.current) return;
      setState("error"); setError(cause instanceof Error ? cause.message : "Copy was denied. Select and copy the code instead.");
    }
  }}>{state === "pending" ? <LoaderCircle aria-hidden="true" className="size-3.5 motion-safe:animate-spin" /> : state === "copied" ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}</button></div><CodeBlock {...props} code={code} filename={filename} copyable={false} showLineNumbers={props.showLineNumbers ?? false} maxHeight={code.split("\n").length * 24 + 32} className={`rounded-none bg-transparent [&>div:first-child]:hidden [&>div:last-child]:border-0 [&>div:last-child]:py-4 [&_pre]:text-sm [&_pre]:leading-6 [&_code>span]:min-h-6 ${props.className ?? ""}`} /><p role={state === "error" ? "alert" : "status"} className={state === "error" ? "px-4 pb-3 text-xs text-destructive" : "sr-only"}>{state === "error" ? error : state === "copied" ? "Exact code copied to clipboard." : state === "pending" ? "Copying code…" : ""}</p></div>;
}
