import { lazy, Suspense, useCallback, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Hand, Maximize2 } from "lucide-react";
import { SectionHeading } from "./Reveal";
import { Lightbox } from "./Lightbox";
import { SceneBoundary } from "./SceneBoundary";
import { useInView } from "@/hooks/use-in-view";
import { exhibition } from "@/data/portfolio";

const ExhibitionScene = lazy(() => import("@/components/three/ExhibitionScene"));

function FlatFallback({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div className="absolute inset-0 flex snap-x gap-4 overflow-x-auto p-6">
      {exhibition.map((e, i) => (
        <button key={i} onClick={() => onOpen(i)} className="h-full shrink-0 snap-center">
          <img src={e.thumb} alt={e.title} loading="lazy" className="h-full w-auto rounded-sm object-cover" />
        </button>
      ))}
    </div>
  );
}

export function Exhibition() {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [seen, seenInView] = useInView<HTMLDivElement>("400px", true);
  const [live, liveInView] = useInView<HTMLDivElement>("0px");
  const item = exhibition[index] ?? exhibition[0]!;
  const n = exhibition.length;
  const onIndexChange = useCallback((i: number) => setIndex(i), []);
  const onOpen = useCallback((i: number) => setLightbox(i), []);

  return (
    <section id="exhibition" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="02"
          eyebrow="Virtual Exhibition"
          title={<>Walk the <span className="text-gold">gallery</span>.</>}
          intro="Renderings, concept sketches, models and drawings, hung in a circular room. Drag to rotate, click a work to inspect it."
        />
      </div>

      <div ref={seen} className="relative mx-auto max-w-[1600px]">
        <div
          ref={live}
          tabIndex={0}
          aria-label="3D exhibition. Use left and right arrow keys to rotate."
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setIndex((i) => (i + 1) % n);
            if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + n) % n);
            if (e.key === "Enter") setLightbox(index);
          }}
          className="relative h-[62vh] min-h-[420px] w-full cursor-grab outline-none active:cursor-grabbing focus-visible:ring-1 focus-visible:ring-ring"
        >
          {seenInView && (
            <ClientOnly fallback={null}>
              <SceneBoundary fallback={<FlatFallback onOpen={onOpen} />}>
                <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-muted-foreground">Hanging the works…</div>}>
                  <ExhibitionScene index={index} onIndexChange={onIndexChange} onOpen={onOpen} active={liveInView} />
                </Suspense>
              </SceneBoundary>
            </ClientOnly>
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-fade-bottom" />
        </div>

        <div className="mx-auto mt-6 flex max-w-7xl flex-col items-center justify-between gap-6 px-5 md:flex-row md:px-8">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="text-center md:text-left">
              <p className="eyebrow">
                {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {item.full.kind}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold">{item.title}</p>
              <p className="text-sm text-muted-foreground">{item.project}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-3">
            <span className="mr-2 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground lg:flex">
              <Hand className="h-3.5 w-3.5 text-primary" /> Drag to rotate
            </span>
            <button onClick={() => setIndex((i) => (i - 1 + n) % n)} aria-label="Previous work" className="glass rounded-full p-3 transition-colors hover:text-primary">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => setLightbox(index)} aria-label="Inspect work" className="glass rounded-full p-3 transition-colors hover:text-primary">
              <Maximize2 className="h-5 w-5" />
            </button>
            <button onClick={() => setIndex((i) => (i + 1) % n)} aria-label="Next work" className="glass rounded-full p-3 transition-colors hover:text-primary">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <Lightbox images={exhibition.map((e) => e.full)} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </section>
  );
}
