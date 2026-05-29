import { z } from "zod";

export const createPasswordSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  url: z.string().refine((val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "invalid URL"),
});
export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
export const createPassword = async () => {};
