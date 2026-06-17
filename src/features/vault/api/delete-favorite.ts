import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export const deleteFavorite = async (id: string | number) => {
  await privateApi.delete(`/vault/items/${id}/favorite`);
};

export const useDeleteFavorite = () => {
  return useMutation<void, ApiError, string | number>({
    retry: maxRetry,
    mutationFn: deleteFavorite,
  });
};
