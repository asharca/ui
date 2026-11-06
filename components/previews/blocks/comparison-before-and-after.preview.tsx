"use client";

import { BeforeAndAfter } from "@/components/motion/comparison";

// Public Unsplash photography; the ungraded URLs use image-service adjustments,
// rather than redistributing a proprietary before/after asset.
const photo = "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1600&q=80";
const scenes = [
  { id: "light", label: "Low light", before: { src: `${photo}&exp=-25&sat=-25`, alt: "Riverside houses and boats with a darker, muted grade" }, after: { src: photo, alt: "Riverside houses and boats in a bright, balanced grade" }, metrics: [{ label: "Exposure", before: 27, after: 74, unit: "%" }, { label: "Contrast", before: 38, after: 81, unit: "%" }, { label: "Color accuracy", before: 61, after: 96, unit: "%" }], histogram: { before: [5, 9, 12, 11, 8, 6, 4, 3, 2, 1, 1, 1], after: [2, 3, 5, 8, 10, 12, 11, 9, 7, 5, 3, 2] } },
  { id: "haze", label: "Haze", before: { src: `${photo}&con=-35&sat=-30`, alt: "Riverside houses and boats with a low-contrast hazy grade" }, after: { src: photo, alt: "Riverside houses and boats with clear contrast" }, metrics: [{ label: "Exposure", before: 45, after: 74, unit: "%" }, { label: "Contrast", before: 25, after: 81, unit: "%" }, { label: "Color accuracy", before: 55, after: 96, unit: "%" }], histogram: { before: [1, 2, 3, 6, 10, 12, 12, 10, 6, 3, 2, 1], after: [2, 3, 5, 8, 10, 12, 11, 9, 7, 5, 3, 2] } },
  { id: "color", label: "Color cast", before: { src: `${photo}&temp=40&tint=20`, alt: "Riverside houses and boats with a warm color cast" }, after: { src: photo, alt: "Riverside houses and boats with balanced color" }, metrics: [{ label: "Exposure", before: 53, after: 74, unit: "%" }, { label: "Contrast", before: 51, after: 81, unit: "%" }, { label: "Color accuracy", before: 38, after: 96, unit: "%" }], histogram: { before: [2, 4, 7, 10, 11, 9, 7, 5, 4, 3, 2, 1], after: [2, 3, 5, 8, 10, 12, 11, 9, 7, 5, 3, 2] } },
];

export function BeforeAndAfterPreview() {
  return <div className="w-full bg-background"><header className="px-4 pt-20 sm:px-8 sm:pt-24"><p className="text-sm font-medium text-muted-foreground">Image auto-grade</p><h2 className="mt-4 text-balance text-4xl font-medium tracking-tight">One pass fixes the whole frame.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">Compare light, haze, and white balance. Drag the divider to see what changes.</p></header><BeforeAndAfter scenes={scenes} className="pt-8 sm:pt-8" /><p className="px-8 pb-6 text-xs text-muted-foreground">Illustrative grading and readouts, not measured image-analysis results.</p></div>;
}
