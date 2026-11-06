"use client";

import { DocumentCards } from "@/components/motion/illustration-document-cards";

const documents = [
  { id: "report", name: "Impact report.pdf", status: "Verified record", description: "Review packet · revision 4" },
  { id: "certificate", name: "Compliance record.pdf", status: "Review required", description: "Evidence packet · revision 2" },
  { id: "policy", name: "Data policy.md", status: "Draft", description: "Internal guidance · revision 1" },
];

export function DocumentCardsIllustration1Preview() {
  return <DocumentCards variant={1} documents={documents} label="Document verification" />;
}
