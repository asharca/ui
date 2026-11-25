"use client";

import Link from "next/link";
import { Button } from "@/components/motion/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page">
      <section className="panel space-y-4" role="alert">
        <h1>This view couldn’t be displayed.</h1>
        <p className="text-sm text-muted-foreground">
          Your saved browser-local workspace data has not been reset.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={reset}>Try this view again</Button>
          <Link href="/settings/" className="text-sm underline">
            Open workspace settings
          </Link>
          <Link href="/" className="text-sm text-muted-foreground underline">
            Return to chat
          </Link>
        </div>
      </section>
    </div>
  );
}
