"use client";

import { useState } from "react";
import { FeatureBento, type FeatureLoop } from "@/components/motion/marketing-feature-sections";

export function FeatureBentoPreview() {
  const [decision, setDecision] = useState("Awaiting your review");
  const items: FeatureLoop[] = [
    { id: "conversation", title: "A conversation with context", description: "A scripted preview, not a connected assistant.", frames: [<p key="a" className="text-sm">You: What changed in the research brief?</p>, <p key="b" className="text-sm">Demo assistant: Two new interview notes were linked to the brief.</p>, <p key="c" className="text-sm">Sources: Research brief · Interview notes</p>] },
    { id: "tools", title: "Connect your toolkit", description: "Inspect the shape of a tool connection.", frames: [<code key="a" className="text-xs">$ connect calendar --read-only</code>, <code key="b" className="text-xs">scope: events.read<br/>approval: required</code>, <code key="c" className="text-xs">Preview configuration ready</code>] },
    { id: "memory", title: "Recall the useful details", description: "Move through a sample memory record.", frames: [<p key="a" className="text-sm">Preference / Weekly briefs on Monday</p>, <p key="b" className="text-sm">Source / Team handbook, section 3</p>, <p key="c" className="text-sm">Context / Used in the planning workflow</p>] },
    { id: "output", title: "A shape your product understands", description: "Watch a structured response come together.", frames: [<pre key="a" className="text-xs">{'{ "title": "Weekly brief" }'}</pre>, <pre key="b" className="text-xs">{'{ "title": "Weekly brief",\n  "status": "draft" }'}</pre>] },
    { id: "approval", title: "The important decisions stay yours", description: "A local review interaction. No external action is executed.", frames: [<p key="a" className="text-sm">Proposed action / Share the weekly brief</p>, <p key="b" className="text-sm">Audience / Project team · Access / Read only</p>], interactive: <div className="mt-3"><p role="status" className="mb-3 text-sm">{decision}</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setDecision("Approved in this preview")} className="min-h-11 cursor-pointer rounded-lg bg-primary px-4 text-sm text-primary-foreground">Approve preview</button><button type="button" onClick={() => setDecision("Declined in this preview")} className="min-h-11 cursor-pointer rounded-lg border border-border px-4 text-sm">Decline preview</button><button type="button" onClick={() => setDecision("Awaiting your review")} className="min-h-11 cursor-pointer px-3 text-sm underline">Reset review</button></div></div> },
  ];
  return <div className="w-full"><FeatureBento title={"Everything your agent needs,\nwired up out of the box."} description={"Tools, memory, streaming, and tracing — ship a production agent without stitching the plumbing together yourself."} items={items} /></div>;
}
