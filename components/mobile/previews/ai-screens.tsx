"use client";

import {
  ArrowUp,
  Bot,
  Check,
  ChevronRight,
  CircleDashed,
  Clock,
  FileCode2,
  GitBranch,
  Globe,
  ImagePlus,
  Mic,
  MicOff,
  Search,
  Sparkles,
  Volume2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, damping: 24, stiffness: 320 };

export function PromptComposerPreview() {
  const [text, setText] = useState("Audit the checkout flow for contrast issues");
  const [webOn, setWebOn] = useState(true);
  const [hasAttachment, setHasAttachment] = useState(true);
  const [messages, setMessages] = useState([
    "Refactor auth middleware into composable helpers.",
  ]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev.slice(-2), trimmed]);
    setText("");
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-3.5 pt-2 pb-4">
      <div className="space-y-2.5">
        <div className="rounded-2xl border border-border bg-card p-3">
          <p className="text-[11px] font-medium text-muted-foreground">Assistant</p>
          <p className="mt-1 text-xs leading-relaxed text-foreground">
            Ready when you are. Drop a screenshot or enable Web tools.
          </p>
        </div>
        {messages.map((msg) => (
          <div
            key={msg}
            className="ml-6 rounded-2xl bg-primary px-3 py-2 text-xs text-primary-foreground"
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-3 shadow-sm">
        {hasAttachment ? (
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-xl bg-muted px-2.5 py-1 text-[10px] font-medium text-foreground">
            <ImagePlus aria-hidden="true" className="size-3" />
            <span>checkout-shot.png</span>
            <button
              type="button"
              onClick={() => setHasAttachment(false)}
              aria-label="Remove attachment"
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        ) : null}

        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message agent..."
          aria-label="Prompt composer"
          className="w-full resize-none bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setWebOn((v) => !v)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors",
                webOn
                  ? "bg-primary/15 text-primary"
                  : "border border-border text-muted-foreground",
              )}
            >
              <Globe aria-hidden="true" className="size-3" />
              <span>Web</span>
            </button>
            <button
              type="button"
              onClick={() => setHasAttachment(true)}
              aria-label="Attach image"
              className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            >
              <ImagePlus aria-hidden="true" className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Hold to dictate"
              className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
            >
              <Mic aria-hidden="true" className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={send}
            aria-label="Send prompt"
            className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
          >
            <ArrowUp aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ModelPickerMobilePreview() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("sonnet");
  const [effort, setEffort] = useState<"Low" | "Med" | "High">("High");

  const models = [
    { id: "opus", name: "Claude Opus 4.1", tag: "Deep reasoning", speed: "Medium" },
    { id: "sonnet", name: "Claude Sonnet 4.5", tag: "Balanced coding", speed: "Fast" },
    { id: "gpt5", name: "GPT-5 Mini", tag: "Quick drafts", speed: "Instant" },
    { id: "gemini", name: "Gemini 2.5", tag: "Long context", speed: "Fast" },
  ].filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Select model</h3>
        <span className="font-mono text-[10px] text-muted-foreground">Effort: {effort}</span>
      </div>

      <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2">
        <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search models..."
          aria-label="Search models"
          className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-2.5 flex gap-1 rounded-xl bg-muted p-1">
        {(["Low", "Med", "High"] as const).map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => setEffort(lvl)}
            className={cn(
              "flex-1 rounded-lg py-1 text-[11px] font-medium",
              effort === lvl ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {lvl} effort
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-1.5">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => setSelected(model.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-left transition-colors",
              selected === model.id
                ? "border-primary/40 bg-card"
                : "border-border bg-card/50",
            )}
          >
            <div>
              <p className="text-xs font-medium text-foreground">{model.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {model.tag} · {model.speed}
              </p>
            </div>
            {selected === model.id ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check aria-hidden="true" className="size-3" />
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

export function VoiceModePreview() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"Listening" | "Thinking" | "Speaking">("Listening");
  const [muted, setMuted] = useState(false);

  const captions: Record<typeof phase, string> = {
    Listening: "Tell me which endpoints still need schema validation...",
    Thinking: "Checking app/r/[slug] and webhook payload types...",
    Speaking: "All seven API handlers match the strict contract.",
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-5 pt-4 pb-5 text-center">
      <span className="rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {muted ? "Microphone muted" : phase}
      </span>

      <div className="relative flex items-center justify-center">
        <motion.div
          animate={
            reduce || muted
              ? { scale: 1 }
              : {
                  scale: phase === "Speaking" ? [1, 1.12, 1] : [1, 1.05, 1],
                }
          }
          transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="flex size-36 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 p-1 shadow-lg"
        >
          <div className="flex size-full items-center justify-center rounded-full bg-black/25 backdrop-blur-sm">
            <Volume2 aria-hidden="true" className="size-8 text-white" />
          </div>
        </motion.div>
      </div>

      <p className="min-h-10 text-xs leading-relaxed text-foreground/90">
        {captions[phase]}
      </p>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground"
        >
          {muted ? <MicOff aria-hidden="true" className="size-4" /> : <Mic aria-hidden="true" className="size-4" />}
        </button>
        {(["Listening", "Thinking", "Speaking"] as const).map((next) => (
          <button
            key={next}
            type="button"
            onClick={() => setPhase(next)}
            className={cn(
              "rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors",
              phase === next
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground",
            )}
          >
            {next}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AgentInboxPreview() {
  const [tab, setTab] = useState<"active" | "done">("active");
  const [selectedId, setSelectedId] = useState("a1");

  const tasks = [
    { id: "a1", title: "Migrate navigation tokens", status: "active", pct: 72, branch: "feat/nav-tokens" },
    { id: "a2", title: "Audit registry snapshots", status: "active", pct: 35, branch: "chore/registry" },
    { id: "a3", title: "Fix dark-mode focus rings", status: "done", pct: 100, branch: "fix/a11y-rings" },
  ].filter((t) => t.status === tab);

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Agent inbox</h3>
        <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-medium text-primary">
          2 running
        </span>
      </div>

      <div className="mt-2.5 flex gap-1 rounded-xl bg-muted p-1">
        {(["active", "done"] as const).map((next) => (
          <button
            key={next}
            type="button"
            onClick={() => setTab(next)}
            className={cn(
              "flex-1 rounded-lg py-1 text-[11px] font-medium capitalize",
              tab === next ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {next === "active" ? "In progress" : "Ready for review"}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {tasks.map((task) => (
          <button
            key={task.id}
            type="button"
            onClick={() => setSelectedId(task.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border p-3 text-left transition-colors",
              selectedId === task.id ? "border-primary/40 bg-card" : "border-border bg-card/60",
            )}
          >
            <div className="min-w-0 pr-2">
              <p className="truncate text-xs font-medium text-foreground">{task.title}</p>
              <p className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <GitBranch aria-hidden="true" className="size-3" />
                <span>{task.branch}</span>
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-primary tabular-nums">
              {task.pct}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AgentRunPreview() {
  const [step, setStep] = useState(2);
  const steps = [
    { label: "Read repository structure", detail: "18 files indexed" },
    { label: "Update theme variables", detail: "+42 / -11 lines" },
    { label: "Run typecheck & lint", detail: "0 errors in 1.4s" },
    { label: "Prepare PR #184", detail: "Waiting approval" },
  ];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground">RUN #842</p>
            <h3 className="text-sm font-semibold text-foreground">Refresh card shadow tokens</h3>
          </div>
          <Bot aria-hidden="true" className="size-4 text-primary" />
        </div>

        <div className="mt-3 space-y-2">
          {steps.map((item, idx) => {
            const done = idx <= step;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setStep(idx)}
                className="flex w-full items-start gap-2.5 rounded-2xl border border-border bg-card px-3 py-2.5 text-left"
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                    done ? "bg-emerald-500/20 text-emerald-500" : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check aria-hidden="true" className="size-3" /> : <Clock aria-hidden="true" className="size-3" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.detail}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setStep((s) => (s + 1) % steps.length)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        Advance run step ({step + 1}/{steps.length})
      </button>
    </div>
  );
}

export function ParallelAgentsPreview() {
  const [merged, setMerged] = useState(false);
  const workers = [
    { name: "Explorer", task: "Mapped 24 routes", status: "Done" },
    { name: "Builder", task: "Drafted 3 UI views", status: "Done" },
    { name: "Verifier", task: "Checked a11y + contrast", status: merged ? "Merged" : "Ready" },
  ];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Parallel Swarm</h3>
          <span className="font-mono text-[10px] text-emerald-500">3/3 online</span>
        </div>

        <div className="mt-3 space-y-2">
          {workers.map((worker) => (
            <div
              key={worker.name}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2.5"
            >
              <div>
                <p className="text-xs font-semibold text-foreground">{worker.name}</p>
                <p className="text-[10px] text-muted-foreground">{worker.task}</p>
              </div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                {worker.status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-dashed border-border bg-card/50 p-3">
          <p className="text-[11px] font-medium text-foreground">
            {merged ? "Unified plan ready to apply" : "Convergence queue"}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {merged ? "All 3 diffs verified without conflicts." : "Waiting to merge worker outputs."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setMerged((m) => !m)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {merged ? "Reset merge" : "Merge worker plans"}
      </button>
    </div>
  );
}

export function DeepResearchPreview() {
  const [sourceIndex, setSourceIndex] = useState(0);
  const sources = [
    { domain: "reactnative.dev", title: "New Architecture Benchmarks" },
    { domain: "docs.swmansion.com", title: "Reanimated Worklets v4" },
    { domain: "expo.dev", title: "SDK Router Static Exports" },
  ];

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
        <Sparkles aria-hidden="true" className="size-3 text-primary" />
        Deep Research · 14 sources
      </span>
      <h3 className="mt-2.5 text-sm font-semibold leading-snug text-foreground">
        React Native Fabric performance report
      </h3>

      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
        {sources.map((src, idx) => (
          <button
            key={src.domain}
            type="button"
            onClick={() => setSourceIndex(idx)}
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors",
              sourceIndex === idx
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            [{idx + 1}] {src.domain}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card p-3.5">
        <p className="text-[11px] font-semibold text-foreground">
          Source [{sourceIndex + 1}]: {sources[sourceIndex]?.title}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Synchronous JSI bindings cut bridge serialization overhead by up to 62% during gesture-driven list scrolling [{sourceIndex + 1}].
        </p>
      </div>
    </div>
  );
}

export function AgentQuestionnairePreview() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(["Expo SDK 53", "Passkeys + OAuth", "Edge US-East"]);

  const questions = [
    { prompt: "Which runtime should we target?", opts: ["Expo SDK 53", "Bare React Native", "Expo Router"] },
    { prompt: "Preferred sign-in flow?", opts: ["Passkeys + OAuth", "Email magic link", "Phone SMS"] },
    { prompt: "Primary deploy region?", opts: ["Edge US-East", "EU-Central", "Multi-region"] },
  ];

  const current = questions[step] ?? questions[0];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Setup check</span>
          <span className="font-mono tabular-nums">
            {step + 1} / {questions.length}
          </span>
        </div>

        <div className="mt-2 flex gap-1">
          {questions.map((q, idx) => (
            <span
              key={q.prompt}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                idx <= step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        <h3 className="mt-4 text-sm font-semibold text-foreground">{current.prompt}</h3>

        <div className="mt-3 space-y-2">
          {current.opts.map((opt) => {
            const active = answers[step] === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() =>
                  setAnswers((prev) => prev.map((a, i) => (i === step ? opt : a)))
                }
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl border px-3.5 py-2.5 text-left text-xs font-medium",
                  active ? "border-primary bg-card text-foreground" : "border-border bg-card/50 text-muted-foreground",
                )}
              >
                <span>{opt}</span>
                {active ? <Check aria-hidden="true" className="size-3.5 text-primary" /> : <ChevronRight aria-hidden="true" className="size-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setStep((s) => (s + 1) % questions.length)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {step === questions.length - 1 ? "Confirm & restart demo" : "Next question"}
      </button>
    </div>
  );
}

export function UsageBudgetMobilePreview() {
  const [alertOn, setAlertOn] = useState(true);
  const bars = [
    { id: "mon", day: "M", h: 32 },
    { id: "tue", day: "T", h: 48 },
    { id: "wed", day: "W", h: 64 },
    { id: "thu", day: "T", h: 42 },
    { id: "fri", day: "F", h: 78 },
    { id: "sat", day: "S", h: 28 },
    { id: "sun", day: "S", h: 52 },
  ];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Usage budget</h3>
        <div className="mt-3 rounded-3xl border border-border bg-card p-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">
              $14.20
            </span>
            <span className="font-mono text-xs text-muted-foreground">/ $50.00 cap</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[28%] rounded-full bg-primary" />
          </div>

          <div className="mt-4 flex h-16 items-end justify-between gap-1.5">
            {bars.map((bar) => (
              <div key={bar.id} className="flex flex-1 flex-col items-center gap-1">
                <div style={{ height: `${bar.h}%` }} className="w-full rounded-t-md bg-primary/70" />
                <span className="font-mono text-[9px] text-muted-foreground">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAlertOn((a) => !a)}
        className="flex items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-2.5 text-xs font-medium text-foreground"
      >
        <span>Notify at 80% spend</span>
        <span
          className={cn(
            "h-5 w-9 rounded-full p-0.5 transition-colors",
            alertOn ? "bg-primary" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "block size-4 rounded-full bg-white transition-transform",
              alertOn ? "translate-x-4" : "translate-x-0",
            )}
          />
        </span>
      </button>
    </div>
  );
}

export function ContextUsageMobilePreview() {
  const [compacted, setCompacted] = useState(false);

  const items = [
    { label: "System rules", pct: compacted ? 12 : 14, color: "bg-sky-500" },
    { label: "Repo files", pct: compacted ? 18 : 38, color: "bg-emerald-500" },
    { label: "Tool output", pct: compacted ? 9 : 22, color: "bg-amber-500" },
  ];

  const totalUsed = items.reduce((s, x) => s + x.pct, 0);

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Context window</h3>
          <span className="font-mono text-xs font-medium text-foreground tabular-nums">
            {totalUsed}% used
          </span>
        </div>

        <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-muted">
          {items.map((item) => (
            <motion.div
              key={item.label}
              animate={{ width: `${item.pct}%` }}
              transition={SPRING}
              className={item.color}
            />
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full", item.color)} />
                <FileCode2 aria-hidden="true" className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </div>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {item.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCompacted((c) => !c)}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        <CircleDashed aria-hidden="true" className="size-3.5" />
        <span>{compacted ? "Restore full context" : "Compact thread memory"}</span>
      </button>
    </div>
  );
}
