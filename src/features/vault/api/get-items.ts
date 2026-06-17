import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { VaultItem } from "@/types/entity";
import type { VaultApiParams } from "@/types/params";
import type { ApiError, PaginationResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const getItems = async (params: VaultApiParams) => {
  const resp = await privateApi<PaginationResponse<VaultItem[]>>(
    "/vault/items",
    {
      params,
    },
  );

  return resp.data;
};

export const useGetItemsQuery = (params: VaultApiParams) => {
  return useQuery<PaginationResponse<VaultItem[]>, ApiError>({
    retry: maxRetry,
    queryKey: ["vault", "items", params],
    queryFn: () => getItems(params),
  });
};
