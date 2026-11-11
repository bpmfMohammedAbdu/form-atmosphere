import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { AmbientAudio } from "@/lib/ambient-audio";
import { cn } from "@/lib/utils";

export function AudioToggle() {
  const audio = useRef<AmbientAudio | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => () => audio.current?.stop(), []);

  const toggle = async () => {
    if (!audio.current) {
      const { AmbientAudio } = await import("@/lib/ambient-audio");
      audio.current = new AmbientAudio();
    }
    if (on) {
      audio.current.stop();
      setOn(false);
    } else {
      await audio.current.start();
      setOn(true);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      aria-pressed={on}
      aria-label={on ? "Mute ambient sound" : "Play ambient sound"}
      className="glass fixed bottom-5 left-5 z-40 flex h-12 items-center gap-3 rounded-full px-4 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn("block w-[3px] origin-bottom rounded-full bg-primary", on ? "h-4 animate-eq" : "h-1")}
            style={on ? { animationDelay: `${i * 0.18}s` } : undefined}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{on ? "Sound on" : "Sound off"}</span>
    </motion.button>
  );
}
