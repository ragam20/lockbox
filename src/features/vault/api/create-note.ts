import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import { VAULT_ITEM_TYPE } from "@/types/entity";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1),
  itemType: z.enum(VAULT_ITEM_TYPE),
  ivCipherText: z.string(),
  ciphertext: z.string(),
  ivProtectionKey: z.string(),
  protectionKey: z.string(),
});
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export const createNote = async (data: CreateNoteInput) => {
  await privateApi.post("/vault/items", data);
};

export const useCreateNote = () => {
  return useMutation<void, ApiError, CreateNoteInput>({
    retry: maxRetry,
    mutationFn: createNote,
  });
};
