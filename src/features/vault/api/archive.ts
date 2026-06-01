import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export const archiveVault = async (id: string | number) => {
  await privateApi.post(`/vault/items/${id}/archive`);
};

export const useArchive = () => {
  return useMutation<void, ApiError, string | number>({
    retry: maxRetry,
    mutationFn: archiveVault,
  });
};
