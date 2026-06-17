import { publicApi } from "@/lib/api-client";
import type {
  ApiError,
  ApiResponse,
  RequestOtpResponse,
} from "@/types/response";
import { useMutation } from "@tanstack/react-query";

type RequestOtpInput = {
  email: string;
};
export const requestOTP = async (data: RequestOtpInput) => {
  const resp = await publicApi.post<ApiResponse<RequestOtpResponse>>(
    "/auth/request-otp",
    data,
  );
  return resp.data.data;
};

export const useRequestOTP = () => {
  return useMutation<RequestOtpResponse, ApiError, RequestOtpInput>({
    retry: false,
    mutationFn: requestOTP,
  });
};
