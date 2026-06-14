import z from "zod";
import { privateApi, publicApi } from "./api-client";
import { useAppStore } from "./store";
import { ApiError, type ApiResponse } from "@/types/response";
import type { ArgonConfig, User, Vault } from "@/types/entity";
import { useMutation, useQuery } from "@tanstack/react-query";
import { maxRetry, queryClient } from "./react-query";

export const authQueryKeys = {
  user: ["auth", "user"] as const,
  vault: ["auth", "vault"] as const,
  argonConfig: ["auth", "argon-config"] as const,
};

export const unlockInputSchema = z.object({
  email: z.email(),
  verifier: z.string(),
});
export type UnlockInputData = z.infer<typeof unlockInputSchema>;
export const login = async (data: UnlockInputData) => {
  await privateApi.post("/auth/unlock", data);
};

export const logout = async () => {
  await privateApi.post("/auth/logout");
};

export const refreshToken = async () => {
  await publicApi.post("/auth/refresh-token");
};

export const getArgonConfig = async () => {
  const resp = await privateApi.get<unknown, ApiResponse<ArgonConfig>>(
    "/vault/argon-config",
  );

  return resp.data.data;
};

export const getVault = async () => {
  const resp = await privateApi.get<unknown, ApiResponse<Vault>>("/vault");
  return resp.data.data;
};

export const getUser = async () => {
  const resp = await privateApi.get<unknown, ApiResponse<User>>("/user");
  return resp.data.data;
};

export const useGetUserQuery = () => {
  return useQuery<User, ApiError>({
    retry: maxRetry,
    queryKey: authQueryKeys.user,
    queryFn: getUser,
  });
};

export const useGetVaultQuery = () => {
  return useQuery<Vault, ApiError>({
    retry: maxRetry,
    queryKey: authQueryKeys.vault,
    queryFn: getVault,
  });
};

export const useGetArgonConfigQuery = () => {
  return useQuery<ArgonConfig, ApiError>({
    retry: maxRetry,
    queryKey: authQueryKeys.argonConfig,
    queryFn: getArgonConfig,
  });
};

export const useLogout = () => {
  const store = useAppStore();

  const doLogout = async (onSuccess?: () => void) => {
    try {
      await logout();
    } finally {
      queryClient.clear();
      store.clearApp();
    }

    onSuccess?.();
  };

  return {
    logout: doLogout,
  };
};

export const useLogin = () => {
  return useMutation<void, ApiError, UnlockInputData>({
    retry: false,
    mutationFn: login,
  });
};
