import {
  BodyMedium,
  Heading2,
  Heading3,
  Heading5,
} from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { useRequestVerificationLink } from "../api/request-verification-link";

const emailSchema = z.object({
  email: z.email("Invalid email"),
});
type EmailFormValues = z.infer<typeof emailSchema>;
export const RegisterForm = () => {
  const { userEmail, regisStep, loading, onSubmit } =
    useRequestVerificationLink();

  return (
    <RegisterStep
      step={regisStep}
      userEmail={userEmail}
      onSubmit={onSubmit}
      loading={loading ?? false}
    />
  );
};

type RegisterStepProps = {
  step: number;
  userEmail: string;
  loading: boolean;
  onSubmit: (data: EmailFormValues) => void;
};

const RegisterStep = ({
  step,
  userEmail,
  loading,
  onSubmit,
}: RegisterStepProps) => {
  switch (step) {
    case 0:
      return (
        <EmailCard
          loading={loading}
          onSubmit={(data) => {
            onSubmit(data);
          }}
        />
      );
    case 1:
      return (
        <VerifCard
          email={userEmail}
          loading={loading}
          onResend={() => onSubmit({ email: userEmail })}
        />
      );
    default:
      return (
        <div>
          <Heading5>
            Oopss ada kesalahan silakan kembali ke halaman login
          </Heading5>
          <Link to={paths.auth.register.path} replace>
            <Button>Kembali</Button>
          </Link>
        </div>
      );
  }
};

type EmailCardProps = {
  loading: boolean;
  onSubmit: (data: EmailFormValues) => void;
};

export const EmailCard = ({ onSubmit, loading }: EmailCardProps) => {
  return (
    <Card className="w-90 border border-forest  rounded-md h-70">
      <CardHeader>
        <CardTitle className="text-center">
          <Heading3 className="font-bold">Daftar</Heading3>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Form id="register-form" schema={emailSchema} onSubmit={onSubmit}>
          {({ register, errors }) => (
            <>
              <FormField label="Email" error={errors.email}>
                <Input
                  placeholder="example@gmail.com"
                  type="email"
                  className="rounded-md"
                  {...register("email")}
                />
              </FormField>
            </>
          )}
        </Form>
        <Button
          loading={loading}
          form="register-form"
          type="submit"
          className="w-full rounded-md cursor-pointer"
        >
          Lanjut
        </Button>
      </CardContent>
    </Card>
  );
};

const DEFAULT_COUNTDOWN_SECONDS = 70;
const TIMER_TICK_MS = 250;

type VerifCardProps = {
  email: string;
  loading: boolean;
  onResend: () => void;
};

export const VerifCard = ({ email, loading, onResend }: VerifCardProps) => {
  const [time, setTime] = useState(DEFAULT_COUNTDOWN_SECONDS);
  const [timerKey, setTimerKey] = useState(0);
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const isResendDisabled = time > 0 || loading || !email;

  useEffect(() => {
    const endTime = Date.now() + DEFAULT_COUNTDOWN_SECONDS * 1000;
    let intervalId = 0;

    const syncRemainingTime = () => {
      const remainingMs = endTime - Date.now();

      if (remainingMs <= 0) {
        setTime(0);
        window.clearInterval(intervalId);
        return;
      }

      setTime(Math.ceil(remainingMs / 1000));
    };

    syncRemainingTime();

    intervalId = window.setInterval(syncRemainingTime, TIMER_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [timerKey]);

  const handleResendClick = () => {
    setTime(DEFAULT_COUNTDOWN_SECONDS);
    setTimerKey((currentKey) => currentKey + 1);
    onResend();
  };

  return (
    <Card className="w-90 border border-forest rounded-md h-60">
      <CardHeader>
        <CardTitle className="text-center">
          <BodyMedium className="font-medium">Menunggu Verifikasi</BodyMedium>
        </CardTitle>
        <CardDescription className="text-center">
          Silahkan cek email{" "}
          <span className="font-bold text-neon-green">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Heading2 className="text-center">
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </Heading2>
        <p className="text-center text-md mt-10">
          Tidak dapat email?{" "}
          <button
            type="button"
            disabled={isResendDisabled}
            className="bg-transparent border-0 p-0 text-aloe cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleResendClick}
          >
            Kirim ulang
          </button>
        </p>
      </CardContent>
    </Card>
  );
};
