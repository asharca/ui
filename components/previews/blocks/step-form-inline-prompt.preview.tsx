"use client";

import { useState } from "react";
import { StepForm, type DecisionFormStep } from "@/components/motion/business-decisions/step-form";
import type { QuestionAnswers } from "@/components/motion/business-decisions/questionnaire";
import { Checkbox } from "@/components/motion/checkbox";

const steps: DecisionFormStep[] = [
  { id: "start", title: "What are you hoping to make?", fields: [{ id: "idea", label: "What are you hoping to make?", placeholder: "A short product idea", type: "text", required: true }] },
  { id: "pace", title: "How quickly do you want to move?", fields: [{ id: "pace", label: "How quickly do you want to move?", type: "single", required: true, options: [{ value: "week", label: "This week" }, { value: "month", label: "This month" }, { value: "relaxed", label: "No rush" }] }] },
  { id: "finish", title: "Where should the summary go?", fields: [{ id: "email", label: "Where should the summary go?", placeholder: "you@company.com", type: "email", required: true }] },
];
export function StepFormInlinePromptPreview() {
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [submitted, setSubmitted] = useState<QuestionAnswers | null>(null);
  const [fail, setFail] = useState(false);
  return <div className="relative flex min-h-[34rem] w-full flex-col items-center justify-center py-4"><div className="w-full px-4 py-14 sm:px-6"><StepForm variant="inline" title="Quick brief" submitLabel="Finish" steps={steps} answers={answers} onAnswersChange={setAnswers} onSubmit={async values => { if (fail) throw new Error("Demo rejection"); setSubmitted(values); }} /></div><details className="absolute left-4 top-full z-10 text-xs text-muted-foreground"><summary>Demo controls</summary><Checkbox label="Simulate submission failure" checked={fail} onCheckedChange={setFail} />{submitted && <output aria-label="Submitted brief" className="block overflow-auto whitespace-pre rounded-xl bg-muted p-4 font-mono text-xs">{JSON.stringify(submitted, null, 2)}</output>}</details></div>;
}
