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
      <section className="panel empty-state" role="alert">
        <h1>This view couldn’t be opened.</h1>
        <p className="muted">
          Your saved local workspace has not been reset. Try reopening this
          view or check workspace data in settings.
        </p>
        <div
          className="actions"
          style={{ justifyContent: "center", marginTop: "16px" }}
        >
          <Button onClick={reset}>Try this view again</Button>
          <Link href="/" className="text-link">
            Return to workflows
          </Link>
        </div>
      </section>
    </div>
  );
}
