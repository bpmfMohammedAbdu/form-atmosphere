import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="relative border-t">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <a href={`mailto:${profile.email}`} className="group block">
          <p className="eyebrow mb-4">Start a conversation</p>
          <p className="text-display font-bold transition-colors group-hover:text-primary break-all sm:break-normal">{profile.email}</p>
        </a>
        <div className="mt-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <ul className="flex flex-wrap gap-3">
            {profile.socials.map((s, i) => (
              <motion.li key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <motion.a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3 }}
                  className="group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors hover:border-primary hover:text-primary"
                >
                  {s.label}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </motion.a>
              </motion.li>
            ))}
          </ul>
          <div className="text-sm text-muted-foreground md:text-right">
            <p>{profile.studio} · {profile.location}</p>
            <p className="mt-1">© {2026} {profile.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
