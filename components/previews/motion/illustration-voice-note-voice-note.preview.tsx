"use client";

import { VoiceNoteScene } from "@/components/motion/illustration-voice-note";
export function VoiceNoteScenePreview() {
  return <VoiceNoteScene notes={[
    { id: "walk", title: "On the way home", date: "Sample · Today, 16:24", duration: 42, waveform: [0.2, 0.4, 0.7, 0.5, 0.9, 0.6, 0.4, 0.8, 1, 0.6, 0.4, 0.7, 0.3, 0.5, 0.8, 0.4, 0.2, 0.5, 0.3, 0.2, 0.4, 0.2, 0.9, 0.4, 0.5, 0.3, 0.7, 0.5, 0.4, 0.6, 0.3, 0.1], transcriptStatus: "ready", transcript: "The recording became a clear plan. Decisions stayed visible, owners were named, and every next step found its place." },
    { id: "thought", title: "A thought to revisit", date: "Sample · Yesterday", duration: 18, waveform: [0.3, 0.7, 0.4, 0.6, 0.9, 0.5, 0.2, 0.8, 0.4, 0.3, 0.6, 0.5], transcriptStatus: "pending", transcript: "" },
    { id: "field", title: "Field notes", date: "Sample · Monday", duration: 63, waveform: [0.2, 0.5, 0.3, 0.8, 0.4, 0.7, 0.6, 0.3, 0.8, 0.4], transcriptStatus: "error", transcript: "" },
  ]} />;
}
