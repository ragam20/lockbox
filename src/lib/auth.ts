import z from "zod";
import { privateApi, publicApi } from "./api-client";

export const loginInputSchema = z.object({
  email: z.email(),
  verifier: z.string(),
});
export type LoginInputData = z.infer<typeof loginInputSchema>;
export const login = async (data: LoginInputData) => {
  const resp = await publicApi.post("/auth/login", data);
  return resp;
};

export const logout = async () => {
  await privateApi.post("/auth/logout");
};

export const refreshToken = async () => {
  await publicApi.get("/auth/refresh-token");
};
