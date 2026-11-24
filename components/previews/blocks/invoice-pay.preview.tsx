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
      paid={paid}
      onPay={() => setPaid(true)}
      onReset={() => setPaid(false)}
      items={[
        {
          id: "brand",
          description: "Brand system refresh",
          detail: "Logo, type, color tokens",
          qty: 1,
          rate: 4200,
        },
        {
          id: "motion",
          description: "Interactive hero prototype",
          detail: "Responsive motion study",
          qty: 1,
          rate: 1600,
        },
      ]}
    />
  );
}
