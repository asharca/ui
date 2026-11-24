"use client";

import {
  InvoiceDocument,
  type InvoiceDocumentLineItem,
} from "@/components/motion/invoice-document";

const LINE_ITEMS: InvoiceDocumentLineItem[] = [
  {
    id: "brand-system",
    description: "Brand & motion design system",
    detail: "Token specification, easing curves, core primitives",
    qty: 1,
    rate: 4200,
  },
  {
    id: "checkout-flow",
    description: "Interactive checkout prototypes",
    detail: "Desktop and mobile responsive validation",
    qty: 2,
    rate: 1150,
  },
  {
    id: "docs-audit",
    description: "Accessibility & keyboard audit",
    detail: "WCAG AA verification across 18 views",
    qty: 1,
    rate: 950,
  },
];

export function InvoiceDocumentPreview() {
  return (
    <InvoiceDocument
      invoiceNumber="FF-2026-0418"
      issueDate="Nov 17, 2026"
      dueDate="Dec 17, 2026"
      from={{
        name: "Field & Fern Studio",
        email: "hello@fieldandfern.co",
        addressLines: ["Calle de Pradillo 14", "Madrid, Spain", "+34 612 448 190"],
        taxId: "ES-B87654321",
      }}
      billTo={{
        name: "Lumen Roasters",
        email: "ana@lumenroasters.com",
        addressLines: ["Wilhelminastraat 22", "Utrecht 3581, Netherlands"],
      }}
      items={LINE_ITEMS}
      taxRatePercent={8}
    />
  );
}
