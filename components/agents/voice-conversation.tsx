"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Play, Mic, MicOff, PhoneOff, AudioLines } from "lucide-react";
import { Message, MessageContent, MessageHeader } from "@/components/agents/message";
import { MessageScroller } from "@/components/agents/message-scroller";
import type { VoiceAgentProps } from "@/components/agents/voice-agent";
import { Button } from "@/components/motion/button";
import { SPRING_GLIDE } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface VoiceTranscriptTurn { id: string; speaker: string; role: "user" | "assistant"; text: string; audioUrl?: string; final?: boolean; }
export interface VoiceConversationProps extends Omit<VoiceAgentProps, "variant" | "transcript" | "visualizer" | "surface"> {
  turns: VoiceTranscriptTurn[];
  inputLevel?: number;
  outputLevel?: number;
  onPlay?: (turn: VoiceTranscriptTurn) => void | Promise<void>;
}
const WAVE_BARS = [
  { x: 7, weight: 0.18 }, { x: 17, weight: 0.24 }, { x: 27, weight: 0.3 },
  { x: 37, weight: 0.4 }, { x: 47, weight: 0.55 }, { x: 57, weight: 0.7 },
  { x: 67, weight: 0.86 }, { x: 77, weight: 0.94 }, { x: 87, weight: 1 },
  { x: 97, weight: 0.96 }, { x: 107, weight: 0.9 }, { x: 117, weight: 0.82 },
  { x: 127, weight: 0.74 }, { x: 137, weight: 0.65 }, { x: 147, weight: 0.6 },
  { x: 157, weight: 0.56 }, { x: 167, weight: 0.5 }, { x: 177, weight: 0.44 },
  { x: 187, weight: 0.38 }, { x: 197, weight: 0.3 }, { x: 207, weight: 0.22 },
];
function Waveform({ level }: { level: number }) {
  const reduce = useReducedMotion();
  const safeLevel = Number.isFinite(level) ? Math.max(0, Math.min(1, level)) : 0;
  return <div aria-hidden="true" className="flex h-28 items-center justify-center gap-1.5"><svg aria-hidden="true" viewBox="0 0 214 88" className="h-22 w-56 overflow-visible text-foreground">{WAVE_BARS.map(({ weight, x }) => <motion.line key={x} x1={x} x2={x} y1={reduce ? 44 - safeLevel * weight * 34 : 43.5} y2={reduce ? 44 + safeLevel * weight * 34 : 44.5} stroke="currentColor" strokeWidth="5" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ transformOrigin: `${x}px 44px` }} initial={false} animate={{ scaleY: reduce ? 1 : Math.max(1, safeLevel * weight * 68) }} transition={reduce ? { duration: 0 } : SPRING_GLIDE} />)}</svg></div>;
}
function TranscriptAudio({ turn, transcriptId, onError }: { turn: VoiceTranscriptTurn; transcriptId: string; onError: () => void }) {
  const captionTrack = useRef<HTMLTrackElement>(null);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    const track = captionTrack.current?.track;
    if (!track) return;
    while (track.cues?.length) track.removeCue(track.cues[0]);
    // The public model supplies an utterance transcript, not word-level timings.
    if (Number.isFinite(duration) && duration > 0 && turn.text.trim()) {
      track.addCue(new VTTCue(0, duration, turn.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")));
      track.mode = "showing";
    }
  }, [duration, turn.text]);
  return <audio controls src={turn.audioUrl} aria-label={`${turn.speaker} audio`} aria-describedby={transcriptId} className="mt-2 max-w-full" onLoadedMetadata={event => setDuration(event.currentTarget.duration)} onDurationChange={event => setDuration(event.currentTarget.duration)} onError={onError}>
    <track ref={captionTrack} kind="captions" srcLang="und" label={`${turn.speaker} transcript`} default />
  </audio>;
}
export function VoiceConversation({ turns, inputLevel = 0, outputLevel = 0, onPlay, muted, defaultMuted = false, onMutedChange, className, ...session }: VoiceConversationProps) {
  const transcriptPrefix = useId();
  const [localMuted, setMuted] = useState(defaultMuted);
  const currentMuted = muted ?? localMuted;
  const changeMuted = async (next: boolean) => { await onMutedChange?.(next); if (muted === undefined) setMuted(next); };
  const [playError, setPlayError] = useState(""); const [playing, setPlaying] = useState<string | null>(null);
  const play = async (turn: VoiceTranscriptTurn) => { if (!onPlay || playing) return; setPlaying(turn.id); setPlayError(""); try { await onPlay(turn); } catch (failure) { setPlayError(failure instanceof Error ? failure.message : "Playback failed"); } finally { setPlaying(null); } };
  const [pending, setPending] = useState(false);
  const invoke = async (action: (() => void | Promise<void>) | undefined) => { if (!action || pending) return; setPending(true); setPlayError(""); try { await action(); } catch (cause) { setPlayError(cause instanceof Error ? cause.message : "Voice action failed"); } finally { setPending(false); } };
  const active = ["connecting", "listening", "thinking", "speaking"].includes(session.state);
  const status = { idle: "Ready when you are", connecting: "Connecting…", listening: "Listening to you", thinking: "Thinking it through", speaking: "Speaking", ended: "Chat ended", error: "Connection error" }[session.state];
  const latest = turns.at(-1);
  return <section aria-label="Voice conversation" className={cn("w-full max-w-sm rounded-3xl border border-border bg-background p-5 text-foreground", className)}>
    <header className="flex items-center justify-between gap-3"><h2 className="text-xl font-medium">{session.title || "Voice conversation"}</h2><AudioLines className="size-4 text-muted-foreground" /></header>
    <meter aria-label="Input audio level" min={0} max={1} value={currentMuted ? 0 : inputLevel} className="sr-only" /><meter aria-label="Output audio level" min={0} max={1} value={outputLevel} className="sr-only" /><Waveform level={session.state === "speaking" ? outputLevel : active && !currentMuted ? inputLevel : 0} />
    <div className="text-center"><output className="block text-sm font-medium">{status}{active && currentMuted ? " · Muted" : ""}</output><p className="mt-2 flex min-h-12 items-start justify-center text-sm leading-relaxed text-muted-foreground">{latest && active ? `“${latest.text}”` : active ? "Take your time. I’m here." : "Talk through an idea, one thought at a time."}</p></div>
    <div className="mt-4 flex items-center justify-center gap-3">{active && onMutedChange && <Button variant="outline" size="icon" disabled={pending || session.state === "connecting"} aria-label={currentMuted ? "Unmute microphone" : "Mute microphone"} aria-pressed={currentMuted} onClick={() => invoke(() => changeMuted(!currentMuted))} className="size-9 rounded-full">{currentMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}</Button>}{active ? session.onEnd && <Button disabled={pending} onClick={() => invoke(session.onEnd)} className="h-9 rounded-full"><PhoneOff className="size-4" />{session.state === "connecting" ? "Cancel" : "End chat"}</Button> : session.onStart && <Button disabled={pending} onClick={() => invoke(session.onStart)} className="h-9 rounded-full"><Mic className="size-4" />{session.state === "error" ? "Reconnect" : "Start talking"}</Button>}</div>
    {(session.inputDevices?.length || session.outputDevices?.length) ? <details className="mt-5 border-t border-border pt-3"><summary className="cursor-pointer text-xs text-muted-foreground">Audio devices</summary><div className="mt-3 grid grid-cols-2 gap-3">{(["input", "output"] as const).map(kind => { const devices = kind === "input" ? session.inputDevices : session.outputDevices; return devices?.length ? <label key={kind} className="grid min-w-0 gap-1 text-xs text-muted-foreground">{kind === "input" ? "Microphone" : "Speaker"}<select aria-label={`${kind === "input" ? "Microphone" : "Speaker"} device`} className="min-w-0 rounded-lg border border-border bg-background p-2 text-foreground" value={(kind === "input" ? session.inputDevice : session.outputDevice) ?? ""} disabled={!session.onDeviceChange || pending} onChange={event => invoke(() => session.onDeviceChange?.(kind, event.target.value))}><option value="" disabled>Select device</option>{devices.map(device => <option key={device.id} value={device.id}>{device.label}</option>)}</select></label> : null; })}</div></details> : null}
    {turns.length > 0 && <details className="mt-5 border-t border-border pt-3"><summary className="cursor-pointer text-xs text-muted-foreground">Conversation transcript</summary><MessageScroller label="Voice transcript" busy={session.state === "listening" || session.state === "speaking"} className="mt-3 max-h-72" contentClassName="space-y-4">{turns.map(turn => {
      const transcriptId = `${transcriptPrefix}-${encodeURIComponent(turn.id)}-transcript`;
      return <Message key={turn.id} from={turn.role} aria-label={`${turn.speaker} transcript`}><MessageContent className="min-w-0 max-w-[90%] rounded-xl bg-muted/60 p-3"><MessageHeader className="mb-1 text-xs font-medium text-muted-foreground">{turn.speaker}{turn.final === false ? " · Transcribing…" : ""}</MessageHeader><p id={transcriptId} className="whitespace-pre-wrap text-sm leading-6">{turn.text}</p>{onPlay ? <Button variant="ghost" disabled={playing !== null || turn.final === false} aria-label={`Play ${turn.speaker} audio`} aria-describedby={transcriptId} onClick={() => play(turn)} className="mt-2 gap-2 text-xs"><Play className="size-3" />{playing === turn.id ? "Playing…" : "Play audio"}</Button> : turn.audioUrl && /^(https?:|blob:|data:audio\/)/i.test(turn.audioUrl) ? <TranscriptAudio key={turn.audioUrl} turn={turn} transcriptId={transcriptId} onError={() => setPlayError("Audio could not be loaded.")} /> : null}</MessageContent></Message>;
    })}</MessageScroller></details>}
    {(playError || session.error) && <p role="alert" className="mt-3 text-sm text-destructive">{playError || session.error}</p>}
  </section>;
}
