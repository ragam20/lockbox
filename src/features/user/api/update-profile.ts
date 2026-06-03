import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

type UpdateProfileInput = {
  name: string;
};
export const updateProfile = async (data: UpdateProfileInput) => {
  await privateApi.put("/user", data);
};

export const useUpdateProfile = () => {
  return useMutation<void, ApiError, UpdateProfileInput>({
    retry: maxRetry,
    mutationFn: updateProfile,
  });
};
