import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <section className="panel empty-state">
        <p className="eyebrow">404</p>
        <h1>This page isn’t in the workspace.</h1>
        <p className="muted">
          No workflow, agent, or workspace route exists at this address.
        </p>
        <Link href="/" className="text-link">
          Return to workflows →
        </Link>
      </section>
    </div>
  );
}
