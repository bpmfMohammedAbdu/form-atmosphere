import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading, Reveal } from "./Reveal";
import { Magnetic } from "./MagneticButton";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

// Messages are not delivered anywhere yet; swap this for a real backend call.
async function sendMessage(_values: ContactValues) {
  await new Promise((r) => setTimeout(r, 1400));
  if (!navigator.onLine) throw new Error("offline");
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5" /> {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

const inputCls = (err?: boolean) =>
  cn(
    "w-full border-b bg-transparent py-3 text-base outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary",
    err ? "border-destructive" : "border-foreground/15",
  );

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: ContactValues) => {
    setStatus("sending");
    try {
      await sendMessage(values);
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading index="04" eyebrow="Contact" title={<>Let's build something <span className="text-gold">lasting</span>.</>} />

        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="space-y-8 lg:col-span-4">
            <p className="text-lead text-muted-foreground">{profile.availability}</p>
            <ul className="space-y-5">
              <li>
                <a href={`mailto:${profile.email}`} className="group flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border transition-colors group-hover:border-primary group-hover:text-primary"><Mail className="h-4 w-4" /></span>
                  <span className="link-line">{profile.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border"><Phone className="h-4 w-4" /></span>
                {profile.phone}
              </li>
              <li className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border"><MapPin className="h-4 w-4" /></span>
                {profile.location}
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-8">
            <div className="glass relative overflow-hidden rounded-2xl p-6 md:p-10">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex min-h-[380px] flex-col items-center justify-center text-center">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-gold"
                    >
                      <Check className="h-8 w-8" />
                    </motion.span>
                    <h3 className="mt-6 text-title font-bold">Message received</h3>
                    <p className="mt-2 max-w-sm text-muted-foreground">Thank you — I'll reply within two working days.</p>
                    <Button variant="line" className="mt-8 rounded-full" onClick={() => setStatus("idle")}>Send another</Button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-8 md:grid-cols-2">
                    <Field label="Name" error={errors.name?.message}>
                      <input {...register("name")} placeholder="Your name" autoComplete="name" maxLength={100} className={inputCls(!!errors.name)} />
                    </Field>
                    <Field label="Email" error={errors.email?.message}>
                      <input {...register("email")} type="email" placeholder="you@company.com" autoComplete="email" maxLength={255} className={inputCls(!!errors.email)} />
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Subject" error={errors.subject?.message}>
                        <input {...register("subject")} placeholder="A new cultural centre…" maxLength={150} className={inputCls(!!errors.subject)} />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Message" error={errors.message?.message}>
                        <textarea {...register("message")} rows={5} placeholder="Tell me about the site, the brief and the timeline." maxLength={2000} className={cn(inputCls(!!errors.message), "resize-none")} />
                      </Field>
                    </div>
                    <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
                      <AnimatePresence>
                        {status === "error" && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4" /> Couldn't send — check your connection and try again.
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <div className="md:ml-auto">
                        <Magnetic>
                          <Button type="submit" variant="gold" size="xl" disabled={status === "sending"}>
                            {status === "sending" ? (<><Loader2 className="animate-spin" /> Sending…</>) : (<>Send message <ArrowRight /></>)}
                          </Button>
                        </Magnetic>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
