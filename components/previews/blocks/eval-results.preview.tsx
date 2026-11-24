"use client";

import { useState } from "react";
import {
  EvalResults,
  type EvalModelSummary,
  type EvalTestCase,
} from "@/components/motion/eval-results";

const MODELS: EvalModelSummary[] = [
  { id: "atlas-2", name: "Atlas 2", tier: "Large", deltaVsLast: 6 },
  { id: "kite", name: "Kite", tier: "Small", deltaVsLast: -12 },
  { id: "lumen", name: "Lumen", tier: "Fine-tuned", deltaVsLast: 3 },
];

const CASES: EvalTestCase[] = [
  {
    id: "refund-30d",
    title: "Refund after 30 days",
    category: "Billing",
    prompt: "I forgot to cancel before renewal two days ago. Can I still request a refund?",
    results: {
      "atlas-2": { score: 0.94, outcome: "pass", output: "Explained the 14-day grace window and issued pro-rated credit eligibility details.", graderNote: "Clear policy grounding without false promises." },
      kite: { score: 0.61, outcome: "partial", output: "Stated the 30-day rule accurately but omitted escalation steps.", graderNote: "Missing escalation link." },
      lumen: { score: 0.88, outcome: "pass", output: "Verified account renewal date and provided refund form link directly.", graderNote: "Concise and accurate." },
    },
  },
  {
    id: "angry-outage",
    title: "Angry customer during outage",
    category: "Tone",
    prompt: "Your API has been returning 503 for 20 minutes during our launch!",
    regression: true,
    results: {
      "atlas-2": { score: 0.91, outcome: "pass", output: "Owned the disruption calmly, linked live status updates, and gave a timeline.", graderNote: "Empathetic without defensiveness." },
      kite: { score: 0.22, outcome: "fail", output: "Suggested the user check their local internet connection first.", graderNote: "Dismissive during active incident." },
      lumen: { score: 0.58, outcome: "partial", output: "Shared status link but omitted apology for launch impact.", graderNote: "Tone needs warmer opening." },
    },
  },
  {
    id: "sso-saml",
    title: "SAML metadata upload error",
    category: "Auth",
    prompt: "Okta XML upload says invalid ACS certificate.",
    results: {
      "atlas-2": { score: 0.96, outcome: "pass", output: "Identified SHA-256 fingerprint mismatch and listed three verification steps.", graderNote: "Exact match to docs." },
      kite: { score: 0.84, outcome: "pass", output: "Recommended re-downloading X.509 cert in PEM format.", graderNote: "Correct root cause." },
      lumen: { score: 0.89, outcome: "pass", output: "Pointed to Okta ACS URL formatting and certificate headers.", graderNote: "Helpful checklist." },
    },
  },
  {
    id: "gdpr-export",
    title: "EU workspace data deletion",
    category: "Compliance",
    prompt: "Need confirmation that backups purge within 30 days.",
    regression: true,
    results: {
      "atlas-2": { score: 0.89, outcome: "pass", output: "Cited Section 4 of the retention policy covering rolling encrypted snapshots.", graderNote: "Accurate citation." },
      kite: { score: 0.31, outcome: "fail", output: "Claimed backups are deleted instantaneously on button click.", graderNote: "Incorrect retention claim." },
      lumen: { score: 0.41, outcome: "fail", output: "Advised emailing support without explaining automatic purge schedule.", graderNote: "Missed self-serve schedule." },
    },
  },
  {
    id: "seat-proration",
    title: "Mid-cycle seat downgrade",
    category: "Billing",
    prompt: "What happens if we remove four seats halfway through the month?",
    results: {
      "atlas-2": { score: 0.92, outcome: "pass", output: "Explained prorated invoice credit applied automatically to next renewal.", graderNote: "Complete math example." },
      kite: { score: 0.79, outcome: "pass", output: "Confirmed unused seat credit carries over.", graderNote: "Correct." },
      lumen: { score: 0.9, outcome: "pass", output: "Detailed credit calculation and billing portal route.", graderNote: "Exact match." },
    },
  },
  {
    id: "webhook-sig",
    title: "Verify HMAC webhook signature",
    category: "API",
    prompt: "Why does SHA256 fail in Express after JSON middleware?",
    regression: true,
    results: {
      "atlas-2": { score: 0.97, outcome: "pass", output: "Explained passing raw Buffer before body parsing.", graderNote: "Best practice fix." },
      kite: { score: 0.44, outcome: "fail", output: "Recommended stringifying req.body again.", graderNote: "Re-serialization breaks HMAC." },
      lumen: { score: 0.86, outcome: "pass", output: "Showed express.raw verify hook snippet.", graderNote: "Working snippet." },
    },
  },
];

export function EvalResultsPreview() {
  const [seed, setSeed] = useState(42);
  return (
    <EvalResults
      key={seed}
      suiteName="Support replies"
      runLabel={`Run ${seed} · ${CASES.length} cases`}
      models={MODELS}
      cases={CASES}
      onReplay={() => setSeed((prev) => prev + 1)}
    />
  );
}
