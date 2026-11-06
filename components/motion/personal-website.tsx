"use client";

import { Moon, Sun } from "lucide-react";
import { useId, useState } from "react";
import { Button, ButtonLink } from "@/components/motion/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/motion/popover";
import { CenterMorphModal, CenterMorphModalContent, CenterMorphModalTrigger } from "@/components/motion/center-morph-modal";
import { LandingReveal, LandingStyles, type LandingAction } from "@/components/motion/landing-templates/shared";
import { useThemeToggle } from "@/components/motion/theme-toggle";
import { cn } from "@/lib/utils";

export interface PersonalWebsiteProject { id: string; title: string; category: string; year: string; summary: string; description: string; role: string; focus: string[]; links: LandingAction[]; image?: { src: string; alt: string } }
export interface PersonalWebsiteArticle { title: string; excerpt: string; href: string; image?: { src: string; alt: string } }
export interface PersonalWebsiteProps { name: string; role: string; location: string; introduction: string; story: string; portrait?: { src: string; alt: string }; links: (LandingAction & { description: string })[]; projects: PersonalWebsiteProject[]; writing?: PersonalWebsiteArticle[]; experience: { organization: string; role: string; period: string; description: string }[]; services?: { title: string; description: string }[]; contact: LandingAction; availability: string; className?: string }

function CharacterPortrait() {
  return <svg viewBox="0 0 160 160" role="img" aria-label="Original monochrome character portrait" className="h-full w-full bg-muted fill-background stroke-foreground" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 160c3-34 22-51 45-55h34c24 4 43 24 45 55"/><path d="m55 114 25 19 25-19-12 41H67Z"/><path d="M65 99v17l15 10 15-10V99"/><path d="M44 64c0-35 14-49 36-49s37 16 37 49v17c-2 26-19 38-37 38S45 104 44 81Z"/><path d="M42 84 32 72l5-25 18-25 34-12 30 18 10 32-10 29-6-37-13-17-20 27-1-25-25 30-4-17Z" className="fill-foreground"/><path d="m56 77 15-3m18 0 15 3M59 80h10m22 0h10M80 81l-3 12h6m-10 10q8 4 15 0"/><path d="m26 147 26-18m56 0 26 18M45 65l-7 17 8 8m69-25 7 17-8 8"/><path d="M12 30h12m-6-6v12m118 64h12m-6-6v12"/></svg>;
}

/** Original editorial graphics, intentionally not the reference's proprietary project artwork. */
function ProjectArtwork({ project, index = 0 }: { project: PersonalWebsiteProject; index?: number }) {
  if (project.image) return <img src={project.image.src} alt={project.image.alt} loading="lazy" className="landing-project-art w-full object-cover" />;
  return <div className="landing-project-art" aria-hidden="true">{index % 3 === 0 ? <svg aria-hidden="true" viewBox="0 0 320 230" className="w-full fill-background stroke-foreground" strokeWidth="1.5"><rect x="16" y="15" width="288" height="200" rx="14"/><path d="M16 48h288M84 48v167" className="stroke-border"/><text x="30" y="36" className="fill-muted-foreground stroke-none" fontSize="8" letterSpacing="2">WORKBENCH / OVERVIEW</text><path d="M30 70h36M30 90h24M30 110h32M30 130h22" className="stroke-muted-foreground"/><path d="M106 71h82" className="stroke-foreground" strokeWidth="5"/><rect x="106" y="124" width="50" height="66" rx="5" className="fill-foreground stroke-none opacity-70"/><rect x="169" y="94" width="50" height="96" rx="5" className="fill-foreground stroke-none opacity-90"/><rect x="232" y="112" width="50" height="78" rx="5" className="fill-foreground stroke-none opacity-60"/><text x="244" y="72" className="fill-muted-foreground stroke-none" fontSize="8">12 / 18</text></svg> : index % 3 === 1 ? <svg aria-hidden="true" viewBox="0 0 320 230" className="w-full fill-background stroke-border" strokeWidth="1.5"><rect x="16" y="84" width="288" height="62" rx="16"/>{[0, 1, 2, 3, 4].map(item => <rect key={item} x={26 + item * 56} y="94" width="44" height="42" rx="10" className="fill-muted"/>)}<path d="M39 115h18m-9-9v18m50-9h18m-9-9v18m51-8 6-5 6 5v9h-12Zm55-7h16v14h-16Zm62 0v16m-6-8h12" className="stroke-foreground" strokeWidth="2"/></svg> : <div className="text-center"><p className="font-mono text-[8px] tracking-[.3em] text-muted-foreground">FIELD NOTES / 03</p><p className="mt-6 text-4xl font-medium leading-[.95] tracking-[-2px]">A place<br/>for ideas.</p><p className="mt-6 font-mono text-[8px] text-muted-foreground">OBSERVE　/　SHAPE　/　KEEP</p></div>}</div>;
}

/** Host-owned portfolio content with focus-aware link previews and accessible project details. */
export function PersonalWebsite({ name, role, location, introduction, story, portrait, links, projects, writing, experience, services, contact, availability, className }: PersonalWebsiteProps) {
  const id = useId();
  const { isDark, mounted, toggle } = useThemeToggle({ variant: "circle", start: "center" });
  const [expanded, setExpanded] = useState(true);
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(projects.map(project => project.category))];
  const filtered = category === "All" ? projects : projects.filter(project => project.category === category);
  return <div className={cn("landing-site landing-personal w-full min-w-0 bg-background text-foreground [&_a]:cursor-pointer [&_button:not(:disabled)]:cursor-pointer [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4", className)}><LandingStyles family="personal"/><main>
    <LandingReveal>
      <div className="landing-profile"><div className="landing-profile-portrait">{portrait ? <img src={portrait.src} alt={portrait.alt} className="h-full w-full object-cover"/> : <CharacterPortrait/>}</div><div><h1>{name}</h1><p>{role}</p></div><button type="button" className="landing-profile-theme" aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"} onClick={event => { const rect = event.currentTarget.getBoundingClientRect(); toggle(); document.documentElement.style.setProperty("--beui-vt-origin", `${rect.x + rect.width / 2}px ${rect.y + rect.height / 2}px`); }}>{mounted && (isDark ? <Moon aria-hidden="true" size={16} strokeWidth={1.5}/> : <Sun aria-hidden="true" size={16} strokeWidth={1.5}/>)}</button></div>
      <div className="landing-personal-copy"><p>{introduction}</p><div id={`${id}-story`} hidden={!expanded} className="landing-personal-story whitespace-pre-wrap">{story}</div><p className="mt-4">I share work and references at {links.map((link, index) => <span key={link.href}>{index > 0 && (index === links.length - 1 ? " and " : ", ")}<Popover trigger="hover" side="bottom" align="start"><PopoverTrigger><a href={link.href} className="text-foreground underline decoration-border underline-offset-4">{link.label}</a></PopoverTrigger><PopoverContent className="max-w-[min(19rem,calc(100vw-2rem))] p-5"><p className="text-sm font-medium">{link.label} ↗</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{link.description}</p></PopoverContent></Popover></span>)} and can be reached <a href={contact.href} aria-label="Contact the author" className="text-foreground underline decoration-border underline-offset-4">here</a>.</p></div><Button className="mt-3 h-auto p-0 text-[10px] text-muted-foreground" variant="ghost" size="sm" aria-expanded={expanded} aria-controls={`${id}-story`} onClick={() => setExpanded(!expanded)}>{expanded ? "Less about me −" : "More about me +"}</Button>
    </LandingReveal>
    <section id={`${id}-projects`} className="landing-personal-section scroll-mt-8"><div className="mb-1 flex items-end justify-between gap-4"><h2 className="landing-personal-heading">Highlights</h2><fieldset className="mb-6 flex min-w-0 gap-1 border-0 p-0" aria-label="Project categories">{categories.map(item => <Button key={item} variant="ghost" size="sm" className={cn("h-auto px-2 py-1 text-[9px]", category === item ? "text-foreground" : "text-muted-foreground")} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</Button>)}</fieldset></div><section className="landing-personal-gallery" aria-label="Project gallery">{filtered.map((project, index) => <CenterMorphModal key={project.id}><article className="landing-personal-project"><CenterMorphModalTrigger><button type="button" aria-label={`View ${project.title}`}><ProjectArtwork project={project} index={index}/><div className="landing-project-caption"><span className="float-right font-mono text-[8px] text-muted-foreground">{project.year}</span><h3>{project.title}</h3><p>{project.category}</p></div></button></CenterMorphModalTrigger></article><CenterMorphModalContent ariaLabel={project.title} className="max-h-[85dvh] max-w-2xl overflow-y-auto p-0"><ProjectArtwork project={project} index={index}/><div className="p-7"><p className="font-mono text-xs text-muted-foreground">{project.category} · {project.year}</p><h2 className="mt-3 text-3xl font-semibold">{project.title}</h2><p className="mt-5 whitespace-pre-wrap leading-8 text-muted-foreground">{project.description}</p><dl className="mt-6 border-t border-border pt-5"><dt className="text-xs text-muted-foreground">My role</dt><dd className="mt-1 text-sm">{project.role}</dd><dt className="mt-4 text-xs text-muted-foreground">Focus</dt><dd className="mt-2 flex flex-wrap gap-2">{project.focus.map(item => <span key={item} className="rounded-full bg-muted px-3 py-1 text-xs">{item}</span>)}</dd></dl><div className="mt-7 flex flex-wrap gap-3">{project.links.map(link => <ButtonLink key={link.href} href={link.href} variant="outline">{link.label} ↗</ButtonLink>)}</div></div></CenterMorphModalContent></CenterMorphModal>)}</section>{!filtered.length && <p className="py-6 text-muted-foreground">No projects in this category yet.</p>}</section>
    <section className="landing-personal-section"><h2 className="landing-personal-heading">Projects</h2>{projects.map(project => <article key={project.id} className="landing-personal-project-row"><h3>{project.links[0] ? <a href={project.links[0].href}>{project.title} <span aria-hidden="true" className="float-right text-muted-foreground">↗</span></a> : project.title}</h3><p>{project.summary}</p></article>)}</section>
    {!!writing?.length && <section className="landing-personal-section" aria-labelledby={`${id}-writing`}>
      <h2 id={`${id}-writing`} className="landing-personal-heading">Writing</h2>
      <div className="landing-writing-list">{writing.map((article, index) => <a key={article.href} href={article.href} className="landing-writing-link">
        {article.image ? <img className="landing-writing-art" src={article.image.src} alt={article.image.alt} loading="lazy"/> : <span className="landing-writing-art" aria-hidden="true">
          <svg aria-hidden="true" viewBox="0 0 80 64" width={80} height={64} fill="none">
            <rect width="80" height="64" rx="8" fill="var(--color-muted)"/>
            {index % 3 === 0 ? <>
              <rect x="9" y="9" width="62" height="46" rx="4" fill="var(--color-background)"/>
              <path d="M9 19h62M24 19v36" stroke="var(--color-border)"/>
              <path d="M32 44v-9m12 9V27m12 17V23" stroke="var(--color-foreground)" strokeWidth="7" opacity=".65"/>
            </> : index % 3 === 1 ? <>
              <rect x="8" y="11" width="28" height="42" rx="6" fill="var(--color-background)"/>
              <rect x="42" y="11" width="30" height="18" rx="6" fill="var(--color-foreground)" opacity=".55"/>
              <rect x="42" y="35" width="30" height="18" rx="6" fill="var(--color-background)"/>
            </> : <>
              <path d="M-8 50C9 13 35 62 54 29s28-25 37-18" stroke="var(--color-foreground)" strokeWidth="22" opacity=".12"/>
              <path d="M-8 43C9 6 35 55 54 22S82-3 91 4" stroke="var(--color-foreground)" strokeWidth="10" opacity=".6"/>
            </>}
          </svg>
        </span>}
        <div><h3>{article.title}</h3><p>{article.excerpt}</p></div>
      </a>)}</div>
    </section>}
    <section id={`${id}-experience`} className="landing-personal-section scroll-mt-8"><h2 className="landing-personal-heading">Work</h2><ol className="space-y-8">{experience.map(item => <li key={`${item.organization}-${item.period}`} className="grid grid-cols-[56px_1fr_auto] items-start gap-4"><div aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted text-base">{item.organization.slice(0, 1)}</div><div><h3 className="text-sm font-medium">{item.organization}</h3><p className="mt-1 text-xs text-muted-foreground">{item.role}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{item.description}</p></div><p className="pt-1 text-[10px] text-muted-foreground">{item.period}</p></li>)}</ol></section>
    {!!services?.length && <section className="landing-personal-section"><h2 className="landing-personal-heading">Practice</h2>{services.map(service => <article key={service.title} className="landing-personal-project-row"><h3>{service.title}</h3><p>{service.description}</p></article>)}</section>}
    <footer className="landing-personal-section pb-16"><h2 className="landing-personal-heading">Elsewhere</h2><p className="max-w-sm text-sm leading-6 text-muted-foreground">{availability}</p><a className="mt-5 inline-flex text-xs underline underline-offset-4" href={contact.href}>{contact.label} ↗</a><div className="mt-16 flex justify-between gap-4 text-[10px] text-muted-foreground"><span>© {name}</span><span>{location}</span></div></footer>
  </main></div>;
}
