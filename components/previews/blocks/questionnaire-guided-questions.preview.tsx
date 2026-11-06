"use client";

import { useState } from "react";
import { Questionnaire, type DecisionQuestion, type QuestionAnswers } from "@/components/motion/business-decisions/questionnaire";
import { Checkbox } from "@/components/motion/checkbox";

const questions: DecisionQuestion[] = [
  { id: "work", label: "What would you like to work on?", type: "single", options: [{ value: "build", label: "Build something new", description: "Turn an idea into a first version" }, { value: "fix", label: "Fix a problem", description: "Find what’s wrong and put it right" }, { value: "polish", label: "Polish what’s there", description: "Improve the details and interactions" }, { value: "explore", label: "Explore an idea", description: "Compare a few directions before building" }] },
  { id: "start", label: "Where should I start?", type: "single", required: true, options: [{ value: "plan", label: "Make a plan", description: "Walk me through the approach first" }, { value: "draft", label: "Show me a draft", description: "Give me something I can react to" }, { value: "begin", label: "Get started", description: "Work through it and share the result" }] },
  { id: "context", label: "Any details I should know?", type: "text", placeholder: "Project details" },
];
export function QuestionnaireGuidedQuestionsPreview() {
  const [answers, setAnswers] = useState<QuestionAnswers>({});
  const [submitted, setSubmitted] = useState<QuestionAnswers | null>(null);
  const [fail, setFail] = useState(false);
  return <div className="relative flex min-h-96 w-full flex-col items-center justify-center gap-4 px-4 py-8"><Questionnaire variant="guided" questions={questions} answers={answers} onAnswersChange={setAnswers} onSubmit={async values => { if (fail) throw new Error("Demo rejection"); setSubmitted(values); }} /><details className="absolute left-4 top-full z-10 text-xs text-muted-foreground"><summary>Demo controls</summary><Checkbox label="Simulate submission failure" checked={fail} onCheckedChange={setFail} />{submitted && <output aria-label="Submitted answers" className="block w-full max-w-xl overflow-auto whitespace-pre rounded-xl bg-muted p-4 font-mono text-xs">{JSON.stringify(submitted, null, 2)}</output>}</details></div>;
}
