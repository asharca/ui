"use client";

import { useState } from "react";
import { ProductGrid, ProductDetail, type CommerceProduct } from "@/components/motion/ecommerce";
import { Button } from "@/components/motion/button";

// Public Unsplash photography; no licensed beUI Pro assets are bundled.
export const commerceDemoProducts: CommerceProduct[] = [
  { id: "headphones", name: "Studio headphones", description: "A little more focus. A lot more of your favorite music.", category: "Audio", currency: "USD", badge: "Bestseller", features: ["Comfortable over-ear fit", "Wireless listening, wired when you need it", "A simple design made for daily use"], images: [
    { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&h=1000&q=85", alt: "Over-ear headphones against a warm yellow background" },
    { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&crop=focalpoint&fp-x=0.35&fp-y=0.65&fp-z=1.6&w=1000&h=1000&q=85", alt: "Studio headphones, cropped detail view" },
    { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&crop=focalpoint&fp-x=0.65&fp-y=0.3&fp-z=1.8&w=1000&h=1000&q=85", alt: "Studio headphones, second close-up" },
  ], variants: [{ id: "standard", label: "Standard", description: "Headphones and charging cable", price: 129, stock: 8 }, { id: "travel", label: "Travel set", description: "Headphones, charging cable and travel case", price: 159, stock: 4 }, { id: "studio", label: "Studio set", description: "Headphones, charging cable and desk stand", price: 179, stock: 0 }] },
  { id: "watch", name: "Everyday watch", description: "A simple companion for every day.", category: "Everyday", currency: "USD", images: [{ src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85", alt: "Minimal wristwatch on a pale background" }], variants: [{ id: "everyday", label: "Everyday", price: 89, stock: 6 }] },
  { id: "camera", name: "Weekend camera", description: "Keep the moments that matter.", category: "Everyday", currency: "USD", badge: "Just arrived", images: [{ src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85", alt: "Camera and lens photographed up close" }], variants: [{ id: "standard", label: "Standard", price: 349, stock: 3 }] },
  { id: "lamp", name: "Focus desk lamp", description: "A softer light for focused work.", category: "Workspace", currency: "USD", images: [{ src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85", alt: "A desk lamp lighting a workspace" }], variants: [{ id: "standard", label: "Standard", price: 79, stock: 5 }] },
];

export function ProductGridPreview() {
  const [selected, setSelected] = useState<CommerceProduct | null>(null); const [bag, setBag] = useState(0);
  return <div className="w-full">{selected ? <><Button variant="ghost" className="rounded-full" onClick={() => setSelected(null)}>Back to collection</Button><ProductDetail product={selected} onAdd={async (_product, _variant, quantity) => setBag(n => n + quantity)} /><p role="status" className="text-center text-xs text-muted-foreground">{bag} items in the local sample bag. No payment processed.</p></> : <ProductGrid products={commerceDemoProducts} onProduct={setSelected} onAdd={async (_product, _variant, quantity) => setBag(n => n + quantity)} />}</div>;
}
