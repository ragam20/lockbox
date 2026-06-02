import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export const setFavorite = async (id: string | number) => {
  await privateApi.put(`/vault/items/${id}/favorite`);
};

export const useSetFavorite = () => {
  return useMutation<void, ApiError, string | number>({
    retry: maxRetry,
    mutationFn: setFavorite,
  });
};
