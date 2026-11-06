"use client";

import { useState } from "react";
import { RollingStackIllustration } from "@/components/motion/illustration-rolling-stack";

const items = [
  { id: "eth", label: "Ethereum", icon: <span className="text-indigo-500">♦</span> },
  { id: "sol", label: "Solana", icon: <span className="text-emerald-400">≋</span> },
  { id: "btc", label: "Bitcoin", icon: <span className="grid size-[6cqw] place-items-center rounded-full bg-orange-400 text-white">₿</span> },
  { id: "pol", label: "Polygon", icon: <span className="text-purple-500">♧</span> },
  { id: "bnb", label: "Binance", icon: <span className="text-yellow-500">❖</span> },
];
export function IllustrationRollingStackTimelinePreview() {
  const [loop, setLoop] = useState(true);
  const [active, setActive] = useState("btc");
  return <div className="w-full max-w-xl"><RollingStackIllustration variant="timeline" label="Networks in one wallet" items={items} activeId={active} onActiveChange={setActive} loop={loop} autoPlay /><label className="sr-only focus-within:not-sr-only"><input type="checkbox" checked={loop} onChange={event => setLoop(event.target.checked)} /> Loop the ordered stack</label></div>;
}
