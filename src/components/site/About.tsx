import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { education, marqueeSkills, profile, skillGroups } from "@/data/portfolio";
import { cn } from "@/lib/utils";

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="group mask-fade-x flex overflow-hidden">
      <div className={cn("flex shrink-0 gap-3 pr-3 group-hover:[animation-play-state:paused]", reverse ? "animate-marquee-reverse" : "animate-marquee")}>
        {[...items, ...items].map((s, i) => (
          <span
            key={i}
            className="whitespace-nowrap rounded-full border bg-card/40 px-5 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export function About() {
  const [group, setGroup] = useState(0);
  const half = Math.ceil(marqueeSkills.length / 2);

  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading index="01" eyebrow="About" title={<>Designing with <span className="text-gold">intent</span>, building with precision.</>} />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Portrait */}
          <Reveal className="lg:col-span-5">
            <figure className="group relative">
              <div className="absolute -inset-3 translate-x-3 translate-y-3 rounded-sm border border-primary/40 transition-transform duration-700 group-hover:translate-x-5 group-hover:translate-y-5" />
              <div className="relative overflow-hidden rounded-sm">
                <img
                  src={profile.portrait}
                  alt={`Portrait of ${profile.name}`}
                  width={896}
                  height={1152}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover grayscale-[60%] transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-fade-bottom opacity-70" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-display text-2xl font-bold">{profile.name}</p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {profile.location}
                  </p>
                </figcaption>
              </div>
            </figure>
          </Reveal>

          <div className="space-y-14 lg:col-span-7">
            {/* Bio */}
            <Reveal delay={0.1} className="space-y-5">
              {profile.bio.map((p, i) => (
                <p key={i} className={i === 0 ? "text-lead text-foreground" : "text-muted-foreground leading-relaxed"}>
                  {p}
                </p>
              ))}
              <blockquote className="border-l-2 border-primary pl-5 font-display text-xl italic text-foreground/90">
                "Light is the first material, structure is the second."
              </blockquote>
            </Reveal>

            {/* Education */}
            <Reveal delay={0.15}>
              <h3 className="eyebrow mb-6">Education & Credentials</h3>
              <ol className="relative space-y-8 border-l pl-8">
                {education.map((e, i) => (
                  <motion.li
                    key={e.degree}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="group relative"
                  >
                    <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background transition-colors group-hover:bg-primary" />
                    <p className="font-mono text-xs text-primary">{e.period}</p>
                    <p className="mt-1 font-display text-lg font-semibold">{e.degree}</p>
                    <p className="text-sm text-foreground/80">{e.institution}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>
                  </motion.li>
                ))}
              </ol>
            </Reveal>

            {/* Skills */}
            <Reveal delay={0.2}>
              <h3 className="eyebrow mb-6">Skill Set</h3>
              <div className="mb-6 flex flex-wrap gap-2" role="tablist">
                {skillGroups.map((g, i) => (
                  <button
                    key={g.name}
                    role="tab"
                    aria-selected={group === i}
                    onClick={() => setGroup(i)}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm transition-colors",
                      group === i ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {group === i && <motion.span layoutId="skill-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 300, damping: 28 }} />}
                    <span className="relative">{g.name}</span>
                  </button>
                ))}
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {(skillGroups[group]?.skills ?? []).map((s, i) => (
                  <motion.div key={`${group}-${s.name}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{s.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{s.level}%</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full bg-gold"
                        initial={{ width: 0 }}
                        animate={{ width: `${s.level}%` }}
                        transition={{ duration: 1, delay: 0.1 + i * 0.06, ease: [0.2, 0.7, 0.2, 1] }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mt-24 space-y-3">
        <Marquee items={marqueeSkills.slice(0, half)} />
        <Marquee items={marqueeSkills.slice(half)} reverse />
      </div>
    </section>
  );
}
