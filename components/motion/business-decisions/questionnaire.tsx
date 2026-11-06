"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Check, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/motion/button";
import { Checkbox } from "@/components/motion/checkbox";
import { Input, type InputClassNames } from "@/components/motion/input";
import { RadioGroup, RadioGroupItem } from "@/components/motion/radio";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/motion/select";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { DecisionFeedback, useDecisionAction } from "./decision-support";

export type QuestionAnswers = Record<string, string | string[]>;
export interface DecisionQuestion {
  id: string; label: string; description?: string; type: "text" | "email" | "textarea" | "single" | "multiple"; placeholder?: string; presentation?: "select" | "pills" | "cards";
  required?: boolean; fullWidth?: boolean; options?: { value: string; label: string; description?: string; disabled?: boolean }[];
  validate?: (value: string | string[], answers: QuestionAnswers) => string | undefined;
}
export function questionError(question: DecisionQuestion, answers: QuestionAnswers, requiredMessage = "Please answer this question.") {
  const value = answers[question.id] ?? (question.type === "multiple" ? [] : "");
  const choices = question.options?.filter(option => !option.disabled).map(option => option.value) ?? [];
  if (question.required && (Array.isArray(value) ? !value.length : !value.trim())) return requiredMessage;
  if (question.type === "multiple" && (!Array.isArray(value) || value.some(item => !choices.includes(item)))) return "Choose valid options.";
  if (question.type === "single" && (typeof value !== "string" || (value !== "" && !choices.includes(value)))) return "Choose a valid option.";
  if ((question.type === "text" || question.type === "email" || question.type === "textarea") && typeof value !== "string") return "Enter a valid response.";
  if (question.type === "email" && typeof value === "string" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  return question.validate?.(value, answers);
}
/** Filters removed/unknown question IDs and disabled choices before host submission. */
export function validQuestionAnswers(questions: DecisionQuestion[], answers: QuestionAnswers): QuestionAnswers {
  return Object.fromEntries(questions.filter(question => !questionError(question, answers)).map(question => [question.id, answers[question.id] ?? (question.type === "multiple" ? [] : "")]));
}
export function QuestionField({ question, answers, onChange, disabled, error, flat = false, hideLabel = false, reserveError = false, showRequiredMarker = false, inputClassNames }: {
  question: DecisionQuestion; answers: QuestionAnswers; onChange: (answers: QuestionAnswers) => void; disabled?: boolean; error?: string; flat?: boolean; hideLabel?: boolean; reserveError?: boolean; showRequiredMarker?: boolean; inputClassNames?: InputClassNames;
}) {
  const id = useId();
  const reduce = useReducedMotion();
  const value = answers[question.id];
  const update = (next: string | string[]) => onChange({ ...answers, [question.id]: next });
  return <fieldset disabled={disabled} className={cn("min-w-0 space-y-3", question.fullWidth && "sm:col-span-2")} aria-describedby={error ? `${id}-error` : undefined} aria-invalid={Boolean(error)}>
    <legend className={hideLabel ? "sr-only" : "mb-3 text-base font-medium"}>{question.label}{showRequiredMarker && question.required && <span aria-hidden className="ml-1 text-muted-foreground">*</span>}</legend>
    {question.description && <p className="text-sm text-muted-foreground">{question.description}</p>}
    {(question.type === "text" || question.type === "email") ? (
      <Input aria-label={question.label} placeholder={question.placeholder ?? "Type your answer..."} value={typeof value === "string" ? value : ""} onChange={update} type={question.type} disabled={disabled} aria-describedby={error ? `${id}-error` : undefined} classNames={{ ...inputClassNames, field: cn("h-10", inputClassNames?.field), input: cn("text-sm leading-6", inputClassNames?.input) }} />
    ) : question.type === "textarea" ? (
      <textarea aria-label={question.label} placeholder={question.placeholder ?? "Type your answer..."} value={typeof value === "string" ? value : ""} onChange={event => update(event.target.value)} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="h-auto min-h-24 w-full resize-none rounded-xl border-0 bg-muted/55 px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:bg-muted focus-visible:ring-2 focus-visible:ring-foreground/10" />
    ) : question.presentation === "select" ? (
      <Select value={typeof value === "string" ? value : ""} onValueChange={update} disabled={disabled}><SelectTrigger aria-label={question.label} className="h-11 w-full rounded-full border-0 bg-muted/55 px-3.5 py-0 text-sm text-foreground shadow-none outline-none transition-colors focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-foreground/10"><SelectValue placeholder={question.placeholder ?? "Select an option"} /></SelectTrigger><SelectContent>{question.options?.map(option => <SelectItem key={option.value} value={option.value} disabled={option.disabled}>{option.label}</SelectItem>)}</SelectContent></Select>
    ) : flat || question.presentation === "pills" || question.presentation === "cards" ? (
      <div className={question.presentation === "pills" ? "flex flex-wrap gap-2" : question.presentation === "cards" ? "grid gap-2" : "grid gap-1"}>{question.options?.map((option, index) => {
        const checked = Array.isArray(value) ? value.includes(option.value) : value === option.value;
        return <button key={option.value} type="button" disabled={disabled || option.disabled} aria-pressed={checked} onKeyDown={event => { if (question.type !== "single" || !["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return; const buttons = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []); const current = buttons.indexOf(event.currentTarget); if (current < 0 || !buttons.length) return; event.preventDefault(); const next = buttons[(current + (event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length]; next.focus(); next.click(); }} onClick={() => update(question.type === "multiple" ? checked ? (Array.isArray(value) ? value : []).filter(item => item !== option.value) : [...(Array.isArray(value) ? value : []), option.value] : option.value)} className={cn("flex min-h-10 items-center gap-2 px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50", question.presentation === "pills" ? "relative isolate justify-center gap-2 overflow-hidden rounded-full border px-4 font-medium focus-visible:border-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background" : "w-full rounded-xl", question.presentation === "pills" && (checked ? "border-foreground/40 bg-foreground/7 text-primary" : "border-border"), question.presentation === "cards" && "relative isolate min-h-14 justify-between gap-4 overflow-hidden border border-border/60 px-4 py-3 focus-visible:bg-muted focus-visible:ring-offset-2 focus-visible:ring-offset-background", checked && question.presentation !== "pills" && (question.presentation === "cards" ? "bg-muted" : "bg-foreground/7"))}>
          {question.presentation === "pills" && <motion.span aria-hidden className="flex shrink-0 items-center overflow-hidden" initial={false} animate={{ width: checked ? 14 : 0, marginRight: checked ? 7 : 0, opacity: checked ? 1 : 0, scale: checked ? 1 : 0.6 }} transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}><Check className="size-3.5 shrink-0" strokeWidth={2.5} /></motion.span>}
          <span className="min-w-0 flex-1"><span className={cn("font-medium", question.presentation === "cards" && "block")}>{option.label}</span>{option.description && <span className={cn("text-muted-foreground", question.presentation === "cards" && "mt-0.5 block text-xs leading-5")}> {option.description}</span>}</span>
          {question.presentation === "cards" ? <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full border", checked ? "border-foreground bg-foreground text-background" : "border-border text-transparent")}><Check className="size-3" strokeWidth={2.5} /></span> : question.presentation !== "pills" && <kbd className="grid size-6 shrink-0 place-items-center rounded-lg border border-border font-sans text-xs tabular-nums text-muted-foreground">{checked ? <Check aria-hidden className="size-3.5" /> : index + 1}</kbd>}
        </button>;
      })}</div>
    ) : question.type === "single" ? (
      <RadioGroup aria-label={question.label} value={typeof value === "string" ? value : ""} onValueChange={update} className="gap-1">{question.options?.map(option => <RadioGroupItem key={option.value} value={option.value} label={option.label} description={option.description} disabled={disabled || option.disabled} className="min-h-10 items-start rounded-xl px-3 py-2.5 [&_button]:mt-0.5 [&_button]:size-4 [&_button]:border [&_button>span]:inset-1" />)}</RadioGroup>
    ) : (
      <div className="grid gap-1">{question.options?.map(option => <Checkbox key={option.value} label={option.label} description={option.description} disabled={disabled || option.disabled} checked={Array.isArray(value) && value.includes(option.value)} onCheckedChange={checked => update(checked ? [...(Array.isArray(value) ? value : []), option.value] : (Array.isArray(value) ? value : []).filter(item => item !== option.value))} className="min-h-10 items-start gap-3 rounded-xl px-3 py-2.5 [&_button]:mt-0.5 [&_button]:size-4 [&_button]:border" />)}</div>
    )}
    {(error || reserveError) && <p id={`${id}-error`} role={error ? "alert" : undefined} aria-hidden={!error} data-field-error className={cn("text-xs text-destructive", reserveError && "min-h-6 pt-1.5")}>{error}</p>}
  </fieldset>;
}
export interface QuestionnaireProps {
  questions: DecisionQuestion[]; answers?: QuestionAnswers; defaultAnswers?: QuestionAnswers;
  onAnswersChange?: (answers: QuestionAnswers) => void; onSubmit: (answers: QuestionAnswers) => void | Promise<void>;
  variant?: "guided" | "selection"; title?: string; className?: string;
  step?: number; defaultStep?: number; onStepChange?: (step: number) => void;
}
export function Questionnaire({ questions, answers, defaultAnswers = {}, onAnswersChange, onSubmit, variant = "guided", title = "A little context", className, step, defaultStep = 0, onStepChange }: QuestionnaireProps) {
  const [internal, setInternal] = useState(defaultAnswers);
  const [internalStep, setInternalStep] = useState(defaultStep);
  const [attempted, setAttempted] = useState(false);
  const [complete, setComplete] = useState(false);
  const action = useDecisionAction();
  const reduce = useReducedMotion();
  const values = answers ?? internal;
  const index = Math.max(0, Math.min(step ?? internalStep, questions.length - 1));
  const question = questions[index];
  const change = (next: QuestionAnswers) => { if (answers === undefined) setInternal(next); onAnswersChange?.(next); setComplete(false); };
  const navigate = (next: number) => { if (step === undefined) setInternalStep(next); onStepChange?.(next); setAttempted(false); action.clearError(); };
  const errors = questions.map(item => questionError(item, values, item.type === "text" || item.type === "email" || item.type === "textarea" ? "Enter an answer to continue." : "Choose an answer to continue."));
  const answered = questions.reduce((count, item) => { const value = values[item.id]; return count + (Array.isArray(value) ? value.length : Number(Boolean(value?.trim()))); }, 0);
  async function advance(skip = false) {
    setAttempted(true);
    if (!question || (!skip && errors[index])) return;
    if (skip) change({ ...values, [question.id]: question.type === "multiple" ? [] : "" });
    if (index < questions.length - 1) navigate(index + 1);
    else {
      const invalid = errors.findIndex((error, position) => Boolean(error) && !(skip && position === index));
      if (invalid >= 0) { navigate(invalid); setAttempted(true); return; }
      const submitted = skip ? { ...values, [question.id]: question.type === "multiple" ? [] : "" } : values;
      if (await action.run(() => onSubmit(validQuestionAnswers(questions, submitted)))) setComplete(true);
    }
  }
  return <section className={cn("w-full max-w-xl rounded-2xl border border-border bg-background p-2 text-foreground", className)} aria-label={title}>
    {!complete && <div role="progressbar" aria-label="Questionnaire progress" aria-live="polite" aria-valuemin={questions.length ? 1 : 0} aria-valuemax={questions.length} aria-valuenow={questions.length ? index + 1 : 0} aria-valuetext={`Question ${questions.length ? index + 1 : 0} of ${questions.length}`} className="px-3 pt-2 text-xs text-muted-foreground">Question {questions.length ? index + 1 : 0} of {questions.length}<h2 className="sr-only">{title}</h2></div>}
    {complete ? <div role="status" className="p-3"><h3 className="flex items-center gap-2 text-sm font-normal"><Check aria-hidden className="size-4" />All set</h3><p className="mt-2 text-sm text-muted-foreground">{answered} {answered === 1 ? "answer" : "answers"} noted for the next step.</p><Button className="mt-5 h-9" variant="outline" onClick={() => { change({}); navigate(0); }}>Start again</Button></div> : question ? <form className="[&_legend]:mb-2 [&_legend]:w-full [&_legend]:px-3 [&_legend]:pt-2 [&_legend]:text-xl [&_fieldset]:space-y-0 [&_[data-field-error]]:mt-3 [&_[data-field-error]]:px-3 [&_[data-field-error]]:text-sm [&_[data-field-error]]:leading-5" noValidate onSubmit={event => { event.preventDefault(); void advance(); }} onKeyDown={event => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); if (!action.busy) void advance(); return; }
      if (variant !== "guided" || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA/.test((event.target as HTMLElement).tagName)) return;
      const option = question.options?.[Number(event.key) - 1];
      if (!option || option.disabled || action.busy) return;
      event.preventDefault();
      const previous = values[question.id];
      change({ ...values, [question.id]: question.type === "multiple" ? Array.isArray(previous) && previous.includes(option.value) ? previous.filter(value => value !== option.value) : [...(Array.isArray(previous) ? previous : []), option.value] : option.value });
    }}>
      <motion.div key={question.id} initial={reduce ? false : { opacity: 0, x: variant === "guided" ? 14 : 0 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}><QuestionField question={question} answers={values} onChange={change} disabled={action.busy} error={attempted ? errors[index] : undefined} flat={variant === "guided"} inputClassNames={{ root: "mx-3 my-2", field: "has-[:focus]:border-border has-[:focus]:ring-2 has-[:focus]:ring-ring", input: "px-4 placeholder:text-muted-foreground" }} /></motion.div>
      <div className="mt-3 flex items-center justify-end gap-2 px-1 pb-1 [&_button]:h-9 [&_button]:text-sm">{index > 0 && <Button type="button" size="sm" variant="ghost" className="mr-auto gap-2" disabled={action.busy} onClick={() => navigate(index - 1)}><ArrowLeft aria-hidden className="size-4" />Back</Button>}{!question.required && <Button type="button" size="sm" variant="ghost" disabled={action.busy} onClick={() => { void advance(true); }}>Skip</Button>}<Button type="submit" size="sm" className="gap-2" disabled={action.busy}>{index === questions.length - 1 ? "Send answers" : "Continue"}<kbd aria-hidden className="flex items-center rounded-md border border-current/15 px-1.5 py-0.5 text-xs"><CornerDownLeft className="size-3" /></kbd></Button></div>
    </form> : <p role="status">No questions to answer.</p>}
    <DecisionFeedback {...action} />
  </section>;
}
