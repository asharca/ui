"use client";

import { useState } from "react";
import { ModelPickerRail } from "@/components/agents/model-picker";
import {
  SAMPLE_MODELS,
  SAMPLE_PROVIDERS,
} from "@/components/previews/agents/model-picker-catalog.preview";

export function ModelPickerRailPreview() {
  const [modelId, setModelId] = useState("gpt-5-4");

  return (
    <div className="flex min-h-[260px] w-full items-center justify-center">
      <ModelPickerRail
        providers={SAMPLE_PROVIDERS}
        models={SAMPLE_MODELS}
        value={modelId}
        onValueChange={setModelId}
      />
    </div>
  );
}
