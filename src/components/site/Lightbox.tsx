import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { ProjectImage } from "@/data/portfolio";

type Props = {
  images: ProjectImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

export function Lightbox({ images, index, onClose, onIndex }: Props) {
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const open = index !== null;
  const img = open ? images[index] : null;

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      setZoom(false);
      onIndex((index + d + images.length) % images.length);
    },
    [index, images.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", key);
    };
  }, [open, go, onClose]);

  return (
    <AnimatePresence>
      {img && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={img.caption}
          className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-8">
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-primary">{String(index! + 1).padStart(2, "0")}</span> / {String(images.length).padStart(2, "0")}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setZoom((z) => !z)} aria-label={zoom ? "Zoom out" : "Zoom in"} className="rounded-full border p-2.5 transition-colors hover:border-primary hover:text-primary">
                {zoom ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              </button>
              <button onClick={onClose} aria-label="Close" className="rounded-full border p-2.5 transition-colors hover:border-primary hover:text-primary">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 md:px-20">
            <AnimatePresence mode="wait">
              <motion.img
                key={img.src}
                src={img.src}
                alt={img.caption}
                width={img.width}
                height={img.height}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: zoom ? 2 : 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                style={{ transformOrigin: origin }}
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
                  setZoom((z) => !z);
                }}
                className={`max-h-[78vh] max-w-full rounded-sm object-contain shadow-panel ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                drag={!zoom ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(1);
                  else if (info.offset.x > 80) go(-1);
                }}
              />
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button onClick={() => go(-1)} aria-label="Previous image" className="glass absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-3 transition-colors hover:text-primary md:left-6">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={() => go(1)} aria-label="Next image" className="glass absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-3 transition-colors hover:text-primary md:right-6">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <div className="px-5 py-5 text-center md:px-8">
            <p className="eyebrow">{img.kind}</p>
            <p className="mt-1 font-display text-lg">{img.caption}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
