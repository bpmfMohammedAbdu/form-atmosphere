import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./Reveal";
import { projects } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <section id="projects" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          index="03"
          eyebrow="Selected Projects"
          title={<>Built work & <span className="text-gold">competitions</span>.</>}
          intro="A curated selection across cultural, residential and high-rise typologies. Open a project for drawings, renders and the full story."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {projects.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: (i % 2) * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
              className={cn(i === 0 && "md:col-span-2")}
            >
              <Link to="/projects/$slug" params={{ slug: p.slug }} className="group block">
                <div className={cn("relative overflow-hidden rounded-sm", i === 0 ? "aspect-[16/10] md:aspect-[21/9]" : "aspect-[4/5]")}>
                  <img
                    src={p.cover.src}
                    alt={p.cover.caption}
                    width={p.cover.width}
                    height={p.cover.height}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-fade-bottom opacity-80 transition-opacity duration-700 group-hover:opacity-95" />
                  <div className="absolute left-5 top-5 flex gap-2">
                    <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest">{p.year}</span>
                    <span className="glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest">{p.status.split(" · ")[0]}</span>
                  </div>
                  <span className="absolute right-5 top-5 flex h-12 w-12 -translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="eyebrow">{p.typology}</p>
                    <h3 className="mt-2 text-title font-bold">{p.title}</h3>
                    <p className="mt-2 max-w-xl text-sm text-muted-foreground">{p.location}</p>
                    <p className="mt-3 max-h-0 max-w-xl overflow-hidden text-sm text-foreground/80 opacity-0 transition-all duration-700 group-hover:max-h-24 group-hover:opacity-100">
                      {p.summary}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
