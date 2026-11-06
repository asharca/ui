"use client";

import { useState } from "react";
import { ConversionFlowScene } from "@/components/motion/illustration-metrics";
import { Button } from "@/components/motion/button";

export function ConversionFlowScenePreview() {
  const [returning, setReturning] = useState(false);
  return <div className="w-full max-w-xl"><ConversionFlowScene stages={returning ? [
    { id: "visit", label: "Visitors", value: 2400 }, { id: "signup", label: "Sign-ups", value: 1440 }, { id: "trial", label: "Trials", value: 720 }, { id: "paid", label: "Paid", value: 360 },
  ] : [
    { id: "visit", label: "Visitors", value: 24800 }, { id: "signup", label: "Sign-ups", value: 6200 }, { id: "trial", label: "Trials", value: 2480 }, { id: "paid", label: "Paid", value: 868 },
  ]} /><fieldset aria-label="Sample audience" className="sr-only m-0 min-w-0 border-0 p-0 focus-within:not-sr-only"><Button size="sm" variant="outline" aria-pressed={!returning} onClick={() => setReturning(false)}>New visitors</Button><Button size="sm" variant="outline" aria-pressed={returning} onClick={() => setReturning(true)}>Returning visitors</Button></fieldset></div>;
}
