"use client";

import {
  Check,
  Code2,
  Copy,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ComponentType, useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/app/chrome/theme-toggle";
import {
  ShaderBackground,
  type ShaderBackgroundProps,
  type ShaderBackgroundVariant,
} from "@/components/motion/shader-background";
import {
  CenterMorphModal,
  CenterMorphModalContent,
  CenterMorphModalTrigger,
} from "@/components/motion/center-morph-modal";
import { cn } from "@/lib/utils";

type StudioContext = "hero" | "content" | "cta";
type MaterialCategory = "all" | "flow" | "light" | "organic" | "pattern";
type TuneTab = "material" | "color" | "finish";

type MaterialPreset = {
  id: string;
  label: string;
  category: Exclude<MaterialCategory, "all">;
  variant: ShaderBackgroundVariant;
  supportsColors: boolean;
  supportsSpeed: boolean;
  defaultColors: string[];
  colorBack?: string;
  previewGradient: string;
  extraProps?: Record<string, unknown>;
};

type ScenePreset = {
  id: string;
  name: string;
  description: string;
  materialId: string;
  colors: string[];
  colorBack: string;
  speed: number;
};

const MATERIALS: MaterialPreset[] = [
  {
    id: "mesh-gradient",
    label: "Mesh",
    category: "flow",
    variant: "mesh-gradient",
    supportsColors: true,
    supportsSpeed: true,
    defaultColors: ["#0b132b", "#1c2541", "#3a506b", "#d9a074"],
    previewGradient: "radial-gradient(circle at 70% 45%, #d9a074, #1c2541 65%, #0b132b)",
    extraProps: { distortion: 0.7, swirl: 0.3 },
  },
  {
    id: "grain-gradient",
    label: "Grain",
    category: "light",
    variant: "grain-gradient",
    supportsColors: true,
    supportsSpeed: true,
    defaultColors: ["#2b1a14", "#8a4227", "#d98c62", "#f5cba6"],
    colorBack: "#151515",
    previewGradient: "radial-gradient(circle at 75% 40%, #f5cba6, #8a4227 55%, #2b1a14)",
    extraProps: { softness: 0.7 },
  },
  {
    id: "warp",
    label: "Warp",
    category: "flow",
    variant: "warp",
    supportsColors: true,
    supportsSpeed: true,
    defaultColors: ["#091a1d", "#0f4c5c", "#00b4d8", "#90e0ef"],
    previewGradient: "linear-gradient(135deg, #091a1d, #0f4c5c 50%, #00b4d8)",
  },
  {
    id: "swirl",
    label: "Swirl",
    category: "flow",
    variant: "swirl",
    supportsColors: true,
    supportsSpeed: true,
    defaultColors: ["#f7e1d7", "#edafb8", "#4a5759", "#1d2d44"],
    colorBack: "#101820",
    previewGradient: "radial-gradient(circle at 50% 50%, #edafb8, #4a5759 60%, #101820)",
  },
  {
    id: "god-rays",
    label: "Aurora Rays",
    category: "light",
    variant: "god-rays",
    supportsColors: true,
    supportsSpeed: true,
    defaultColors: ["#a8ff78", "#78ffd6", "#0072ff"],
    colorBack: "#041418",
    previewGradient: "linear-gradient(125deg, #041418, #0072ff 55%, #78ffd6)",
  },
  {
    id: "smoke-ring",
    label: "Smoke",
    category: "light",
    variant: "smoke-ring",
    supportsColors: true,
    supportsSpeed: true,
    defaultColors: ["#ffffff", "#a8dadc", "#457b9d"],
    colorBack: "#0c0f14",
    previewGradient: "radial-gradient(circle at 60% 50%, #a8dadc, #1b263b 55%, #0c0f14)",
  },
  {
    id: "neuro-noise",
    label: "Neuro",
    category: "organic",
    variant: "neuro-noise",
    supportsColors: false,
    supportsSpeed: true,
    defaultColors: ["#06111c", "#1e6091", "#99d98c", "#ffffff"],
    colorBack: "#06111c",
    previewGradient: "radial-gradient(circle at 40% 40%, #99d98c, #1e6091 55%, #06111c)",
    extraProps: { colorFront: "#ffffff", colorMid: "#47a6ff", colorBack: "#06111c" },
  },
  {
    id: "metaballs",
    label: "Metaballs",
    category: "organic",
    variant: "metaballs",
    supportsColors: true,
    supportsSpeed: true,
    defaultColors: ["#ff5cf4", "#4d9eff", "#120c2c"],
    colorBack: "#0a0a0f",
    previewGradient: "radial-gradient(circle at 35% 50%, #ff5cf4, #4d9eff 50%, #0a0a0f)",
  },
  {
    id: "voronoi",
    label: "Voronoi",
    category: "organic",
    variant: "voronoi",
    supportsColors: true,
    supportsSpeed: true,
    defaultColors: ["#ff8247", "#ffe53d", "#24140e"],
    previewGradient: "radial-gradient(circle at 50% 50%, #ffe53d, #ff8247 55%, #24140e)",
  },
  {
    id: "waves",
    label: "Waves",
    category: "pattern",
    variant: "waves",
    supportsColors: false,
    supportsSpeed: false,
    defaultColors: ["#0d1b2a", "#415a77", "#778da9", "#e0e1dd"],
    colorBack: "#0d1b2a",
    previewGradient: "repeating-radial-gradient(circle at 50% 50%, #415a77 0 12px, #0d1b2a 12px 24px)",
    extraProps: { colorFront: "#778da9", colorBack: "#0d1b2a" },
  },
  {
    id: "dithering",
    label: "Dither",
    category: "pattern",
    variant: "dithering",
    supportsColors: false,
    supportsSpeed: true,
    defaultColors: ["#07120e", "#00ff9d", "#18392b", "#d8f3dc"],
    colorBack: "#07120e",
    previewGradient: "linear-gradient(155deg, #00ff9d 10%, #07120e 75%)",
    extraProps: { colorFront: "#00ff9d", colorBack: "#07120e" },
  },
  {
    id: "dot-grid",
    label: "Dot Grid",
    category: "pattern",
    variant: "dot-grid",
    supportsColors: false,
    supportsSpeed: false,
    defaultColors: ["#0c0c0c", "#f5f5f5", "#ffaa00", "#333333"],
    colorBack: "#0c0c0c",
    previewGradient: "radial-gradient(#ffaa00 1.5px, #0c0c0c 1.5px)",
    extraProps: { colorBack: "#0c0c0c", colorFill: "#ffffff", colorStroke: "#ffaa00" },
  },
];

const SCENES: ScenePreset[] = [
  {
    id: "prismatic-drift",
    name: "Prismatic drift",
    description: "Deep color fields with a clear center",
    materialId: "mesh-gradient",
    colors: ["#09131d", "#143547", "#d9a773", "#0b1a24"],
    colorBack: "#09131d",
    speed: 0.4,
  },
  {
    id: "solar-veil",
    name: "Solar veil",
    description: "Warm light folding through smoke",
    materialId: "grain-gradient",
    colors: ["#2b1a14", "#8a4227", "#d98c62", "#f5cba6"],
    colorBack: "#1e100b",
    speed: 0.45,
  },
  {
    id: "signal-field",
    name: "Signal field",
    description: "Electric depth with a calm text lane",
    materialId: "god-rays",
    colors: ["#00ffb2", "#0072ff", "#071f2c"],
    colorBack: "#05141c",
    speed: 0.35,
  },
  {
    id: "mineral-tide",
    name: "Mineral tide",
    description: "Layered color with editorial restraint",
    materialId: "swirl",
    colors: ["#d8e2dc", "#84a59d", "#2f3e46", "#161f24"],
    colorBack: "#11181c",
    speed: 0.25,
  },
  {
    id: "matrix-dither",
    name: "Retro dither",
    description: "Crisp halftone motion for dev tools",
    materialId: "dithering",
    colors: ["#07120e", "#00ff9d", "#18392b", "#d8f3dc"],
    colorBack: "#07120e",
    speed: 0.4,
  },
];

const ShaderAny = ShaderBackground as ComponentType<
  ShaderBackgroundProps & Record<string, unknown>
>;

function StudioShaderCanvas({
  material,
  colors,
  colorBack,
  speed,
  playing,
}: {
  material: MaterialPreset;
  colors: string[];
  colorBack: string;
  speed: number;
  playing: boolean;
}) {
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    if (typeof WebGL2RenderingContext === "undefined") return;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    setWebglReady(true);
  }, []);

  const resolvedProps: Record<string, unknown> = {
    ...(material.extraProps ?? {}),
    ...(material.supportsColors ? { colors } : {}),
    ...(material.colorBack ? { colorBack } : {}),
    ...(material.supportsSpeed ? { speed: playing ? speed : 0 } : {}),
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(90% 80% at 70% 40%, ${colors[2] ?? colors[0]}, ${colors[1] ?? colors[0]} 55%, ${colorBack} 100%)`,
      }}
    >
      {webglReady ? (
        <ShaderAny
          variant={material.variant}
          {...resolvedProps}
          className="h-full w-full"
        />
      ) : null}
    </div>
  );
}

export function BackgroundStudio() {
  const [context, setContext] = useState<StudioContext>("hero");
  const [sceneId, setSceneId] = useState(SCENES[0].id);
  const [materialId, setMaterialId] = useState(SCENES[0].materialId);
  const [colors, setColors] = useState<string[]>(SCENES[0].colors);
  const [colorBack, setColorBack] = useState(SCENES[0].colorBack);
  const [speed, setSpeed] = useState(SCENES[0].speed);
  const [playing, setPlaying] = useState(true);
  const [tuneTab, setTuneTab] = useState<TuneTab>("material");
  const [category, setCategory] = useState<MaterialCategory>("all");
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const activeMaterial =
    MATERIALS.find((item) => item.id === materialId) ?? MATERIALS[0];
  const activeScene =
    SCENES.find((item) => item.id === sceneId) ?? SCENES[0];

  const selectScene = (scene: ScenePreset) => {
    setSceneId(scene.id);
    setMaterialId(scene.materialId);
    setColors(scene.colors);
    setColorBack(scene.colorBack);
    setSpeed(scene.speed);
  };

  const selectMaterial = (mat: MaterialPreset) => {
    setMaterialId(mat.id);
    setColors(mat.defaultColors);
    if (mat.colorBack) setColorBack(mat.colorBack);
  };

  const remix = () => {
    const nextMat = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
    const rotated = [...nextMat.defaultColors.slice(1), nextMat.defaultColors[0]];
    setMaterialId(nextMat.id);
    setColors(rotated);
    if (nextMat.colorBack) setColorBack(nextMat.colorBack);
    setSpeed(Number((0.2 + Math.random() * 0.5).toFixed(2)));
  };

  const filteredMaterials = useMemo(() => {
    if (category === "all") return MATERIALS;
    return MATERIALS.filter((item) => item.category === category);
  }, [category]);

  const codeSnippet = useMemo(() => {
    const propsLines: string[] = [`  variant="${activeMaterial.variant}"`];
    if (activeMaterial.supportsColors) {
      propsLines.push(`  colors={${JSON.stringify(colors)}}`);
    }
    if (activeMaterial.colorBack) {
      propsLines.push(`  colorBack="${colorBack}"`);
    }
    if (activeMaterial.supportsSpeed) {
      propsLines.push(`  speed={${speed}}`);
    }
    for (const [k, v] of Object.entries(activeMaterial.extraProps ?? {})) {
      if (k === "colorBack") continue;
      propsLines.push(
        `  ${k}={${typeof v === "string" ? JSON.stringify(v) : String(v)}}`,
      );
    }
    return `import { ShaderBackground } from "@/components/motion/shader-background";

export function SectionBackground() {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <ShaderBackground
${propsLines.join("\n")}
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative z-10 p-10 text-white">
        {/* Your section content */}
      </div>
    </div>
  );
}`;
  }, [activeMaterial, colors, colorBack, speed]);

  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      setCopiedCode(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Studio top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
          >
            <Image
              src="/beui-mark.png"
              alt=""
              width={24}
              height={24}
              className="size-6 rounded-lg"
            />
            <span>beUI</span>
          </Link>
          <span aria-hidden="true" className="h-4 w-px bg-border" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">
              Background Studio
            </p>
            <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
              Lightweight WebGL · {activeMaterial.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOverlayVisible((v) => !v)}
            className="hidden h-8 items-center rounded-full border border-border bg-card px-3 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            {overlayVisible ? "Hide copy" : "Show copy"}
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause shader" : "Play shader"}
            title={playing ? "Pause shader" : "Play shader"}
            className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            {playing ? (
              <Pause aria-hidden="true" className="size-3.5" />
            ) : (
              <Play aria-hidden="true" className="size-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={remix}
            aria-label="Randomize preset"
            title="Randomize preset"
            className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Shuffle aria-hidden="true" className="size-3.5" />
          </button>
          <ThemeToggle className="hidden sm:block" />

          <CenterMorphModal>
            <CenterMorphModalTrigger>
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Code2 aria-hidden="true" className="size-3.5" />
                <span>Use background</span>
              </button>
            </CenterMorphModalTrigger>
            <CenterMorphModalContent
              ariaLabel={`Use ${activeMaterial.label} background`}
              className="w-full max-w-2xl border border-border bg-background p-6 shadow-2xl"
            >
              <h2 className="text-lg font-medium tracking-tight text-foreground">
                Use {activeMaterial.label} background
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Install <code className="font-mono text-foreground">@beui/shader-background</code>{" "}
                with shadcn or copy the JSX directly.
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-border bg-card px-3 py-2 font-mono text-xs text-foreground">
                  bunx --bun shadcn add @beui/shader-background
                </div>
                <div className="relative rounded-xl border border-border bg-card p-3">
                  <button
                    type="button"
                    onClick={copySnippet}
                    className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
                  >
                    {copiedCode ? (
                      <Check aria-hidden="true" className="size-3.5 text-success" />
                    ) : (
                      <Copy aria-hidden="true" className="size-3.5 text-muted-foreground" />
                    )}
                    <span>{copiedCode ? "Copied" : "Copy JSX"}</span>
                  </button>
                  <pre className="overflow-x-auto pr-20 font-mono text-xs leading-relaxed text-foreground">
                    <code>{codeSnippet}</code>
                  </pre>
                </div>
              </div>
            </CenterMorphModalContent>
          </CenterMorphModal>
        </div>
      </header>

      {/* Main 3-column workbench */}
      <div className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[17rem_minmax(0,1fr)_20rem]">
        {/* Left: Scene library */}
        <aside className="flex flex-col rounded-2xl border border-border bg-card/50 p-3">
          <div>
            <p className="text-xs font-medium text-foreground">Scene library</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Curated starting points for the page.
            </p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
            {(
              [
                { id: "hero", label: "Hero" },
                { id: "content", label: "Content" },
                { id: "cta", label: "Footer CTA" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setContext(item.id)}
                className={cn(
                  "rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                  context === item.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {SCENES.map((scene) => {
              const active = scene.id === sceneId;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => selectScene(scene)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-colors",
                    active
                      ? "border-foreground/20 bg-foreground text-background"
                      : "border-border bg-background/60 text-foreground hover:border-(--color-border-strong)",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="size-10 shrink-0 rounded-lg border border-white/10"
                    style={{
                      background: `radial-gradient(circle at 70% 35%, ${scene.colors[2] ?? scene.colors[0]}, ${scene.colors[0]})`,
                    }}
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">
                      {scene.name}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block line-clamp-2 text-[11px] leading-snug",
                        active ? "text-background/75" : "text-muted-foreground",
                      )}
                    >
                      {scene.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center: Live preview canvas */}
        <section className="flex min-h-[28rem] flex-col rounded-2xl border border-border bg-card/30 p-3">
          <div className="flex items-center justify-between px-1 pb-2.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span>{activeScene.description}</span>
            </span>
            <span className="rounded-full border border-border bg-card px-2.5 py-0.5 font-mono text-[11px]">
              WebGL adaptive
            </span>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-[#0c0c0c]">
            <StudioShaderCanvas
              material={activeMaterial}
              colors={colors}
              colorBack={colorBack}
              speed={speed}
              playing={playing}
            />

            {overlayVisible ? (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                {context === "hero" ? (
                  <>
                    <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] backdrop-blur-md">
                      New material system
                    </span>
                    <h1 className="mt-4 max-w-lg text-balance text-3xl font-medium tracking-tight sm:text-4xl">
                      Make the first frame impossible to ignore.
                    </h1>
                    <p className="mt-2.5 max-w-md text-xs text-white/80 sm:text-sm">
                      A sculpted, responsive field built for launch pages and
                      confident product stories.
                    </p>
                    <div className="pointer-events-auto mt-5 flex items-center gap-2.5">
                      <Link
                        href="/components/motion/shader-background"
                        className="inline-flex h-9 items-center rounded-full bg-white px-4 text-xs font-medium text-[#151515]"
                      >
                        Start building
                      </Link>
                      <Link
                        href="/components"
                        className="inline-flex h-9 items-center rounded-full border border-white/25 bg-black/30 px-4 text-xs font-medium text-white backdrop-blur-md"
                      >
                        See components
                      </Link>
                    </div>
                  </>
                ) : context === "content" ? (
                  <div className="max-w-md rounded-2xl border border-white/15 bg-black/35 p-6 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-wider text-white/65">
                      Section showcase
                    </p>
                    <h2 className="mt-2 text-2xl font-medium tracking-tight">
                      Calm surface behind rich UI
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-white/75">
                      Subtle motion and balanced contrast keep foreground cards
                      legible across both light and dark sections.
                    </p>
                  </div>
                ) : (
                  <div className="max-w-lg">
                    <h2 className="text-3xl font-medium tracking-tight">
                      Ship your next release faster.
                    </h2>
                    <p className="mt-2 text-xs text-white/80 sm:text-sm">
                      Drop this ShaderBackground into any Next.js section with
                      reduced-motion protection built in.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between px-1 pt-3 text-xs">
            <div>
              <p className="font-medium text-foreground">{activeMaterial.label}</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {activeMaterial.variant} · interactive WebGL
              </p>
            </div>
            <button
              type="button"
              onClick={remix}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
            >
              <Shuffle aria-hidden="true" className="size-3.5" />
              <span>Remix this direction</span>
            </button>
          </div>
        </section>

        {/* Right: Tune panel */}
        <aside className="flex flex-col rounded-2xl border border-border bg-card/50 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-foreground">
                Tune the scene
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Only the controls that shape this background.
              </p>
            </div>
            <button
              type="button"
              onClick={() => selectScene(SCENES[0])}
              aria-label="Reset scene"
              title="Reset scene"
              className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 border-b border-border text-xs">
            {(
              [
                { id: "material", label: "Material" },
                { id: "color", label: "Color" },
                { id: "finish", label: "Finish" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTuneTab(t.id)}
                className={cn(
                  "border-b-2 pb-2 font-medium transition-colors",
                  tuneTab === t.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tuneTab === "material" ? (
            <div className="mt-3 flex-1">
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    { id: "all", label: "All" },
                    { id: "flow", label: "Flow" },
                    { id: "light", label: "Light" },
                    { id: "organic", label: "Organic" },
                    { id: "pattern", label: "Pattern" },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      category === cat.id
                        ? "bg-foreground text-background"
                        : "bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {filteredMaterials.map((mat) => {
                  const active = mat.id === materialId;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => selectMaterial(mat)}
                      className={cn(
                        "overflow-hidden rounded-xl border p-1.5 text-left transition-colors",
                        active
                          ? "border-primary bg-background"
                          : "border-border bg-card/60 hover:border-(--color-border-strong)",
                      )}
                    >
                      <div
                        className="h-14 w-full rounded-lg"
                        style={{
                          background: mat.previewGradient,
                          backgroundSize:
                            mat.id === "dot-grid" ? "10px 10px" : undefined,
                        }}
                      />
                      <p className="mt-1.5 truncate text-xs font-medium text-foreground">
                        {mat.label}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {mat.category}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {tuneTab === "color" ? (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Palette stops for {activeMaterial.label}
              </p>
              <div className="space-y-2">
                {colors.map((hex, idx) => (
                  <label
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed ordered palette stops
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-2 text-xs"
                  >
                    <span className="text-muted-foreground">
                      Stop {idx + 1}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-foreground">{hex}</span>
                      <input
                        type="color"
                        value={hex}
                        onChange={(e) => {
                          const next = [...colors];
                          next[idx] = e.target.value;
                          setColors(next);
                        }}
                        className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          {tuneTab === "finish" ? (
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Motion speed</span>
                  <span className="font-mono text-foreground tabular-nums">
                    {speed.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1.5}
                  step={0.05}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="mt-2 w-full accent-primary"
                />
              </div>

              <label className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-xs">
                <span className="text-foreground">Playback active</span>
                <input
                  type="checkbox"
                  checked={playing}
                  onChange={(e) => setPlaying(e.target.checked)}
                  className="size-4 accent-primary"
                />
              </label>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
