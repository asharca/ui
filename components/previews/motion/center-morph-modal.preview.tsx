"use client";

import { ArrowUpRight, Check } from "lucide-react";
import {
  CenterMorphModal,
  CenterMorphModalContent,
  CenterMorphModalTrigger,
} from "@/components/motion/center-morph-modal";

export function CenterMorphModalPreview() {
  return (
    <div className="flex min-h-[420px] w-full items-center justify-center">
      <CenterMorphModal>
        <CenterMorphModalTrigger>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Open modal
          </button>
        </CenterMorphModalTrigger>

        <CenterMorphModalContent
          ariaLabel="Workspace overview"
          ariaDescribedBy="center-morph-workspace-description"
        >
          <div className="p-7 sm:p-8">
            <p className="text-sm font-medium text-muted-foreground">
              Workspace overview
            </p>
            <h2 className="mt-5 max-w-xs pr-8 text-2xl font-medium tracking-tight text-foreground">
              Keep your work together.
            </h2>
            <p
              id="center-morph-workspace-description"
              className="mt-3 text-sm leading-relaxed text-muted-foreground"
            >
              Organize your tools and drafts in a workspace built with
              reusable components and accessible interactions.
            </p>

            <div className="mt-7 space-y-3 border-y border-border py-5">
              {[
                "Flexible workspace layouts",
                "Keyboard-friendly navigation",
                "Editable open-source components",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <Check
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <a
              href="/workspace"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background press focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open workspace
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </CenterMorphModalContent>
      </CenterMorphModal>
    </div>
  );
}
