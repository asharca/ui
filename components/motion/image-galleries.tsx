"use client";

import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button";
import { Marquee } from "@/components/motion/marquee";
import { ImageViewer, ImageViewerContent, ImageViewerThumbnail, type LightboxImage } from "@/components/motion/morphing-lightbox";
import { StoryMedia, StoryPlayback, useStorySelection, type StorySelectionProps } from "@/components/motion/marketing-stories-shared";
import { EASE_OUT_CSS, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface EditorialGalleryImage extends LightboxImage { credit?: string; href?: string; }
export interface EditorialGalleryProps extends StorySelectionProps {
  images: readonly EditorialGalleryImage[];
  title?: string;
  className?: string;
}
export interface VerticalImageGalleryProps extends EditorialGalleryProps {
  columns?: number;
  speed?: number;
}

function EditorialGallery({ images, title, className, columns = 4, speed = 50, layout, ...props }: VerticalImageGalleryProps & { layout: "vertical" | "mosaic" | "rail" }) {
  const selection = useStorySelection(images.map((image) => image.id), props);
  const active = images.find((image) => image.id === selection.selected);
  const [wallPaused, setWallPaused] = useState(false);
  const reduce = useReducedMotion();
  const heading = useId();
  const detail = useId();
  const gallery = useRef<HTMLElement>(null);
  const count = Math.max(1, Math.min(6, Math.floor(columns)));
  const columnImages = Array.from({ length: count }, (_, column) => images.filter((_, index) => index % count === column));
  const mosaic = active ? [active, ...images.filter((image) => image.id !== active.id).slice(0, 4)] : [];
  const onArrow = (event: KeyboardEvent<HTMLElement>) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key) || !images.length) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? images.length - 1 : (selection.index + (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) + images.length) % images.length;
    selection.select(images[nextIndex].id);
    gallery.current?.querySelectorAll<HTMLButtonElement>("[data-gallery-frame]").forEach((button) => { if (button.dataset.galleryFrame === images[nextIndex].id && !button.closest("[inert]")) button.focus(); });
  };
  const galleryTitle = title ?? (layout === "vertical" ? "A living archive of considered work" : layout === "mosaic" ? "Every frame gets its moment" : "Move through images one frame at a time");
  const tile = (image: EditorialGalleryImage, index: number) => <motion.button key={image.id} type="button" onKeyDown={onArrow} data-gallery-frame={image.id} aria-label={`Select ${image.alt}`} aria-pressed={active?.id === image.id} aria-describedby={active?.id === image.id ? detail : undefined} layout={!reduce && layout === "mosaic"} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} onClick={() => selection.select(image.id)} onFocus={() => { if (layout === "rail") selection.select(image.id); }} className={cn("relative min-h-0 min-w-0 overflow-hidden bg-muted text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", layout === "vertical" && "block w-full rounded-3xl", layout === "mosaic" && (index === 0 ? "col-span-2 row-span-2 lg:col-span-8" : "col-span-1 lg:col-span-2"))}
    style={layout === "rail" ? { flex: active?.id === image.id ? "5 1 0%" : "1 1 0%", transition: reduce ? undefined : `flex 450ms ${EASE_OUT_CSS}` } : undefined}>
    <StoryMedia src={image.src} alt={image.alt} className={cn("h-full w-full", layout === "vertical" ? "aspect-[4/5]" : "absolute inset-0")} />
    {layout !== "vertical" && active?.id === image.id && <><span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" /><span className="absolute bottom-6 left-6 right-6 text-lg font-medium text-white">{image.caption ?? image.alt}<span className="mt-1 block text-xs font-normal text-white/70">{image.alt}</span></span></>}
  </motion.button>;
  return <section aria-labelledby={heading} className={cn("w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-8 sm:py-24", className)} {...selection.pauseProps}><div className="mx-auto w-full max-w-7xl"><header className={cn(layout === "mosaic" ? "mx-auto max-w-3xl text-center" : "grid gap-6 pb-9 md:grid-cols-[1.2fr_0.8fr] md:items-end md:gap-16", layout === "vertical" && "border-b border-border pb-8")}><div><p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{layout === "vertical" ? "Selected spaces" : layout === "mosaic" ? "Living collection" : "Spaces in focus"}</p><h2 id={heading} className={cn("mt-5 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.045em]", layout !== "mosaic" && "max-w-sm")}>{galleryTitle}</h2></div><div className={cn("text-muted-foreground", layout === "mosaic" && "mt-5")}><p className="text-pretty leading-7">{layout === "vertical" ? "An image-led collection moving with a quiet, continuous rhythm" : layout === "mosaic" ? "A shifting editorial mosaic that reshapes itself around the selected image" : "Select a frame or let the gallery quietly move the focus for you"}</p>{layout === "rail" && <p className="mt-5 font-mono text-xs tabular-nums">{String(selection.index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</p>}</div></header>
    {!active ? <p role="status" className="p-10 text-center text-muted-foreground">No images to display.</p> : <ImageViewer images={[...images]} label={galleryTitle} onValueChange={(id) => { if (id) selection.select(id); }}>
      <section ref={gallery} aria-label="Select an image with arrow keys" className={cn(layout === "vertical" && "mt-5 grid h-[36rem] grid-cols-2 gap-2 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_7%,black_93%,transparent)] sm:h-[42rem] sm:gap-3 lg:grid-cols-[repeat(var(--gallery-columns),minmax(0,1fr))] focus-within:[&_.animate-marquee-vertical]:[animation-play-state:paused]", layout === "mosaic" && "mt-10 grid h-[36rem] grid-cols-2 grid-rows-4 gap-2 border-y border-border py-2 sm:gap-3 sm:py-3 lg:h-[40rem] lg:grid-cols-12 lg:grid-rows-2", layout === "rail" && "flex h-[38rem] flex-col gap-2 border-y border-border py-2 md:h-[35rem] md:flex-row", wallPaused && "[&_.animate-marquee-vertical]:[animation-play-state:paused]")} style={{ "--gallery-columns": count } as CSSProperties}>
        {layout === "vertical" ? columnImages.map((column, index) => column.length > 0 && (reduce ? <div key={column[0].id} className="space-y-3">{column.map(tile)}</div> : <Marquee key={column[0].id} direction={index % 2 ? "down" : "up"} speed={Math.max(5, speed + index * 8)} className={cn("h-full [&_.animate-marquee-vertical]:w-full [&_.animate-marquee-vertical>div]:w-full", index > 1 && "hidden lg:flex")}>{column.map(tile)}</Marquee>)) : layout === "mosaic" ? mosaic.map(tile) : images.map(tile)}
      </section>
      {layout === "mosaic" && <fieldset aria-label="Choose an image" className="mt-5 flex justify-center gap-2">{images.map((image, index) => <button type="button" key={image.id} aria-label={`Show ${image.caption ?? image.alt}`} aria-pressed={active.id === image.id} onClick={() => selection.select(image.id)} className={cn("h-10 min-w-10 rounded-full border border-border px-3 font-mono text-xs focus-visible:outline-2 focus-visible:outline-ring", active.id === image.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted")}>{String(index + 1).padStart(2, "0")}</button>)}</fieldset>}
      <div id={detail} className="sr-only focus-within:not-sr-only focus-within:mt-5"><div aria-live={selection.playing ? "off" : "polite"}>{active.caption ?? active.alt}{active.credit && ` · ${active.credit}`}</div><ImageViewerThumbnail imageId={active.id} imageClassName="hidden" className="border border-border px-4 py-2 text-sm">Open selected image</ImageViewerThumbnail><nav aria-label="Gallery navigation" className="flex gap-3"><Button variant="outline" size="sm" disabled={images.length < 2} onClick={() => selection.move(-1)}>Previous image</Button><Button variant="outline" size="sm" disabled={images.length < 2} onClick={() => selection.move(1)}>Next image</Button>{layout === "vertical" && !reduce && <StoryPlayback paused={wallPaused} toggle={() => setWallPaused(!wallPaused)} />}{layout !== "vertical" && props.autoPlay && <StoryPlayback paused={selection.paused} toggle={selection.toggle} />}</nav></div><ImageViewerContent />
    </ImageViewer>}</div>
  </section>;
}

export function VerticalImageGallery(props: VerticalImageGalleryProps) { return <EditorialGallery {...props} layout="vertical" />; }
export function MorphingMosaic(props: EditorialGalleryProps) { return <EditorialGallery {...props} layout="mosaic" />; }
export function ExpandingFocusRail(props: EditorialGalleryProps) { return <EditorialGallery {...props} layout="rail" />; }
