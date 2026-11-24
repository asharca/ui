"use client";

import { ArrowLeft, CheckCircle2, MapPin, Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/motion/button";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface HiringStage {
  step: string;
  title: string;
  duration: string;
  detail: string;
}

export interface CareerRoleDetail {
  department: string;
  title: string;
  location: string;
  employment: string;
  compensation: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  teamSummary: string;
  hiringProcess: HiringStage[];
}

export interface CareersRoleDetailProps {
  role: CareerRoleDetail;
  backHref?: string;
  onSubmitApplication?: (payload: {
    name: string;
    email: string;
    portfolio: string;
    note: string;
  }) => void;
  className?: string;
}

/** Open role detail layout with animated hiring timeline and stateful application card. */
export function CareersRoleDetail({
  role,
  backHref = "#roles",
  onSubmitApplication,
  className,
}: CareersRoleDetailProps) {
  const reduce = useReducedMotion() ?? false;
  const [applying, setApplying] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmitApplication?.({ name, email, portfolio, note });
    setSubmitted(true);
    setApplying(false);
  };

  return (
    <article
      aria-label={role.title}
      className={cn(
        "mx-auto w-full max-w-5xl rounded-3xl border border-border bg-background p-6 text-foreground sm:p-10",
        className,
      )}
    >
      <a
        href={backHref}
        onClick={(event) => {
          if (backHref.startsWith("#")) event.preventDefault();
        }}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All open roles
      </a>

      <header className="mt-5 border-b border-border pb-6">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {role.department}
        </span>
        <h3 className="mt-2 text-3xl font-medium tracking-tight sm:text-4xl">
          {role.title}
        </h3>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden="true" className="size-3.5" />
            {role.location}
          </span>
          <span aria-hidden="true">·</span>
          <span>{role.employment}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono text-foreground">{role.compensation}</span>
        </div>
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div className="space-y-8">
          <section>
            <h4 className="text-base font-semibold text-foreground">About the role</h4>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {role.about}
            </p>
          </section>

          <section>
            <h4 className="text-base font-semibold text-foreground">
              What you&apos;ll do
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {role.responsibilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-base font-semibold text-foreground">
              What you bring
            </h4>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
              {role.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-base font-semibold text-foreground">
              Who you&apos;ll work with
            </h4>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {role.teamSummary}
            </p>
          </section>

          <section>
            <h4 className="text-base font-semibold text-foreground">How we hire</h4>
            <ol className="mt-4 space-y-3 border-l border-border pl-4">
              {role.hiringProcess.map((stage, idx) => (
                <motion.li
                  key={stage.step}
                  initial={reduce ? false : { opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: idx * 0.06, ease: EASE_OUT }}
                  className="rounded-2xl border border-border bg-card p-3.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      {stage.step} · {stage.title}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {stage.duration}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{stage.detail}</p>
                </motion.li>
              ))}
            </ol>
          </section>
        </div>

        {/* Pinned sidebar card */}
        <aside className="rounded-3xl border border-border bg-card p-5 lg:sticky lg:top-20">
          <p className="text-xs text-muted-foreground">Compensation</p>
          <p className="mt-1 font-mono text-xl font-semibold text-foreground">
            {role.compensation}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {role.location} · {role.employment} · Equity included
          </p>

          <AnimatePresence mode="wait" initial={false}>
            {submitted ? (
              <motion.div
                key="thanks"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs"
              >
                <div className="flex items-center gap-2 font-semibold text-emerald-500">
                  <CheckCircle2 aria-hidden="true" className="size-4" />
                  Application received
                </div>
                <p className="mt-1.5 leading-relaxed text-muted-foreground">
                  Thanks for applying{name ? `, ${name}` : ""}. We review every note
                  personally within three business days.
                </p>
              </motion.div>
            ) : applying ? (
              <motion.form
                key="form"
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                onSubmit={handleSubmit}
                className="mt-5 space-y-3"
              >
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  aria-label="Full name"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  aria-label="Email address"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                  type="url"
                  value={portfolio}
                  onChange={(event) => setPortfolio(event.target.value)}
                  placeholder="Portfolio or GitHub URL"
                  aria-label="Portfolio or GitHub URL"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <textarea
                  rows={3}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Link something you built that felt unusually smooth..."
                  aria-label="Short application note"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setApplying(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="flex-1">
                    <Send aria-hidden="true" className="size-3.5" />
                    Submit
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="cta"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5"
              >
                <Button className="w-full" onClick={() => setApplying(true)}>
                  Apply for this role
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </article>
  );
}
