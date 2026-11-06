"use client";

import { useState } from "react";
import { StepForm, type DecisionFormStep } from "@/components/motion/business-decisions/step-form";
import type { QuestionAnswers } from "@/components/motion/business-decisions/questionnaire";
import { Checkbox } from "@/components/motion/checkbox";

const steps: DecisionFormStep[] = [
  { id: "project", title: "What are you planning?", fields: [{ id: "project", label: "What are you planning?", type: "single", required: true, options: [{ value: "website", label: "A new website" }, { value: "product", label: "A product experience" }, { value: "redesign", label: "A focused redesign" }] }] },
  { id: "timing", title: "When should it be ready?", fields: [{ id: "timing", label: "When should it be ready?", type: "single", required: true, options: [{ value: "soon", label: "As soon as possible" }, { value: "month", label: "Within a month" }, { value: "exploring", label: "Still exploring" }] }] },
  { id: "contact", title: "Where can we follow up?", fields: [{ id: "email", label: "Where can we follow up?", placeholder: "name@company.com", type: "email", required: true }] },
];
export function StepFormCardStackPreview() {
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [submitted, setSubmitted] = useState<QuestionAnswers | null>(null);
  const [fail, setFail] = useState(false);
  return <div className="relative flex min-h-[38rem] w-full flex-col items-center justify-center py-4"><div className="w-full px-4 py-14 sm:px-6"><StepForm variant="stack" submitLabel="Send brief" steps={steps} answers={answers} onAnswersChange={setAnswers} onSubmit={async values => { if (fail) throw new Error("Demo rejection"); setSubmitted(values); }} /></div><details className="absolute left-4 top-full z-10 text-xs text-muted-foreground"><summary>Demo controls</summary><Checkbox label="Simulate submission failure" checked={fail} onCheckedChange={setFail} />{submitted && <output aria-label="Submitted brief" className="block overflow-auto whitespace-pre rounded-xl bg-muted p-4 font-mono text-xs">{JSON.stringify(submitted, null, 2)}</output>}</details></div>;
}
