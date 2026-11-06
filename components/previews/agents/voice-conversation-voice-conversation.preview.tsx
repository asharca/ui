"use client";
import { useEffect, useRef, useState } from "react";
import { VoiceConversation, type VoiceTranscriptTurn } from "@/components/agents/voice-conversation";
import type { VoiceSessionState } from "@/components/agents/voice-agent";
import { Button } from "@/components/motion/button";
export function VoiceConversationPreview() {
  const [state, setState] = useState<VoiceSessionState>("idle"); const [muted, setMuted] = useState(false);
  const [turns, setTurns] = useState<VoiceTranscriptTurn[]>([]);
  const speech = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => () => { if (speech.current && typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); }, []);
  useEffect(() => { const next: Partial<Record<VoiceSessionState, VoiceSessionState>> = { connecting: "listening", listening: "thinking", thinking: "speaking", speaking: "listening" }; const phase = next[state]; if (!phase || (muted && state === "listening") || speech.current) return; const timer = setTimeout(() => { setState(phase); if (phase === "listening" || phase === "speaking") setTurns(items => [...items, { id: crypto.randomUUID(), speaker: phase === "speaking" ? "Assistant" : "You", role: phase === "speaking" ? "assistant" : "user", text: phase === "speaking" ? "Let’s start with what matters most to you." : "Help me turn this idea into a first draft.", final: true }]); }, state === "connecting" ? 900 : 2600); return () => clearTimeout(timer); }, [state, muted]);
  const addTurn = () => { setTurns(items => [...items, { id: crypto.randomUUID(), speaker: items.length % 2 ? "Assistant" : "You", role: items.length % 2 ? "assistant" : "user", text: items.length % 2 ? "Start with the keyboard path, then verify each visible control." : "How should we review this interface?", final: true }]); setState("listening"); };
  const play = (turn: VoiceTranscriptTurn) => {
    if (typeof speechSynthesis === "undefined") return Promise.reject(new Error("Speech synthesis is unavailable in this browser."));
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    const utterance = new SpeechSynthesisUtterance(turn.text); speech.current = utterance;
    utterance.onend = () => { speech.current = null; setState(current => current === "ended" ? current : "listening"); resolve(); };
    utterance.onerror = () => { speech.current = null; setState(current => current === "ended" ? current : "error"); reject(new Error("Speech playback was interrupted or unavailable.")); };
    setState("speaking"); speechSynthesis.speak(utterance); return promise;
  };
  return <div className="flex w-full flex-col items-center gap-4 p-4"><VoiceConversation turns={turns} state={state} muted={muted} onMutedChange={setMuted} onStart={() => { setTurns([]); setState("connecting"); }} onEnd={() => { if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); setState("ended"); }} inputLevel={state === "listening" ? 0.8 : state === "connecting" ? 0.1 : 0} outputLevel={state === "speaking" ? 0.7 : 0} onPlay={play} /><details className="w-full max-w-sm text-[10px] text-muted-foreground"><summary className="cursor-pointer list-none text-center text-xs [&::-webkit-details-marker]:hidden">Interactive demo · No microphone access</summary><p className="mt-2">Demo transcript and levels · playback uses your browser’s real speech synthesis.</p><div className="mt-2 flex flex-wrap gap-2"><Button variant="ghost" onClick={addTurn}>Append demo turn</Button><Button variant="ghost" onClick={() => setState("thinking")}>Simulate thinking</Button><Button variant="ghost" onClick={() => { if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); setTurns([]); setState("idle"); }}>Reset transcript</Button></div></details></div>;
}
