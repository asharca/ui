"use client";

import { useState } from "react";
import { Button } from "@/components/motion/button";
import { BarWave } from "@/components/motion/illustration-bar-wave";

const bars = Array.from({ length: 13 }, (_, index) => ({ id: `signal-${index}`, label: `Signal ${index + 1}`, level: 1 }));

export function BarWavePreview() {
  const [pointerResponse, setPointerResponse] = useState(true);
  return <div className="group flex w-full max-w-xl flex-col items-center gap-4">
    <BarWave bars={bars} label="Traveling signal" pointerResponse={pointerResponse} />
    <Button type="button" size="sm" variant="outline" className="sr-only focus:not-sr-only" aria-pressed={pointerResponse} onClick={() => setPointerResponse((current) => !current)}>{pointerResponse ? "Disable pointer response" : "Enable pointer response"}</Button>
  </div>;
}
