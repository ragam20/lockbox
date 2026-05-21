import { publicApi } from "@/lib/api-client";
import { ApiError } from "@/types/response";
import { useEffect, useState } from "react";
import z from "zod";

export const registerInputSchema = z.object({
  email: z.email(),
  name: z.string(),
  authVerifier: z.string(),
  authVerifierSalt: z.string(),
  masterKeySalt: z.string(),
  vaultKeySalt: z.string(),
});
export type RegisterInputData = z.infer<typeof registerInputSchema>;
export const register = async (data: RegisterInputData, session: string) => {
  await publicApi.post("/auth/register", data, {
    params: {
      session,
    },
  });
};

export const useRegister = (session: string) => {
  const [registerLoading, setRegisterLoading] = useState<boolean | null>(null);
  const [registerData, setRegisterData] = useState<RegisterInputData | null>(
    null,
  );
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [successMessage, setSucessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!registerData) {
      return;
    }

    const fetch = async () => {
      setRegisterLoading(true);
      try {
        await register(registerData, session);
        setSucessMessage("Berhasil daftar");
      } catch (err) {
        console.log(err);
        if (err instanceof ApiError) {
          setRegisterError(err.message);
        }
      } finally {
        setRegisterLoading(null);
      }
    };

    fetch();
  }, [session, registerData]);

  return {
    setRegisterData,
    successMessage,
    registerError,
    registerLoading,
  };
};
