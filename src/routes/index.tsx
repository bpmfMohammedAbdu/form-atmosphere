import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Exhibition } from "@/components/site/Exhibition";
import { Projects } from "@/components/site/Projects";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Elena Roux — Architect & Computational Designer | Roux Atelier" },
      { name: "description", content: "Explore Elena Roux's architecture portfolio: an interactive 3D exhibition, selected projects, drawings and renders from Lisbon-based Roux Atelier." },
      { property: "og:title", content: "Elena Roux — Architect & Computational Designer" },
      { property: "og:description", content: "Interactive architecture portfolio with a 3D exhibition, selected projects, drawings and renders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Hero />
      <About />
      <Exhibition />
      <Projects />
      <Contact />
      <Footer />
    </motion.main>
  );
}
