"use client";

import { useState } from "react";
import { CheckoutScene } from "@/components/motion/illustration-payments";
import { Button } from "@/components/motion/button";
const demonstration = { receipt: { reference: "SAMPLE-NO-CHARGE", amount: "$267.84", message: "Payment received" } };
export function CheckoutScenePreview() {
  const [attempt, setAttempt] = useState(0);
  return <div className="group w-full max-w-xl"><CheckoutScene key={attempt} demonstration={demonstration} item="Studio headphones" itemDetail="Sand · Qty 1" itemAmount="$248.00" shipping="Free" tax="$19.84" amount="$267.84" paymentLabel="Visa •••• 4821" onCheckout={async () => {
    throw new Error("No payment provider is connected to this illustration preview. No money was moved. Replay the sample to view the presentation sequence.");
  }} /><Button variant="ghost" size="sm" className="sr-only focus:not-sr-only" onClick={() => setAttempt(value => value + 1)}>Replay sample checkout</Button><p className="sr-only">The automatic receipt is sample artwork. Activating checkout exercises the host boundary, which reports the missing payment provider rather than fabricating a payment.</p></div>;
}
