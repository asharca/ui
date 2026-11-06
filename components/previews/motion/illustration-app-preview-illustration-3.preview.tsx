"use client";

import { useState } from "react";
import { SocialPhone, type SocialIllustrationPost } from "@/components/motion/illustration-app-preview";
// Original artwork keeps the distributable preview independent of proprietary photography.
const coastalArtwork = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#c8d9e2"/><stop offset="1" stop-color="#f4e8d4"/></linearGradient><linearGradient id="sea" x2="0" y2="1"><stop stop-color="#80a8b2"/><stop offset="1" stop-color="#496f84"/></linearGradient></defs><rect width="640" height="400" fill="url(#sky)"/><circle cx="450" cy="95" r="38" fill="#f8edc9"/><path d="M0 180Q170 150 340 180T640 170V400H0Z" fill="url(#sea)"/><path d="M0 230 180 195 260 220 380 185 475 240 640 260V400H0Z" fill="#bdc5af"/><path d="m150 235 80-36 80 36v103H150Z" fill="#f0e0c8"/><path d="m135 235 95-51 96 51Z" fill="#ab7d68"/><path d="M185 266h28v41h-28m42-41h28v41h-28" fill="#6e8a8e"/><path d="M0 330Q230 285 415 345T640 315V400H0Z" fill="#859a87"/><path d="m240 400 10-65 105-48-80 66-3 47Z" fill="#e7d3b7"/></svg>')}`;
export function SocialPhonePreview() {
  const [posts, setPosts] = useState<SocialIllustrationPost[]>([
    { id: "1", author: "Kai Morgan", handle: "Lisbon · 12 min", content: "Morning light, quiet streets, and nowhere else to be.", likes: 248, image: { src: coastalArtwork, alt: "Original coastal landscape artwork used instead of the reference photograph" } },
    { id: "2", author: "Ava Park", handle: "Just now", content: "Ava shared a new collection", likes: 18 },
  ]);
  return <SocialPhone posts={posts} onPostChange={(id, change) => setPosts((items) => items.map((post) => post.id === id ? { ...post, ...change, likes: change.liked === undefined ? post.likes : post.likes + (change.liked ? 1 : -1) } : post))} />;
}
