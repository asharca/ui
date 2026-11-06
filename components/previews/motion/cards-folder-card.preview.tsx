"use client";
import { useState } from "react";
import { CollectionFolderCard } from "@/components/motion/purposeful-cards";
export function FolderCardPreview() {
  const [open, setOpen] = useState(false);
  return <div className="flex w-full flex-col items-center gap-4 px-4 py-10 sm:px-8 sm:py-16"><CollectionFolderCard title="Daily memo" count={5} updated="1,270 notes" media={<div aria-hidden className="relative size-full overflow-hidden bg-[linear-gradient(128deg,#e9b071_0%,#d96b4e_42%,#347d78_100%)]"><div className="absolute -top-12 left-[8%] h-48 w-20 rotate-[24deg] rounded-full bg-white/25 blur-xl" /><div className="absolute left-[38%] top-4 h-40 w-16 -rotate-[18deg] rounded-full bg-white/20 blur-lg" /><div className="absolute -bottom-10 -right-12 size-52 rounded-full border-[30px] border-[#164c53]/40" /></div>} onOpen={() => setOpen(value => !value)} />{open && <section aria-label="Collection contents" className="w-full max-w-md rounded-xl border border-border p-4"><h3 className="font-semibold">Daily memo</h3><ul className="mt-3 space-y-2 text-sm">{["Research notes", "Field sketches", "Reading list", "Ideas", "Daily journal"].map(name=><li key={name}>{name}</li>)}</ul><button type="button" onClick={()=>setOpen(false)} className="mt-4 text-sm underline">Close collection</button></section>}</div>;
}
