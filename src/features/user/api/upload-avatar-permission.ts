import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type {
  ApiError,
  ApiResponse,
  UploadAvatarPermissionResponse,
} from "@/types/response";
import { useMutation } from "@tanstack/react-query";

export const uploadAvatarPermission = async () => {
  const resp = await privateApi.get<
    ApiResponse<UploadAvatarPermissionResponse>
  >("/user/avatar/upload-permission");
  return resp.data.data;
};

export const useUploadAvatarPermission = () => {
  return useMutation<UploadAvatarPermissionResponse, ApiError>({
    retry: maxRetry,
    mutationFn: uploadAvatarPermission,
  });
};
