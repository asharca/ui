"use client";

import { useState } from "react";
import { VerificationScene } from "@/components/motion/illustration-security";
import { Button } from "@/components/motion/button";
const demonstration = { code: "482019" };
export function VerificationScenePreview() {
  const [attempt, setAttempt] = useState(0);
  return <div className="w-full max-w-xl"><p className="sr-only">The sample digits and unlock icon play automatically. Focus a code field to enter your own code. This preview has no authentication provider.</p><VerificationScene key={attempt} demonstration={demonstration} destination="your authenticator app" onVerify={async () => ({ verified: false, message: "No authentication provider is connected. Sample playback never authorizes an account." })} /><Button variant="ghost" size="sm" className="sr-only focus:not-sr-only" onClick={() => setAttempt(value => value + 1)}>Replay verification sample</Button></div>;
}
