import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import { projects } from "@/data/portfolio";
import { Lightbox } from "@/components/site/Lightbox";
import { Reveal } from "@/components/site/Reveal";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { slug: project.slug };
  },
  head: ({ loaderData }) => {
    const p = projects.find((x) => x.slug === loaderData?.slug);
    if (!p) return { meta: [{ title: "Project not found — Roux Atelier" }, { name: "robots", content: "noindex" }] };
    const title = `${p.title} — ${p.location} | Roux Atelier`;
    return {
      meta: [
        { title },
        { name: "description", content: p.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: p.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="text-display font-bold">Project not found</h1>
      <Link to="/" hash="projects" className="text-primary link-line">Back to projects</Link>
    </main>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useLoaderData();
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];
  const next = projects[(idx + 1) % projects.length];
  const [lightbox, setLightbox] = useState<number | null>(null);

  const meta = [
    ["Client", project.client],
    ["Location", project.location],
    ["Year", project.year],
    ["Typology", project.typology],
    ["Area", project.area],
    ["Status", project.status],
  ];

  return (
    <motion.main key={slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      {/* Cover */}
      <section className="relative flex min-h-[88svh] items-end overflow-hidden">
        <motion.img
          src={project.cover.src}
          alt={project.cover.caption}
          width={project.cover.width}
          height={project.cover.height}
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-fade-bottom" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
          <Link to="/" hash="projects" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="eyebrow">
            {project.typology} · {project.year}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }} className="mt-4 text-hero font-extrabold uppercase">
            {project.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-5 max-w-2xl text-lead text-foreground/80">
            {project.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Metadata + narrative */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <dl className="divide-y border-y">
            {meta.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{k}</dt>
                <dd className="text-right text-sm">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.1} className="space-y-6 lg:col-span-7 lg:col-start-6">
          <p className="eyebrow">Design narrative</p>
          <p className="text-title font-semibold leading-snug">{project.summary}</p>
          {project.narrative.map((p, i) => (
            <p key={i} className="leading-relaxed text-muted-foreground">{p}</p>
          ))}
        </Reveal>
      </section>

      {/* Masonry gallery */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-title font-bold">Drawings & images</h2>
          <p className="font-mono text-xs text-muted-foreground">{project.images.length} works</p>
        </div>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {project.images.map((im, i) => (
            <motion.button
              key={im.src + i}
              onClick={() => setLightbox(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
              className="group relative mb-5 block w-full overflow-hidden rounded-sm text-left break-inside-avoid"
            >
              <img src={im.src} alt={im.caption} width={im.width} height={im.height} loading="lazy" className="w-full transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-fade-bottom opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div>
                  <p className="eyebrow">{im.kind}</p>
                  <p className="text-sm">{im.caption}</p>
                </div>
                <Maximize2 className="h-4 w-4 text-primary" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Next project */}
      <section className="border-t">
        <Link to="/projects/$slug" params={{ slug: next.slug }} className="group mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-16 md:px-8">
          <div>
            <p className="eyebrow">Next project</p>
            <p className="mt-3 text-display font-bold transition-colors group-hover:text-primary">{next.title}</p>
          </div>
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-6 w-6" />
          </span>
        </Link>
      </section>

      <Footer />
      <Lightbox images={project.images} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </motion.main>
  );
}
