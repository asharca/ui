"use client";

import { useEffect, useRef, useState } from "react";
import { LayeredControlStack, type OfferRunStep } from "@/components/motion/what-we-offer";

const initialSteps: OfferRunStep[] = [
  { id: "context", label: "Read approved context", detail: "Resolve the source collection and its access scope.", status: "queued" },
  { id: "policy", label: "Check tool policy", detail: "Verify that the requested tools are permitted for this run.", status: "queued" },
  { id: "review", label: "Prepare review brief", detail: "Attach evidence and make the outcome ready for a human review.", status: "queued" },
];

export function LayeredControlStackPreview() {
  const [steps, setSteps] = useState<OfferRunStep[]>(initialSteps);
  const [status, setStatus] = useState<"idle" | "running" | "passed" | "failed">("idle");
  const [elapsed, setElapsed] = useState(0);
  const [fail, setFail] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const settle = useRef<(() => void) | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); settle.current?.(); }, []);
  const run = () => new Promise<void>((resolve) => {
    settle.current = resolve;
    setStatus("running"); setElapsed(0);
    setSteps(initialSteps.map((step, index) => ({ ...step, status: index === 0 ? "running" : "queued" })));
    let tick = 0;
    timer.current = setInterval(() => {
      tick += 1; setElapsed(tick);
      if (fail && tick === 2) {
        setSteps(initialSteps.map((step, index) => ({ ...step, status: index === 0 ? "passed" : index === 1 ? "failed" : "queued" })));
        setStatus("failed"); clearInterval(timer.current!); timer.current = null; settle.current = null; resolve(); return;
      }
      setSteps(initialSteps.map((step, index) => ({ ...step, status: index < tick ? "passed" : index === tick ? "running" : "queued" })));
      if (tick === initialSteps.length) { setStatus("passed"); clearInterval(timer.current!); timer.current = null; settle.current = null; resolve(); }
    }, 1000);
  });
  return <div className="w-full space-y-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={fail} disabled={status === "running"} onChange={event => setFail(event.target.checked)} />Demonstrate a policy failure</label><LayeredControlStack {...{"eyebrow": "A calmer way to build", "title": "Visible steps. Confident outcomes.", "description": "This explicit local demo plays a three-step workflow. No tools or network requests are executed.", "primary": {"label": "Explore the platform", "href": "https://example.com/platform"}, "secondary": {"label": "Read the guide", "href": "https://example.com/guide"}, "capabilities": [{"id": "sources", "title": "Trusted sources", "description": "Approved context, ready when needed.", "link": {"label": "Explore trusted sources", "href": "https://example.com/capabilities/sources"}}, {"id": "routing", "title": "Thoughtful routing", "description": "A clear path for every kind of task.", "link": {"label": "Explore thoughtful routing", "href": "https://example.com/capabilities/routing"}}, {"id": "tools", "title": "Scoped tools", "description": "Useful actions with visible boundaries.", "link": {"label": "Explore scoped tools", "href": "https://example.com/capabilities/tools"}}]}} steps={steps} status={status} elapsedSeconds={elapsed} onRun={run} /></div>;
}
