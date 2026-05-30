import { BodyText, Heading5 } from "@/components/typography";
import { Button, SubmitButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { useVerifyOTP } from "../api/verify-otp";
import { useRequestOTP } from "../api/request-otp";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/messages";

const requestOtpSchema = z.object({
  email: z.email("Invalid email"),
});
type RequestOtpData = z.infer<typeof requestOtpSchema>;

const verifyOtpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
});
type Step = "request" | "verify";

export const OtpForm = () => {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [expiresIn, setExpiresIn] = useState(0);
  const hasRequestedOtp = Boolean(email);

  const navigate = useNavigate();

  const verifyOTP = useVerifyOTP();
  const requestOTP = useRequestOTP();

  const appStore = useAppStore();

  useEffect(() => {
    if (step !== "verify" || expiresIn <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setExpiresIn((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [expiresIn, step]);

  const handleRequestOtp = async (data: RequestOtpData) => {
    const resp = await requestOTP.mutateAsync({ email: data.email });

    verifyOTP.reset();

    setEmail(data.email);
    setExpiresIn(resp.expiresIn);
    setStep("verify");
  };

  const handleVerifyOtp = async (otp: string) => {
    const resp = await verifyOTP.mutateAsync({ email: email, otp: otp });

    if (!resp.isVerified) {
      toast.error("OTP tidak valid");
      return;
    }

    appStore.auth.setAuth({ email: email, isAuthenticated: resp.isVerified });

    navigate(paths.unlock.path, { replace: true });
  };

  const restartSession = () => {
    requestOTP.reset();
    verifyOTP.reset();
    setStep("request");
    setEmail("");
    setExpiresIn(0);
  };

  const handleChangeStep = (nextStep: Step) => {
    if (step === "verify" && nextStep === "request") {
      restartSession();
      return;
    }

    setStep(nextStep);
  };

  return (
    <Card className="w-90 border border-forest rounded-md">
      <CardHeader>
        <CardTitle className="text-center">
          <Heading5 className="font-bold">
            Verifikasi {step === "verify" ? "OTP" : "Email"}
          </Heading5>
          {email !== "" && (
            <CardDescription className="my-2">
              Masukan kode verifikasi yang dikirim ke email:
              <span className="font-extrabold"> {email}</span>
            </CardDescription>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {step === "request" ? (
          <RequestOtp
            isLoading={requestOTP.isPending}
            isError={requestOTP.isError}
            errorMessage={requestOTP.error?.code}
            onSubmit={handleRequestOtp}
          />
        ) : (
          <VerifyOtp
            isLoading={verifyOTP.isPending}
            isError={verifyOTP.isError}
            errorMessage={verifyOTP.error?.code}
            email={email}
            expiresIn={expiresIn}
            onBack={restartSession}
            onResetError={verifyOTP.reset}
            onSubmit={handleVerifyOtp}
          />
        )}

        <StepButtons
          currentStep={step}
          canOpenVerify={hasRequestedOtp}
          onChangeStep={handleChangeStep}
        />
      </CardContent>
    </Card>
  );
};

type StepButtonsProps = {
  currentStep: Step;
  canOpenVerify: boolean;
  onChangeStep: (step: Step) => void;
};

const StepButtons = ({
  currentStep,
  canOpenVerify,
  onChangeStep,
}: StepButtonsProps) => {
  const steps: Array<{ label: string; value: Step; disabled: boolean }> = [
    { label: "Request OTP", value: "request", disabled: false },
    { label: "Verify OTP", value: "verify", disabled: !canOpenVerify },
  ];

  return (
    <div className="my-4 flex items-center justify-center gap-3">
      {steps.map((step, index) => (
        <button
          key={step.value}
          type="button"
          aria-label={step.label}
          disabled={step.disabled}
          onClick={() => onChangeStep(step.value)}
          className={cn(
            "size-3 rounded-full border border-neon-green transition-colors disabled:cursor-not-allowed disabled:border-muted-foreground disabled:opacity-40",
            currentStep === step.value && "bg-neon-green",
          )}
        >
          <span className="sr-only">{index + 1}</span>
        </button>
      ))}
    </div>
  );
};

type RequestOtpProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onSubmit: (data: RequestOtpData) => void;
};

const RequestOtp = ({
  isLoading,
  isError,
  errorMessage,
  onSubmit,
}: RequestOtpProps) => {
  useEffect(() => {
    if (isError) {
      toast.error("Gagal mengirim OTP. Silakan coba lagi.");
    }
  }, [isError]);

  return (
    <>
      {errorMessage && (
        <BodyText className="text-xs text-red-600">
          {getErrorMessage(errorMessage)}
        </BodyText>
      )}

      <Form id="request-otp-form" schema={requestOtpSchema} onSubmit={onSubmit}>
        {({ register, errors }) => (
          <FormField label="Email" error={errors.email}>
            <Input
              type="email"
              placeholder="user@gmail.com"
              className="rounded-md"
              {...register("email")}
            />
          </FormField>
        )}
      </Form>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" disabled className="rounded-md">
          Kembali
        </Button>
        <SubmitButton
          loading={isLoading}
          type="submit"
          form="request-otp-form"
          className="rounded-md cursor-pointer"
        >
          Request OTP
        </SubmitButton>
      </div>

      <BodyText className="text-white text-xs mt-4 text-center">
        Belum punya akun?{" "}
        <Link to={paths.auth.register.path}>
          <span className="text-neon-green cursor-pointer">Daftar</span>
        </Link>
      </BodyText>
    </>
  );
};

type VerifyOtpProps = {
  email: string;
  expiresIn: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onBack: () => void;
  onResetError: () => void;
  onSubmit: (code: string) => void;
};

const VerifyOtp = ({
  isLoading,
  isError,
  errorMessage,
  expiresIn,
  onBack,
  onResetError,
  onSubmit,
}: VerifyOtpProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const isExpired = expiresIn === 0;

  useEffect(() => {
    if (isError && errorMessage) {
      toast.error(getErrorMessage(errorMessage));
      return;
    }
  }, [errorMessage, isError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = verifyOtpSchema.safeParse({ code });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Invalid OTP");
      return;
    }

    setError("");
    onSubmit(code);
  };

  return (
    <>
      <div className="space-y-1">
        <BodyText className={cn("text-xs", isExpired && "text-red-600")}>
          {isExpired ? "OTP expired" : `Expires in ${expiresIn}s`}
        </BodyText>
      </div>

      <form
        id="verify-otp-form"
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-3"
      >
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(value) => {
            setCode(value.replace(/\D/g, ""));
            setError("");
            onResetError();
          }}
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={isExpired}
          containerClassName="justify-center"
        >
          <InputOTPGroup className="flex items-center gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className={cn("size-10 text-base", isError && "border-red-600")}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {error && <BodyText className="text-xs text-red-600">{error}</BodyText>}
      </form>

      {isExpired ? (
        <Button
          type="button"
          onClick={onBack}
          className="w-full rounded-md cursor-pointer"
        >
          Kembali
        </Button>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="rounded-md cursor-pointer"
          >
            Kembali
          </Button>
          <SubmitButton
            loading={isLoading}
            type="submit"
            form="verify-otp-form"
            disabled={code.length !== 6}
            className="rounded-md cursor-pointer"
          >
            Verifikasi
          </SubmitButton>
        </div>
      )}
    </>
  );
};
