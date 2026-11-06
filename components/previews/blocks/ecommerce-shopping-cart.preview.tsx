"use client";

import { useState } from "react";
import { ShoppingCart, type CartLine } from "@/components/motion/ecommerce";
import { commerceDemoProducts } from "./ecommerce-product-grid.preview";

export function ShoppingCartPreview() {
  const [lines, setLines] = useState<CartLine[]>([{ id: "line-1", productId: "headphones", variantId: "standard", quantity: 1 }, { id: "line-2", productId: "watch", variantId: "everyday", quantity: 1 }]); const [message, setMessage] = useState("");
  return <ShoppingCart products={commerceDemoProducts} lines={lines} onLinesChange={setLines} checkoutNotice={message || "Checkout is not connected in this preview."} onCheckout={async (_lines, summary) => { setMessage(`Local checkout review: ${summary.currency} ${summary.total.toFixed(2)}. No payment was processed.`); }} />;
}
