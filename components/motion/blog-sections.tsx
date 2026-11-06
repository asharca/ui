"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button";
import { StoryMedia } from "@/components/motion/marketing-stories-shared";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface BlogArticle {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  href: string;
  publishedAt: string;
  dateLabel?: string;
  readingMinutes?: number;
  author?: string;
  image?: { src: string; alt: string };
}
export interface BlogSectionProps {
  articles: readonly BlogArticle[];
  title?: string;
  description?: string;
  category?: string;
  defaultCategory?: string;
  onCategoryChange?: (category: string) => void;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
}

function BlogSection({ articles, title = "Notes from the field", description, category, defaultCategory = "All", onCategoryChange, page, defaultPage = 1, onPageChange, pageSize = 6, emptyMessage = "No articles in this category yet.", className, layout }: BlogSectionProps & { layout: "image" | "featured" | "list" | "cards" }) {
  const [localCategory, setLocalCategory] = useState(defaultCategory);
  const [localPage, setLocalPage] = useState(defaultPage);
  const selectedCategory = category ?? localCategory;
  const categories = ["All", ...new Set(articles.map((article) => article.category).filter((item) => item !== "All"))];
  const filtered = selectedCategory === "All" ? articles : articles.filter((article) => article.category === selectedCategory);
  const size = Math.max(1, Math.floor(pageSize));
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const activePage = Math.min(pages, Math.max(1, page ?? localPage));
  const visible = filtered.slice((activePage - 1) * size, activePage * size);
  const headingId = useId();
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const changePage = (next: number) => { setLocalPage(next); onPageChange?.(next); };
  return <section aria-labelledby={headingId} className={cn("w-full bg-background px-6 py-12 text-foreground sm:px-10 sm:py-16", className)}><div className={layout === "list" ? "mx-auto max-w-5xl" : "mx-auto max-w-6xl"}>
    <header className={cn("mb-10 max-w-2xl", (layout === "image" || layout === "cards") && "mx-auto text-center")}>{layout === "featured" && <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">From the journal</p>}<h2 id={headingId} className="text-balance text-4xl font-medium tracking-tight">{title}</h2>{description && <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>}</header>
    <fieldset aria-label="Article categories" className={cn("m-0 mb-6 flex min-w-0 w-fit flex-wrap gap-1 rounded-full border-0 bg-muted/50 p-1", layout !== "list" && "sr-only focus-within:not-sr-only")}>{categories.map((item) => <button type="button" key={item} aria-pressed={selectedCategory === item} onClick={() => { if (category === undefined) setLocalCategory(item); onCategoryChange?.(item); changePage(1); }} className={cn("rounded-full px-4 py-2 text-xs focus-visible:outline-2 focus-visible:outline-ring", selectedCategory === item ? "bg-background font-medium shadow-sm" : "text-muted-foreground")}>{item}</button>)}</fieldset>
    <div aria-live="polite" className="sr-only">{filtered.length} articles, page {activePage} of {pages}</div>
    {!visible.length ? <p role="status" className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">{emptyMessage}</p> : <div className={cn(layout === "list" ? "divide-y divide-border border-y border-border" : layout === "featured" ? "grid gap-x-12 lg:grid-cols-2" : "grid gap-5 md:grid-cols-3")}>
      {visible.map((article, index) => <motion.article key={article.id} layout={!reduce} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ layout: SPRING_LAYOUT, opacity: { duration: 0.25, ease: EASE_OUT } }} whileHover={canHover && !reduce && layout !== "list" ? { y: -2 } : undefined} className={cn("min-w-0", layout === "list" ? "flex items-center gap-7 py-6" : layout === "featured" ? index === 0 ? "lg:row-span-3" : "flex flex-row-reverse items-center gap-6 border-y border-border py-7" : "overflow-hidden rounded-3xl border border-border bg-background p-3 shadow-sm", layout === "cards" && "flex flex-col")}>
        {layout !== "cards" && <a href={article.href} aria-label={`Read ${article.title}`} className={cn("block shrink-0 overflow-hidden", layout === "list" ? "hidden h-28 w-36 rounded-xl sm:block" : layout === "featured" && index > 0 ? "h-32 w-32 rounded-2xl" : "aspect-[16/10] w-full rounded-2xl")}><StoryMedia src={article.image?.src} alt={article.image?.alt ?? `Cover for ${article.title}`} className="h-full w-full" /></a>}
        <div className={cn("min-w-0", layout === "list" || (layout === "featured" && index > 0) ? "flex-1" : layout === "featured" ? "pt-5" : "px-2 pb-3 pt-5", layout === "cards" && "flex flex-1 flex-col")}>
          <p className={cn("mb-3 text-[10px] text-muted-foreground", (layout === "image" || layout === "cards") && "font-mono uppercase tracking-wider")}>{article.category}{layout === "list" && <> · <time dateTime={article.publishedAt}>{article.dateLabel ?? article.publishedAt}</time></>}{layout === "featured" && article.readingMinutes !== undefined && <> · {article.readingMinutes} min read</>}</p><h3 className="text-xl font-medium leading-snug tracking-tight"><a href={article.href} className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{article.title}</a></h3>
          {article.excerpt && (layout === "list" || (layout === "featured" && index === 0)) && <p className="mt-3 text-sm leading-7 text-muted-foreground">{article.excerpt}</p>}
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">{layout !== "list" && <time dateTime={article.publishedAt}>{article.dateLabel ?? article.publishedAt}</time>}{layout === "list" && article.readingMinutes !== undefined && <span>{article.readingMinutes} min read</span>}{(layout === "list" || layout === "featured" && index === 0) && article.author && <span>{article.author}</span>}</div>
          {layout === "cards" && <a href={article.href} aria-label={`Read ${article.title}`} className="mt-5 block"><StoryMedia src={article.image?.src} alt={article.image?.alt ?? `Cover for ${article.title}`} className="aspect-[16/10] rounded-2xl" /></a>}
        </div>
      </motion.article>)}
    </div>}
    {pages > 1 && <nav aria-label="Article pagination" className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-5"><Button variant="outline" size="sm" disabled={activePage === 1} onClick={() => changePage(activePage - 1)}>Previous page</Button><span className="text-xs tabular-nums text-muted-foreground">{activePage} / {pages}</span><Button variant="outline" size="sm" disabled={activePage === pages} onClick={() => changePage(activePage + 1)}>Next page</Button></nav>}
    </div>
  </section>;
}

export function BlogImageFirstCards(props: BlogSectionProps) { return <BlogSection {...props} layout="image" />; }
export function BlogFeaturedStories(props: BlogSectionProps) { return <BlogSection {...props} layout="featured" />; }
export function BlogArticleList(props: BlogSectionProps) { return <BlogSection {...props} layout="list" />; }
export function BlogArticleCards(props: BlogSectionProps) { return <BlogSection {...props} layout="cards" />; }
