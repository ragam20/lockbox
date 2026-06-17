import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import { VAULT_ITEM_TYPE } from "@/types/entity";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

export const updateVaultSchema = z.object({
  id: z.any(),
  title: z.string().min(1),
  itemType: z.enum(VAULT_ITEM_TYPE),
  ivCipherText: z.string(),
  ciphertext: z.string(),
  ivProtectionKey: z.string(),
  protectionKey: z.string(),
});
export type UpdateVaultInput = z.infer<typeof updateVaultSchema>;
export const updateVaultInput = async (data: UpdateVaultInput) => {
  await privateApi.put(`/vault/items/${data.id}`, data);
};

export const useUpdateVault = () => {
  return useMutation<void, ApiError, UpdateVaultInput>({
    retry: maxRetry,
    mutationFn: updateVaultInput,
  });
};
