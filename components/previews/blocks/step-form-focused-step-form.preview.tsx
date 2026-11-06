"use client";

import { useState } from "react";
import { StepForm, type DecisionFormStep } from "@/components/motion/business-decisions/step-form";
import type { QuestionAnswers } from "@/components/motion/business-decisions/questionnaire";
import { Checkbox } from "@/components/motion/checkbox";

const steps: DecisionFormStep[] = [
  { id: "introduction", eyebrow: "Introduction", title: "What should we call you?", description: "A first name is enough.", fields: [{ id: "name", label: "What should we call you?", placeholder: "Your name", type: "text", required: true }] },
  { id: "team", eyebrow: "Team size", title: "How do you usually build?", description: "Choose the setup closest to yours.", fields: [{ id: "team", label: "How do you usually build?", type: "single", required: true, options: [{ value: "solo", label: "Solo", description: "Just me for now" }, { value: "small", label: "Small team", description: "2–10 people" }, { value: "growing", label: "Growing team", description: "11+ people" }] }] },
  { id: "goal", eyebrow: "Main goal", title: "What would make this useful?", fields: [{ id: "goal", label: "What would make this useful?", type: "single", required: true, options: [{ value: "launch", label: "Launch something new" }, { value: "improve", label: "Improve an existing product" }, { value: "explore", label: "Explore what is possible" }] }] },
  { id: "contact", eyebrow: "Last step", title: "Where should we send the plan?", description: "No newsletters. Just the project summary.", fields: [{ id: "email", label: "Where should we send the plan?", placeholder: "you@company.com", type: "email", required: true }] },
];
export function StepFormFocusedStepFormPreview() {
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [submitted, setSubmitted] = useState<QuestionAnswers | null>(null);
  const [fail, setFail] = useState(false);
  return <div className="relative flex min-h-[38rem] w-full flex-col items-center justify-center py-4"><div className="w-full px-4 py-12 sm:px-6"><StepForm variant="focused" submitLabel="Create my plan" steps={steps} answers={answers} onAnswersChange={setAnswers} onSubmit={async values => { if (fail) throw new Error("Demo rejection"); setSubmitted(values); }} /></div><details className="absolute left-4 top-full z-10 text-xs text-muted-foreground"><summary>Demo controls</summary><Checkbox label="Simulate submission failure" checked={fail} onCheckedChange={setFail} />{submitted && <output aria-label="Submitted brief" className="block overflow-auto whitespace-pre rounded-xl bg-muted p-4 font-mono text-xs">{JSON.stringify(submitted, null, 2)}</output>}</details></div>;
}
