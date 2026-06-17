import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { VaultItem } from "@/types/entity";
import type { VaultApiParams } from "@/types/params";
import type { ApiError, PaginationResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const getFavorites = async (params: VaultApiParams) => {
  const resp = await privateApi<PaginationResponse<VaultItem[]>>(
    "/vault/items/favorites",
    {
      params,
    },
  );

  return resp;
};

export const useGetFavorites = (params: VaultApiParams) => {
  return useQuery<PaginationResponse<VaultItem[]>, ApiError>({
    retry: maxRetry,
    queryKey: ["vault", "items", "favorites", params],
    queryFn: () => getFavorites(params),
  });
};
