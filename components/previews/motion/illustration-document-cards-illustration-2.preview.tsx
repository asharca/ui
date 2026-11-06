"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { DocumentCards } from "@/components/motion/illustration-document-cards";

export function DocumentCardsIllustration2Preview() {
  const [showSignature, setShowSignature] = useState(true);
  return <div className="flex w-full max-w-xl flex-col items-center">
    <DocumentCards variant={2} presentationPlaying label="Signature presentation" documents={[
      { id: "agreement", name: "Service agreement", status: showSignature ? "Signed" : "Awaiting signature", signature: showSignature ? "Ana Ruiz" : undefined, description: "Illustrative document, not a signing service" },
      { id: "amendment", name: "Scope amendment.pdf", status: "Draft", description: "No signature supplied" },
    ]} />
    <Button type="button" size="sm" variant="outline" className="sr-only focus:not-sr-only" onClick={() => setShowSignature(current => !current)}>{showSignature ? "Hide sample signature" : "Show sample signature"}</Button>
    <p className="sr-only">Preview-only display state. No electronic signature is collected.</p>
  </div>;
}
