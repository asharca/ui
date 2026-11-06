"use client";

import { useState } from "react";
import { MessageReactions, type EmojiReaction } from "@/components/motion/emoji-picker";

export function EmojiMessageReactionsPreview() {
  const [reactions, setReactions] = useState<EmojiReaction[]>([{ emoji: "🎉", name: "party popper", count: 6 }, { emoji: "🚀", name: "rocket", count: 3 }, { emoji: "👀", name: "eyes", count: 1 }]);
  return <div className="flex min-h-[260px] w-full items-center justify-center px-4 py-8"><div className="flex w-full max-w-md gap-3"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=96&h=96&q=80" alt="" className="size-9 shrink-0 rounded-full object-cover" /><div className="min-w-0"><p className="text-sm"><span className="font-medium">Mira Okafor</span> <span className="text-xs text-muted-foreground">10:42</span></p><p className="mt-1 text-pretty text-sm">The new onboarding flow is live. Sign-ups are up 18% since this morning.</p><MessageReactions className="mt-3 gap-1.5" reactions={reactions} onReactionsChange={setReactions} pickerProps={{ storageKey: "beui-preview-message-emoji-recent" }} /></div></div></div>;
}
