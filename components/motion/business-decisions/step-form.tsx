"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/motion/button";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { DecisionFeedback, useDecisionAction } from "./decision-support";
import { QuestionField, questionError, validQuestionAnswers, type DecisionQuestion, type QuestionAnswers } from "./questionnaire";

export interface DecisionFormStep { id: string; title: string; description?: string; eyebrow?: string; fields: DecisionQuestion[]; when?: (answers: QuestionAnswers) => boolean; columns?: 1 | 2 }
export interface StepFormProps {
  steps: DecisionFormStep[]; answers?: QuestionAnswers; defaultAnswers?: QuestionAnswers;
  onAnswersChange?: (answers: QuestionAnswers) => void; onSubmit: (answers: QuestionAnswers) => void | Promise<void>;
  variant?: "focused" | "stack" | "inline" | "onboarding";
  stepId?: string; defaultStepId?: string; onStepChange?: (id: string) => void;
  title?: string; submitLabel?: string; className?: string; progressStyle?: "steps" | "compact";
}
/** All four presentations share one answer model. Hidden branch answers are excluded on submit. */
export function StepForm({ steps, answers, defaultAnswers = {}, onAnswersChange, onSubmit, variant = "focused", stepId, defaultStepId, onStepChange, title = "Build your brief", submitLabel = "Submit brief", className, progressStyle = "steps" }: StepFormProps) {
  const [internal, setInternal] = useState(defaultAnswers);
  const [internalId, setInternalId] = useState(defaultStepId ?? steps[0]?.id ?? "");
  const [attempted, setAttempted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [direction, setDirection] = useState(1);
  const heading = useRef<HTMLHeadingElement>(null);
  const action = useDecisionAction();
  const reduce = useReducedMotion();
  const values = answers ?? internal;
  const active = steps.filter(item => !item.when || item.when(values));
  const index = Math.max(0, active.findIndex(item => item.id === (stepId ?? internalId)));
  const current = active[index];
  const previousStep = useRef(current?.id);
  useEffect(() => { if (previousStep.current !== current?.id) { previousStep.current = current?.id; heading.current?.focus(); } }, [current?.id]);
  const change = (next: QuestionAnswers) => { if (answers === undefined) setInternal(next); onAnswersChange?.(next); setComplete(false); };
  const navigate = (position: number) => { const next = active[position]; if (!next) return; setDirection(position < index ? -1 : 1); if (stepId === undefined) setInternalId(next.id); onStepChange?.(next.id); setAttempted(false); action.clearError(); };
  async function advance() {
    if (!current) return;
    setAttempted(true);
    if (current.fields.some(field => questionError(field, values))) return;
    if (index < active.length - 1) { navigate(index + 1); return; }
    const invalid = active.findIndex(item => item.fields.some(field => questionError(field, values)));
    if (invalid >= 0) { navigate(invalid); setAttempted(true); return; }
    if (await action.run(() => onSubmit(validQuestionAnswers(active.flatMap(item => item.fields), values)))) setComplete(true);
  }
  function restart() {
    const first = steps.find(item => !item.when || item.when({}));
    change({});
    setDirection(-1);
    setAttempted(false);
    action.clearError();
    if (first) { if (stepId === undefined) setInternalId(first.id); onStepChange?.(first.id); }
  }
  const progress = <ol aria-label="Form progress" data-progress-style={variant === "onboarding" ? progressStyle : undefined} className={variant === "onboarding" ? progressStyle === "steps" ? "mt-6 grid gap-3 overflow-x-auto pb-1" : "mt-6 grid gap-2" : "flex w-full gap-2"} style={variant === "onboarding" ? { gridTemplateColumns: `repeat(${active.length}, minmax(${progressStyle === "steps" ? "5rem" : "0px"}, 1fr))` } : undefined}>
    {active.map((item, position) => <li key={item.id} aria-current={position === index ? "step" : undefined} aria-label={item.eyebrow ?? item.title} className={variant === "onboarding" ? "min-w-0" : "flex-1 text-xs"}>
      {variant === "onboarding" && progressStyle === "steps" ? <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-2.5"><span className={cn("grid size-7 shrink-0 place-items-center rounded-full border text-xs font-medium transition-colors", position === index ? "border-foreground bg-foreground text-background" : position < index ? "border-border bg-muted text-foreground" : "border-border/70 text-muted-foreground")}>{position < index ? <Check aria-hidden className="size-3" /> : position + 1}</span><span className={cn("truncate text-xs transition-colors", position === index ? "font-medium text-foreground" : "text-muted-foreground")}>{item.eyebrow ?? item.title}</span>{position < active.length - 1 && <div aria-hidden className="relative ml-1 hidden h-px min-w-2 flex-1 overflow-hidden bg-border/60 sm:block"><motion.div className="absolute inset-0 origin-left bg-foreground/40" initial={false} animate={{ scaleX: position < index ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }} /></div>}</div> : <span aria-hidden className={cn("block overflow-hidden rounded-full bg-muted", variant === "onboarding" ? "h-1.5" : "h-1")}><motion.span initial={false} animate={{ scaleX: position <= index ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }} className="block h-full origin-left rounded-full bg-foreground" /></span>}
      <span className="sr-only">{item.title}</span>
    </li>)}
  </ol>;
  return <section data-variant={variant} className={cn("relative isolate mx-auto min-w-0 w-full text-foreground", variant === "onboarding" ? "max-w-3xl rounded-2xl border border-border/55 bg-background" : variant === "inline" ? "max-w-2xl py-6 sm:px-9 sm:py-8" : variant === "stack" ? "mb-4 max-w-lg rounded-2xl border border-border/60 bg-background" : "max-w-xl overflow-hidden rounded-xl border border-border/60 bg-background", className)} aria-label={title}>
    {variant === "stack" && <><div aria-hidden="true" className="pointer-events-none absolute -bottom-2 inset-x-4 top-2 -z-10 rounded-2xl bg-muted/55" /><div aria-hidden="true" className="pointer-events-none absolute -bottom-4 inset-x-8 top-4 -z-20 rounded-2xl bg-muted/30" /><div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl bg-background" /></>}
    <header className={cn(variant === "focused" && "border-b border-border/50 px-5 py-4 sm:px-7", variant === "stack" && "px-5 pt-5 sm:px-7", variant === "onboarding" && "border-b border-border/45 px-5 py-5 sm:px-8")}>
      {variant === "onboarding" ? <><div className="flex items-center justify-between gap-6"><div><h2 className="text-sm font-medium tracking-tight">{title}</h2><p className="mt-0.5 text-xs text-muted-foreground">Usually takes less than two minutes</p></div>{!complete && <span className="shrink-0 rounded-full border border-border/60 px-2.5 py-1 font-mono text-xs tabular-nums text-muted-foreground">{index + 1} / {active.length}</span>}</div>{!complete && progress}</> : variant === "inline" ? <div className="flex items-center justify-between"><h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{title}</h2><div aria-hidden className="flex gap-1.5">{active.map((item, position) => <span key={item.id} className={cn("size-1.5 rounded-full", complete || position === index ? "bg-foreground" : "bg-muted-foreground/20")} />)}</div></div> : <div className="flex items-center justify-between gap-5">{variant === "focused" ? <div className="w-[152px]">{progress}</div> : <Button type="button" size="icon" variant="ghost" className="-ml-2 size-9" aria-label="Previous step" disabled={complete || index === 0 || action.busy} onClick={() => navigate(index - 1)}><ArrowLeft className="size-4" /></Button>}<span className="shrink-0 font-mono text-xs text-muted-foreground">{complete ? variant === "stack" ? "Complete" : "Done" : variant === "stack" ? `${index + 1} of ${active.length}` : `${String(index + 1).padStart(2, "0")} / ${String(active.length).padStart(2, "0")}`}</span></div>}
    </header>
    {complete ? <div role="status" className={cn("text-center", variant === "focused" ? "px-5 py-10 sm:px-10 sm:py-12" : variant === "stack" ? "px-6 pb-10 pt-8 sm:px-9" : variant === "inline" ? "py-10" : "px-6 py-16 sm:px-10 sm:py-20")}><span aria-hidden className={cn("mx-auto grid place-items-center rounded-full", variant === "focused" ? "size-12 border border-foreground text-foreground" : "bg-foreground text-background", variant === "inline" ? "size-10" : variant !== "focused" && "size-11")}><Check className={variant === "focused" ? "size-6" : variant === "inline" ? "size-4" : "size-5"} /></span><h3 className={cn("text-xl font-medium tracking-tight", variant === "inline" ? "mt-4" : "mt-5")}>{variant === "focused" ? "Your plan is ready." : variant === "stack" ? "Brief received." : variant === "inline" ? "That is everything." : "Your workspace is ready."}</h3><p className={cn("mt-2 text-sm text-muted-foreground", variant !== "inline" && "mx-auto max-w-sm leading-6")}>{variant === "focused" ? "We saved your answers and prepared the next steps." : variant === "stack" ? "We will review the details and follow up shortly." : variant === "inline" ? "Your answers are ready for the next step." : "Everything is set up. You can start inviting your team."}</p><Button size="sm" variant="ghost" className={cn("h-9 gap-1.5 px-3 text-xs", variant === "focused" ? "mt-6" : "mt-5")} onClick={restart}>{variant !== "inline" && <RotateCcw aria-hidden className="size-3.5" />}Start again</Button></div> : current ? <form noValidate onSubmit={event => { event.preventDefault(); void advance(); }} aria-busy={action.busy} className={cn("[&_fieldset]:space-y-0", variant === "focused" ? "px-5 py-7 sm:px-10 sm:py-9" : variant === "stack" ? "px-6 py-7 sm:px-9 sm:pb-9" : variant === "inline" ? "pb-2 pt-10" : "px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9")}>
      <motion.div key={current.id} initial={reduce ? false : { opacity: 0, x: variant === "focused" ? direction * 24 : 0, y: variant === "focused" ? 0 : direction * 16, rotate: variant === "stack" ? direction * 1.2 : 0 }} animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }} transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }}>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{current.eyebrow ?? current.id}</p><div className={variant === "stack" || variant === "inline" || variant === "onboarding" ? "mt-2" : "mt-3"}><h3 ref={heading} tabIndex={-1} className={cn("text-xl font-medium tracking-tight outline-none", variant === "focused" && "sm:leading-9")}>{current.title}</h3>{current.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{current.description}</p>}</div>
        <div className={cn("grid gap-5", variant !== "onboarding" && "[&_fieldset]:grid", variant !== "onboarding" && "[&_fieldset]:gap-0", (variant === "focused" || variant === "stack") && "[&_fieldset:has([aria-pressed])]:gap-2", (variant === "focused" || variant === "stack") && "[&_input]:px-4 [&_input]:text-base [&_input]:placeholder:text-muted-foreground/65", variant === "inline" && "min-h-24 items-start [&_input]:placeholder:text-muted-foreground/55", variant === "focused" ? "mt-7" : variant === "inline" ? "mt-8" : "mt-6", variant === "onboarding" && "mt-7 gap-x-4 gap-y-5 [&_legend]:mb-2 [&_legend]:text-xs [&_[data-field-error]]:min-h-5 [&_[data-field-error]]:pt-1", variant === "onboarding" && current.columns !== 1 && "sm:grid-cols-2")}>
          {current.fields.map(field => <QuestionField key={field.id} question={field.options && variant !== "onboarding" ? { ...field, presentation: variant === "inline" ? "pills" : "cards" } : field} answers={values} onChange={change} disabled={action.busy} error={attempted ? questionError(field, values, variant === "onboarding" ? "This is required." : "Please complete this step.") : undefined} hideLabel={variant !== "onboarding" && current.fields.length === 1} showRequiredMarker={variant === "onboarding"} reserveError />)}
        </div>
      </motion.div>
      <div className={cn("flex items-center gap-3 [&_button]:h-9 [&_button[type=submit]]:text-sm", variant === "inline" ? "mt-3" : variant === "onboarding" ? "mt-2" : variant === "stack" ? "mt-3" : "mt-5")}>{variant !== "stack" && <Button type="button" size="sm" variant="ghost" className={cn("-ml-3 text-muted-foreground", variant === "focused" ? "gap-2 px-5 text-sm" : "gap-1.5 text-xs")} disabled={index === 0 || action.busy} onClick={() => navigate(index - 1)}><ArrowLeft className={variant === "focused" ? "size-4" : "size-3.5"} />Back</Button>}<Button type="submit" size="sm" className="ml-auto gap-2 px-5" disabled={action.busy}>{index === active.length - 1 ? submitLabel : variant === "stack" ? "Next" : "Continue"}<ArrowRight className="size-4" /></Button></div>
    </form> : <p role="status">No applicable steps.</p>}
    <DecisionFeedback {...action} />
  </section>;
}
