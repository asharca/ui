"use client";

import { type ReactNode, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Mic, MicOff, PhoneOff, AudioLines } from "lucide-react";
import { VoiceOrb } from "@/components/agents/voice-orb";
import { Button } from "@/components/motion/button";
import { SPRING_GLIDE } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type VoiceSessionState = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "ended" | "error";
export interface VoiceDevice { id: string; label: string; }
export interface VoiceAgentProps {
  variant?: "orb" | "dock";
  state: VoiceSessionState;
  title?: string;
  transcript?: string;
  muted?: boolean;
  defaultMuted?: boolean;
  onMutedChange?: (muted: boolean) => void | Promise<void>;
  onStart?: () => void | Promise<void>;
  onEnd?: () => void | Promise<void>;
  inputDevices?: VoiceDevice[];
  outputDevices?: VoiceDevice[];
  inputDevice?: string;
  outputDevice?: string;
  onDeviceChange?: (kind: "input" | "output", id: string) => void | Promise<void>;
  audioLevel?: number;
  orb?: "liquid" | "halo";
  size?: number;
  speed?: number;
  visualizer?: ReactNode;
  surface?: "card" | "minimal";
  error?: string;
  className?: string;
}
const labels: Record<VoiceSessionState, string> = { idle: "Ready to talk", connecting: "Connecting…", listening: "Listening", thinking: "Thinking", speaking: "Speaking", ended: "Call ended", error: "Connection error" };

/** Presentation and host callbacks only: never acquires a microphone or opens a connection. */
export function VoiceAgent({ variant = "orb", state, title = "Voice assistant", transcript, muted, defaultMuted = false, onMutedChange, onStart, onEnd, inputDevices = [], outputDevices = [], inputDevice, outputDevice, onDeviceChange, audioLevel = 0, orb = "liquid", size = 288, speed = 1, visualizer, surface = "card", error, className }: VoiceAgentProps) {
  const id = useId(); const reduce = useReducedMotion();
  const [localMuted, setMuted] = useState(defaultMuted); const [pending, setPending] = useState(false); const [actionError, setError] = useState("");
  const currentMuted = muted ?? localMuted;
  const active = state === "listening" || state === "thinking" || state === "speaking";
  const level = Number.isFinite(audioLevel) ? Math.max(0, Math.min(1, audioLevel)) : 0;
  const invoke = async (action: () => void | Promise<void>) => { if (pending) return; setPending(true); setError(""); try { await action(); } catch (failure) { setError(failure instanceof Error ? failure.message : "Voice action failed"); } finally { setPending(false); } };
  const toggleMute = () => invoke(async () => { const next = !currentMuted; await onMutedChange?.(next); if (muted === undefined) setMuted(next); });
  const visual = visualizer ?? <div aria-hidden="true" className="relative isolate aspect-square max-w-full shrink-0 max-sm:max-w-64" style={{ width: variant === "dock" ? 56 : size }}>{orb === "halo" && <div className="pointer-events-none absolute inset-0 -z-10 rounded-full blur-2xl" style={{ background: "radial-gradient(circle at 30% 30%, #e5fbff, transparent 55%), radial-gradient(circle at 65% 60%, #45b9d8, transparent 70%)", opacity: 0.28 }} />}<VoiceOrb activity={currentMuted && state === "listening" ? 0 : level} colors={orb === "halo" ? ["#45bad9", "#e6f8fc", "#17576c"] : undefined} active={state !== "ended" && state !== "error"} speed={speed} className={cn("size-full", orb === "halo" && "saturate-125")} />{orb === "halo" && <div className="pointer-events-none absolute inset-[4.5%] rounded-full border border-foreground/10" />}</div>;
  const deviceSelect = (kind: "input" | "output", devices: VoiceDevice[], selected: string | undefined) => devices.length > 0 && <label htmlFor={`${id}-${kind}`} className="grid min-w-0 gap-1 text-[10px] text-muted-foreground">{kind === "input" ? "Microphone" : "Speaker"}<select id={`${id}-${kind}`} aria-label={kind === "input" ? "Microphone device" : "Speaker device"} value={selected ?? ""} disabled={!onDeviceChange || pending} onChange={event => invoke(() => onDeviceChange?.(kind, event.target.value))} className="min-w-0 rounded-lg border border-border bg-background p-2 text-xs text-foreground"><option value="" disabled>Select device</option>{devices.map(device => <option key={device.id} value={device.id}>{device.label}</option>)}</select></label>;
  const controls = <div className={cn("flex shrink-0 items-center justify-center gap-2", variant === "orb" && "mx-auto mt-6 min-h-9")}>
    {(active || state === "connecting") ? <>{onMutedChange && <Button variant="outline" size="icon" className="size-9 rounded-full" disabled={pending || state === "connecting"} aria-label={currentMuted ? "Unmute microphone" : "Mute microphone"} aria-pressed={currentMuted} onClick={toggleMute}>{currentMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}</Button>}{onEnd && <Button variant="outline" size={variant === "dock" ? "icon" : "sm"} className="h-9 rounded-full" disabled={pending} aria-label="End call" onClick={() => invoke(onEnd)}><PhoneOff className="size-4" />{variant === "orb" && "End call"}</Button>}</> : onStart && <Button className={cn("h-9 rounded-full", variant === "orb" && "w-44")} disabled={pending} aria-label={state === "error" ? "Reconnect" : variant === "orb" ? "Start talking" : "Start"} onClick={() => invoke(onStart)}><Mic className="size-4" />{state === "error" ? "Reconnect" : variant === "orb" ? "Start talking" : "Start"}</Button>}
  </div>;
  return <section aria-label={title} data-session-state={state} className={cn("w-full text-foreground", surface === "card" && "rounded-3xl border border-border bg-background", variant === "orb" ? "max-w-md p-6 sm:p-8" : "max-w-md p-3", className)}>
    {variant === "orb" ? <><header className="flex items-center justify-between gap-4"><h2 className="text-xl font-medium">{title}</h2><AudioLines className="size-5 text-muted-foreground" /></header><div className="my-6 flex justify-center">{visual}</div><div className="text-center"><motion.p key={state} role="status" initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={SPRING_GLIDE} className="text-base font-medium">{labels[state]}{active && currentMuted ? " · Muted" : ""}</motion.p><p className="mx-auto mt-2 min-h-12 max-w-xs whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{transcript || (state === "idle" || state === "ended" ? "Start a conversation with your agent." : state === "connecting" ? "Getting your session ready…" : state === "listening" ? "I’m listening. Take your time." : state === "thinking" ? "A moment to think it through." : "")}</p></div>{controls}</> : <div className="flex items-center gap-3">{visual}<div className="min-w-0 flex-1"><h2 className="text-sm font-medium">{title}</h2><p role="status" className="mt-1 text-xs text-muted-foreground">{labels[state]}{active && currentMuted ? " · Muted" : ""}</p>{transcript && <p className="mt-1 truncate text-xs text-muted-foreground">{transcript}</p>}</div>{controls}</div>}
    {(inputDevices.length > 0 || outputDevices.length > 0) && <div className="mt-4 grid w-full grid-cols-2 gap-3">{deviceSelect("input", inputDevices, inputDevice)}{deviceSelect("output", outputDevices, outputDevice)}</div>}{(error || actionError) && <p role="alert" className="mt-3 w-full text-sm text-destructive">{actionError || error}</p>}
  </section>;
}
