import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be under 255 characters"),
  subject: z.string().trim().min(3, "Please add a subject").max(150, "Subject must be under 150 characters"),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000, "Message must be under 2000 characters"),
});

export type ContactValues = z.infer<typeof contactSchema>;
