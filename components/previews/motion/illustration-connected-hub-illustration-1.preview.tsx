"use client";

import { CreditCard, Landmark, Link, Wallet } from "lucide-react";
import { ConnectedHub } from "@/components/motion/illustration-connected-hub";

const nodes = [
  { id: "bank", label: "Bank transfer", description: "Bank transfers connect to the payment hub.", icon: <Landmark /> },
  { id: "card", label: "Card payments", description: "Card payment activity connects to the same hub.", icon: <CreditCard /> },
  { id: "wallet", label: "Wallet", description: "Wallet payments connect to the central service.", icon: <Wallet /> },
  { id: "links", label: "Payment links", description: "Payment links use the same payment service.", icon: <Link /> },
];

export function ConnectedHubIllustration1Preview() {
  return <ConnectedHub variant={1} label="Payment integrations" hubLabel="Payments" nodes={nodes} />;
}
