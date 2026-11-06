"use client";

import { LayeredCards } from "@/components/motion/illustration-layered-cards";

export function LayeredCardsIllustration2Preview() {
  return <LayeredCards variant={2} autoPlay label="Payment card fan" items={[
    { id: "everyday", name: "Everyday", lastFour: "4821", holder: "SAMPLE CARDHOLDER", expires: "09/29", balance: "$2,480.20" },
    { id: "travel", name: "Travel", lastFour: "0937", holder: "SAMPLE CARDHOLDER", expires: "09/29", balance: "$6,915.00" },
    { id: "business", name: "Business", lastFour: "6610", holder: "SAMPLE BUSINESS", expires: "09/29", balance: "$18,300.75" },
  ]} />;
}
