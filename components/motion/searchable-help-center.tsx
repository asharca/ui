"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, BookOpen, Rocket, FileText, Search, Users, CreditCard, ShieldCheck, Clock3, ThumbsUp, ThumbsDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button";
import { Input } from "@/components/motion/input";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { KnowledgeSearchText } from "@/components/motion/knowledge-search-text";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { EASE_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

export interface HelpTopic { id: string; name: string; description: string }
export interface HelpArticle { id: string; title: string; content: string; topicId: string; summary?: string; updatedAt?: string; sourceUrl?: string; readingMinutes?: number; sections?: { id: string; title: string; content: string; steps?: string[] }[] }
export interface SearchableHelpCenterProps {
  title?: string;
  description?: string;
  articles: HelpArticle[];
  topics: HelpTopic[];
  popularSearches?: string[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Optional real host search. Without this, search is literal full-text over supplied articles. */
  onSearch?: (request: { query: string; topicId: string | null; signal: AbortSignal }) => Promise<HelpArticle[]>;
  retrievalLabel?: string;
  onArticleOpen?: (article: HelpArticle) => void;
  onArticleFeedback?: (article: HelpArticle, helpful: boolean) => void | Promise<void>;
  className?: string;
}

export function SearchableHelpCenter({ title = "How can we help?", description = "Practical guides for your next step.", articles, topics, popularSearches = [], query: controlledQuery, defaultQuery = "", onQueryChange, onSearch, retrievalLabel, onArticleOpen, onArticleFeedback, className }: SearchableHelpCenterProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const query = controlledQuery ?? internalQuery;
  const [topicId, setTopicId] = useState<string | null>(null);
  const [remote, setRemote] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const latestRetry = useRef(retry); latestRetry.current = retry;
  const [selected, setSelected] = useState<HelpArticle | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; helpful: boolean } | null>(null);
  const [feedbackPending, setFeedbackPending] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const reduce = useReducedMotion();
  const hover = useHoverCapable();
  useEffect(() => {
    if (!onSearch) return;
    const controller = new AbortController();
    setLoading(true); setError(null);
    const isCurrent = () => !controller.signal.aborted && latestRetry.current === retry;
    Promise.resolve().then(() => onSearch({ query, topicId, signal: controller.signal })).then((results) => { if (isCurrent()) setRemote(results); }).catch((cause) => { if (isCurrent()) { setRemote([]); setError(cause instanceof Error ? cause.message : "Search could not be completed."); } }).finally(() => { if (isCurrent()) setLoading(false); });
    return () => controller.abort();
  }, [onSearch, query, topicId, retry]);
  const search = (next: string) => { if (controlledQuery === undefined) setInternalQuery(next); onQueryChange?.(next); };
  const needle = query.trim().toLocaleLowerCase();
  const results = onSearch ? remote : articles.filter((article) => (!topicId || article.topicId === topicId) && `${article.title} ${article.summary ?? ""} ${article.content}`.toLocaleLowerCase().includes(needle));
  const topicCounts = new Map<string, number>();
  for (const article of articles) topicCounts.set(article.topicId, (topicCounts.get(article.topicId) ?? 0) + 1);
  const clear = () => { search(""); setTopicId(null); searchRef.current?.focus(); };
  const rate = async (helpful: boolean) => { if (!selected || feedbackPending) return; setFeedbackPending(true); setFeedbackError(""); try { await onArticleFeedback?.(selected, helpful); setFeedback({ id: selected.id, helpful }); } catch (cause) { setFeedbackError(cause instanceof Error ? cause.message : "Could not record feedback."); } finally { setFeedbackPending(false); } };
  return <section aria-label="Searchable help center" className={cn("w-full bg-background px-5 py-12 text-foreground sm:px-10", className)}><div className="mx-auto max-w-5xl">
    <header className="mx-auto mb-12 max-w-2xl text-center"><span className="mx-auto mb-6 grid size-12 place-items-center rounded-full bg-muted"><BookOpen className="size-5" /></span><h2 className="text-balance text-4xl font-medium tracking-tight md:text-5xl">{title}</h2><p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">{description}</p><div className="mx-auto mt-8 max-w-lg"><Input classNames={{ field: "h-10" }} ref={searchRef} aria-label="Search help articles" aria-controls={`${id}-results`} placeholder="Search for an answer…" value={query} onChange={search} leftIcon={<Search className="size-4" />} />{popularSearches.length > 0 && <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"><span>Popular:</span>{popularSearches.map((term) => <Button key={term} type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => { search(term); setTopicId(null); searchRef.current?.focus(); }}>{term}</Button>)}</div>}</div></header>
    <div><fieldset aria-label="Help topics" className="m-0 grid min-w-0 gap-3 border-0 p-0 sm:grid-cols-2 lg:grid-cols-4">{topics.map((topic, index) => <motion.button key={topic.id} type="button" aria-pressed={topicId === topic.id} whileHover={hover && !reduce ? { y: -2 } : undefined} onClick={() => setTopicId((current) => current === topic.id ? null : topic.id)} className={cn("cursor-pointer rounded-3xl border border-border p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring", topicId === topic.id && "border-foreground/30 bg-muted/30")}><span className="mb-4 flex items-center justify-between gap-2"><span className="grid size-9 place-items-center rounded-full bg-muted">{index === 1 ? <Users className="size-4" /> : index === 2 ? <CreditCard className="size-4" /> : index === 3 ? <ShieldCheck className="size-4" /> : <Rocket className="size-4" />}</span><span className="text-xs text-muted-foreground">{topicCounts.get(topic.id) ?? 0} {(topicCounts.get(topic.id) ?? 0) === 1 ? "article" : "articles"}</span></span><span className="block text-xl font-medium">{topic.name}</span><span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{topic.description}</span></motion.button>)}</fieldset>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4"><h3 className="text-xl font-medium">{query ? `Results for “${query}”` : "Explore articles"}</h3><Tabs value={topicId ?? ""} onValueChange={id => setTopicId(id || null)} className="min-w-0 max-w-full overflow-x-auto p-1"><TabsList aria-label="Article topic filter" className="bg-muted">{[{ id: "", name: "All topics" }, ...topics].map(topic => <TabsTrigger key={topic.id} value={topic.id} className="px-3.5 py-1.5 text-xs [&_[data-tabs-label]]:text-foreground" indicatorClassName="bg-background shadow-sm">{topic.name}</TabsTrigger>)}</TabsList></Tabs>{(query || topicId) && <Button variant="ghost" size="sm" onClick={clear}>Clear filters</Button>}</div>
      <p className={cn("mt-1 text-xs text-muted-foreground", !retrievalLabel && "sr-only")}>{retrievalLabel ?? (onSearch ? "Results supplied by your search service" : "Literal full-text search across supplied articles")}</p>
      <div id={`${id}-results`} aria-busy={loading} className="mt-5"><p role="status" className="mb-3 text-xs text-muted-foreground">{loading ? "Searching…" : error ? "Search unavailable" : `${results.length} articles to explore`}</p>
        {error ? <div role="alert" className="rounded-xl border border-destructive/30 p-4 text-sm"><p>{error}</p><Button size="sm" variant="outline" className="mt-3" onClick={() => setRetry((value) => value + 1)}>Retry search</Button></div> : !loading && <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border">
          <AnimatePresence initial={false}>
            {results.map((article) => <PresenceGate key={article.id}>{({ gate }) => <motion.li
              {...gate}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -4 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
            >
              <button type="button" aria-haspopup="dialog" className="flex w-full cursor-pointer items-center gap-4 px-4 py-5 sm:px-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => { setSelected(article); onArticleOpen?.(article); }}>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-muted"><FileText className="size-4 text-muted-foreground" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium"><KnowledgeSearchText text={article.title} query={query} /></span><span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground"><KnowledgeSearchText text={article.summary ?? article.content} query={query} /></span></span>
                {article.readingMinutes !== undefined && <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">{article.readingMinutes} min</span>}<span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-border"><ArrowRight className="size-4" /></span>
              </button>
            </motion.li>}</PresenceGate>)}
          </AnimatePresence>
        </ul>}
        {!loading && !error && !results.length && <div className="rounded-2xl border border-dashed border-border p-8 text-center"><p className="text-sm font-medium">No matching articles</p><p className="mt-1 text-xs text-muted-foreground">Try another phrase or choose a different topic.</p><Button variant="outline" size="sm" className="mt-4" onClick={clear}>Browse all articles</Button></div>}
      </div>
    </div>
    <MorphingModal viewId={selected?.id ?? null} onClose={() => setSelected(null)} placement="center" ariaLabel={selected?.title} className="max-h-[calc(100dvh-2rem)] max-w-4xl overflow-y-auto rounded-3xl p-5 sm:p-8">{selected && <article><header className="mb-8"><p className="text-xs text-muted-foreground">{topics.find((topic) => topic.id === selected.topicId)?.name ?? "Help article"}</p><h3 className="mt-3 text-xl font-medium">{selected.title}</h3>{selected.summary && <p className="mt-4 text-sm leading-6 text-muted-foreground">{selected.summary}</p>}{selected.readingMinutes !== undefined && <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{selected.readingMinutes} min read</p>}</header><div className={cn("grid gap-8", selected.sections?.length && "md:grid-cols-[minmax(0,1fr)_10rem]")}><div className="min-w-0 space-y-8">{selected.sections?.length ? selected.sections.map(section => <section id={`${id}-article-${section.id}`} key={section.id} className="scroll-mt-6"><h4 className="mb-3 text-lg font-medium">{section.title}</h4><p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground"><KnowledgeSearchText text={section.content} query={query} /></p>{section.steps && <ol className="mt-4 space-y-3">{section.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm leading-6"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-[10px]">{index + 1}</span><span>{step}</span></li>)}</ol>}</section>) : <div className="whitespace-pre-wrap text-sm leading-7"><KnowledgeSearchText text={selected.content} query={query} /></div>}</div>{selected.sections?.length ? <nav aria-label="On this page" className="hidden self-start border-l border-border pl-4 md:block"><h4 className="mb-4 text-xs font-medium">On this page</h4><ul className="space-y-3">{selected.sections.map(section => <li key={section.id}><button type="button" onClick={() => document.getElementById(`${id}-article-${section.id}`)?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" })} className="text-left text-xs leading-5 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">{section.title}</button></li>)}</ul></nav> : null}</div>{selected.updatedAt && <p className="mt-5 text-xs text-muted-foreground">Updated {selected.updatedAt}</p>}{selected.sourceUrl && <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm underline underline-offset-4">View original source</a>}<footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5"><p className="text-xs text-muted-foreground">Was this article helpful?</p><div className="flex items-center gap-2"><Button variant="ghost" size="sm" className="rounded-full text-xs" disabled={feedbackPending} aria-pressed={feedback?.id === selected.id && feedback.helpful} onClick={() => rate(true)}><ThumbsUp className="size-3.5" />Yes</Button><Button variant="ghost" size="sm" className="rounded-full text-xs" disabled={feedbackPending} aria-pressed={feedback?.id === selected.id && !feedback.helpful} onClick={() => rate(false)}><ThumbsDown className="size-3.5" />Not quite</Button></div>{feedback?.id === selected.id && <p role="status" className="w-full text-xs text-muted-foreground">{onArticleFeedback ? "Thank you for your feedback." : "Feedback noted in this session."}</p>}{feedbackError && <p role="alert" className="w-full text-xs text-destructive">{feedbackError}</p>}</footer></article>}</MorphingModal>
  </div></section>;
}
