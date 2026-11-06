"use client";

import { FileText, ScanLine, ShieldCheck } from "lucide-react";
import { ConnectedHub } from "@/components/motion/illustration-connected-hub";

const nodes = [
  { id: "input", label: "Sources", description: "Original content arrives at the coordinator.", icon: <FileText /> },
  { id: "extract", label: "Extraction", description: "Extraction provides structured context.", icon: <ScanLine /> },
  { id: "verify", label: "Verification", description: "Verification contributes review evidence.", icon: <ShieldCheck /> },
  { id: "context", label: "Context", description: "Supporting context contributes to orchestration.", icon: <FileText /> },
];

export function ConnectedHubIllustration3Preview() {
  return <ConnectedHub variant={3} label="Fan-in orchestration" hubLabel="Orchestrator" nodes={nodes} />;
}
