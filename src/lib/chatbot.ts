import { education, profile, projects, skillGroups } from "@/data/portfolio";

export type BotLink =
  | { label: string; kind: "project"; slug: string }
  | { label: string; kind: "section"; hash: "projects" | "contact" | "about" };
export type BotReply = { text: string; suggestions?: string[]; link?: BotLink };

const DEFAULT_SUGGESTIONS = ["Who is Elena?", "Show me projects", "Design philosophy", "How can I contact you?"];

const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

/** Pure, pre-programmed answer engine for the portfolio assistant. */
export function answer(input: string): BotReply {
  const q = input.toLowerCase().trim();
  if (!q) return { text: "Ask me anything about Elena's work.", suggestions: DEFAULT_SUGGESTIONS };

  const project = projects.find((p) => p.keywords.some((k) => q.includes(k)) || q.includes(p.title.toLowerCase()));
  if (project && !has(q, ["projects", "all work", "portfolio"])) {
    return {
      text: `${project.title} (${project.year}) — ${project.typology} in ${project.location} for ${project.client}. ${project.summary}`,
      link: { label: `Open ${project.title}`, kind: "project", slug: project.slug },
      suggestions: ["Other projects", "Design philosophy", "Contact"],
    };
  }

  if (has(q, ["contact", "email", "mail", "reach", "phone", "call", "hire", "commission", "get in touch"])) {
    return {
      text: `You can email ${profile.email} or call ${profile.phone}. ${profile.availability} The contact form at the bottom of the page works too.`,
      link: { label: "Go to contact form", kind: "section", hash: "contact" },
      suggestions: ["Where are you based?", "Show me projects"],
    };
  }

  if (has(q, ["project", "work", "portfolio", "built", "building", "design"]) && !has(q, ["philosoph", "approach"])) {
    const list = projects.map((p) => `• ${p.title} — ${p.typology}, ${p.location} (${p.year})`).join("\n");
    return {
      text: `Here are the selected projects:\n${list}\nAsk about any of them for details.`,
      link: { label: "Browse projects", kind: "section", hash: "projects" },
      suggestions: projects.map((p) => p.title),
    };
  }

  if (has(q, ["philosoph", "approach", "ethos", "believe", "style", "vision", "process"])) {
    return { text: profile.philosophy, suggestions: ["Skills & software", "Show me projects"] };
  }

  if (has(q, ["educat", "study", "studied", "degree", "university", "school", "award", "honour", "honor"])) {
    const list = education.map((e) => `• ${e.degree} — ${e.institution} (${e.period})`).join("\n");
    return { text: `Education & honours:\n${list}`, suggestions: ["Skills & software", "Contact"] };
  }

  if (has(q, ["skill", "software", "tool", "rhino", "revit", "blender", "cad", "grasshopper", "three", "parametric"])) {
    const list = skillGroups.map((g) => `• ${g.name}: ${g.skills.map((s) => s.name).join(", ")}`).join("\n");
    return { text: `Core skills:\n${list}`, suggestions: ["Show me projects", "Education"] };
  }

  if (has(q, ["where", "based", "location", "city", "live", "lisbon"])) {
    return { text: `${profile.studio} is based in ${profile.location}, working on projects worldwide.`, suggestions: ["Contact", "Show me projects"] };
  }

  if (has(q, ["who", "about", "background", "elena", "yourself", "experience", "bio"])) {
    return { text: `${profile.name} is an ${profile.role.toLowerCase()} and founder of ${profile.studio}. ${profile.bio[0]}`, suggestions: ["Education", "Design philosophy"] };
  }

  if (has(q, ["hi", "hello", "hey", "good morning", "good evening"])) {
    return { text: `Hello! I'm the ${profile.studio} assistant. I can tell you about Elena's background, projects, philosophy or how to get in touch.`, suggestions: DEFAULT_SUGGESTIONS };
  }

  if (has(q, ["thank", "thanks", "great", "cool"])) {
    return { text: "My pleasure. Anything else you'd like to know?", suggestions: DEFAULT_SUGGESTIONS };
  }

  return {
    text: "I'm not sure about that one. I can answer questions about Elena's background, education, skills, projects, design philosophy and contact details.",
    suggestions: DEFAULT_SUGGESTIONS,
  };
}

export const initialSuggestions = DEFAULT_SUGGESTIONS;
