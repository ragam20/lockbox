import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export const removeAvatar = async () => {
  await privateApi.delete("/user/avatar");
};

export const useRemoveAvatar = () => {
  return useMutation<void, ApiError>({
    retry: maxRetry,
    mutationFn: removeAvatar,
  });
};
