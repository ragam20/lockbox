import { privateApi } from "@/lib/api-client";
import type { ApiResponse, ProtectionKey } from "@/types/response";

export const getProtectionKeys = async () => {
  const resp = await privateApi.get<ApiResponse<ProtectionKey[]>>(
    "/vault/items/protection-key",
  );

  return resp.data.data;
};
