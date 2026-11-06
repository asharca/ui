"use client";

import { useState } from "react";
import { ProductDetail } from "@/components/motion/ecommerce";
import { commerceDemoProducts } from "./ecommerce-product-grid.preview";

export function ProductDetailPreview() {
  const [bag, setBag] = useState(0);
  return <div className="w-full"><ProductDetail product={commerceDemoProducts[0]} onAdd={async (_product, _variant, quantity) => setBag(n => n + quantity)} />{bag > 0 && <p role="status" className="text-center text-xs text-muted-foreground">Added {bag} items to the local sample bag. No payment processed.</p>}</div>;
}
