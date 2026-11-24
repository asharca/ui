"use client";

import { useState } from "react";
import {
  ModelPicker,
  type ModelOption,
  type ModelProvider,
} from "@/components/agents/model-picker";

const OpenAIMark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className="size-4 text-foreground"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.35"
  >
    <circle cx="8" cy="8" r="5.5" />
    <path d="M5.4 6.5 8 5l2.6 1.5v3L8 11 5.4 9.5z" />
  </svg>
);

const AnthropicMark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className="size-4 text-sky-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M8 2.2v11.6M2.2 8h11.6M3.9 3.9l8.2 8.2M12.1 3.9l-8.2 8.2" />
  </svg>
);

const GoogleMark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className="size-4 text-emerald-400"
    fill="currentColor"
  >
    <path d="M8 1.5 9.7 6.3 14.5 8 9.7 9.7 8 14.5 6.3 9.7 1.5 8l4.8-1.7z" />
  </svg>
);

const MistralMark = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 16 16"
    className="size-4 text-sky-400"
    fill="currentColor"
  >
    <rect x="2.5" y="3" width="2.2" height="10" rx="0.5" />
    <rect x="11.3" y="3" width="2.2" height="10" rx="0.5" />
    <rect x="4.7" y="5.2" width="2.2" height="2.4" />
    <rect x="9.1" y="5.2" width="2.2" height="2.4" />
    <rect x="6.9" y="7.6" width="2.2" height="2.6" />
  </svg>
);

export const SAMPLE_PROVIDERS: ModelProvider[] = [
  { id: "openai", name: "OpenAI", icon: <OpenAIMark /> },
  { id: "anthropic", name: "Anthropic", icon: <AnthropicMark /> },
  { id: "google", name: "Google", icon: <GoogleMark /> },
  { id: "mistral", name: "Mistral", icon: <MistralMark /> },
];

export const SAMPLE_MODELS: ModelOption[] = [
  { id: "gpt-5-4", providerId: "openai", name: "GPT-5.4" },
  { id: "gpt-5-4-mini", providerId: "openai", name: "GPT-5.4 mini" },
  { id: "gpt-5-4-nano", providerId: "openai", name: "GPT-5.4 nano" },
  { id: "gpt-5-2", providerId: "openai", name: "GPT-5.2" },
  { id: "gpt-4-1", providerId: "openai", name: "GPT-4.1" },
  { id: "gpt-4-1-mini", providerId: "openai", name: "GPT-4.1 mini" },
  { id: "o3", providerId: "openai", name: "o3" },
  { id: "o4-mini", providerId: "openai", name: "o4-mini" },
  { id: "claude-fable-5-1", providerId: "anthropic", name: "Claude Fable 5.1" },
  { id: "claude-opus-5", providerId: "anthropic", name: "Claude Opus 5" },
  { id: "claude-sonnet-5", providerId: "anthropic", name: "Claude Sonnet 5" },
  { id: "claude-haiku-4-5", providerId: "anthropic", name: "Claude Haiku 4.5" },
  { id: "gemini-3-1-pro", providerId: "google", name: "Gemini 3.1 Pro" },
  { id: "gemini-3-1-flash", providerId: "google", name: "Gemini 3.1 Flash" },
  { id: "gemini-3-1-flash-lite", providerId: "google", name: "Gemini 3.1 Flash-Lite" },
  { id: "gemini-2-5-pro", providerId: "google", name: "Gemini 2.5 Pro" },
  { id: "gemini-2-5-flash", providerId: "google", name: "Gemini 2.5 Flash" },
  { id: "mistral-large", providerId: "mistral", name: "Mistral Large" },
  { id: "mistral-small", providerId: "mistral", name: "Mistral Small" },
  { id: "codestral", providerId: "mistral", name: "Codestral" },
  { id: "devstral", providerId: "mistral", name: "Devstral" },
];

export function ModelPickerCatalogPreview() {
  const [modelId, setModelId] = useState("claude-sonnet-5");
  return (
    <div className="flex min-h-[260px] w-full items-center justify-center">
      <ModelPicker
        providers={SAMPLE_PROVIDERS}
        models={SAMPLE_MODELS}
        value={modelId}
        onValueChange={setModelId}
      />
    </div>
  );
}
