"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button";
import { Marquee } from "@/components/motion/marquee";
import { useMarketingPlayback } from "@/components/motion/marketing-systems-playback";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { EASE_OUT } from "@/lib/ease";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

export interface CloudLogo { id: string; name: string; mark?: ReactNode; href?: string }
export interface LogoCloudProps { logos: CloudLogo[]; title?: string; description?: string; className?: string }
function LogoMark({ logo }: { logo: CloudLogo }) {
  const canHover = useHoverCapable();
  const content = <><span aria-hidden="true" className="text-xl">{logo.mark ?? logo.name.slice(0, 1)}</span><span className="text-base font-semibold tracking-tight">{logo.name}</span></>;
  const classes = cn("flex h-[5.5rem] min-w-36 items-center justify-center gap-3 px-5 text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-ring", canHover && "hover:text-foreground hover:bg-muted/40");
  return logo.href ? <a href={logo.href} className={classes}>{content}</a> : <span className={classes}>{content}</span>;
}
function LogoHeading({ title = "Good work travels together", description }: Pick<LogoCloudProps, "title" | "description">) {
  return <header className="mx-auto mb-10 max-w-xl text-center"><h2 className="text-balance text-4xl font-medium leading-tight tracking-[-.04em]">{title}</h2>{description && <p className="mt-3 text-pretty text-sm leading-7 text-muted-foreground">{description}</p>}</header>;
}

/** Composes the existing Marquee: its duplicate track is aria-hidden and inert. */
export function LogoMarquee(props: LogoCloudProps) {
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { ref, playing, interactionProps } = useMarketingPlayback();
  return <section className={cn("w-full min-w-0 bg-background px-4 py-16 text-foreground sm:px-8 [&_header]:mb-8 [&_header_h2]:text-sm [&_header_h2]:tracking-normal [&_header_h2]:text-muted-foreground", props.className)}><div className="mx-auto w-full max-w-6xl"><LogoHeading {...props} /><div ref={ref} {...interactionProps} className={cn("[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", (paused || reduce || !playing) && "[&_.animate-marquee]:[animation-play-state:paused]")}><Marquee pauseOnHover gap="3rem">{props.logos.map((logo) => <LogoMark key={logo.id} logo={logo} />)}</Marquee></div>{props.logos.length ? <Button size="sm" variant="ghost" className="sr-only focus:not-sr-only" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume logo motion" : "Pause logo motion"}</Button> : <p>No logos supplied.</p>}</div></section>;
}
export function LogoGrid(props: LogoCloudProps) {
  const reduce = useReducedMotion();
  return <section className={cn("w-full bg-background px-4 py-16 text-foreground sm:px-8", props.className)}><div className="mx-auto w-full max-w-5xl"><LogoHeading {...props} /><div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border/60 sm:grid-cols-4">{props.logos.map((logo, index) => <motion.div key={logo.id} initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : .4, delay: reduce ? 0 : index % 4 * .07, ease: EASE_OUT }} className="-mt-px -ml-px border-t border-l border-border/60"><LogoMark logo={logo} /></motion.div>)}</div>{!props.logos.length && <p>No logos supplied.</p>}</div></section>;
}
export function KineticLogoColumns(props: LogoCloudProps) {
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { ref, playing, interactionProps } = useMarketingPlayback();
  return <section className={cn("mx-auto grid w-full max-w-6xl gap-10 bg-background px-4 py-20 text-foreground sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end [&_header]:text-left", props.className)}>
    <div className="max-w-lg pb-2"><p className="mb-4 text-xs font-medium uppercase tracking-[.16em] text-muted-foreground">In good company</p><LogoHeading {...props} />{!!props.logos.length && <Button size="sm" variant="ghost" className="sr-only focus:not-sr-only" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume all columns" : "Pause all columns"}</Button>}</div>
    <div ref={ref} onFocusCapture={interactionProps.onFocusCapture} onBlurCapture={interactionProps.onBlurCapture} className={cn("grid h-[420px] min-w-0 grid-cols-2 overflow-hidden border-y border-border [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] sm:h-[380px] sm:grid-cols-4 [&>div]:border-l [&>div:first-child]:border-l-0 [&_a]:h-[6.5rem] [&_span.flex]:h-[6.5rem]", (paused || reduce || !playing) && "[&_.animate-marquee-vertical]:[animation-play-state:paused]")}>
      {[0, 1, 2, 3].map((lane) => <Marquee key={lane} direction={lane % 2 ? "down" : "up"} speed={24 + lane * 4} pauseOnHover className="h-full" gap="0px">{props.logos.filter((_, index) => index % 4 === lane).map((logo) => <div key={logo.id} className="border-b border-border/70"><LogoMark logo={logo} /></div>)}</Marquee>)}
    </div>
    {!props.logos.length && <p>No logos supplied.</p>}
  </section>;
}
export interface RollingLogoCarouselProps extends LogoCloudProps {
  slots?: number;
  interval?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
}
export function RollingLogoCarousel({ slots = 4, interval = 4500, page, defaultPage = 0, onPageChange, ...props }: RollingLogoCarouselProps) {
  const [internal, setInternal] = useState(defaultPage);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const { ref, playing, interactionProps } = useMarketingPlayback();
  const count = Math.max(1, Math.floor(slots));
  const pages = Math.ceil(props.logos.length / count);
  const current = Math.min(Math.max(0, page ?? internal), Math.max(0, pages - 1));
  useEffect(() => {
    if (paused || reduce || !playing || pages < 2) return;
    const timer = window.setTimeout(() => { const next = (current + 1) % pages; if (page === undefined) setInternal(next); onPageChange?.(next); }, Math.max(1000, interval));
    return () => window.clearTimeout(timer);
  }, [current, interval, pages, paused, playing, reduce, page, onPageChange]);
  const move = (next: number) => { if (page === undefined) setInternal(next); onPageChange?.(next); };
  return <section className={cn("w-full bg-background px-4 py-20 text-foreground sm:px-8 [&_header]:max-w-none [&_header]:text-left sm:[&_header]:grid sm:[&_header]:grid-cols-[1fr_.65fr] sm:[&_header]:items-end sm:[&_header]:gap-6 [&_header_h2]:max-w-2xl", props.className)}><div className="mx-auto w-full max-w-6xl">
    <p className="mb-4 text-xs font-medium uppercase tracking-[.16em] text-muted-foreground">Chosen by focused teams</p><LogoHeading {...props} />
    <div ref={ref} {...interactionProps}>
      <div className="relative min-h-28 overflow-hidden border border-border [&_a]:h-28 [&_span.flex]:h-28">
        <AnimatePresence initial={false}>
          <motion.div key={current} initial={{ y: reduce ? 0 : 20, opacity: 1 }} animate={{ y: 0 }} exit={{ y: reduce ? 0 : -20, opacity: 0 }} transition={{ duration: reduce ? 0 : .35, ease: EASE_OUT }} className="grid grid-cols-2 sm:grid-cols-4 [&:not(:last-child)]:absolute [&:not(:last-child)]:inset-0">
            <PresenceGate>{({ gate, isPresent }) => <div {...gate} aria-hidden={!isPresent} className="contents">
              {props.logos.slice(current * count, (current + 1) * count).map((logo, index) => <motion.div key={logo.id} initial={{ y: reduce ? 0 : 20 }} animate={{ y: 0 }} transition={{ duration: reduce ? 0 : .5, delay: reduce ? 0 : index * .08, ease: EASE_OUT }}><LogoMark logo={logo} /></motion.div>)}
            </div>}</PresenceGate>
          </motion.div>
        </AnimatePresence>
      </div>
      {pages > 1 && <div className="sr-only mt-4 flex flex-wrap items-center gap-3 focus-within:not-sr-only"><Button size="sm" variant="secondary" onClick={() => move((current - 1 + pages) % pages)}>Previous logos</Button><span className="text-xs text-muted-foreground" role="status">Group {current + 1} of {pages}</span><Button size="sm" variant="secondary" onClick={() => move((current + 1) % pages)}>Next logos</Button><Button size="sm" variant="ghost" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume carousel" : "Pause carousel"}</Button></div>}
    </div>
    {!props.logos.length && <p>No logos supplied.</p>}
  </div></section>;
}
