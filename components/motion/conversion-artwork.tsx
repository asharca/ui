"use client";

import { useEffect, useState } from "react";
import { ShaderBackground } from "@/components/motion/shader-background";
import { cn } from "@/lib/utils";

/** Decorative shader composition with a deterministic, theme-native non-WebGL alternative. */
export function ConversionShader({ variant, colors, distortion, swirl, className }: { variant: "mesh-gradient" | "dithering" | "static-mesh-gradient"; /** Gradient stops, or background/foreground colors for dithering. */ colors?: string[]; distortion?: number; swirl?: number; className?: string }) {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (typeof WebGL2RenderingContext === "undefined") return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    if (!context) return;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    setAvailable(true);
  }, []);
  const background = colors?.[0] ?? "var(--background)";
  const foreground = colors?.[1] ?? "var(--primary)";
  const fallback = variant === "dithering"
    ? `linear-gradient(165deg, ${foreground} 15%, transparent 70%), linear-gradient(${background}, ${background})`
    : `radial-gradient(ellipse at 15% 15%, ${background}, transparent 70%), radial-gradient(ellipse at 85% 25%, ${foreground}, transparent 65%), linear-gradient(135deg, ${colors?.[2] ?? background}, ${foreground})`;
  return <div aria-hidden="true" className={cn("relative h-full w-full overflow-hidden", className)} style={{ background: fallback }}>
    {!available && variant === "dithering" && <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${background} 1px, transparent 1.2px)`, backgroundSize: "4px 4px", maskImage: "linear-gradient(165deg, transparent 15%, black 48%, transparent 80%)" }} />}
    {available && (variant === "dithering" ? <ShaderBackground variant="dithering" shape="wave" scale={1.15} size={3} type="4x4" colorBack={colors?.[0]} colorFront={colors?.[1]} /> : variant === "static-mesh-gradient" ? <ShaderBackground variant="static-mesh-gradient" colors={colors} /> : <ShaderBackground variant="mesh-gradient" colors={colors} distortion={distortion} swirl={swirl} />)}
  </div>;
}
