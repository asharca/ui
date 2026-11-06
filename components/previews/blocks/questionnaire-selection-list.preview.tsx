"use client";

import { useState } from "react";
import { Questionnaire, type DecisionQuestion, type QuestionAnswers } from "@/components/motion/business-decisions/questionnaire";
import { Checkbox } from "@/components/motion/checkbox";

const questions: DecisionQuestion[] = [
  { id: "checks", label: "What should I check before finishing?", type: "multiple", options: [{ value: "tests", label: "Run the relevant tests" }, { value: "mobile", label: "Check the mobile layout" }, { value: "keyboard", label: "Try the keyboard controls" }, { value: "changes", label: "Review the final changes" }] },
  { id: "update", label: "How would you like the update?", type: "single", required: true, options: [{ value: "short", label: "Keep it short" }, { value: "explain", label: "Explain what changed and why" }, { value: "walkthrough", label: "Walk me through the result" }] },
  { id: "context", label: "Anything you’d like me to leave alone?", type: "text", placeholder: "Things to leave unchanged" },
];
export function QuestionnaireSelectionListPreview() {
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [submitted, setSubmitted] = useState<QuestionAnswers | null>(null);
  const [fail, setFail] = useState(false);
  return <div className="relative flex min-h-96 w-full flex-col items-center justify-center gap-4 px-4 py-8"><Questionnaire variant="selection" questions={questions} answers={answers} onAnswersChange={setAnswers} onSubmit={async values => { if (fail) throw new Error("Demo rejection"); setSubmitted(values); }} /><details className="absolute left-4 top-full z-10 text-xs text-muted-foreground"><summary>Demo controls</summary><Checkbox label="Simulate submission failure" checked={fail} onCheckedChange={setFail} />{submitted && <output aria-label="Submitted answers" className="block w-full max-w-xl overflow-auto whitespace-pre rounded-xl bg-muted p-4 font-mono text-xs">{JSON.stringify(submitted, null, 2)}</output>}</details></div>;
}
