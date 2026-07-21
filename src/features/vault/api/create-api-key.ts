import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import { VAULT_ITEM_TYPE } from "@/types/entity";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const createApiKeySchema = z.object({
  title: z.string().min(5),
  itemType: z.enum(VAULT_ITEM_TYPE),
  ivCipherText: z.string(),
  ciphertext: z.string(),
  ivProtectionKey: z.string(),
  protectionKey: z.string(),
});
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export const createApiKey = async (data: CreateApiKeyInput) => {
  await privateApi.post("/vault/items", data);
};

export const useCreateApiKey = () => {
  return useMutation<void, ApiError, CreateApiKeyInput>({
    retry: maxRetry,
    mutationFn: createApiKey,
  });
};
