import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
});
export type CreateNote = z.infer<typeof createNoteSchema>;
export const createNote = async () => {};
