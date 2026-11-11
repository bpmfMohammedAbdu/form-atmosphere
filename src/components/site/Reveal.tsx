import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

export function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ index, eyebrow, title, intro }: { index: string; eyebrow: string; title: React.ReactNode; intro?: string }) {
  return (
    <Reveal className="mb-12 md:mb-16 max-w-3xl">
      <p className="eyebrow mb-4 flex items-center gap-3">
        <span className="text-muted-foreground">{index}</span>
        <span className="h-px w-10 bg-primary/60" />
        {eyebrow}
      </p>
      <h2 className="text-display font-bold">{title}</h2>
      {intro && <p className="mt-5 text-lead text-muted-foreground">{intro}</p>}
    </Reveal>
  );
}
