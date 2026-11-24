"use client";

import { useState } from "react";
import {
  ModelPicker,
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

export const SAMPLE_PROVIDERS: ModelProvider[] = [
  { id: "anthropic", name: "Anthropic", icon: <AnthropicMark /> },
  { id: "openai", name: "OpenAI", icon: <OpenAIMark /> },
  { id: "google", name: "Google Gemini", icon: <GeminiMark /> },
  { id: "open", name: "Open Weights", icon: <OpenWeightMark /> },
];

export const SAMPLE_MODELS: ModelOption[] = [
  { id: "claude-sonnet-5", providerId: "anthropic", name: "Claude Sonnet 5", description: "Balanced reasoning and coding", contextWindow: "200k", badge: "Default" },
  { id: "claude-opus-4-6", providerId: "anthropic", name: "Claude Opus 4.6", description: "Deep architecture and research", contextWindow: "200k", badge: "Reasoning" },
  { id: "claude-haiku-4-5", providerId: "anthropic", name: "Claude Haiku 4.5", description: "Instant lightweight replies", contextWindow: "200k" },
  { id: "claude-sonnet-4", providerId: "anthropic", name: "Claude Sonnet 4", description: "Steady multi-file editing", contextWindow: "200k" },
  { id: "claude-3-7-sonnet", providerId: "anthropic", name: "Claude 3.7 Sonnet", description: "Extended thinking mode", contextWindow: "200k" },
  { id: "gpt-5-4", providerId: "openai", name: "GPT-5.4", description: "General intelligence flagship", contextWindow: "400k", badge: "New" },
  { id: "gpt-5-mini", providerId: "openai", name: "GPT-5 Mini", description: "Fast structured extraction", contextWindow: "200k" },
  { id: "gpt-5-nano", providerId: "openai", name: "GPT-5 Nano", description: "Ultra-low latency routing", contextWindow: "128k" },
  { id: "o3-pro", providerId: "openai", name: "o3-pro", description: "Verifiable multi-step proofs", contextWindow: "200k", badge: "Reasoning" },
  { id: "o4-mini", providerId: "openai", name: "o4-mini", description: "Compact tool calling", contextWindow: "200k" },
  { id: "codex-max", providerId: "openai", name: "Codex Max", description: "Long-horizon software agent", contextWindow: "256k" },
  { id: "gemini-2-5-pro", providerId: "google", name: "Gemini 2.5 Pro", description: "Long-context multimodal", contextWindow: "2M", badge: "2M ctx" },
  { id: "gemini-2-5-flash", providerId: "google", name: "Gemini 2.5 Flash", description: "High-throughput streaming", contextWindow: "1M" },
  { id: "gemini-2-5-flash-lite", providerId: "google", name: "Gemini 2.5 Flash-Lite", description: "Economical batch jobs", contextWindow: "1M" },
  { id: "gemini-robotics", providerId: "google", name: "Gemini Vision Pro", description: "Spatial UI inspection", contextWindow: "512k" },
  { id: "deepseek-r2", providerId: "open", name: "DeepSeek R2", description: "Open reasoning weights", contextWindow: "128k" },
  { id: "deepseek-v3-2", providerId: "open", name: "DeepSeek V3.2", description: "Efficient MoE coder", contextWindow: "128k" },
  { id: "qwen-3-coder", providerId: "open", name: "Qwen 3 Coder 480B", description: "Repository-scale synthesis", contextWindow: "256k" },
  { id: "llama-4-maverick", providerId: "open", name: "Llama 4 Maverick", description: "Multilingual chat and vision", contextWindow: "1M" },
  { id: "llama-4-scout", providerId: "open", name: "Llama 4 Scout", description: "Fast edge deployment", contextWindow: "512k" },
  { id: "mistral-large-3", providerId: "open", name: "Mistral Large 3", description: "Deterministic JSON tools", contextWindow: "128k" },
];

export function ModelPickerCatalogPreview() {
  const [modelId, setModelId] = useState("claude-sonnet-5");
  return (
    <div className="flex min-h-[300px] w-full items-start justify-center pt-6">
      <ModelPicker
        providers={SAMPLE_PROVIDERS}
        models={SAMPLE_MODELS}
        value={modelId}
        onValueChange={setModelId}
      />
    </div>
  );
}
