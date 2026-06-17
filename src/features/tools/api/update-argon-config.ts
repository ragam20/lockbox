import { privateApi } from "@/lib/api-client";
import { maxRetry } from "@/lib/react-query";
import type { ApiError } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import z from "zod";

const argonConfigSchema = z.object({
  id: z.string().or(z.number()),
  iterations: z.number(),
  parallelism: z.number(),
  memory: z.number(),
});
const protectionKey = z.object({
  itemId: z.string().or(z.number()),
  ivProtectionKey: z.string(),
  protectionKey: z.string(),
});

export const updateArgonConfigSchema = z.object({
  authVerifier: z.string(),
  argonConfig: argonConfigSchema,
  protectionKeys: z.array(protectionKey),
});

export type UpdateArgonConfigInput = z.infer<typeof updateArgonConfigSchema>;

export const updateArgonConfig = async (data: UpdateArgonConfigInput) => {
  const resp = await privateApi.put("/vault/argon-config", data);

  return resp.data;
};

export const useUpdateArgonConfig = () => {
  return useMutation<void, ApiError, UpdateArgonConfigInput>({
    retry: maxRetry,
    mutationFn: updateArgonConfig,
  });
};
