import Link from "next/link";
export default function NotFound() { return <section className="panel empty"><h1>This page is off the map.</h1><p>No asset or workspace route exists at this address.</p><Link href="/">Return to overview →</Link></section>; }
