import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const links = [
  { hash: "about", label: "About" },
  { hash: "exhibition", label: "Exhibition" },
  { hash: "projects", label: "Projects" },
  { hash: "contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={cn("fixed inset-x-0 top-0 z-40 transition-all duration-500", scrolled ? "glass border-x-0 border-t-0" : "border-b border-transparent")}>
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-primary/60 font-display text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              ER
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-wide sm:block">{profile.studio}</span>
          </Link>
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l, i) => (
              <li key={l.hash}>
                <Link to="/" hash={l.hash} className="group flex items-baseline gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <span className="font-mono text-[10px] text-primary/70">0{i + 1}</span>
                  <span className="link-line">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/"
            hash="contact"
            className="hidden rounded-full border border-primary/50 px-5 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:inline-flex"
          >
            Hire me
          </Link>
          <button className="rounded-full p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-primary" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex flex-col justify-center bg-background/95 px-8 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-6">
              {links.map((l, i) => (
                <motion.li key={l.hash} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link to="/" hash={l.hash} onClick={() => setOpen(false)} className="flex items-baseline gap-4 font-display text-4xl font-bold">
                    <span className="font-mono text-sm text-primary">0{i + 1}</span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <p className="mt-12 font-mono text-xs text-muted-foreground">{profile.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
