import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "./MagneticButton";
import { SceneBoundary } from "./SceneBoundary";
import { useInView } from "@/hooks/use-in-view";
import { profile, stats } from "@/data/portfolio";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({ y: 0, transition: { duration: 1, delay: 0.15 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] as const } }),
};

export function Hero() {
  const [ref, inView] = useInView<HTMLElement>("0px");
  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pb-28 pt-24">
      {/* 3D structure */}
      <div className="absolute inset-0 opacity-60 md:left-[38%] md:opacity-100">
        <ClientOnly fallback={null}>
          <SceneBoundary fallback={null}>
            <Suspense fallback={null}>
              <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.3 }}>
                <HeroScene active={inView} />
              </motion.div>
            </Suspense>
          </SceneBoundary>
        </ClientOnly>
        <div className="pointer-events-none absolute inset-0 bg-fade-bottom md:hidden" />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-5 md:px-8">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="eyebrow mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-primary" /> {profile.role} — {profile.location}
        </motion.p>
        <h1 className="max-w-4xl text-hero font-extrabold uppercase">
          {["Space,", "structure", "& light."].map((w, i) => (
            <span key={w} className="block overflow-hidden pb-1">
              <motion.span custom={i} variants={line} initial="hidden" animate="show" className={i === 2 ? "block text-gold" : "block"}>
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-8 max-w-xl text-lead text-muted-foreground"
        >
          I'm {profile.name}. I design buildings and parametric systems that are rooted in landscape, honest in structure and generous with light.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="pointer-events-auto mt-10 flex flex-wrap gap-4"
        >
          <Magnetic>
            <Button asChild variant="gold" size="xl">
              <a href="#projects">
                Explore Projects <ArrowRight />
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild variant="line" size="xl">
              <a href="#contact">Get in Touch</a>
            </Button>
          </Magnetic>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t pt-6"
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-xs text-muted-foreground">{s.label}</dt>
              <dd className="font-display text-3xl font-bold">{s.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        Scroll <ArrowDown className="h-4 w-4 text-primary" />
      </motion.a>
      <p className="absolute bottom-8 right-8 z-10 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:block">
        Move your cursor to rotate
      </p>
    </section>
  );
}
