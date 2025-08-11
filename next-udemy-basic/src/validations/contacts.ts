import { z } from "zod";
export const ContactSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});
// 型の定義（フォームやAPIで使用）
export type ContactType = z.infer<typeof ContactSchema>;
