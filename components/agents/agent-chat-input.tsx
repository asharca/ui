"use client";

import { type ReactNode, useId, useLayoutEffect, useRef, useState } from "react";
import { Paperclip, Mic, AudioLines, BookOpen, Cpu, Globe2, X, Plus, ArrowUp, Square, ImageIcon, Monitor, RectangleHorizontal, CornerDownRight, Pencil, Trash2, Atom, Telescope } from "lucide-react";
import type { PromptModel } from "@/components/agents/prompt-input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/motion/popover";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";
import { AnimatedDropdown, type AnimatedDropdownItem } from "@/components/motion/animated-dropdown";

export type AgentComposerVariant = "creative" | "pill" | "studio" | "credits";
export interface ComposerSettings { model: string; output: string; resolution: string; aspectRatio: string; reasoning: string; skills: string[]; webSearch: boolean; customSources: boolean; agent?: string; speed?: string; }
export interface ComposerPayload { text: string; attachments: File[]; settings: ComposerSettings; }
export interface ComposerSkill { id: string; label: string; description?: string; }
export interface ComposerOption { value: string; label: ReactNode; shortLabel?: ReactNode; icon?: ReactNode; disabled?: boolean; }
export interface ComposerModel extends PromptModel { shortLabel?: ReactNode; }
export interface AgentChatInputProps {
  variant: AgentComposerVariant;
  models: ComposerModel[];
  /** Host-supplied choices; selection is part of settings.agent and submit payloads. */
  agents?: ComposerOption[];
  /** Host-supplied choices; selection is part of settings.speed and submit payloads. */
  speedOptions?: ComposerOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (text: string) => void;
  attachments?: File[];
  onAttachmentsChange?: (files: File[]) => void;
  settings?: ComposerSettings;
  defaultSettings?: Partial<ComposerSettings>;
  onSettingsChange?: (settings: ComposerSettings) => void;
  skills?: ComposerSkill[];
  onSubmit: (payload: ComposerPayload) => void | Promise<void>;
  streaming?: boolean;
  onStop?: () => void;
  onDictate?: () => Promise<string>;
  onVoice?: () => void;
  onQueue?: (payload: ComposerPayload) => void | Promise<void>;
  queuedMessages?: { id: string; text: string }[];
  onRemoveQueued?: (id: string) => void;
  credits?: number;
  creditCost?: number;
  disabled?: boolean;
  onUpgrade?: () => void;
  className?: string;
}

function ComposerChoice({ label, value, options, onChange, disabled, icon, className, menuWidth = 224, showHeading = true }: {
  label: string;
  value: string;
  options: ComposerOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  menuWidth?: number;
  showHeading?: boolean;
}) {
  const selected = options.find(option => option.value === value);
  const title = label.replace(/^Select /, "").replace(/^./, character => character.toUpperCase());
  return <AnimatedDropdown ariaLabel={label} side="top" shadow={false} value={value} onValueChange={onChange} disabled={disabled} indicatorPosition="end" menuLabel={showHeading ? title : undefined} menuWidth={menuWidth} itemClassName="min-h-10 gap-2.5 rounded-lg px-2.5" trigger={<>{icon ?? selected?.icon}<span className="truncate">{selected?.shortLabel ?? selected?.label ?? value}</span></>} triggerClassName={cn("h-9 min-w-0 gap-1.5 rounded-full border-0 bg-transparent px-3 text-xs", className)} items={options.map(option => ({ id: option.value, kind: "option", value: option.value, label: option.label, textValue: typeof option.label === "string" ? option.label : option.value, icon: option.icon, disabled: option.disabled }))} />;
}

const REASONING_OPTIONS = [
  { value: "fast", label: "Low" },
  { value: "balanced", label: "Medium" },
  { value: "deep", label: "High" },
  { value: "extra-high", label: "Extra High" },
];

function StudioSettings({ models, speedOptions, settings, onChange, disabled }: { models: ComposerModel[]; speedOptions: ComposerOption[]; settings: ComposerSettings; onChange: (patch: Partial<ComposerSettings>) => void; disabled: boolean }) {
  const model = models.find(option => option.value === settings.model);
  const items: AnimatedDropdownItem[] = [
    ...REASONING_OPTIONS.map(option => ({ id: `reasoning:${option.value}`, kind: "option" as const, value: `reasoning:${option.value}`, label: option.label, textValue: option.label, checked: settings.reasoning === option.value })),
    { id: "model-separator", kind: "separator" },
    { id: "model", kind: "submenu", label: model?.label ?? "Model", textValue: "Model", items: models.map(option => ({ id: option.value, kind: "option", value: `model:${option.value}`, label: option.label, textValue: typeof option.label === "string" ? option.label : option.value, icon: option.icon, disabled: option.disabled, checked: settings.model === option.value })) },
  ];
  if (speedOptions.length) items.push({ id: "speed", kind: "submenu", label: "Speed", textValue: "Speed", items: speedOptions.map(option => ({ id: option.value, kind: "option", value: `speed:${option.value}`, label: option.label, textValue: typeof option.label === "string" ? option.label : option.value, icon: option.icon, disabled: option.disabled, checked: settings.speed === option.value })) });
  return <AnimatedDropdown ariaLabel="Change model and reasoning" side="top" shadow={false} menuLabel="Reasoning" menuWidth={240} submenuWidth={256} itemClassName="min-h-10 gap-2.5 rounded-lg px-2.5" indicatorPosition="end" align="end" disabled={disabled} value={settings.reasoning} onValueChange={choice => {
    if (choice.startsWith("model:")) onChange({ model: choice.slice(6) });
    else if (choice.startsWith("speed:")) onChange({ speed: choice.slice(6) });
    else if (choice.startsWith("reasoning:")) onChange({ reasoning: choice.slice(10) });
  }} trigger={<><span>{model?.shortLabel ?? model?.label ?? settings.model}</span><span className="hidden font-normal sm:inline">{REASONING_OPTIONS.find(option => option.value === settings.reasoning)?.label ?? settings.reasoning}</span></>} triggerClassName="h-9 gap-1.5 rounded-full border-0 bg-transparent px-3 text-sm text-muted-foreground" items={items} />;
}

export function AgentChatInput({ variant, models, agents = [], speedOptions = [], value, defaultValue = "", onValueChange, attachments, onAttachmentsChange, settings, defaultSettings, onSettingsChange, skills = [], onSubmit, streaming = false, onStop, onDictate, onVoice, onQueue, queuedMessages = [], onRemoveQueued, credits, creditCost = 1, disabled = false, onUpgrade, className }: AgentChatInputProps) {
  const id = useId(); const fileInput = useRef<HTMLInputElement>(null); const textarea = useRef<HTMLTextAreaElement>(null);
  const [creditsNotice, setCreditsNotice] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState(defaultValue);
  const [files, setFiles] = useState<File[]>([]);
  const [attachmentIdentity] = useState(() => ({ keys: new WeakMap<File, string[]>(), next: 0 }));
  const [localSettings, setLocalSettings] = useState<ComposerSettings>({ model: models[0]?.value ?? "", agent: agents[0]?.value, speed: speedOptions[0]?.value, output: "image", resolution: "1080p", aspectRatio: "1:1", reasoning: "balanced", skills: [], webSearch: false, customSources: false, ...defaultSettings });
  const [pending, setPending] = useState(false); const [dictating, setDictating] = useState(false);
  const [error, setError] = useState("");
  const currentText = value ?? text; const currentFiles = attachments ?? files; const current = settings ?? localSettings;
  // File identity survives reordering; occurrence slots also retain repeated File references.
  const occurrences = new Map<File, number>();
  const attachmentItems = currentFiles.map((file, index) => {
    const occurrence = occurrences.get(file) ?? 0;
    occurrences.set(file, occurrence + 1);
    let keys = attachmentIdentity.keys.get(file);
    if (!keys) { keys = []; attachmentIdentity.keys.set(file, keys); }
    const key = keys[occurrence] ?? `${id}-attachment-${attachmentIdentity.next++}`;
    keys[occurrence] = key;
    return { file, index, key };
  });
  const busy = pending || streaming;
  useLayoutEffect(() => { const field = textarea.current; if (!field) return; field.style.height = "auto"; const height = variant === "pill" && currentText.length === 0 ? 40 : Math.min(200, field.scrollHeight); field.style.height = `${height}px`; setExpanded(previous => variant === "pill" && Boolean(currentText.trim()) && (previous || height > 44)); }, [currentText, variant]);
  const insufficient = variant === "credits" && credits !== undefined && credits < creditCost;
  const updateText = (next: string) => { if (value === undefined) setText(next); onValueChange?.(next); };
  const updateFiles = (next: File[]) => { if (attachments === undefined) setFiles(next); onAttachmentsChange?.(next); };
  const updateSettings = (patch: Partial<ComposerSettings>) => { const next = { ...current, ...patch }; if (!settings) setLocalSettings(next); onSettingsChange?.(next); };
  const send = async (queue = false) => {
    if (disabled || insufficient || dictating || (!currentText.trim() && !currentFiles.length) || (busy && !queue) || (queue && (!onQueue || pending))) return;
    const payload: ComposerPayload = { text: currentText.trim(), attachments: [...currentFiles], settings: { ...current, skills: [...current.skills] } };
    setPending(true); setError("");
    try { if (queue) await onQueue?.(payload); else await onSubmit(payload); updateText(""); updateFiles([]); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Message could not be sent. Your draft is preserved."); }
    finally { setPending(false); }
  };
  const dictate = async () => {
    if (!onDictate || busy || disabled || dictating) return;
    setDictating(true); setError("");
    try { const transcript = await onDictate(); updateText([currentText, transcript].filter(Boolean).join(" ")); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Dictation failed"); }
    finally { setDictating(false); }
  };
  const controlClass = cn("rounded-full px-3 font-medium shadow-none", variant === "creative" ? "h-10 border border-border bg-background text-sm" : variant === "pill" ? "h-10 border-0 bg-transparent px-2 text-sm" : variant === "credits" ? "h-8 border-0 bg-transparent px-1.5 text-xs" : "h-9 border-0 bg-transparent text-sm");
  const option = (label: string, key: "output" | "resolution" | "aspectRatio", options: [string, string, string?][], icon?: ReactNode) => <ComposerChoice label={`Select ${label}`} value={current[key]} onChange={next => updateSettings({ [key]: next })} disabled={busy || disabled} options={options.map(([value, label, shortLabel]) => ({ value, label, shortLabel }))} icon={icon} className={controlClass} />;
  const toggleSkill = (skill: ComposerSkill) => { updateSettings({ skills: current.skills.includes(skill.id) ? current.skills.filter(value => value !== skill.id) : [...current.skills, skill.id] }); if (variant === "credits" && currentText.startsWith("/")) updateText(""); };
  const skillButtons = skills.map(skill => <button key={skill.id} type="button" disabled={disabled || busy} aria-pressed={current.skills.includes(skill.id)} title={skill.description} onClick={() => toggleSkill(skill)} className={cn("inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", current.skills.includes(skill.id) ? "bg-[#dceeff] text-[#1677d2] dark:bg-[#15324a] dark:text-[#70baff]" : "hover:bg-muted")}>{variant === "credits" && <Telescope className="size-4 shrink-0" />}{variant === "credits" ? <span className="hidden @[22rem]:inline">{skill.label}</span> : skill.label}</button>);
  const modelPicker = <ComposerChoice label="Select model" value={current.model} onChange={model => updateSettings({ model })} disabled={busy || disabled} options={models.map(model => ({ ...model, icon: model.icon ?? (variant === "creative" || variant === "pill" ? <Atom className="size-4 shrink-0" /> : variant === "credits" ? <Cpu className="size-4 shrink-0 @[22rem]:hidden" /> : undefined) }))} className={cn(controlClass, "max-w-40", variant === "credits" && "h-9 w-9 px-0 [&>span]:hidden [&>svg:last-child]:hidden @[22rem]:h-8 @[22rem]:w-auto @[22rem]:px-1.5 @[22rem]:[&>span]:inline @[22rem]:[&>svg:last-child]:block")} />;
  const attach = <Button type="button" variant="ghost" size="icon" aria-label={variant === "creative" ? "Attach images" : "Attach files"} disabled={busy || disabled} onClick={() => fileInput.current?.click()} className={cn("size-9 shrink-0 rounded-full", variant === "creative" && "size-10 border border-border bg-background")}>{variant === "creative" || variant === "credits" ? <Paperclip className={variant === "creative" ? "size-5" : "size-4"} /> : <Plus className="size-4" />}</Button>;
  const actions = variant === "creative" || variant === "credits" ? attach : <Popover side="top" align="start"><PopoverTrigger><Button type="button" variant="ghost" size="icon" aria-label="Open agent actions" disabled={busy || disabled} className="size-9 shrink-0 rounded-full"><Plus className="size-4" /></Button></PopoverTrigger><PopoverContent className="w-64 p-2"><button type="button" disabled={busy || disabled} onClick={() => fileInput.current?.click()} className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm hover:bg-muted"><Paperclip className="size-4" />Attach files</button>{skills.length > 0 && <fieldset aria-label="Agent skills" className="mt-2 flex flex-wrap border-t border-border pt-2">{skillButtons}</fieldset>}</PopoverContent></Popover>;
  const voice = onDictate && <Button type="button" variant="ghost" size="icon" aria-label={dictating ? "Dictating" : "Dictate message"} disabled={busy || disabled || dictating} onClick={dictate} className={cn("size-9 shrink-0 rounded-full text-muted-foreground", variant === "studio" && "hidden sm:inline-flex")}><Mic className="size-4" /></Button>;
  const submitClass = cn("shrink-0 rounded-full", variant === "creative" || variant === "credits" ? "size-10" : variant === "studio" ? "size-8" : "size-9");
  const submitButton = streaming && onStop ? <Button type="button" size="icon" aria-label="Stop response" onClick={onStop} className={submitClass}><Square className="size-3 fill-current" /></Button> : variant === "pill" && !currentText.trim() && !currentFiles.length && onVoice ? <Button type="button" size="icon" aria-label="Start voice conversation" onClick={onVoice} disabled={disabled || pending} className={cn(submitClass, "bg-foreground text-background hover:bg-foreground/90")}><AudioLines className="size-4" /></Button> : <Button type="submit" size="icon" aria-label="Send message" disabled={disabled || busy || dictating || insufficient || (!currentText.trim() && !currentFiles.length)} className={submitClass}><ArrowUp className={variant === "creative" || variant === "credits" ? "size-5" : "size-4"} /></Button>;
  return <section aria-label={`${variant} composer`} data-variant={variant} className={cn("@container relative w-full min-w-0 text-foreground", className)}>
    {variant === "studio" && current.skills.length > 0 && <div className="mx-auto w-[88%] rounded-t-2xl border border-b-0 border-border/70 bg-background/70 px-2 py-1 backdrop-blur-xl md:w-[94%]">{skills.filter(skill => current.skills.includes(skill.id)).map(skill => <div key={skill.id} className="flex min-h-[33px] items-center gap-2 px-2 text-sm text-muted-foreground"><CornerDownRight className="size-3.5" /><span className="min-w-0 flex-1 truncate">{skill.label}</span><button type="button" disabled={busy || disabled} aria-label={`Steer ${skill.label}`} onClick={() => { updateText(`Regarding ${skill.label}: `); textarea.current?.focus(); }} className="flex h-7 items-center gap-1 rounded-full px-1.5 text-sm hover:bg-primary/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><CornerDownRight className="size-3.5" /><span className="hidden sm:inline">Steer</span></button><button type="button" disabled={busy || disabled} aria-label={`Remove ${skill.label}`} onClick={() => toggleSkill(skill)} className="grid size-7 place-items-center rounded-full hover:bg-primary/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><Trash2 className="size-3.5" /></button><button type="button" disabled={busy || disabled} aria-label={`Edit ${skill.label}`} onClick={() => { updateText(`/${skill.id} `); textarea.current?.focus(); }} className="grid size-7 place-items-center rounded-full hover:bg-primary/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"><Pencil className="size-3.5" /></button></div>)}</div>}
    <div className={cn(variant === "creative" ? "rounded-3xl bg-muted p-1.5" : variant === "credits" && "rounded-2xl bg-muted p-[3px]")}>
      {variant === "credits" && creditsNotice && credits !== undefined && <div className="flex h-9 items-center justify-between gap-3 px-3 text-sm text-muted-foreground"><span>{credits} Credits Remaining</span><div className="flex items-center gap-3">{onUpgrade && <button type="button" onClick={onUpgrade} className="font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">Upgrade</button>}<button type="button" aria-label="Dismiss credits notice" onClick={() => setCreditsNotice(false)} className="rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="size-4" /></button></div></div>}
      <form aria-label={`${variant} prompt`} onSubmit={event => { event.preventDefault(); void send(); }} className={cn("relative min-w-0 bg-background", variant === "pill" ? "flex min-h-[54px] flex-wrap items-center gap-1 rounded-[27px] border border-border p-1.5" : variant === "creative" ? "rounded-2xl" : variant === "credits" ? "rounded-2xl px-2 pt-1.5 pb-2" : "rounded-3xl border border-border")}>
        <input id={`${id}-files`} ref={fileInput} type="file" multiple accept={variant === "creative" ? "image/*" : undefined} aria-label="Attach files" className="sr-only" disabled={busy || disabled} onChange={event => { updateFiles([...currentFiles, ...Array.from(event.target.files ?? [])]); event.target.value = ""; }} />
        {variant === "pill" && !expanded && actions}
        <textarea ref={textarea} rows={1} aria-label="Message" value={currentText} onChange={event => updateText(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void send(); } }} disabled={disabled || pending || dictating || insufficient} placeholder={variant === "creative" ? "What would you like to create?" : variant === "pill" ? "Ask anything" : variant === "studio" ? "Ask for follow-up changes" : "What do you want to do today?"} className={cn("block min-w-0 resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground disabled:opacity-50", variant === "pill" ? expanded ? "max-h-48 min-h-10 w-full basis-full px-3 py-2.5 leading-5" : "max-h-48 min-h-10 flex-1 basis-16 px-1 py-2.5 leading-5" : variant === "creative" ? "min-h-40 w-full rounded-2xl bg-background p-5" : variant === "studio" ? "min-h-14 w-full px-4 pt-4 pb-3 text-base sm:px-5 sm:pt-5" : "min-h-[84px] w-full px-2.5 pt-2.5 pb-2 text-base sm:px-3 sm:pt-3")} />
        {currentFiles.length > 0 && <ul aria-label="Attachments" className="flex w-full flex-wrap gap-2 p-2">{attachmentItems.map(({ file, index, key }) => <li key={key} className="flex min-w-0 max-w-full items-center gap-2 rounded-xl border border-border bg-background px-2 py-1.5 text-xs"><Paperclip className="size-3 shrink-0" /><span className="truncate">{file.name}</span><span className="text-muted-foreground">{Math.ceil(file.size / 1024)} KB</span><button type="button" disabled={busy || disabled} aria-label={`Remove attachment ${file.name}`} onClick={() => updateFiles(currentFiles.filter((_, i) => index !== i))} className="rounded p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="size-3" /></button></li>)}</ul>}
        <div className={cn("flex min-w-0 flex-wrap items-center gap-1", variant === "pill" && !expanded ? "contents" : "w-full p-1", variant === "creative" && "gap-2 rounded-b-2xl bg-muted p-2", variant === "credits" && "gap-1 p-0", variant === "studio" && "px-4 pt-0 pb-2", (variant === "studio" || variant === "credits") && "flex-nowrap")}>
          {(variant !== "pill" || expanded) && actions}
          {variant === "creative" && <>{option("Output type", "output", [["image", "Image"], ["video", "Video"]], <ImageIcon className="size-4" />)}{option("Resolution", "resolution", [["1080p", "HD · 1080p", "HD"], ["1440p", "2K · 1440p", "2K"], ["2160p", "4K · 2160p", "4K"]], <Monitor className="size-4" />)}{option("Aspect ratio", "aspectRatio", [["16:9", "Landscape · 16:9", "16:9"], ["9:16", "Portrait · 9:16", "9:16"], ["1:1", "Square · 1:1", "1:1"], ["4:3", "Landscape · 4:3", "4:3"], ["3:4", "Portrait · 3:4", "3:4"]], <RectangleHorizontal className="size-4" />)}<div className="ml-auto" />{modelPicker}</>}
          {variant === "studio" && <>{agents.length > 0 ? <ComposerChoice label="Select agent" menuWidth={256} showHeading={false} value={current.agent ?? ""} options={agents} onChange={agent => updateSettings({ agent })} disabled={busy || disabled} className="h-9 max-w-[7.5rem] rounded-full border-0 bg-transparent px-2 text-sm font-medium text-muted-foreground sm:max-w-44 sm:px-2.5" /> : <span className="px-2 text-sm text-muted-foreground">Agent</span>}<div className="ml-auto" /><StudioSettings models={models} speedOptions={speedOptions} settings={current} onChange={updateSettings} disabled={busy || disabled} />{voice}</>}
          {variant === "pill" && <>{modelPicker}{voice}</>}
          {variant === "credits" && <>{voice}<Button type="button" variant="ghost" aria-label="Web search" aria-pressed={current.webSearch} disabled={busy || disabled} onClick={() => updateSettings({ webSearch: !current.webSearch })} className={cn("h-9 gap-2 rounded-full px-3 text-sm font-normal", current.webSearch && "bg-[#dceeff] text-[#1677d2] hover:bg-[#dceeff] dark:bg-[#15324a] dark:text-[#70baff]")}><Globe2 className="size-4" /><span className="hidden @[22rem]:inline">Search</span></Button>{skillButtons}<Button type="button" variant="ghost" aria-label="Custom sources" aria-pressed={current.customSources} disabled={busy || disabled} onClick={() => updateSettings({ customSources: !current.customSources })} className={cn("h-9 gap-2 rounded-full px-3 text-sm font-normal", current.customSources && "bg-[#dceeff] text-[#1677d2] hover:bg-[#dceeff] dark:bg-[#15324a] dark:text-[#70baff]")}><BookOpen className="size-4" /><span className="hidden @[22rem]:inline">Knowledge</span></Button>{modelPicker}<div className="ml-auto" /></>}
          {submitButton}
        </div>
      </form>
    </div>
    {variant === "credits" && currentText.startsWith("/") && skills.length > 0 && <fieldset aria-label="Slash commands" className="absolute bottom-full left-0 mb-2 flex w-full flex-wrap gap-2 rounded-2xl border border-border bg-background p-3 shadow-lg">{skillButtons}</fieldset>}
    {variant === "studio" && streaming && onQueue && <Button className="mt-3" variant="ghost" disabled={pending || disabled || (!currentText.trim() && !currentFiles.length)} onClick={() => send(true)}>Queue message</Button>}
    {variant === "studio" && queuedMessages.length > 0 && <ol aria-label="Queued messages" className="mt-3 space-y-2">{queuedMessages.map((message, index) => <li key={message.id} className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 text-xs"><span className="text-muted-foreground">{index + 1}</span><span className="min-w-0 flex-1 truncate">{message.text || "Attachments"}</span>{onRemoveQueued && <button type="button" aria-label={`Remove queued message ${index + 1}`} onClick={() => onRemoveQueued(message.id)} className="rounded p-1 focus-visible:ring-2 focus-visible:ring-ring"><X className="size-3" /></button>}</li>)}</ol>}
    {dictating && <p role="status" className="mt-2 text-xs text-muted-foreground">Waiting for your dictation provider…</p>}{insufficient && <p role="status" className="mt-2 text-xs text-muted-foreground">Not enough credits to send this message.</p>}{error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </section>;
}
