"use client";

import { CheckoutFlow, type CheckoutFlowProps } from "@/components/motion/checkout-pages";

/** Supply real host data and callbacks. Provider fields use submitAttempted to reveal errors and onReady(null) to revoke invalid methods; onReady(method) carries only opaque IDs and safe metadata. Only a paid result with orderId creates a receipt; optional receiptDetails supplies merchant identity and ISO confirmation time. No demo controller is installed. */
export function CheckoutPagesCheckoutFlowExample(props: CheckoutFlowProps) {
  return <CheckoutFlow {...props} />;
}
