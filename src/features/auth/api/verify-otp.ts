import { publicApi } from "@/lib/api-client";
import type {
  ApiError,
  ApiResponse,
  VerifyOtpResponse,
} from "@/types/response";
import { useMutation } from "@tanstack/react-query";

type RequestVerifyOTP = {
  email: string;
  otp: string;
};
export const verifyOTP = async (data: RequestVerifyOTP) => {
  const resp = await publicApi.post<ApiResponse<VerifyOtpResponse>>(
    "/auth/verify-otp",
    data,
  );
  return resp.data.data;
};

export const useVerifyOTP = () => {
  return useMutation<VerifyOtpResponse, ApiError, RequestVerifyOTP>({
    retry: false,
    mutationFn: verifyOTP,
  });
};
