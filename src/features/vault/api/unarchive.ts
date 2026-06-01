import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export const unArchive = async (id: string | number) => {
  await privateApi.post(`/vault/items/${id}/unarchive`);
};

export const useUnArchive = () => {
  return useMutation<void, ApiError, string | number>({
    retry: maxRetry,
    mutationFn: unArchive,
  });
};
