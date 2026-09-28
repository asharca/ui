"use client";

import { Bot, Brain, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/motion/button";
import { ModelSelector } from "@/components/motion/model-selector";
import type { ModelOption } from "@/components/motion/model-selector";

const MODELS: ModelOption[] = [
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    provider: "Anthropic",
    description: "Balanced reasoning and coding for everyday work.",
    context: "200K context",
    tags: ["Reasoning", "Vision", "Tools"],
    pinned: true,
    icon: <Brain className="size-4" />,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description:
      "A fast multimodal model for conversation and visual understanding.",
    context: "128K context",
    tags: ["Vision", "Tools"],
    recent: true,
    icon: <Sparkles className="size-4" />,
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    provider: "Anthropic",
    description: "Deep reasoning for complex analysis and longer coding tasks.",
    context: "200K context",
    tags: ["Reasoning", "Vision", "Tools"],
    icon: <Brain className="size-4" />,
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "OpenAI",
    description:
      "Precise instruction following and code generation with a large context window.",
    context: "1M context",
    tags: ["Vision", "Tools"],
    icon: <Sparkles className="size-4" />,
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Long-context reasoning across documents, images, and code.",
    context: "1M context",
    tags: ["Reasoning", "Vision"],
    icon: <Bot className="size-4" />,
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    description: "Efficient conversational and coding assistance.",
    context: "128K context",
    tags: ["Tools"],
    icon: <Bot className="size-4" />,
  },
];

const SIZES = [
  { size: "sm", label: "Small", dimensions: "320 × 360", width: "max-w-xs" },
  { size: "md", label: "Medium", dimensions: "400 × 440", width: "max-w-sm" },
  { size: "lg", label: "Large", dimensions: "480 × 520", width: "max-w-md" },
] as const;

export function ModelSelectorPreview() {
  const [sizeIndex, setSizeIndex] = useState(1);
  const [model, setModel] = useState(MODELS[0]);
  const current = SIZES[sizeIndex];

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-sm">Choose your model</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSizeIndex((index) => (index + 1) % SIZES.length)}
        >
          Size: {current.label}
        </Button>
      </div>
      <section
        aria-label={`${current.label} model selector`}
        className={`w-full space-y-2 ${current.width}`}
      >
        <ModelSelector
          size={current.size}
          models={MODELS}
          value={model.id}
          onValueChange={setModel}
        />
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {model.name} · {model.provider}
        </p>
      </section>
      <p aria-live="polite" className="font-mono text-[10px] text-muted-foreground">
        {current.dimensions}
      </p>
      <p className="text-xs text-muted-foreground">
        Search models and providers. Hover a model to inspect its details.
      </p>
    </div>
  );
}
