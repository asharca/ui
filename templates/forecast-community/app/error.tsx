"use client";
import { Button } from "@/components/motion/button";
export default function ErrorPage({ reset }: { reset(): void }) { return <section className="empty-state" role="alert"><h1>This view couldn’t be opened.</h1><p>Your saved demo data has not been intentionally changed. Try reopening this view.</p><Button onClick={reset}>Try this view again</Button><a href="/">Return to discovery</a></section>; }
