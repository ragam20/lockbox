import { publicApi } from "@/lib/api-client";
import { ApiError, type ApiResponse } from "@/types/response";
import z from "zod";
import { useMutation } from "@tanstack/react-query";

export const registerInputSchema = z.object({
  email: z.email(),
  name: z.string(),
  authVerifier: z.string(),
  authVerifierSalt: z.string(),
  masterKeySalt: z.string(),
  vaultKeySalt: z.string(),
});
export type RegisterInputData = z.infer<typeof registerInputSchema> & {
  session: string;
};
export const register = async ({ session, ...data }: RegisterInputData) => {
  await publicApi.post<ApiResponse<unknown>>("/auth/register", data, {
    params: {
      session,
    },
  });
};

export const useRegister = () => {
  return useMutation<void, ApiError, RegisterInputData>({
    retry: false,
    mutationFn: register,
  });
};
