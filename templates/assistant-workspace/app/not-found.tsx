import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <section className="panel space-y-4">
        <h1>Page not found</h1>
        <p className="text-sm text-muted-foreground">
          No workspace route exists at this address.
        </p>
        <Link href="/" className="inline-block text-sm underline">
          Return to chat →
        </Link>
      </section>
    </div>
  );
}
