import { publicApi } from "@/lib/api-client";
import type { ApiResponse, VerifyEmailResponse } from "@/types/response";
import { useEffect, useRef, useState } from "react";

export const verifyEmail = async (token: string) => {
  const resp = await publicApi.get<ApiResponse<VerifyEmailResponse>>(
    "/auth/register/verify-email",
    {
      params: {
        token,
      },
    },
  );

  return resp.data;
};

type VerifyStatus = "idle" | "loading" | "success" | "error";

export const useVerifyEmail = (token: string) => {
  const hasVerified = useRef(false);

  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [session, setSession] = useState<string>("");

  useEffect(() => {
    if (!token || hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    const verify = async () => {
      setVerifyStatus("loading");
      try {
        const resp = await verifyEmail(token);

        setSession(resp.data.session);

        setVerifyStatus("success");
      } catch {
        setVerifyStatus("error");
      }
    };

    verify();
  }, [token]);

  return {
    session,
    verifyStatus,
  };
};
