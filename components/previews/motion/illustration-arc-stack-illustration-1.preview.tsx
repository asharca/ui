"use client";

import { ArcStackIllustration } from "@/components/motion/illustration-arc-stack";

// Original vector portraits replace the reference photography; no proprietary assets ship.
function portrait(background: string, shirt: string, skin: string, hair: string) {
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300"><rect width="240" height="300" fill="${background}"/><ellipse cx="120" cy="300" rx="110" ry="96" fill="${shirt}"/><path d="M91 174h58v63q-29 25-58 0Z" fill="${skin}"/><ellipse cx="120" cy="129" rx="65" ry="88" fill="${hair}"/><ellipse cx="120" cy="142" rx="49" ry="65" fill="${skin}"/><path d="M69 122q2-91 67-74 44 11 39 71-29-5-50-43-18 41-56 46Z" fill="${hair}"/><path d="M91 144h9m40 0h9" stroke="#302a29" stroke-width="4" stroke-linecap="round"/><path d="M106 180q14 9 28 0" fill="none" stroke="#9a6259" stroke-width="3" stroke-linecap="round"/></svg>`)}`;
}
const portraits = [
  ["#e6edf1", "#5f8191", "#d8a27e", "#362f32"],
  ["#e8dfdb", "#656754", "#e7ba99", "#7f4c35"],
  ["#d7e8df", "#645a86", "#a96648", "#2e2824"],
  ["#ece1cf", "#9a6e62", "#e4b69b", "#553e32"],
  ["#dde5f0", "#496d69", "#bc8368", "#262c32"],
  ["#eadde9", "#687c9d", "#dca98b", "#654936"],
  ["#e3e7d3", "#6c6481", "#a97054", "#2f282a"],
];
export function IllustrationArcStackImagesPreview() {
  return <ArcStackIllustration variant="images" label="Original portrait collection" autoPlay defaultIndex={3} items={portraits.map(([background, shirt, skin, hair], index) => ({ id: `portrait-${index}`, label: `Original portrait ${index + 1}`, image: { src: portrait(background, shirt, skin, hair), alt: `Original vector portrait ${index + 1}, substituted for reference photography` } }))} />;
}
