"use client";
import { useEffect, useState } from "react";
import { VoiceAgent, type VoiceSessionState } from "@/components/agents/voice-agent";
import { Button } from "@/components/motion/button";
export function OrbSessionPreview() {
  const [state, setState] = useState<VoiceSessionState>("idle");
  const [muted, setMuted] = useState(false);
  const [orb, setOrb] = useState<"liquid" | "halo">("halo");
  const [level, setLevel] = useState(0.4);
  const [size, setSize] = useState(288);
  const [speed, setSpeed] = useState(1);
  const [devices, setDevices] = useState(false);
  const [input, setInput] = useState("demo-input");
  const [output, setOutput] = useState("demo-output");
  useEffect(() => { const next: Partial<Record<VoiceSessionState, VoiceSessionState>> = { connecting: "listening", listening: "thinking", thinking: "speaking", speaking: "listening" }; if (!next[state]) return; const timer = setTimeout(() => { if (!(muted && state === "listening")) setState(next[state]!); }, state === "connecting" ? 900 : 2600); return () => clearTimeout(timer); }, [state, muted]);
  return <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
    <VoiceAgent variant="orb" title="Voice assistant" state={state} muted={muted} onMutedChange={setMuted} onStart={() => setState("connecting")} onEnd={() => setState("ended")} audioLevel={state === "idle" || state === "ended" ? 0 : level} orb={orb} size={size} speed={speed} inputDevices={devices ? [{ id: "demo-input", label: "Demo microphone" }, { id: "demo-headset", label: "Demo headset microphone" }] : []} outputDevices={devices ? [{ id: "demo-output", label: "Demo speaker" }, { id: "demo-headphones", label: "Demo headphones" }] : []} inputDevice={input} outputDevice={output} onDeviceChange={(kind, id) => kind === "input" ? setInput(id) : setOutput(id)} transcript={state === "speaking" ? "“Let’s start with what matters most to you.”" : undefined} error={state === "error" ? "Demo connection failed. Reconnect or choose another simulated state." : undefined} />
    <fieldset aria-label="Orb appearance" className="flex flex-wrap items-center gap-2 border-0 p-0">{(["liquid", "halo"] as const).map(value => <Button key={value} size="sm" variant={orb === value ? "outline" : "ghost"} aria-pressed={orb === value} onClick={() => setOrb(value)} className="h-9 rounded-full px-3 text-xs">{value === "liquid" ? "Liquid orb" : "Halo orb"}</Button>)}</fieldset>
    <details className="w-full max-w-md text-[10px] text-muted-foreground"><summary className="cursor-pointer list-none text-center text-xs [&::-webkit-details-marker]:hidden">Interactive demo · No microphone access</summary><div className="mt-3 grid grid-cols-2 gap-3"><label>Simulated phase<select aria-label="Simulated phase" value={state} onChange={event => setState(event.target.value as VoiceSessionState)} className="mt-1 w-full rounded-lg border border-border bg-background p-2">{["idle", "connecting", "listening", "thinking", "speaking", "ended", "error"].map(value => <option key={value}>{value}</option>)}</select></label><label><input type="checkbox" checked={devices} onChange={event => setDevices(event.target.checked)} /> Show demo devices</label><label>Audio level<input aria-label="Demo audio level" type="range" min="0" max="1" step="0.05" value={level} onChange={event => setLevel(Number(event.target.value))} className="block w-full" /></label><label>Orb speed<input aria-label="Orb speed" type="range" min="0" max="2" step="0.1" value={speed} onChange={event => setSpeed(Number(event.target.value))} className="block w-full" /></label><label>Orb size<input aria-label="Orb size" type="range" min="80" max="288" value={size} onChange={event => setSize(Number(event.target.value))} className="block w-full" /></label></div></details>
  </div>;
}
