import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Send, X, ArrowUpRight } from "lucide-react";
import { answer, initialSuggestions, type BotReply } from "@/lib/chatbot";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type Msg = { id: number; from: "bot" | "user"; text: string; link?: BotReply["link"] };

const MAX_LEN = 300;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions);
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, from: "bot", text: `Hi, I'm the ${profile.studio} assistant. Ask me about Elena's background, projects, philosophy or how to get in touch.` },
  ]);
  const scroller = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (raw: string) => {
    const text = raw.trim().slice(0, MAX_LEN);
    if (!text || typing) return;
    setMessages((m) => [...m, { id: idRef.current++, from: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = answer(text);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: idRef.current++, from: "bot", text: reply.text, link: reply.link }]);
      setSuggestions(reply.suggestions ?? initialSuggestions);
      setTyping(false);
    }, 550 + Math.min(reply.text.length * 4, 900));
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="shadow-panel fixed inset-x-3 border bg-popover/95 backdrop-blur-xl bottom-24 z-50 flex max-h-[min(640px,75vh)] flex-col overflow-hidden rounded-2xl sm:inset-x-auto sm:right-5 sm:w-[390px]"
          >
            <header className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display text-sm font-bold text-primary-foreground">
                  ER
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-success" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold">Atelier Assistant</p>
                  <p className="text-xs text-muted-foreground">Usually replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      m.from === "user" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-secondary text-secondary-foreground",
                    )}
                  >
                    {m.text}
                    {m.link && (
                      m.link.kind === "project" ? (
                        <Link
                          to="/projects/$slug"
                          params={{ slug: m.link.slug }}
                          onClick={() => setOpen(false)}
                          className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary"
                        >
                          {m.link.label} <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ) : (
                        <Link
                          to="/"
                          hash={m.link.hash}
                          onClick={() => setOpen(false)}
                          className="mt-2 flex items-center gap-1 text-xs font-semibold text-primary"
                        >
                          {m.link.label} <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      )
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-1 px-2 py-2" aria-label="Assistant is typing">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="shrink-0 rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 border-t px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_LEN}
                placeholder="Ask about projects, skills…"
                aria-label="Message"
                className="h-10 flex-1 rounded-full bg-secondary px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-gold"
      >
        {!open && <span className="absolute inset-0 rounded-full border-2 border-primary animate-pulse-ring" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "x" : "chat"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </>
  );
}
