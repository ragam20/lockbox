import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import { VAULT_ITEM_TYPE } from "@/types/entity";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createPasswordSchema = z.object({
  title: z.string().min(5),
  itemType: z.enum(VAULT_ITEM_TYPE),
  ivCipherText: z.string(),
  ciphertext: z.string(),
  ivProtectionKey: z.string(),
  protectionKey: z.string(),
});
export type CreatePasswordInput = z.infer<typeof createPasswordSchema>;
export const createPassword = async (
  data: CreatePasswordInput,
): Promise<void> => {
  await privateApi.post("/vault/items", data);
};

export const useCreatePassword = () => {
  return useMutation<void, ApiError, CreatePasswordInput>({
    retry: maxRetry,
    mutationFn: createPassword,
  });
};
