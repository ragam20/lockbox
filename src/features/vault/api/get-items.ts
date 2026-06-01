import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { VaultItem } from "@/types/entity";
import type { VaultApiParams } from "@/types/params";
import type { ApiError, ApiResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const getItems = async (params: VaultApiParams) => {
  const resp = await privateApi<ApiResponse<VaultItem[]>>("/vault/items", {
    params,
  });

  return resp.data.data;
};

export const useGetItemsQuery = (params: VaultApiParams) => {
  return useQuery<VaultItem[], ApiError>({
    retry: maxRetry,
    queryKey: ["vault", "items", params],
    queryFn: () => getItems(params),
  });
};
