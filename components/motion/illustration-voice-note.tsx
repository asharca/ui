"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { AudioLines, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/motion/button";
import { EASE_IN_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { SceneError } from "./illustration-product-scene";

export interface VoiceIllustrationNote {
  id: string; title: string; date: string; duration: number;
  /** Normalized amplitudes from this note, not randomly generated bars. */
  waveform: readonly number[];
  transcript: string;
  transcriptStatus: "pending" | "ready" | "error";
  /** Omit for an explicitly decorative waveform concept. */
  audioSrc?: string;
}
export interface VoiceNoteSceneProps { notes: readonly VoiceIllustrationNote[]; selectedId?: string; defaultSelectedId?: string; onSelectedIdChange?: (id: string) => void; className?: string }
const time = (seconds: number) => `${Math.floor(Math.max(0, seconds) / 60)}:${Math.floor(Math.max(0, seconds) % 60).toString().padStart(2, "0")}`;

export function VoiceNoteScene({ notes, selectedId, defaultSelectedId, onSelectedIdChange, className }: VoiceNoteSceneProps) {
  const [internal, setInternal] = useState(defaultSelectedId ?? notes[0]?.id);
  const selected = notes.find((note) => note.id === (selectedId ?? internal)) ?? notes[0];
  return <section aria-label="Voice note illustration" className={cn("@container group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xl bg-[oklch(0.92_0.035_160)] text-foreground dark:bg-[oklch(0.18_0.02_160)]", className)}><div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,oklch(0.78_0.09_155/0.48),transparent_48%),linear-gradient(to_bottom,transparent_58%,oklch(0.98_0_0/0.58))] dark:bg-[radial-gradient(circle_at_50%_8%,oklch(0.43_0.07_155/0.42),transparent_48%),linear-gradient(to_bottom,transparent_58%,oklch(0.12_0_0/0.5))]" /><div aria-hidden style={{ transform: "perspective(760px) rotateX(-8deg) translateY(-7%)", transformOrigin: "50% 100%" }} className="absolute left-1/2 top-[13%] h-[52%] w-[46%] -translate-x-1/2 rounded-[1.6rem] border border-white/45 bg-white/28 dark:border-white/8 dark:bg-white/4" /><div aria-hidden style={{ transform: "perspective(760px) rotateX(-7deg) translateY(-3%)", transformOrigin: "50% 100%" }} className="absolute left-1/2 top-[15%] h-[53%] w-[50%] -translate-x-1/2 rounded-[1.7rem] border border-white/55 bg-white/46 dark:border-white/9 dark:bg-white/6" />{selected ? <VoiceNotePlayback key={`${selected.id}-${selected.audioSrc ?? "concept"}`} note={selected} /> : <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">No voice notes supplied.</p>}<fieldset aria-label="Voice notes" className="absolute inset-x-[8%] bottom-1 z-30 m-0 flex min-w-0 flex-wrap justify-center gap-1 border-0 p-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">{notes.map(note => <Button key={note.id} variant="ghost" size="sm" aria-pressed={selected?.id === note.id} className="h-auto rounded-full bg-background/90 px-3 py-1 text-[1.8cqw]" onClick={() => { if (selectedId === undefined) setInternal(note.id); onSelectedIdChange?.(note.id); }}>{note.title}</Button>)}</fieldset></section>;
}

function VoiceNotePlayback({ note }: { note: VoiceIllustrationNote }) {
  const reduce = useReducedMotion();
  const audio = useRef<HTMLAudioElement>(null);
  const captionTrack = useRef<HTMLTrackElement>(null);
  const transcriptId = useId();
  const [mediaDuration, setMediaDuration] = useState(0);
  const [playing, setPlaying] = useState(!note.audioSrc);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const duration = Number.isFinite(note.duration) ? Math.max(0, note.duration) : 0;
  useEffect(() => { const element = audio.current; return () => { element?.pause(); }; }, []);
  useEffect(() => {
    const track = captionTrack.current?.track;
    if (!track) return;
    while (track.cues?.length) track.removeCue(track.cues[0]);
    // The host supplies a complete utterance, not word-level timing.
    if (Number.isFinite(mediaDuration) && mediaDuration > 0 && note.transcriptStatus === "ready" && note.transcript.trim()) {
      track.addCue(new VTTCue(0, mediaDuration, note.transcript.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")));
      track.mode = "showing";
    }
  }, [mediaDuration, note.transcript, note.transcriptStatus]);
  const sampleOccurrences = new Map<number, number>();
  const toggle = async () => {
    setError(null);
    if (!note.audioSrc) { setPlaying((value) => !value); return; }
    const element = audio.current;
    if (!element) return;
    if (!element.paused) element.pause();
    else { try { await element.play(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Audio playback is unavailable."); } }
  };
  return <div className="absolute inset-0"><div style={{ transform: "perspective(760px) rotateX(-6deg)", transformOrigin: "50% 100%" }} className="absolute left-1/2 top-[17%] h-[55%] w-[54%] -translate-x-1/2 overflow-y-auto rounded-[1.8rem] border border-black/6 bg-white/88 px-[6%] pt-[6%] shadow-[0_24px_64px_oklch(0.4_0.04_160/0.14)] [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] dark:border-white/10 dark:bg-[oklch(0.24_0.012_160/0.94)] dark:shadow-none"><span aria-hidden className="absolute right-[9%] top-[8%] grid size-[16%] place-items-center rounded-xl bg-[oklch(0.9_0.055_160)] text-[oklch(0.42_0.09_160)] dark:bg-emerald-900 dark:text-emerald-300"><AudioLines className="size-[4cqw]" /></span><p id={transcriptId} aria-live="polite" className="max-w-[80%] text-[clamp(0.62rem,1.8vw,1rem)] leading-normal tracking-[-0.025em]">{note.transcriptStatus === "ready" ? note.transcript || "No transcript text supplied." : note.transcriptStatus === "pending" ? "Transcription is in progress in the host application." : "A transcript is unavailable for this note."}</p></div>
    <div className="absolute inset-x-[18%] bottom-[15%] z-20 flex h-[16%] min-h-14 items-center gap-2 rounded-[1.75rem] border border-white/85 bg-white/95 p-2 shadow-[0_22px_54px_oklch(0.35_0.03_160/0.16)] dark:border-white/10 dark:bg-[oklch(0.23_0.01_160/0.96)] dark:shadow-none"><span aria-hidden className="grid aspect-square h-full shrink-0 place-items-center rounded-full bg-emerald-50 text-foreground dark:bg-emerald-950"><Volume2 className="size-[3.5cqw]" /></span><div aria-label={`Waveform for ${note.title}`} role="img" className="flex h-[6cqw] min-w-0 flex-1 items-center justify-between overflow-hidden">{note.waveform.map((amplitude, index) => {
      const occurrence = sampleOccurrences.get(amplitude) ?? 0;
      sampleOccurrences.set(amplitude, occurrence + 1);
      return <motion.span key={`${amplitude}:${occurrence}`} className="w-px shrink-0 rounded-full bg-foreground" style={{ height: `${Math.max(5, Math.min(1, Number.isFinite(amplitude) ? amplitude : 0) * 100)}%` }} animate={{ scaleY: playing && !reduce ? [1, .45, 1] : 1, opacity: index > note.waveform.length * .65 ? .2 : 1 }} transition={{ duration: reduce ? 0 : .7, delay: index * .035, repeat: playing && !reduce ? Infinity : 0, ease: EASE_IN_OUT }} />;
    })}</div><button type="button" aria-label={note.audioSrc ? playing ? "Pause recording" : "Play recording" : playing ? "Pause waveform animation" : "Animate silent waveform"} aria-pressed={playing} onClick={() => void toggle()} disabled={!!reduce && !note.audioSrc} className="grid aspect-square h-full shrink-0 cursor-pointer place-items-center rounded-full bg-foreground text-background disabled:cursor-default">{playing ? <Pause className="size-[3.5cqw] fill-current" /> : <Play className="size-[3.5cqw] fill-current" />}</button></div>
    {note.audioSrc && <audio ref={audio} src={note.audioSrc} preload="metadata" aria-label={note.title} aria-describedby={transcriptId} onLoadedMetadata={event => setMediaDuration(event.currentTarget.duration)} onDurationChange={event => setMediaDuration(event.currentTarget.duration)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setPosition(0); }} onTimeUpdate={event => setPosition(event.currentTarget.currentTime)} onError={() => { setPlaying(false); setError("This recording could not be loaded."); }}>
      <track ref={captionTrack} kind="captions" srcLang="und" label={`${note.title} transcript`} default />
    </audio>}
    <span className="sr-only">{note.title} · {note.date} · {time(duration)} · {note.audioSrc ? "Audio recording" : "Silent waveform concept, no audio recording"}</span>
    {note.audioSrc && <label className="absolute inset-x-[20%] bottom-[7%] text-[1.8cqw] text-muted-foreground">Recording position {time(position)} / {time(duration)}<input aria-label="Recording position" className="block w-full accent-foreground" type="range" min={0} max={duration} step={.1} value={Math.min(position, duration)} disabled={!duration} onChange={event => { const next = Number(event.target.value); if (audio.current) audio.current.currentTime = next; setPosition(next); }} /></label>}
    <div className="absolute inset-x-[15%] bottom-0"><SceneError message={error} /></div></div>;
}
