"use client";

import {
  CircleCheck,
  CircleDashed,
  CircleDot,
  CirclePause,
  X,
} from "lucide-react";
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
import { MorphingModal } from "@/components/motion/morphing-modal";

const STATUS_OPTIONS = [
  { value: "todo", label: "To do", icon: <CircleDashed className="size-4 text-muted-foreground" /> },
  { value: "in-progress", label: "In progress", icon: <CircleDot className="size-4 text-muted-foreground" /> },
  { value: "paused", label: "Paused", icon: <CirclePause className="size-4 text-muted-foreground" /> },
  { value: "done", label: "Done", icon: <CircleCheck className="size-4 text-muted-foreground" /> },
];

const TIMEZONES = [
  {
    group: "Americas",
    items: [
      { value: "america/los_angeles", label: "Los Angeles", description: "UTC−8" },
      { value: "america/chicago", label: "Chicago", description: "UTC−6" },
      { value: "america/new_york", label: "New York", description: "UTC−5" },
      { value: "america/sao_paulo", label: "São Paulo", description: "UTC−3" },
    ],
  },
  {
    group: "Europe",
    items: [
      { value: "europe/london", label: "London", description: "UTC+0" },
      { value: "europe/paris", label: "Paris", description: "UTC+1" },
      { value: "europe/berlin", label: "Berlin", description: "UTC+1" },
      { value: "europe/istanbul", label: "Istanbul", description: "UTC+3" },
    ],
  },
  {
    group: "Asia & Pacific",
    items: [
      { value: "asia/dubai", label: "Dubai", description: "UTC+4" },
      { value: "asia/singapore", label: "Singapore", description: "UTC+8" },
      { value: "asia/tokyo", label: "Tokyo", description: "UTC+9" },
      { value: "australia/sydney", label: "Sydney", description: "UTC+10" },
    ],
  },
];

export function AnimatedSelectPreview() {
  const [status, setStatus] = useState("in-progress");
  const [plan, setPlan] = useState("team");
  const [timezone, setTimezone] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTimezone, setModalTimezone] = useState("");
  const [modalStatus, setModalStatus] = useState("in-progress");

  return (
    <div className="flex w-full flex-col items-center gap-6 py-4">
      <div className="flex flex-wrap items-end justify-center gap-4">
        <div className="space-y-1.5">
          <p className="px-1 text-xs text-muted-foreground">Status</p>
          <AnimatedSelect value={status} onValueChange={setStatus}>
            <AnimatedSelectTrigger ariaLabel="Status" className="w-[158px]">
              <AnimatedSelectValue />
            </AnimatedSelectTrigger>
            <AnimatedSelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <AnimatedSelectItem
                  key={opt.value}
                  value={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                />
              ))}
            </AnimatedSelectContent>
          </AnimatedSelect>
        </div>

        <div className="space-y-1.5">
          <p className="px-1 text-xs text-muted-foreground">Plan</p>
          <AnimatedSelect value={plan} onValueChange={setPlan}>
            <AnimatedSelectTrigger ariaLabel="Plan" className="w-[158px]">
              <AnimatedSelectValue />
            </AnimatedSelectTrigger>
            <AnimatedSelectContent className="w-[196px]">
              <AnimatedSelectItem
                value="starter"
                label="Starter"
                description="One project, community help"
              />
              <AnimatedSelectItem
                value="team"
                label="Team"
                description="Unlimited projects, 10 seats"
              />
              <AnimatedSelectItem
                value="scale"
                label="Scale"
                description="SSO, audit log, priority help"
              />
              <AnimatedSelectSeparator />
              <AnimatedSelectItem
                value="legacy"
                label="Legacy"
                description="No longer offered"
                disabled
              />
            </AnimatedSelectContent>
          </AnimatedSelect>
        </div>

        <div className="space-y-1.5">
          <p className="px-1 text-xs text-muted-foreground">Time zone</p>
          <AnimatedSelect value={timezone} onValueChange={setTimezone} required>
            <AnimatedSelectTrigger ariaLabel="Time zone" className="w-[204px]">
              <AnimatedSelectValue placeholder="Pick a time zone" />
            </AnimatedSelectTrigger>
            <AnimatedSelectContent
              searchable
              searchPlaceholder="Search cities"
              className="w-[204px]"
            >
              {TIMEZONES.map((section) => (
                <AnimatedSelectGroup key={section.group}>
                  <AnimatedSelectLabel>{section.group}</AnimatedSelectLabel>
                  {section.items.map((tz) => (
                    <AnimatedSelectItem
                      key={tz.value}
                      value={tz.value}
                      label={tz.label}
                      description={tz.description}
                    />
                  ))}
                </AnimatedSelectGroup>
              ))}
            </AnimatedSelectContent>
          </AnimatedSelect>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setModalTimezone(timezone);
          setModalStatus(status);
          setModalOpen(true);
        }}
        className="text-xs font-normal text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
      >
        Try it in a dialog
      </button>

      <MorphingModal
        viewId={modalOpen ? "meeting-settings" : null}
        onClose={() => setModalOpen(false)}
        placement="center"
        ariaLabel="Meeting settings"
        className="max-w-[360px]"
      >
        <div className="-m-5">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-base font-medium text-foreground">
              Meeting settings
            </h3>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Time zone</p>
              <AnimatedSelect value={modalTimezone} onValueChange={setModalTimezone}>
                <AnimatedSelectTrigger ariaLabel="Meeting time zone" className="w-[204px]">
                  <AnimatedSelectValue placeholder="Pick a time zone" />
                </AnimatedSelectTrigger>
                <AnimatedSelectContent
                  searchable
                  searchPlaceholder="Search cities"
                  className="w-[204px]"
                >
                  {TIMEZONES.map((section) => (
                    <AnimatedSelectGroup key={section.group}>
                      <AnimatedSelectLabel>{section.group}</AnimatedSelectLabel>
                      {section.items.map((tz) => (
                        <AnimatedSelectItem
                          key={tz.value}
                          value={tz.value}
                          label={tz.label}
                          description={tz.description}
                        />
                      ))}
                    </AnimatedSelectGroup>
                  ))}
                </AnimatedSelectContent>
              </AnimatedSelect>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Status</p>
              <AnimatedSelect value={modalStatus} onValueChange={setModalStatus}>
                <AnimatedSelectTrigger ariaLabel="Meeting status" className="w-[158px]">
                  <AnimatedSelectValue />
                </AnimatedSelectTrigger>
                <AnimatedSelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <AnimatedSelectItem
                      key={opt.value}
                      value={opt.value}
                      label={opt.label}
                      icon={opt.icon}
                    />
                  ))}
                </AnimatedSelectContent>
              </AnimatedSelect>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-5 pb-5 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setTimezone(modalTimezone);
                setStatus(modalStatus);
                setModalOpen(false);
              }}
              className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Save
            </button>
          </div>
        </div>
      </MorphingModal>
    </div>
  );
}
