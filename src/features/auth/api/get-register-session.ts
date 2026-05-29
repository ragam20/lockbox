import { publicApi } from "@/lib/api-client";
import {
  type ApiResponse,
  type GetRegisterSessionReponse,
} from "@/types/response";
import { useEffect, useState } from "react";
import z, { string } from "zod";

export const registerSessionSchema = z.object({
  session: string(),
});
export type RegisterSessionInput = z.infer<typeof registerSessionSchema>;
export const getRegisterSession = async (data: RegisterSessionInput) => {
  const resp = await publicApi.post<ApiResponse<GetRegisterSessionReponse>>(
    "/auth/register/session",
    data,
  );
  return resp.data;
};

export const useGetRegisterSession = (session: string) => {
  const [email, setEmail] = useState<string | null>(null);
  const [verficationLoading, setVerificationLoading] = useState<boolean | null>(
    null,
  );
  const [verificationError, setVerficationError] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const registerSession = async () => {
      setVerificationLoading(true);
      try {
        const resp = await getRegisterSession({ session: session });

        setEmail(resp.data.email);
      } catch {
        setVerficationError(true);
      }

      setVerificationLoading(null);
    };

    registerSession();
  }, [session]);

  return {
    email,
    verficationLoading,
    verificationError,
  };
};
