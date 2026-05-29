import { publicApi } from "@/lib/api-client";
import { ApiError } from "@/types/response";
import { useState } from "react";
import { toast } from "sonner";
import z, { email } from "zod";

export const requestVerficationLinkSchema = z.object({
  email: email(),
});
export type RequestVerificationLinkData = z.infer<
  typeof requestVerficationLinkSchema
>;
export const requestVerificationLink = async (
  data: RequestVerificationLinkData,
) => {
  const resp = await publicApi.post(
    "/auth/register/request-verification-link",
    data,
  );
  return resp.data;
};

export const useRequestVerificationLink = () => {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [regisStep, setRegisStep] = useState(0);

  const onSubmit = async (data: RequestVerificationLinkData) => {
    setLoading(true);
    try {
      await requestVerificationLink(data);
      setRegisStep(1);
      setUserEmail(data.email);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Gagal mengirim link verifikasi");
      }
    } finally {
      setLoading(null);
    }
  };

  return {
    userEmail,
    regisStep,
    onSubmit,
    loading,
  };
};
