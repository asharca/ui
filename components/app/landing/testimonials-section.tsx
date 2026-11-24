import { TestimonialCard } from "@/components/app/landing/testimonial-card";
import { TESTIMONIALS } from "@/components/app/landing/testimonials-data";
import { Marquee } from "@/components/motion/marquee";

const EXPIRED_AVATAR_IDS = new Set([
  "2077378979590492457",
  "2073494103153586236",
  "2071327003790184684",
  "2071206392925765751",
  "2069415701874720806",
  "2073188569506587028",
  "2069333890506936655",
  "2069108073839435853",
]);

function splitColumns<T>(items: readonly T[], count: number): T[][] {
  const cols: T[][] = Array.from({ length: count }, () => []);
  items.forEach((item, idx) => {
    cols[idx % count]?.push(item);
  });
  return cols;
}

export function TestimonialsSection() {
  const activeTestimonials = TESTIMONIALS.filter(
    (item) => !EXPIRED_AVATAR_IDS.has(item.id),
  );
  const columns = splitColumns(activeTestimonials, 4);
  const avatars = [0, 1, 4, 5, 6].map((idx) => TESTIMONIALS[idx]);

  return (
    <section
      id="testimonials"
      aria-labelledby="landing-testimonials"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14 sm:py-20"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-xl">
          <p className="text-sm text-muted-foreground">Loved by builders</p>
          <h2
            id="landing-testimonials"
            className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl"
          >
            What builders are saying.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real posts from people shipping with beUI.
          </p>
        </div>

        <div className="flex items-center -space-x-2">
          {avatars.map((item) => (
            /* biome-ignore lint/performance/noImgElement: existing external testimonial avatars */
            <img
              key={item.id}
              src={item.user.avatar.replace("_normal", "_bigger")}
              alt={item.user.name}
              width={32}
              height={32}
              loading="lazy"
              className="size-8 rounded-full object-cover ring-2 ring-background"
            />
          ))}
        </div>
      </div>

      <div className="mt-6 grid h-[26rem] grid-cols-1 gap-3 overflow-hidden sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {columns.map((col, idx) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static 4-column layout buckets
            key={idx}
            className={
              idx === 1
                ? "hidden h-full min-h-0 sm:block"
                : idx === 2
                  ? "hidden h-full min-h-0 lg:block"
                  : idx === 3
                    ? "hidden h-full min-h-0 xl:block"
                    : "h-full min-h-0"
            }
          >
            <Marquee
              direction={idx % 2 === 0 ? "up" : "down"}
              speed={30 + idx * 4}
              gap="0.75rem"
              fade
              className="h-full [&>div]:w-full [&>div>div]:w-full"
            >
              {col.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  className="w-full"
                />
              ))}
            </Marquee>
          </div>
        ))}
      </div>
    </section>
  );
}
