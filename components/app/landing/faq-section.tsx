import Link from "next/link";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { GITHUB_REPOSITORY_URL, GITHUB_LICENSE_URL } from "@/lib/repository";

const FAQS = [
  {
    id: "license",
    title: "Is everything free and open source for commercial projects?",
    description: (
      <>
        Yes. The library components and templates in this repository are MIT
        licensed, including commercial use and customization. Keep the copyright
        and license notice in copies or substantial portions of the source.{" "}
        <a
          className="underline underline-offset-4"
          href={GITHUB_LICENSE_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          Read the license
        </a>
        .
      </>
    ),
  },
  {
    id: "install",
    title: "How do I install a component or block?",
    description: (
      <>
        Open any component page and copy its shadcn CLI command, such as{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          bunx --bun shadcn add @beui/hero-sections
        </code>
        . You can also switch between npm, pnpm, and yarn, or copy the TypeScript
        source directly from the Code tab. See the{" "}
        <Link className="underline underline-offset-4" href="/docs/installation">
          installation guide
        </Link>
        .
      </>
    ),
  },
  {
    id: "ownership",
    title: "Do I own the component code after installing?",
    description:
      "Yes. Everything uses copy-paste source ownership: the real files land directly inside your project so you can adapt styles, animations, and behavior without fighting package overrides.",
  },
  {
    id: "stack",
    title: "What does my project need?",
    description: (
      <>
        Web components are built for React 19, Next.js App Router, Tailwind CSS
        v4, and Motion. Start with the{" "}
        <Link className="underline underline-offset-4" href="/docs/theme">
          theme setup guide
        </Link>{" "}
        to add the shared CSS tokens, and check{" "}
        <Link className="underline underline-offset-4" href="/docs/native-setup">
          React Native setup
        </Link>{" "}
        for Expo and mobile screens.
      </>
    ),
  },
  {
    id: "agents",
    title: "Can AI coding agents discover and install components?",
    description: (
      <>
        Yes. This site publishes machine-readable{" "}
        <Link className="underline underline-offset-4" href="/llms.txt">
          llms.txt
        </Link>
        , shadcn registry JSON, and an{" "}
        <Link className="underline underline-offset-4" href="/docs/ai-agents">
          AI agents guide
        </Link>{" "}
        plus Agent Skill hosted on{" "}
        <a
          className="underline underline-offset-4"
          href={GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </a>
        .
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <section id="faqs" className="scroll-mt-28 px-4 py-14 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,36rem)] lg:items-start lg:gap-12">
        <div className="max-w-lg">
          <p className="text-sm text-muted-foreground">FAQs</p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Questions before starting.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Built around copy-paste source ownership and open standards, not a
            locked black-box package.
          </p>
        </div>

        <div className="w-full lg:max-w-xl">
          <BouncyAccordion items={FAQS} className="w-full" />
        </div>
      </div>
    </section>
  );
}
