"use client";
import { Button } from "@/components/motion/button";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <section className="panel empty" role="alert"><h1>This page couldn't be displayed.</h1><p>Your saved local data has not been reset.</p><Button onClick={reset}>Try this page again</Button><a href="/settings/" className="block-link">Open data settings</a></section>; }
