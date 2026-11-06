"use client";

import { useState } from "react";
import { VoiceMobileHero, type HeroVoiceNote } from "@/components/motion/hero-sections";

const notes: HeroVoiceNote[] = [
  { id: "walk", label: "Morning walk", duration: "00:42", transcript: "Send the revised launch plan to the design team and schedule a review for Thursday. Keep the first release focused on shared notes.", actions: [{ label: "Open the component collection", href: "/components" }, { label: "Read the project guide", href: "/docs" }] },
  { id: "idea", label: "New idea", duration: "00:28", transcript: "Explore a weekly customer digest. Collect the recurring questions, group them by theme, and link the original conversations.", actions: [{ label: "Read the integration guide", href: "/docs" }] },
];
export function HeroVoiceMobilePreview() {
  const [rejectAdapter, setRejectAdapter] = useState(false);
  return <div className="w-full"><details className="mb-3 text-xs text-muted-foreground"><summary className="w-fit cursor-pointer py-2">Recording presentation controls</summary><p className="max-w-xl py-2 leading-6">The default recorder is explicitly microphone-off presentation. Playback animates the supplied sample text; it does not play or transcribe audio.</p><label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={rejectAdapter} onChange={event => setRejectAdapter(event.target.checked)}/>Demonstrate a recording-adapter rejection</label></details><VoiceMobileHero eyebrow="Voice notes for busy days" title={<>Say it once.<br/>Keep moving.</>} description="Bring loose thoughts into a clear note, with the useful next steps already close at hand." primary={{ label: "Explore the components", href: "/components" }} secondary={{ label: "See how it works", href: "/docs" }} navigation={{ brand: { label: "Fieldwork", href: "/" }, links: [{ label: "Components", href: "/components" }, { label: "Documentation", href: "/docs" }] }} notes={notes} download={{ label: "Read mobile integration guide", href: "/docs" }} onRecordingChange={rejectAdapter ? async () => { throw new Error("Presentation adapter rejection: no recording session was started or stopped. Turn off the rejection control to use the microphone-off presentation."); } : undefined}/></div>;
}
