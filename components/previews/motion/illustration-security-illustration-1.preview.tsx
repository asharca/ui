"use client";

import { useState } from "react";
import { ThreatScanScene } from "@/components/motion/illustration-security";
import { Button } from "@/components/motion/button";
export function ThreatScanScenePreview() {
  const [attempt, setAttempt] = useState(0);
  return <div className="w-full max-w-xl"><ThreatScanScene key={attempt} demonstration onScan={async () => {
    throw new Error("No traffic scanner is connected to this illustration preview. The automatic threat-resolution sequence is presentation only.");
  }} /><Button variant="ghost" size="sm" className="sr-only focus:not-sr-only" onClick={() => setAttempt(value => value + 1)}>Replay sample security scan</Button></div>;
}
