"use client";

import type { ReactNode } from "react";
import { PhoneStage } from "@/components/mobile/phone-frame";
import { mobilePreviews } from "@/components/mobile/previews";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs";
import type { MobileScreenVariant } from "@/lib/mobile-screens";

export function MobileVariantSection({
  variant,
  usageNode,
  sourceNode,
}: {
  variant: MobileScreenVariant;
  usageNode: ReactNode;
  sourceNode: ReactNode;
}) {
  const Preview = mobilePreviews[variant.previewKey];

  return (
    <section id={variant.slug} className="scroll-mt-24">
      <div className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              {variant.name}
            </h2>
            <span className="rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {variant.kind}
            </span>
          </div>
          <code className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-[11px] text-foreground">
            {variant.filename.split("/").pop()}
          </code>
        </div>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {variant.description}
        </p>
      </div>

      <Tabs defaultValue="preview" variant="pill">
        <TabsList>
          <TabsTrigger
            value="preview"
            indicatorClassName="bg-background"
            className="aria-[selected=true]:text-foreground [&_[data-tabs-label]]:text-foreground"
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="usage"
            indicatorClassName="bg-background"
            className="aria-[selected=true]:text-foreground [&_[data-tabs-label]]:text-foreground"
          >
            Usage
          </TabsTrigger>
          <TabsTrigger
            value="code"
            indicatorClassName="bg-background"
            className="aria-[selected=true]:text-foreground [&_[data-tabs-label]]:text-foreground"
          >
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <PhoneStage title={variant.name}>
            {Preview ? <Preview /> : null}
          </PhoneStage>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          {usageNode}
        </TabsContent>

        <TabsContent value="code" className="mt-4">
          {sourceNode}
        </TabsContent>
      </Tabs>
    </section>
  );
}
