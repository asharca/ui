"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { DocumentCards, type DocumentApprovalStage } from "@/components/motion/illustration-document-cards";

export function DocumentCardsIllustration3Preview() {
  const [step, setStep] = useState(3);
  const [playing, setPlaying] = useState(true);
  const stages: DocumentApprovalStage[] = [{ id: "finance", label: "Leo Park", role: "Finance" }, { id: "legal", label: "Nora Diaz", role: "Legal" }, { id: "director", label: "Ana Ruiz", role: "Director" }].map((stage, index) => ({ ...stage, status: index < step ? "complete" : index === step ? "active" : "pending" }));
  return <div className="flex w-full max-w-xl flex-col items-center">
    <DocumentCards variant={3} presentationPlaying={playing} label="Approval chain" stages={stages} documents={[
      { id: "proposal", name: "Budget proposal", status: step === 3 ? "Approved" : `Stage ${step + 1} of 3`, description: "Q4 budget · 12 pages" },
      { id: "audit", name: "Audit checklist.pdf", status: "Evidence review", description: "Supporting record" },
    ]} />
    <Button type="button" size="sm" variant="outline" className="sr-only focus:not-sr-only" onClick={() => { setPlaying(false); setStep(current => (current + 1) % 4); }}>{step === 3 ? "Reset approval preview" : "Advance approval preview"}</Button>
    <p className="sr-only">Local illustration state; no document is approved by this demo.</p>
  </div>;
}
