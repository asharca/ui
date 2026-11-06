"use client";

import { LayeredCards } from "@/components/motion/illustration-layered-cards";

export function LayeredCardsIllustration3Preview() {
  return <LayeredCards variant={3} autoPlay label="Pricing deck" yearlySavingsLabel="−20%" items={[
    { id: "starter", name: "Starter", monthlyPrice: "$0", yearlyPrice: "$0", yearlyPriceBasis: "month", features: ["3 projects", "Community support", "Basic analytics"] },
    { id: "pro", name: "Pro", badge: "Popular", monthlyPrice: "$24", yearlyPrice: "$19", yearlyPriceBasis: "month", features: ["Unlimited projects", "Priority support", "Custom domains"] },
    { id: "team", name: "Team", monthlyPrice: "$64", yearlyPrice: "$51", yearlyPriceBasis: "month", features: ["Shared workspaces", "Roles and SSO", "Audit history"] },
  ]} />;
}
