"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Ban, Check, Copy, KeyRound, Plus, RotateCw, Pencil, TriangleAlert } from "lucide-react";
import { Button, StatefulButton } from "@/components/motion/button";
import { Checkbox } from "@/components/motion/checkbox";
import { Input } from "@/components/motion/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/motion/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { DigitSwap } from "@/components/motion/digit-swap";
import { ActionSwapIcon, ActionSwapText } from "@/components/motion/action-swap";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { DecisionDialog, DecisionFeedback, useDecisionAction } from "./decision-support";

export interface ManagedApiKey {
  id: string; name: string; prefix: string; environment: "live" | "test"; scopes: string[];
  status: "active" | "expired" | "revoked"; expiresAt?: string; expiresSoon?: boolean; rotatedAt?: string; revokedAt?: string; lastUsed?: string; requests?: number[]; createdAt?: string; suffix?: string;
}
export interface CreateApiKeyInput { name: string; environment: "live" | "test"; scopes: string[]; expiresInDays: number }
export interface ApiKeysProps {
  keys: ManagedApiKey[]; scopeGroups: { label: string; description?: string; scopes: { value: string; label: string }[] }[];
  onCreate: (input: CreateApiKeyInput) => Promise<{ secret: string }>;
  onRename: (id: string, name: string) => void | Promise<void>;
  /** A fulfilled rotation reveals its actual returned credential once, in the secret dialog. */
  onRotate: (id: string) => Promise<{ secret: string }>;
  onRevoke: (id: string) => void | Promise<void>;
  onCopy: (secret: string) => void | Promise<void>; className?: string;
}
/** Secrets exist only in ephemeral one-time state, never in records, errors, URLs or logs. */
export function ApiKeys({ keys, scopeGroups, onCreate, onRename, onRotate, onRevoke, onCopy, className }: ApiKeysProps) {
  const [create, setCreate] = useState(false);
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<"live" | "test">("test");
  const [scopes, setScopes] = useState<string[]>([]);
  const [expiry, setExpiry] = useState(90);
  const [editing, setEditing] = useState<string | null>(null);
  const [rename, setRename] = useState("");
  const [confirm, setConfirm] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [validation, setValidation] = useState("");
  const [notice, setNotice] = useState("");
  const [tab, setTab] = useState<"live" | "test">("live");
  const [rotating, setRotating] = useState<string | null>(null);
  const [rotated, setRotated] = useState<string | null>(null);
  const [copiedPrefix, setCopiedPrefix] = useState<string | null>(null);
  useEffect(() => {
    if (rotated === null) return;
    const timeout = setTimeout(() => setRotated(null), 1500);
    return () => clearTimeout(timeout);
  }, [rotated]);
  useEffect(() => {
    if (copiedPrefix === null) return;
    const timeout = setTimeout(() => setCopiedPrefix(null), 1500);
    return () => clearTimeout(timeout);
  }, [copiedPrefix]);
  useEffect(() => {
    if (notice !== "Secret copied.") return;
    const timeout = setTimeout(() => setNotice(""), 2000);
    return () => clearTimeout(timeout);
  }, [notice]);
  const action = useDecisionAction();
  const reduce = useReducedMotion();
  const target = keys.find(key => key.id === confirm);
  const available = new Set(scopeGroups.flatMap(group => group.scopes.map(scope => scope.value)));
  const receive = (value: string) => { setSecret(value); setNotice(""); };
  async function createKey() {
    if (!name.trim() || !scopes.length || scopes.some(scope => !available.has(scope))) { setValidation("Enter a name and choose at least one available scope."); return; }
    if (await action.run(async () => { const result = await onCreate({ name: name.trim(), environment, scopes, expiresInDays: expiry }); receive(result.secret); })) { setCreate(false); setName(""); setScopes([]); setValidation(""); }
  }
  async function confirmAction() {
    if (!target || typed !== target.name) return;
    if (await action.run(() => onRevoke(target.id))) { setConfirm(null); setTyped(""); setSecret(null); setNotice(""); }
  }
  async function rotateKey(id: string) {
    await action.run(async () => {
      setRotated(null);
      setRotating(id);
      try {
        const result = await onRotate(id);
        receive(result.secret);
        setRotated(id);
      } finally { setRotating(null); }
    });
  }
  async function copyPrefix(key: ManagedApiKey) {
    await action.run(async () => {
      setCopiedPrefix(null);
      await onCopy(`${key.prefix}••••${key.suffix ?? ""}`);
      setCopiedPrefix(key.id);
    });
  }
  const visible = keys.filter(key => key.environment === tab);
  return <section aria-label="API keys manager" className={cn("w-full bg-background px-4 py-12 text-foreground sm:px-8 sm:py-16", className)}>
    <header className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><h2 className="text-4xl font-medium tracking-tight">API keys</h2><p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">Keys authenticate requests to your API. Scope them tightly and rotate them often.</p></div><Button size="sm" className="h-9 shrink-0 self-start gap-2 px-5 text-sm sm:self-auto" disabled={action.busy} onClick={() => { setEnvironment(tab); setValidation(""); action.clearError(); setCreate(true); }}><Plus className="size-4" />Create key</Button></header>
    <Tabs value={tab} onValueChange={value => setTab(value as "live" | "test")} className="mb-5 w-max"><TabsList aria-label="Key environment" className="w-max bg-muted">{(["live", "test"] as const).map(value => <TabsTrigger key={value} value={value} className="gap-2" indicatorClassName="bg-background">{value === "live" ? "Live" : "Test"}<span aria-live="polite" className="font-mono text-xs text-muted-foreground tabular-nums"><DigitSwap value={keys.filter(key => key.environment === value && key.status !== "revoked").length} direction="down" /></span></TabsTrigger>)}</TabsList></Tabs>
    <div className="overflow-hidden rounded-3xl border border-border"><table className="w-full text-left text-sm"><caption className="sr-only">API keys</caption><thead><tr className="border-b border-border text-xs font-normal text-muted-foreground">{["Name", "Scopes", "Created", "Last used", "Requests · 7d", "Status", "Actions"].map(label => <th key={label} className={cn("px-3 py-3 font-normal", label === "Name" && "pl-5", label === "Scopes" && "hidden lg:table-cell", label === "Created" && "hidden xl:table-cell", label === "Last used" && "hidden md:table-cell", (label === "Requests · 7d" || label === "Status") && "hidden sm:table-cell", label === "Actions" && "pr-5 text-right")}>{label === "Actions" ? <span className="sr-only">Actions</span> : label}</th>)}</tr></thead><tbody>{visible.map(key => { const series = key.requests?.length ? key.requests : [0, 0, 0, 0, 0, 0, 0]; const minimum = Math.min(...series); const range = Math.max(1, Math.max(...series) - minimum); const total = series.reduce((sum, value) => sum + value, 0); const status = <span className={cn("inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs", key.status === "active" ? key.expiresSoon ? "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-rose-500/20 bg-rose-500/10 text-rose-500")}><span className="size-1.5 rounded-full bg-current" />{key.status === "active" ? key.expiresSoon ? "Expires soon" : "Active" : key.status === "expired" ? "Expired" : "Revoked"}</span>; return <tr key={key.id} className="border-b border-border last:border-0"><th scope="row" className="py-4 pl-5 pr-3 text-left font-normal"><div className="group relative min-h-[25px]"><p className={cn("font-medium", key.status === "revoked" && "line-through text-muted-foreground")}>{key.name}</p><Button size="icon" variant="ghost" className="absolute right-0 top-0 size-5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100" aria-label={`Rename ${key.name}`} disabled={action.busy} onClick={() => { setEditing(key.id); setRename(key.name); }}><Pencil className="size-3" /></Button></div><div className="mt-1 flex items-center gap-1.5"><motion.code key={key.prefix} initial={reduce ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-muted-foreground">{key.prefix}••••{key.suffix ?? ""}</motion.code><Button size="icon" variant="ghost" className="size-7 rounded-full hover:bg-primary/5" aria-label={copiedPrefix === key.id ? "Copied" : `Copy key prefix, ${key.name}`} disabled={action.busy} onClick={() => { void copyPrefix(key); }}><ActionSwapIcon value={copiedPrefix === key.id ? "copied" : "idle"} className="size-3.5">{copiedPrefix === key.id ? <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-3.5" />}</ActionSwapIcon></Button></div><div className="mt-2 sm:hidden">{status}</div></th><td className="hidden max-w-[220px] px-3 py-4 lg:table-cell"><div className="flex flex-wrap gap-1">{key.scopes.slice(0, 2).map(scope => <span key={scope} className="rounded-full bg-muted/40 px-2 py-1 font-mono text-xs text-muted-foreground">{scope}</span>)}{key.scopes.length > 2 && <span className="px-1 py-1 text-[10px] text-muted-foreground">+{key.scopes.length - 2}</span>}</div></td><td className="hidden whitespace-nowrap px-3 py-4 text-muted-foreground xl:table-cell">{key.createdAt ?? "—"}</td><td className="hidden whitespace-nowrap px-3 py-4 md:table-cell">{key.lastUsed ?? "Never used"}{key.rotatedAt && <p className="mt-1 text-xs text-muted-foreground">Rotated {key.rotatedAt}</p>}</td><td className="hidden px-3 py-4 sm:table-cell"><div className="flex items-center gap-2"><svg width="64" height="24" viewBox="0 0 64 24" role="img" aria-label={`${total} requests in recent periods`} className={cn("shrink-0 overflow-visible", key.status === "revoked" ? "text-muted-foreground/50" : key.expiresSoon ? "text-amber-500" : "text-emerald-500")}><polyline points={series.map((value, index) => `${(index * 64 / Math.max(1, series.length - 1)).toFixed(1)},${(22.25 - (value - minimum) / range * 20.5).toFixed(1)}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg><span className="font-mono text-xs text-muted-foreground">{total >= 10000 ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(total).toLowerCase() : total.toLocaleString("en")}</span></div></td><td className="hidden px-3 py-4 sm:table-cell">{status}</td><td className="py-4 pl-3 pr-5">{key.status === "active" && <div className="flex items-center gap-1"><StatefulButton size="sm" variant="outline" className="h-9 px-3 leading-none hover:bg-primary/5 [&_.inline-block>span]:align-top" aria-label={`Rotate ${key.name}`} state={rotating === key.id ? "loading" : rotated === key.id ? "success" : "idle"} loadingText="Rotating" successText="Rotated" disabled={action.busy} onClick={() => { void rotateKey(key.id); }}><span className="flex items-center gap-1.5 leading-none"><RotateCw className="size-3.5" /><span className="hidden sm:inline">Rotate</span></span></StatefulButton><Button size="icon" variant="ghost" className="size-9 rounded-full text-muted-foreground hover:bg-primary/5" aria-label={`Revoke ${key.name}`} disabled={action.busy} onClick={() => { setConfirm(key.id); setTyped(""); action.clearError(); }}><Ban className="size-4" /></Button></div>}{key.status === "revoked" && key.revokedAt && <p className="whitespace-nowrap text-right text-xs text-muted-foreground">{key.revokedAt}</p>}</td></tr>; })}</tbody></table></div>
    {!visible.length && <p className="py-8 text-center text-sm text-muted-foreground">No {tab} API keys. Create a scoped key to begin.</p>}
    {!create && secret === null && !target && !editing && <DecisionFeedback {...action} />}
    <DecisionDialog className="max-h-[calc(100dvh-2rem)] max-w-xl w-[calc(100vw-2rem)] rounded-3xl p-0" initialFocus={secret !== null ? "panel" : "first-control"} radius={24} showCloseButton={false} backdropClassName="bg-foreground/10 backdrop-blur-xl" open={create || secret !== null} onOpenChange={open => { if (!open) { setCreate(false); setSecret(null); setNotice(""); action.clearError(); } }} title={secret !== null ? "Save your secret key" : "Create an API key"} busy={action.busy}>{secret !== null ? <div className="p-6"><span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground"><KeyRound className="size-4" /></span><h3 className="mt-4 text-xl font-medium">Save your secret key</h3><p className="mt-1 text-sm text-muted-foreground">Store it in your secrets manager now.</p><div className="mt-5 flex items-start gap-2 rounded-2xl border border-border bg-background p-2 pl-4"><motion.code key={secret} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }} className="min-w-0 flex-1 break-all py-1.5 font-mono text-sm leading-6">{secret}</motion.code><Button variant="outline" size="sm" className="h-9 shrink-0 px-3 hover:bg-primary/5" disabled={action.busy} aria-label={notice === "Secret copied." ? "Secret copied" : "Copy secret"} onClick={async () => { if (secret === null) return; setNotice(""); if (await action.run(() => onCopy(secret))) setNotice("Secret copied."); }}><ActionSwapIcon value={notice === "Secret copied." ? "copied" : "idle"} className="size-4">{notice === "Secret copied." ? <Check className="size-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="size-4" />}</ActionSwapIcon><ActionSwapText value={notice === "Secret copied." ? "copied" : "idle"}>{notice === "Secret copied." ? "Secret copied" : "Copy secret"}</ActionSwapText></Button></div><p role="note" className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300"><TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />You won&apos;t see this secret again. If you lose it, rotate the key to get a new one.</p><DecisionFeedback {...action} />{notice && <p role="status" className="sr-only">{notice}</p>}<div className="mt-6 flex justify-end"><Button className="h-9" disabled={action.busy} onClick={() => { setSecret(null); setNotice(""); action.clearError(); }}>I&apos;ve saved it</Button></div></div> : <section aria-label="API key creation settings" className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><form className="p-6" onSubmit={event => { event.preventDefault(); void createKey(); }}><header><div className="flex items-center gap-2"><h3 className="text-xl font-medium">Create an API key</h3><span className="inline-flex h-6 items-center rounded-full border border-border px-2 font-mono text-xs capitalize text-muted-foreground">{environment}</span></div><p className="mt-1 text-sm text-muted-foreground">Pick a name you will recognise later and only the scopes it needs.</p></header><div className="mt-6 grid gap-5"><div className="grid gap-4 sm:grid-cols-[1fr_10rem]"><Input autoFocus classNames={{ field: "h-10 ring-0 has-[:focus]:border-muted-foreground/40", input: "text-sm leading-6" }} label="Key name" value={name} onChange={setName} disabled={action.busy} placeholder="Ingest worker" /><div className="flex flex-col gap-1.5"><span className="px-1 text-sm font-medium">Expires</span><Select value={String(expiry)} onValueChange={value => setExpiry(Number(value))} disabled={action.busy}><SelectTrigger aria-label="Expires" className="h-10 w-full rounded-full"><SelectValue /></SelectTrigger><SelectContent>{[7, 30, 90, 365].map(days => <SelectItem key={days} value={String(days)}>{`In ${days} days`}</SelectItem>)}</SelectContent></Select></div></div><fieldset><legend className="px-1 text-sm font-medium">Scopes</legend><ul className="mt-1.5 divide-y divide-border rounded-2xl border border-border">{scopeGroups.map(group => <li key={group.label} className="flex items-center justify-between gap-4 px-4 py-3"><div className="min-w-0"><p className="text-sm font-medium">{group.label}</p>{group.description && <p className="truncate text-xs text-muted-foreground">{group.description}</p>}</div><div className="flex shrink-0 items-center gap-4">{group.scopes.map(scope => <Checkbox key={scope.value} className="min-h-10 gap-2" aria-label={`${group.label} ${scope.label.toLowerCase()}`} disabled={action.busy} label={scope.label} checked={scopes.includes(scope.value)} onCheckedChange={checked => setScopes(previous => checked ? [...previous, scope.value] : previous.filter(item => item !== scope.value))} />)}</div></li>)}</ul></fieldset></div>{validation && <p role="alert" className="mt-3 text-sm text-destructive">{validation}</p>}<DecisionFeedback {...action} /><footer className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="ghost" className="h-9 px-5 text-sm" disabled={action.busy} onClick={() => setCreate(false)}>Cancel</Button><Button type="submit" className="h-9 px-5 text-sm" disabled={action.busy}>Create key</Button></footer></form></section>}</DecisionDialog>
    <DecisionDialog open={Boolean(editing)} onOpenChange={open => { if (!open) setEditing(null); }} title="Rename API key" busy={action.busy}><form className="space-y-4" onSubmit={event => { event.preventDefault(); if (editing && rename.trim()) void action.run(() => onRename(editing, rename.trim())).then(ok => { if (ok) setEditing(null); }); }}><h3 className="text-lg font-semibold">Rename API key</h3><Input label="New key name" value={rename} onChange={setRename} disabled={action.busy} /><Button type="submit" disabled={action.busy || !rename.trim()}>Save name</Button><DecisionFeedback {...action} /></form></DecisionDialog>
    <DecisionDialog open={Boolean(target)} onOpenChange={open => { if (!open) { setConfirm(null); action.clearError(); } }} title="Revoke this key?" busy={action.busy} className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md rounded-3xl" radius={24} showCloseButton={false} backdropClassName="bg-foreground/10 backdrop-blur-xl">{target && <form noValidate onSubmit={event => { event.preventDefault(); void confirmAction(); }}><span className="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground"><Ban className="size-4" /></span><h3 className="mt-4 text-xl font-medium">Revoke this key?</h3><p className="mt-1 text-sm text-muted-foreground">Requests using this key will fail immediately. This can&apos;t be undone.</p><div className="mt-5 rounded-2xl border border-border px-4 py-3"><p className="text-sm font-medium">{target.name}</p><p className="mt-0.5 font-mono text-xs text-muted-foreground">{target.prefix}••••{target.suffix ?? ""}</p></div><div className="mt-5"><Input classNames={{ field: "h-10 ring-0 has-[:focus]:border-muted-foreground/40", input: "text-sm leading-6" }} autoFocus label="Type the key name to confirm" placeholder={target.name} autoComplete="off" spellCheck={false} value={typed} onChange={setTyped} disabled={action.busy} /></div><div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button type="button" variant="ghost" className="h-9 rounded-full text-muted-foreground" disabled={action.busy} onClick={() => { setConfirm(null); action.clearError(); }}>Cancel</Button><Button type="submit" className="h-9 rounded-full" aria-busy={action.busy} disabled={action.busy || typed !== target.name}>Revoke</Button></div><DecisionFeedback {...action} /></form>}</DecisionDialog>
  </section>;
}
