"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Play, Scissors, X } from "lucide-react";
import type { WorkCategory, WorkItem } from "@/lib/work";
import { site } from "@/lib/site";
import { InstagramIcon } from "./brand-icons";

const filters: { id: "all" | WorkCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fades", label: "Fades" },
  { id: "designs", label: "Designs" },
  { id: "kids", label: "Kids" },
  { id: "beards", label: "Beards" },
];

/** Two tall tiles per 10 items fill 3- and 4-column grids with no gaps. */
const isFeature = (i: number) => i % 10 === 0 || i % 10 === 5;

/** Plays muted when on screen, pauses when off screen. */
function InViewVideo({ item }: { item: WorkItem }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={item.src}
      poster={item.poster}
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

export function Work({ items }: { items: WorkItem[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [active, setActive] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );
  const available = filters.filter((f) => f.id === "all" || items.some((i) => i.category === f.id));

  const step = useCallback(
    (d: number) => setActive((a) => (a === null ? a : (a + d + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, step]);

  const current = active !== null ? visible[active] : null;

  return (
    <section id="work" className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="display text-[clamp(3.5rem,9vw,7rem)]">Fresh off the chair</h2>
            <p className="mt-5 max-w-xl text-lg text-white/70">
              Real cuts from our barbers this season. Bring a screenshot of the one you want, or ask for something new.
            </p>
          </div>

          {available.length > 1 && (
            <LayoutGroup>
              <div role="tablist" aria-label="Filter work" className="flex flex-wrap gap-2 lg:shrink-0 lg:flex-nowrap">
                {available.map((f) => (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    className={`relative h-11 rounded-full px-5 text-[0.95rem] font-semibold transition-colors ${
                      filter === f.id ? "text-ink" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {filter === f.id && (
                      <motion.span layoutId="work-pill" className="absolute inset-0 rounded-full bg-chalk" />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyWork />
        ) : (
          <motion.ul layout className="mt-14 grid grid-flow-dense grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {visible.map((item, i) => (
                <motion.li
                  key={item.src}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className={isFeature(i) ? "md:row-span-2" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`group relative block aspect-[3/4] h-full w-full overflow-hidden rounded-lg bg-asphalt ${
                      isFeature(i) ? "md:aspect-auto" : ""
                    }`}
                    aria-label={`Open ${item.kind === "video" ? "video" : "photo"}: ${item.alt}`}
                  >
                    {item.kind === "image" ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <>
                        <InViewVideo item={item} />
                        <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-ink/60 backdrop-blur">
                          <Play className="size-3.5 fill-current" aria-hidden />
                        </span>
                      </>
                    )}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        <div className="mt-12 flex justify-center">
          <a href={site.social.instagram.url} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <InstagramIcon className="size-5" />
            More on Instagram {site.social.instagram.handle}
          </a>
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
          >
            <motion.div
              key={current.src}
              className="relative h-[82dvh] w-full max-w-[min(92vw,46rem)]"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {current.kind === "image" ? (
                <Image src={current.src} alt={current.alt} fill sizes="92vw" className="object-contain" />
              ) : (
                <video
                  src={current.src}
                  poster={current.poster}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              )}
            </motion.div>

            <button
              className="absolute top-5 right-5 grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            {visible.length > 1 && (
              <>
                <button
                  className="absolute left-3 grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:left-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  className="absolute right-3 grid size-12 place-items-center rounded-full bg-white/10 hover:bg-white/20 sm:right-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Shown until photos/videos are added to /public/work. */
function EmptyWork() {
  const labels = ["Skin fade", "Freehand design", "Taper + beard", "Kids cut", "Burst fade", "Mullet fade", "Line up"];
  return (
    <ul className="mt-14 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4">
      {labels.map((l, i) => (
        <li
          key={i}
          className={`relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-lg border border-line bg-asphalt p-5 ${
            i === 0 ? "md:row-span-2 md:aspect-auto" : ""
          }`}
        >
          <Scissors className="size-5 text-red" aria-hidden />
          <span className="display text-3xl text-white/80">{l}</span>
        </li>
      ))}
    </ul>
  );
}
