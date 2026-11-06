import Link from "next/link";
export default function NotFound() { return <section className="empty-state"><p className="eyebrow">An unanswered question</p><h1>We couldn’t find that page.</h1><p>This market or profile isn’t in the local sample catalog.</p><Link href="/" className="text-link">Back to discovery ↗</Link></section>; }
