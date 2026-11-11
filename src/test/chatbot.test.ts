import { describe, expect, it } from "vitest";
import { answer } from "@/lib/chatbot";
import { contactSchema } from "@/lib/contact-schema";

describe("portfolio assistant", () => {
  it("gives the contact email when asked how to get in touch", () => {
    expect(answer("How can I contact you?").text).toContain("hello@rouxatelier.studio");
  });
  it("lists every selected project when asked about projects", () => {
    const t = answer("show me your projects").text;
    expect(t).toContain("Monolith Pavilion");
    expect(t).toContain("Cascade House");
    expect(t).toContain("Helix Lattice Tower");
  });
  it("links to a specific project when it is named", () => {
    expect(answer("tell me about the tower in Singapore").link).toMatchObject({ kind: "project", slug: "helix-lattice-tower" });
  });
});

describe("contact form validation", () => {
  const ok = { name: "Ana", email: "ana@example.com", subject: "New house", message: "I'd love to talk about a project." };
  it("accepts a complete message", () => {
    expect(contactSchema.safeParse(ok).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...ok, email: "not-an-email" }).success).toBe(false);
  });
});
