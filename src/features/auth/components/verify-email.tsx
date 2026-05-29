import { SuccessAnimation } from "@/components/animations/anim-success";
import { Button } from "@/components/ui/button";
import { useVerifyEmail } from "../api/verify-email";
import { Heading4 } from "@/components/typography";
import { LoaderCircle } from "lucide-react";
import { FailedAnimation } from "@/components/animations/anim-failed";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

type VerifyEmailProps = {
  token: string;
};

export const VerifyEmail = ({ token }: VerifyEmailProps) => {
  const navigate = useNavigate();
  const { session, verifyStatus } = useVerifyEmail(token);

  if (verifyStatus === "loading" || verifyStatus === "idle") {
    return (
      <div className="p-8 w-68 border border-forest rounded-md flex flex-col items-center gap-4 justify-center">
        <Heading4 className="text-center text-sm">
          Menunggu verifikasi...
        </Heading4>
        <LoaderCircle className="size-12 animate-spin" />
      </div>
    );
  }

  if (verifyStatus === "success") {
    return (
      <div className="p-8 w-68 border border-forest rounded-md flex flex-col items-center gap-4 justify-center">
        <Heading4 className="text-sm">Verifikasi Berhasil</Heading4>
        <SuccessAnimation />
        <Button
          onClick={() => {
            navigate(paths.auth.register.complete.getHref(session), {
              replace: true,
            });
          }}
          className="cursor-pointer"
        >
          Lanjutkan
        </Button>
      </div>
    );
  }

  if (verifyStatus === "error") {
    return (
      <div className="p-8 w-68 border border-forest rounded-md flex flex-col items-center gap-4 justify-center">
        <Heading4 className="text-sm">Verifikasi Gagal</Heading4>
        <FailedAnimation />
        <Button
          onClick={() => {
            navigate(paths.auth.register.path, { replace: true });
          }}
          className="cursor-pointer"
        >
          Kembali
        </Button>
      </div>
    );
  }
};
