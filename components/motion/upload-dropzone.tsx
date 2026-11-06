"use client";

import { Check, FileImage, FileText, Pause, Play, RotateCcw, Trash2, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { FileUploadItem } from "@/components/motion/file-upload";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";

export interface UploadDropzoneItem extends FileUploadItem {
  file: File;
  uploadedBytes?: number;
  bytesPerSecond?: number;
  paused?: boolean;
}
export interface UploadProgress { uploadedBytes: number }
export interface UploadContext {
  signal: AbortSignal;
  /** Resume byte offset. The host is responsible for a resumable transport/session. */
  offset: number;
  onProgress: (progress: UploadProgress) => void;
}
export interface UploadRejection { file: File; reason: string }
export interface UploadDropzoneProps {
  upload: (file: File, context: UploadContext) => Promise<void>;
  value?: UploadDropzoneItem[];
  defaultValue?: UploadDropzoneItem[];
  onValueChange?: (items: UploadDropzoneItem[]) => void;
  /** Delete a remote file here. A rejected promise retains the row and shows its error. */
  onRemove?: (item: UploadDropzoneItem) => void | Promise<void>;
  onReject?: (rejections: UploadRejection[]) => void;
  accept?: string;
  maxFileSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  autoUpload?: boolean;
  disabled?: boolean;
  className?: string;
}

function ImagePreview({ file }: { file: File }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const next = URL.createObjectURL(file);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  return url ? <img src={url} alt={`Preview of ${file.name}`} className="size-10 rounded-xl object-cover" /> : null;
}

function formatUploadBytes(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : bytes >= 1024 ? `${Math.round(bytes / 1024)} KB` : `${bytes} B`;
}

/**
 * Reuses the existing FileUpload dropzone and one validation path with compact
 * progress rows, host-reported progress, abort/resume and async deletion.
 * No simulated uploads are performed by this component.
 * The upload promise must resolve only after the host has confirmed completion.
 * Pause aborts the current request; resume invokes upload with the last byte offset.
 */
export function UploadDropzone({ upload, value, defaultValue = [], onValueChange, onRemove, onReject, accept, maxFileSize = 10 * 1024 * 1024, maxFiles = 8, multiple = true, autoUpload = true, disabled = false, className }: UploadDropzoneProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue);
  const items = value ?? internal;
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const active = useRef(new Map<string, AbortController>());
  const deleting = useRef(new Set<string>());
  const mounted = useRef(true);
  const [removing, setRemoving] = useState<string[]>([]);
  const [rejections, setRejections] = useState<{ id: string; rejection: UploadRejection }[]>([]);
  const [actionError, setActionError] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; for (const controller of active.current.values()) controller.abort(); active.current.clear(); };
  }, []);
  useEffect(() => {
    const present = new Set(items.map((item) => item.id));
    for (const [key, controller] of active.current) if (!present.has(key)) { controller.abort(); active.current.delete(key); }
  }, [items]);

  const commit = (next: UploadDropzoneItem[]) => {
    if (!mounted.current) return;
    itemsRef.current = next;
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  const update = (key: string, patch: Partial<UploadDropzoneItem>) => {
    commit(itemsRef.current.map((item) => item.id === key ? { ...item, ...patch } : item));
  };
  const start = async (item: UploadDropzoneItem) => {
    if (disabled || active.current.has(item.id) || deleting.current.has(item.id)) return;
    const controller = new AbortController();
    active.current.set(item.id, controller);
    let previousBytes = item.uploadedBytes ?? 0;
    let previousTime = performance.now();
    update(item.id, { status: "uploading", paused: false, error: undefined, bytesPerSecond: 0 });
    try {
      await upload(item.file, {
        signal: controller.signal,
        offset: previousBytes,
        onProgress: ({ uploadedBytes }) => {
          if (!mounted.current || active.current.get(item.id) !== controller || controller.signal.aborted || !Number.isFinite(uploadedBytes)) return;
          const bytes = Math.max(previousBytes, Math.min(item.size, uploadedBytes));
          const now = performance.now();
          const speed = now > previousTime ? (bytes - previousBytes) * 1000 / (now - previousTime) : 0;
          update(item.id, { uploadedBytes: bytes, progress: item.size ? bytes / item.size * 100 : 0, bytesPerSecond: speed });
          previousBytes = bytes; previousTime = now;
        },
      });
      if (mounted.current && active.current.get(item.id) === controller && !controller.signal.aborted) update(item.id, { status: "success", progress: 100, uploadedBytes: item.size, bytesPerSecond: 0 });
    } catch (cause) {
      if (mounted.current && active.current.get(item.id) === controller && !controller.signal.aborted) update(item.id, { status: "error", bytesPerSecond: 0, error: cause instanceof Error ? cause.message : "Upload failed. Please retry." });
    } finally {
      if (active.current.get(item.id) === controller) active.current.delete(item.id);
    }
  };
  const enqueue = (files: File[]) => {
    if (disabled || !files.length) return;
    const next: UploadDropzoneItem[] = [];
    const rejected: UploadRejection[] = [];
    const rules = accept?.split(",").map((rule) => rule.trim().toLowerCase()).filter(Boolean) ?? [];
    for (const file of files) {
      let reason: string | undefined;
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      if (rules.length && !rules.some((rule) => rule.startsWith(".") ? name.endsWith(rule) : rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule)) reason = "This file type is not accepted.";
      else if (file.size > maxFileSize) reason = `File exceeds the ${Math.round(maxFileSize / 1024 / 1024 * 10) / 10} MB size limit.`;
      else if (itemsRef.current.length + next.length >= (multiple ? maxFiles : Math.min(1, maxFiles))) reason = `The queue allows ${multiple ? maxFiles : Math.min(1, maxFiles)} file${multiple && maxFiles !== 1 ? "s" : ""}.`;
      if (reason) rejected.push({ file, reason });
      else next.push({ id: crypto.randomUUID(), file, name: file.name, size: file.size, type: file.type, status: "queued", uploadedBytes: 0, progress: 0 });
    }
    setRejections(rejected.map((rejection) => ({ id: crypto.randomUUID(), rejection }))); onReject?.(rejected);
    if (next.length) { commit([...itemsRef.current, ...next]); if (autoUpload) for (const item of next) void start(item); }
  };
  const pause = (item: UploadDropzoneItem) => {
    active.current.get(item.id)?.abort(); active.current.delete(item.id);
    update(item.id, { status: "queued", paused: true, bytesPerSecond: 0 });
  };
  const remove = async (item: UploadDropzoneItem) => {
    if (disabled || deleting.current.has(item.id)) return;
    deleting.current.add(item.id); setRemoving([...deleting.current]); setActionError(undefined);
    active.current.get(item.id)?.abort(); active.current.delete(item.id);
    if (item.status === "uploading") update(item.id, { status: "queued", paused: true, bytesPerSecond: 0 });
    try {
      await onRemove?.(item);
      if (mounted.current) commit(itemsRef.current.filter((entry) => entry.id !== item.id));
    } catch (cause) {
      if (mounted.current) setActionError(cause instanceof Error ? cause.message : `Could not remove ${item.name}.`);
    } finally {
      deleting.current.delete(item.id);
      if (mounted.current) setRemoving([...deleting.current]);
    }
  };
  const total = items.reduce((sum, item) => sum + item.size, 0);
  const loaded = items.reduce((sum, item) => sum + (item.status === "success" ? item.size : item.uploadedBytes ?? 0), 0);
  const complete = items.filter((item) => item.status === "success").length;
  return <section aria-label="File upload dropzone" className={cn("mx-auto w-full max-w-[736px] bg-background px-4 py-12 text-foreground sm:px-8 sm:py-16", className)} onPaste={(event) => { const pasted = Array.from(event.clipboardData.files); if (pasted.length) { event.preventDefault(); enqueue(pasted); } }}>
    <header className="mb-8"><h2 className="text-4xl font-medium tracking-tight">Add files to this project</h2><p id={`${id}-help`} className="mt-2 text-sm text-muted-foreground sm:text-base">Drop in briefs, photos, and exports. Uploads keep running while you work.</p></header>
    <div aria-describedby={`${id}-help`} className="rounded-3xl border border-border bg-background p-2 sm:p-3">
        <input ref={fileInput} type="file" accept={accept} multiple={multiple} disabled={disabled} tabIndex={-1} aria-hidden="true" className="sr-only" onChange={event => { enqueue(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ""; }} />
      <button type="button" disabled={disabled} aria-label="Add files" aria-describedby={`${id}-types`} onClick={() => { if (!disabled) fileInput.current?.click(); }} onDragEnter={event => { event.preventDefault(); if (!disabled && event.dataTransfer.types.includes("Files")) { dragDepth.current += 1; setDragging(true); } }} onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = disabled ? "none" : "copy"; }} onDragLeave={event => { event.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (!dragDepth.current) setDragging(false); }} onDrop={event => { event.preventDefault(); dragDepth.current = 0; setDragging(false); enqueue(Array.from(event.dataTransfer.files)); }} className={cn("group relative flex w-full cursor-pointer flex-col items-center rounded-3xl border border-dashed px-6 pb-7 pt-9 text-center outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background", dragging ? "border-foreground/40 bg-muted/30" : "border-border hover:border-foreground/30", disabled && "cursor-not-allowed opacity-55")}>
        <span aria-hidden="true" className="relative h-24 w-28"><FileImage strokeWidth={1.2} className={cn("absolute left-2 top-2 h-20 w-16 -rotate-6 fill-background text-border-strong motion-safe:transition-transform motion-safe:duration-300 group-hover:-translate-x-1 group-hover:-rotate-12 motion-reduce:transform-none", dragging && "-translate-x-1 -rotate-12")} /><FileText strokeWidth={1.2} className={cn("absolute right-1 top-1 h-20 w-16 rotate-6 fill-background text-border-strong motion-safe:transition-transform motion-safe:duration-300 group-hover:translate-x-1 group-hover:rotate-12 motion-reduce:transform-none", dragging && "translate-x-1 rotate-12")} /></span>
        <span className="relative mt-5 flex h-7 w-full items-center justify-center overflow-hidden"><span className="text-base font-medium">{dragging ? "Drop files here" : "Drag files here"}</span></span>
        <span id={`${id}-types`} className="mt-1 text-sm text-muted-foreground">Images, PDFs, docs, CSV, or ZIP up to {(maxFileSize / 1024 / 1024).toFixed(1)} MB</span>
        <span className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2"><span aria-hidden="true" className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium">Browse files</span><span className="text-xs text-muted-foreground">or paste an image</span></span>
      </button>
    {rejections.length > 0 && <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-3"><p className="text-sm font-medium">Some files were not added</p><ul className="mt-1 space-y-1 text-xs text-destructive">{rejections.map(({ id, rejection: entry }) => <li key={id}>{entry.file.name}: {entry.reason}</li>)}</ul><Button variant="ghost" size="sm" onClick={() => setRejections([])} className="mt-2">Dismiss validation errors</Button></div>}
    {actionError && <p role="alert" className="text-sm text-destructive">{actionError}</p>}
    {items.length ? <section className="pb-1 pt-2" aria-label="Upload queue">{items.map(item => {
      const progress = item.status === "success" ? 100 : Math.max(0, Math.min(100, item.progress ?? (item.uploadedBytes ?? 0) / Math.max(1, item.size) * 100));
      return <fieldset key={item.id} disabled={disabled || removing.includes(item.id)} className="flex min-w-0 items-center gap-3 rounded-2xl border-0 p-3 disabled:opacity-50"><legend className="sr-only">{item.name}</legend>
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">{item.type?.startsWith("image/") ? <ImagePreview file={item.file} /> : <FileText aria-hidden className="size-4" />}</div>
        <div className="min-w-0 flex-1"><div className="flex min-h-6 items-center justify-between gap-3"><p className="truncate text-sm font-medium">{item.name}</p><span className={cn("shrink-0 text-xs", item.status === "success" ? "text-emerald-600" : item.status === "error" ? "rounded-full border border-destructive/30 px-2 py-0.5 text-destructive" : "font-mono text-muted-foreground")}>{item.status === "success" ? <span className="flex items-center gap-1.5"><Check aria-hidden className="size-4 rounded-full bg-emerald-500/15 p-0.5" />Uploaded</span> : item.status === "error" ? "Failed" : item.paused ? `Paused · ${Math.round(progress)}%` : item.status === "uploading" ? `${Math.round(progress)}%` : "Queued"}</span></div>
          <div role="progressbar" aria-label={`${item.name} upload progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", item.status === "success" ? "bg-emerald-500" : item.status === "error" ? "bg-destructive" : "bg-foreground/35")} style={{width:`${progress}%`}} /></div>
          <p className={cn("mt-1.5 truncate font-mono text-xs", item.status === "error" ? "text-destructive" : "text-muted-foreground")}>{removing.includes(item.id) ? "Removing…" : item.status === "success" ? formatUploadBytes(item.size) : item.status === "error" ? `${formatUploadBytes(item.size)} · ${item.error ?? "Upload failed"}` : `${formatUploadBytes(item.uploadedBytes ?? 0)} of ${formatUploadBytes(item.size)}`}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">{item.status === "uploading" ? <button type="button" aria-label={`Pause ${item.name}`} onClick={()=>pause(item)} className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><Pause aria-hidden className="size-4" /></button> : item.status === "queued" ? <button type="button" aria-label={`${item.paused ? "Resume" : "Start"} ${item.name}`} onClick={()=>void start(item)} className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><Play aria-hidden className="size-4" /></button> : item.status === "error" ? <button type="button" aria-label={`Retry ${item.name}`} onClick={()=>void start(item)} className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><RotateCcw aria-hidden className="size-4" /></button> : null}<button type="button" aria-label={`Remove ${item.name}`} onClick={()=>void remove(item)} className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{item.status === "success" ? <Trash2 aria-hidden className="size-4" /> : <X aria-hidden className="size-4" />}</button></div>
      </fieldset>;
    })}</section> : <p className="pb-3 text-center text-xs text-muted-foreground">Your queue is empty.</p>}
    {items.length > 0 && <footer className="sr-only"><p role="status">{complete} of {items.length} uploaded · {items.filter(item=>item.status==="error").length} failed · {formatUploadBytes(loaded)} of {formatUploadBytes(total)} transferred</p><div role="progressbar" aria-label="Overall upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={total ? Math.round(loaded / total * 100) : 0} /></footer>}
    </div>
  </section>;
}
