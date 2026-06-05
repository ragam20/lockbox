import { maxRetry } from "@/lib/react-query";
import type { UploadAvatarResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export type UploadAvatarInput = {
  upload_url: string;
  file: File;
  public_id: string;
  signature: string;
  api_key: string;
  timestamp: number;
};
export const uploadAvatar = async ({
  upload_url,
  ...data
}: UploadAvatarInput) => {
  const formData = new FormData();

  formData.append("file", data.file);
  formData.append("public_id", data.public_id);
  formData.append("signature", data.signature);
  formData.append("api_key", data.api_key);
  formData.append("timestamp", data.timestamp.toString());

  // external fetch
  const resp = await axios.post<UploadAvatarResponse>(upload_url, formData);
  return resp.data;
};

export const useUploadAvatar = () => {
  return useMutation<UploadAvatarResponse, AxiosError, UploadAvatarInput>({
    retry: maxRetry,
    mutationFn: uploadAvatar,
  });
};
