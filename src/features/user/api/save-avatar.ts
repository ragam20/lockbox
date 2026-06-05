import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";

type SaveAvatarRequest = {
  imgURL: string;
  publicImgId: string;
};
export const saveAvatarRequest = async (data: SaveAvatarRequest) => {
  await privateApi.patch("/user/avatar", data);
};

export const useSaveAvatarRequest = () => {
  return useMutation<unknown, ApiError, SaveAvatarRequest>({
    retry: maxRetry,
    mutationFn: saveAvatarRequest,
  });
};
