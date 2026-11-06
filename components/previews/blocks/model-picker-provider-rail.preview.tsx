"use client";
import { useState } from "react";
import { ModelCatalog } from "@/components/motion/model-provider-catalog";
const providers = [{ id: "north", name: "Northstar", mark: "N" }, { id: "cedar", name: "Cedar Labs", mark: "C" }, { id: "atlas", name: "Atlas Research", mark: "A" }, { id: "orbit", name: "Orbit", mark: "O" }];
const models = providers.flatMap((provider, index) => Array.from({ length: [8, 4, 5, 4][index] }, (_, position) => ({ id: `${provider.id}-${position}`, name: `${provider.name} ${["Reason", "Swift", "Vision", "Code", "Long", "Mini", "Pro", "Nano"][position]}`, providerId: provider.id, description: position === 0 ? "Deliberate reasoning for complex questions" : "Fast, focused assistance for everyday work", metadata: `${32 + position * 16}K context`, disabled: position === 4, details: <p className="mt-2 text-xs text-muted-foreground">{position === 4 ? "Not available on this plan." : "Example catalog metadata; your application supplies the real model capabilities."}</p> })));
export function ProviderRailPreview() {
  const [value, setValue] = useState("north-0");
  return <div className="flex min-h-[260px] w-full items-center justify-center p-6"><ModelCatalog models={models} providers={providers} navigation="rail" value={value} onValueChange={setValue} /><p role="status" className="sr-only">Selected model ID: {value}</p></div>;
}
