"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/motion/radio";

export function RadioPreview() {
  const [density, setDensity] = useState("comfortable");

  return (
    <RadioGroup value={density} onValueChange={setDensity} className="min-w-48">
      <RadioGroupItem value="compact" label="Compact — more content" />
      <RadioGroupItem value="comfortable" label="Comfortable — balanced spacing" />
      <RadioGroupItem value="spacious" label="Spacious — extra room" />
      <RadioGroupItem value="automatic" label="Automatic — unavailable" disabled />
    </RadioGroup>
  );
}
