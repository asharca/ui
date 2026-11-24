"use client";

import { useState } from "react";
import { InvoicePay } from "@/components/motion/invoice-pay";

export function InvoicePayPreview() {
  const [paid, setPaid] = useState(false);

  return (
    <InvoicePay
      issuerName="Northfold Studio"
      issuerEmail="billing@northfold.studio"
      invoiceNumber="INV-0142"
      billToCompany="Halcyon Labs"
      billToName="Mara Okafor"
      billToAddress="210 Dune Avenue, Austin, TX 78702"
      issuedDate="Nov 3, 2026"
      dueDate="Dec 3, 2026"
      discountLabel="Returning client"
      discountAmount={543}
      taxRatePercent={8.25}
      paid={paid}
      onPay={() => setPaid(true)}
      onReset={() => setPaid(false)}
      items={[
        {
          id: "brand",
          description: "Brand system refresh",
          detail: "Logo, type, color tokens",
          qty: 1,
          rate: 4800,
        },
        {
          id: "site",
          description: "Marketing site design",
          detail: "Per page, light and dark",
          qty: 6,
          rate: 650,
        },
        {
          id: "motion",
          description: "Motion prototypes",
          detail: "Hourly, hero and pricing",
          qty: 12,
          rate: 120,
        },
        {
          id: "reviews",
          description: "Design review sessions",
          qty: 4,
          rate: 180,
        },
      ]}
    />
  );
}
