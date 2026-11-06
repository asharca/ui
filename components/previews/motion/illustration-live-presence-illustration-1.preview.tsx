"use client";

import { useState } from "react";
import { LivePresenceIllustration } from "@/components/motion/illustration-live-presence";

export function IllustrationLivePresenceDocumentPreview() {
  const [active, setActive] = useState("maya");
  return <LivePresenceIllustration scene="document" title="Working draft" presentationPlaying blocks={[
    { id: "intro", title: "Shared context", text: "Build the next version with shared context", selection: "shared context" },
    { id: "story", title: "Feedback", text: "Leave feedback in place and keep every change", selection: "every change" },
    { id: "visibility", title: "Team visibility", text: "visible to the whole team." },
  ]} collaborators={[
    { id: "maya", name: "Maya", initials: "MA", targetId: "intro", comment: "This version is ready to ship.", cursor: { x: 63, y: 24 } },
    { id: "noah", name: "Noah", initials: "NO", targetId: "story", comment: "The shared context is clear.", cursor: { x: 65, y: 53 }, tone: "muted" },
  ]} activeId={active} onActiveChange={setActive} />;
}
