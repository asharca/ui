"use client";

import { VerticalImageGallery } from "@/components/motion/image-galleries";

// Publicly available Unsplash photography; no proprietary illustration assets.
const images = [
  {
    "id": "space-0",
    "src": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Sunlit coastal living room",
    "caption": "Coastal house",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-1",
    "src": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Sculptural stone interior",
    "caption": "Stone study",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-2",
    "src": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Creative studio with long worktables",
    "caption": "The long room",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-3",
    "src": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Warm courtyard framed by timber",
    "caption": "Inner court",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-4",
    "src": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Minimal gallery with natural light",
    "caption": "White gallery",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-5",
    "src": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Calm bedroom with natural linen",
    "caption": "Linen room",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-6",
    "src": "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Curved concrete stair",
    "caption": "Curved stair",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-7",
    "src": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Oak kitchen with natural materials",
    "caption": "Oak kitchen",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-8",
    "src": "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Modern desert home",
    "caption": "Desert house",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-9",
    "src": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Home opening onto a green terrace",
    "caption": "Garden terrace",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-10",
    "src": "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Quiet reading corner",
    "caption": "Reading room",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  },
  {
    "id": "space-11",
    "src": "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&fm=webp&q=84&w=900",
    "alt": "Arched plaster hallway",
    "caption": "The passage",
    "width": 900,
    "height": 1100,
    "credit": "Unsplash",
    "href": "https://unsplash.com"
  }
];

export function VerticalImageGalleryPreview() {
  return <VerticalImageGallery images={images} columns={4} />;
}
