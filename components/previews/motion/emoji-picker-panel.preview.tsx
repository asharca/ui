"use client";

import { useRef, useState } from "react";
import { EmojiPicker } from "@/components/motion/emoji-picker";

export function EmojiPickerPanelPreview() {
  const [note, setNote] = useState("");
  const [lastChoice, setLastChoice] = useState("");
  const textarea = useRef<HTMLTextAreaElement>(null);
  return <div className="flex w-full flex-col items-center gap-4 px-4 py-10"><EmojiPicker storageKey="beui-preview-panel-emoji-recent" defaultRecent={["👍", "❤️", "😂", "🎉", "🔥", "👀", "🙏", "✅"]} onSelect={selection => { const start = textarea.current?.selectionStart ?? note.length; const end = textarea.current?.selectionEnd ?? start; setNote(note.slice(0, start) + selection.emoji + note.slice(end)); setLastChoice(selection.name); requestAnimationFrame(() => { textarea.current?.focus(); const position = start + selection.emoji.length; textarea.current?.setSelectionRange(position, position); }); }} /><textarea aria-label="Compose a note" ref={textarea} value={note} placeholder="Pick a few emoji" onChange={event => setNote(event.target.value)} rows={1} className="h-7 w-full max-w-[338px] resize-none rounded-lg bg-transparent text-center text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" /><p role="status" className="sr-only">{lastChoice ? `Inserted ${lastChoice}` : "No emoji selected"}</p></div>;
}
