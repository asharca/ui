"use client";

import { Bot, Brain, Building2, Circle, Sparkles } from "lucide-react";
import { useState } from "react";
import { Selector } from "@/components/motion/selector";
import type { SelectorOption } from "@/components/motion/selector";

const MODELS: SelectorOption[] = [
  {
    id: "claude-sonnet",
    name: "Claude Sonnet",
    group: "Anthropic",
    description: "Balanced reasoning and everyday coding",
    metadata: "200K",
    keywords: ["reasoning", "vision", "tools"],
    icon: <Brain className="size-4" />,
    details: (
      <div className="space-y-2">
        <p className="font-medium">Claude Sonnet</p>
        <p className="text-sm text-muted-foreground">
          A balanced choice for writing, analysis, and everyday coding. Supports
          images and tools with a 200K-token context window.
        </p>
      </div>
    ),
  },
  {
    id: "claude-opus",
    name: "Claude Opus",
    group: "Anthropic",
    description: "Deep reasoning for complex work",
    metadata: "200K",
    keywords: ["reasoning", "analysis"],
    icon: <Brain className="size-4" />,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    group: "OpenAI",
    description: "Fast, multimodal conversations",
    metadata: "128K",
    keywords: ["vision", "tools"],
    icon: <Sparkles className="size-4" />,
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    group: "OpenAI",
    description: "Precise instructions and a larger context",
    metadata: "1M",
    keywords: ["coding", "tools"],
    icon: <Sparkles className="size-4" />,
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    group: "Google",
    description: "Reason across documents, images, and code",
    metadata: "1M",
    keywords: ["vision", "reasoning"],
    icon: <Bot className="size-4" />,
  },
];

export function SelectorPreview() {
  const [model, setModel] = useState("claude-sonnet");

  return (
    <div className="w-full max-w-md space-y-4">
      <p className="font-medium text-sm">Choose your model</p>
      <Selector
        options={MODELS}
        value={model}
        onValueChange={setModel}
        triggerVariant="pill"
        label="Models"
        searchPlaceholder="Search models…"
      />
      <p aria-live="polite" className="text-xs text-muted-foreground">
        Using {MODELS.find((option) => option.id === model)?.name}.
      </p>
      <p className="text-xs text-muted-foreground">
        Search by model, provider, or capability. Hover or focus Claude Sonnet
        for details. Customize the trigger and panel with classNames.
      </p>
    </div>
  );
}

const PEOPLE: SelectorOption[] = [
  { id: "ava", name: "Ava Thompson", description: "ava@studio.co", metadata: "Design", group: "Your team" },
  { id: "noah", name: "Noah Williams", description: "noah@studio.co", metadata: "Engineering", group: "Your team" },
  { id: "mia", name: "Mia Chen", description: "mia@studio.co", metadata: "Product", group: "Your team" },
  { id: "leo", name: "Leo Martin", description: "leo@partner.co", metadata: "Guest", group: "Collaborators" },
].map((person) => ({
  ...person,
  icon: (
    <span className="flex size-7 items-center justify-center rounded-full border bg-muted text-[10px] font-medium">
      {person.name.split(" ").map((part) => part[0]).join("")}
    </span>
  ),
}));

export function SelectorPeopleSinglePreview() {
  const [person, setPerson] = useState("");

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <p className="font-medium text-sm">Choose an assignee</p>
        <p className="text-xs text-muted-foreground">
          Search by name or email and choose one person responsible for the task.
        </p>
      </div>
      <Selector
        options={PEOPLE}
        value={person}
        onValueChange={setPerson}
        placeholder="Assign to someone"
        searchPlaceholder="Search people…"
        label="Assignee"
      />
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {person ? `Assigned to ${PEOPLE.find((option) => option.id === person)?.name}.` : "No assignee yet."}
      </p>
    </div>
  );
}

export function SelectorPeoplePreview() {
  const [people, setPeople] = useState<string[]>(["ava", "mia"]);

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <p className="font-medium text-sm">Share with your team</p>
        <p className="text-xs text-muted-foreground">
          Search names or emails, then select everyone who needs access.
        </p>
      </div>
      <Selector
        multiple
        options={PEOPLE}
        value={people}
        onValueChange={setPeople}
        triggerVariant="field"
        placeholder="Add people"
        searchPlaceholder="Search people…"
        label="People"
      />
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {people.length === 0
          ? "Only you have access."
          : `Shared with ${people.length} ${people.length === 1 ? "person" : "people"}.`}
      </p>
      <p className="text-xs text-muted-foreground">
        Remove a chip to revoke access, or choose Done when finished.
      </p>
    </div>
  );
}

const WORKSPACES: SelectorOption[] = [
  {
    id: "studio",
    name: "Studio",
    description: "Pro plan · 12 members",
    group: "Team workspaces",
    icon: <Building2 className="size-4" />,
  },
  {
    id: "engineering",
    name: "Engineering",
    description: "Pro plan · 8 members",
    group: "Team workspaces",
    icon: <Building2 className="size-4" />,
  },
  {
    id: "personal",
    name: "Personal",
    description: "Free plan · Just you",
    group: "Personal workspaces",
    icon: <Circle className="size-4" />,
  },
];

export function SelectorWorkspacePreview() {
  const [options, setOptions] = useState(WORKSPACES);
  const [workspace, setWorkspace] = useState("studio");

  function createWorkspace() {
    const number = options.length - WORKSPACES.length + 1;
    const id = `new-workspace-${number}`;
    setOptions([
      ...options,
      {
        id,
        name: `New workspace ${number}`,
        description: "Free plan · Just you",
        group: "Team workspaces",
        icon: <Building2 className="size-4" />,
      },
    ]);
    setWorkspace(id);
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <p className="font-medium text-sm">Your work, in one place</p>
        <p className="text-xs text-muted-foreground">
          Switch between team and personal workspaces.
        </p>
      </div>
      <Selector
        options={options}
        value={workspace}
        onValueChange={setWorkspace}
        triggerVariant="workspace"
        searchPlaceholder="Find a workspace…"
        label="Workspaces"
        action={{ label: "Create workspace", onSelect: createWorkspace }}
      />
      <p aria-live="polite" className="text-xs text-muted-foreground">
        Current workspace: {options.find((option) => option.id === workspace)?.name}.
      </p>
      <p className="text-xs text-muted-foreground">
        Create workspace adds a new workspace and switches to it immediately.
        New workspaces live in this demo until the page is refreshed.
      </p>
    </div>
  );
}

function TemplateThumbnail({ variant }: { variant: "dashboard" | "editorial" | "board" | "portfolio" }) {
  return (
    <div aria-hidden="true" className="flex aspect-[16/10] w-full overflow-hidden rounded-lg border bg-background p-2 text-foreground">
      {variant === "dashboard" ? (
        <>
          <div className="mr-2 w-1/5 space-y-2 border-r pr-2">
            <div className="h-2 w-3 rounded-sm bg-foreground/60" />
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-1 rounded bg-foreground/15" />)}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-1.5 w-1/2 rounded bg-foreground/40" />
            <div className="grid grid-cols-3 gap-1">
              {[0, 1, 2].map((item) => <div key={item} className="h-5 rounded border bg-foreground/5" />)}
            </div>
            <div className="flex flex-1 items-end gap-1 rounded border p-1">
              {[30, 55, 40, 75, 60, 90, 70].map((height) => <div key={height} className="flex-1 rounded-t-sm bg-foreground/25" style={{ height: `${height}%` }} />)}
            </div>
          </div>
        </>
      ) : variant === "editorial" ? (
        <div className="flex w-full flex-col gap-2">
          <div className="h-1 w-full border-b" />
          <div className="mx-auto h-2 w-2/3 rounded-sm bg-foreground/60" />
          <div className="mx-auto h-1 w-1/3 rounded bg-foreground/20" />
          <div className="flex flex-1 gap-2">
            <div className="w-1/2 rounded bg-foreground/10" />
            <div className="flex-1 space-y-1.5 pt-1">
              {[0, 1, 2, 3, 4].map((item) => <div key={item} className="h-1 rounded bg-foreground/15 last:w-2/3" />)}
            </div>
          </div>
        </div>
      ) : variant === "board" ? (
        <div className="flex w-full flex-col gap-2">
          <div className="h-1.5 w-1/3 rounded bg-foreground/50" />
          <div className="grid flex-1 grid-cols-3 gap-1.5">
            {[2, 3, 1].map((count) => (
              <div key={count} className="space-y-1 rounded bg-foreground/5 p-1">
                <div className="mb-2 h-1 w-2/3 rounded bg-foreground/25" />
                {["first", "second", "third"].slice(0, count).map((card) => <div key={card} className="h-4 rounded-sm border bg-background" />)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          <div className="flex justify-between"><div className="h-1.5 w-6 rounded bg-foreground/50" /><div className="h-1 w-8 rounded bg-foreground/15" /></div>
          <div className="mt-1 h-2 w-2/3 rounded-sm bg-foreground/60" />
          <div className="h-1 w-1/2 rounded bg-foreground/20" />
          <div className="grid flex-1 grid-cols-2 gap-2"><div className="rounded bg-foreground/10" /><div className="rounded bg-foreground/20" /></div>
        </div>
      )}
    </div>
  );
}

const RESOURCES: SelectorOption[] = [
  { id: "dashboard", name: "Dashboard", description: "Metrics at a glance", metadata: "12 blocks", preview: <TemplateThumbnail variant="dashboard" />, keywords: ["analytics", "charts"] },
  { id: "editorial", name: "Editorial", description: "Stories worth reading", metadata: "8 blocks", preview: <TemplateThumbnail variant="editorial" />, keywords: ["blog", "writing"] },
  { id: "board", name: "Project board", description: "A little more organized", metadata: "6 blocks", preview: <TemplateThumbnail variant="board" />, keywords: ["kanban", "tasks"] },
  { id: "portfolio", name: "Portfolio", description: "Make your work the focus", metadata: "10 blocks", preview: <TemplateThumbnail variant="portfolio" />, keywords: ["gallery", "personal"] },
];

export function SelectorResourcesPreview() {
  const [resource, setResource] = useState("dashboard");

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <p className="font-medium text-sm">Start with a template</p>
        <p className="text-xs text-muted-foreground">
          Browse the previews or search for a layout that fits your next project.
        </p>
      </div>
      <Selector
        options={RESOURCES}
        value={resource}
        onValueChange={setResource}
        layout="grid"
        triggerVariant="field"
        classNames={{ content: "w-[30rem]", list: "max-h-[26rem]" }}
        label="Templates"
        searchPlaceholder="Search templates…"
      />
      <p aria-live="polite" className="text-xs text-muted-foreground">
        Selected template: {RESOURCES.find((option) => option.id === resource)?.name}.
      </p>
    </div>
  );
}
