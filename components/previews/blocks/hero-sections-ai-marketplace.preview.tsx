"use client";

import { AiMarketplaceHero, type HeroMatch } from "@/components/motion/hero-sections";

const specialists = [
  { id: "research", label: "Research the market", prompt: "Summarize the customer research" },
  { id: "writing", label: "Shape a launch plan", prompt: "Draft an evidence-backed launch story" },
  { id: "ops", label: "Review customer calls", prompt: "Review the onboarding workflow" },
];
const candidates = [
  { id: "research", name: "Mira · Research partner", terms: /research|customer|feedback|market|interview/i },
  { id: "writing", name: "Nico · Writing partner", terms: /write|writing|launch|story|draft|copy/i },
  { id: "ops", name: "Ari · Operations partner", terms: /operation|workflow|onboard|process|schedule/i },
];
export function HeroAiMarketplacePreview() {
  return <AiMarketplaceHero eyebrow="A workspace for considered AI help" title={<>The right specialist.<br/>The useful next step.</>} description="A local matching presentation. Attach a text brief to influence the matches. Web search requires a host provider and reports its absence here. Use “none” or “error” to inspect empty and rejected states." primary={{ label: "Explore the components", href: "/components" }} secondary={{ label: "Read the integration guide", href: "/docs" }} navigation={{ brand: { label: "Fieldwork", href: "/" }, links: [{ label: "Components", href: "/components" }, { label: "Documentation", href: "/docs" }] }} specialists={specialists} prompts={["Compare three launch strategies", "Create a weekly customer digest", "Review our onboarding notes"]} onMatch={async (prompt, context): Promise<HeroMatch[]> => {
    if (prompt.toLowerCase().includes("error")) throw new Error("Local presentation matching was rejected. No external service was contacted.");
    if (context?.webSearch) throw new Error("Web search was requested, but this presentation has no search provider. Turn web search off to run local matching, or supply a real host onMatch adapter.");
    if (prompt.toLowerCase().includes("none")) return [];
    const files = context?.files ?? [];
    const attachedText = await Promise.all(files.map(file => file.type.startsWith("text/") || /\.(txt|md|json|csv)$/i.test(file.name) ? file.text() : Promise.resolve(file.name)));
    const brief = [prompt, ...attachedText].join("\n");
    const matched = candidates.filter(candidate => candidate.terms.test(brief));
    return matched.map(candidate => ({ id: candidate.id, name: candidate.name, description: `Local presentation match for “${prompt}”${files.length ? ` using ${files.length} selected context file${files.length === 1 ? "" : "s"}` : ""}. No external matching or web-search service was called.`, href: candidate.id === "research" ? "/docs" : "/components" }));
  }}/>;
}
