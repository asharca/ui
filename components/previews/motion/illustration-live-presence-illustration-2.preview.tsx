"use client";

import { useState } from "react";
import { LivePresenceIllustration } from "@/components/motion/illustration-live-presence";

export function IllustrationLivePresenceCanvasPreview() {
  const [active, setActive] = useState("maya");
  return <LivePresenceIllustration scene="canvas" title="Homepage · Hero" presentationPlaying blocks={[
    { id: "hero", title: "Homepage hero", text: "Turn clear thinking\ninto shared momentum." },
  ]} collaborators={[
    { id: "maya", name: "Maya", initials: "MA", targetId: "hero", comment: "This version is ready to ship.", cursor: { x: 69, y: 70 } },
    { id: "noah", name: "Noah", initials: "NO", targetId: "hero", comment: "The hierarchy looks good.", cursor: { x: 74, y: 19 }, tone: "muted" },
    { id: "ava", name: "Ava", initials: "AV", targetId: "hero", comment: "Ready for final review." },
  ]} activeId={active} onActiveChange={setActive} />;
}
