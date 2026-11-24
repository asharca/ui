"use client";

import { useState } from "react";
import {
  ModelPickerRail,
  type ModelOption,
  type ModelProvider,
} from "@/components/agents/model-picker";

const AnthropicMark = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-sky-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M8 2v12M2 8h12M3.8 3.8l8.4 8.4M12.2 3.8l-8.4 8.4" />
  </svg>
);

const OpenAIMark = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.4">
    <circle cx="8" cy="8" r="5.5" />
    <path d="M5.2 6.5 8 4.8l2.8 1.7v3L8 11.2 5.2 9.5z" />
  </svg>
);

const GeminiMark = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-violet-400" fill="currentColor">
    <path d="M8 1.5 9.8 6.2 14.5 8 9.8 9.8 8 14.5 6.2 9.8 1.5 8l4.7-1.8z" />
  </svg>
);

const OpenWeightMark = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
    <path d="M8 2 13 5v6l-5 3-5-3V5zM8 2v12M3 5l5 3 5-3" />
  </svg>
);

const RAIL_PROVIDERS: ModelProvider[] = [
  { id: "anthropic", name: "Anthropic", icon: <AnthropicMark /> },
  { id: "openai", name: "OpenAI", icon: <OpenAIMark /> },
  { id: "google", name: "Google Gemini", icon: <GeminiMark /> },
  { id: "open", name: "Open Weights", icon: <OpenWeightMark /> },
];

const RAIL_MODELS: ModelOption[] = [
  { id: "claude-sonnet-5", providerId: "anthropic", name: "Claude Sonnet 5", speed: "Balanced", contextWindow: "200k" },
  { id: "claude-opus-4-6", providerId: "anthropic", name: "Claude Opus 4.6", speed: "Reasoning", contextWindow: "200k" },
  { id: "claude-haiku-4-5", providerId: "anthropic", name: "Claude Haiku 4.5", speed: "Fast", contextWindow: "200k" },
  { id: "gpt-5-4", providerId: "openai", name: "GPT-5.4", speed: "Flagship", contextWindow: "400k" },
  { id: "gpt-5-mini", providerId: "openai", name: "GPT-5 Mini", speed: "Fast", contextWindow: "200k" },
  { id: "o3-pro", providerId: "openai", name: "o3-pro", speed: "Reasoning", contextWindow: "200k" },
  { id: "gemini-2-5-pro", providerId: "google", name: "Gemini 2.5 Pro", speed: "Long context", contextWindow: "2M" },
  { id: "gemini-2-5-flash", providerId: "google", name: "Gemini 2.5 Flash", speed: "Fast", contextWindow: "1M" },
  { id: "deepseek-r2", providerId: "open", name: "DeepSeek R2", speed: "Reasoning", contextWindow: "128k" },
  { id: "qwen-3-coder", providerId: "open", name: "Qwen 3 Coder 480B", speed: "Coder", contextWindow: "256k" },
];

export function ModelPickerRailPreview() {
  const [modelId, setModelId] = useState("gpt-5-4");

  return (
    <div className="flex min-h-[300px] w-full items-start justify-center pt-6">
      <ModelPickerRail
        providers={RAIL_PROVIDERS}
        models={RAIL_MODELS}
        value={modelId}
        onValueChange={setModelId}
      />
    </div>
  );
}
