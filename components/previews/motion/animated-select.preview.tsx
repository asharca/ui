"use client";

import { CheckCircle2, Circle, CircleDashed, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  AnimatedSelect,
  AnimatedSelectContent,
  AnimatedSelectGroup,
  AnimatedSelectItem,
  AnimatedSelectLabel,
  AnimatedSelectSeparator,
  AnimatedSelectTrigger,
  AnimatedSelectValue,
} from "@/components/motion/animated-select";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";

export function AnimatedSelectPreview() {
  const [status, setStatus] = useState("in-progress");
  const [plan, setPlan] = useState("team");
  const [timezone, setTimezone] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-6 py-4">
      <div className="flex flex-wrap items-end justify-center gap-4">
        <div className="space-y-1.5">
          <p className="px-1 text-xs text-muted-foreground">Status</p>
          <AnimatedSelect value={status} onValueChange={setStatus}>
            <AnimatedSelectTrigger ariaLabel="Status">
              <AnimatedSelectValue />
            </AnimatedSelectTrigger>
            <AnimatedSelectContent>
              <AnimatedSelectItem
                value="backlog"
                label="Backlog"
                icon={<CircleDashed className="size-3.5 text-muted-foreground" />}
              />
              <AnimatedSelectItem
                value="in-progress"
                label="In progress"
                icon={<Clock className="size-3.5 text-primary" />}
              />
              <AnimatedSelectItem
                value="review"
                label="In review"
                icon={<Circle className="size-3.5 text-amber-500" />}
              />
              <AnimatedSelectItem
                value="done"
                label="Completed"
                icon={<CheckCircle2 className="size-3.5 text-emerald-500" />}
              />
            </AnimatedSelectContent>
          </AnimatedSelect>
        </div>

        <div className="space-y-1.5">
          <p className="px-1 text-xs text-muted-foreground">Plan</p>
          <AnimatedSelect value={plan} onValueChange={setPlan}>
            <AnimatedSelectTrigger ariaLabel="Plan">
              <AnimatedSelectValue />
            </AnimatedSelectTrigger>
            <AnimatedSelectContent className="w-64">
              <AnimatedSelectItem
                value="starter"
                label="Starter"
                description="Up to 3 workspace projects"
              />
              <AnimatedSelectItem
                value="team"
                label="Team"
                description="Shared library and unlimited seats"
              />
              <AnimatedSelectSeparator />
              <AnimatedSelectItem
                value="enterprise"
                label="Enterprise"
                description="SSO, audit log, and custom SLA"
                icon={<Sparkles className="size-3.5 text-primary" />}
              />
            </AnimatedSelectContent>
          </AnimatedSelect>
        </div>

        <div className="space-y-1.5">
          <p className="px-1 text-xs text-muted-foreground">Time zone</p>
          <AnimatedSelect value={timezone} onValueChange={setTimezone} required>
            <AnimatedSelectTrigger ariaLabel="Time zone">
              <AnimatedSelectValue placeholder="Pick a time zone" />
            </AnimatedSelectTrigger>
            <AnimatedSelectContent
              searchable
              searchPlaceholder="Search city or offset..."
              className="w-64"
            >
              <AnimatedSelectGroup>
                <AnimatedSelectLabel>Americas</AnimatedSelectLabel>
                <AnimatedSelectItem
                  value="america/los_angeles"
                  label="San Francisco"
                  description="UTC-8 · Pacific Time"
                />
                <AnimatedSelectItem
                  value="america/new_york"
                  label="New York"
                  description="UTC-5 · Eastern Time"
                />
              </AnimatedSelectGroup>
              <AnimatedSelectSeparator />
              <AnimatedSelectGroup>
                <AnimatedSelectLabel>Europe & Asia</AnimatedSelectLabel>
                <AnimatedSelectItem
                  value="europe/london"
                  label="London"
                  description="UTC+0 · GMT"
                />
                <AnimatedSelectItem
                  value="asia/tokyo"
                  label="Tokyo"
                  description="UTC+9 · JST"
                />
              </AnimatedSelectGroup>
            </AnimatedSelectContent>
          </AnimatedSelect>
        </div>
      </div>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => setModalOpen(true)}
      >
        Try it in a dialog
      </Button>

      <MorphingModal
        viewId={modalOpen ? "select-dialog" : null}
        onClose={() => setModalOpen(false)}
        placement="center"
        ariaLabel="Animated select inside dialog"
        className="max-w-md"
      >
        <div className="space-y-4 p-2">
          <div>
            <h3 className="text-base font-medium text-foreground">
              Portal layering inside a dialog
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Menus render in a top-layer portal so modal clipping never cuts them off.
            </p>
          </div>
          <AnimatedSelect value={status} onValueChange={setStatus}>
            <AnimatedSelectTrigger ariaLabel="Modal status">
              <AnimatedSelectValue />
            </AnimatedSelectTrigger>
            <AnimatedSelectContent>
              <AnimatedSelectItem value="backlog" label="Backlog" />
              <AnimatedSelectItem value="in-progress" label="In progress" />
              <AnimatedSelectItem value="done" label="Completed" />
            </AnimatedSelectContent>
          </AnimatedSelect>
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={() => setModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </MorphingModal>
    </div>
  );
}
