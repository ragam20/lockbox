import {
  BodyMedium,
  BodyText,
  Heading2,
  Heading3,
} from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, PasswordFormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";
import { z } from "zod";

export const RegisterForm = () => {
  return (
    <div>
      {/* <EmailCard onSubmit={(data) => {}} /> */}
      {/* <VerifCard /> */}
      <CompleteRegisterCard />
    </div>
  );
};

const emailSchema = z.object({
  email: z.email("Invalid email"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

type EmailCardProps = {
  onSubmit: (data: EmailFormValues) => void;
};

export const EmailCard = ({ onSubmit }: EmailCardProps) => {
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
              <FormField label="email" error={errors.email}>
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
        <Button className="w-full rounded-md cursor-pointer">Lanjut</Button>
      </CardContent>
    </Card>
  );
};

const DEFAULT_COUNTDOWN_SECONDS = 50;
const TIMER_TICK_MS = 250;

type VerifCardProps = {
  email: string;
};

export const VerifCard = ({ email }: VerifCardProps) => {
  const [time, setTime] = useState(DEFAULT_COUNTDOWN_SECONDS);
  const [timerKey, setTimerKey] = useState(0);

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
          00:{time.toString().padStart(2, "0")}
        </Heading2>
        <p className="text-center text-md mt-10">
          Tidak dapat email?{" "}
          <button
            type="button"
            className="bg-transparent border-0 p-0 text-aloe cursor-pointer"
            onClick={handleResendClick}
          >
            Kirim ulang
          </button>
        </p>
      </CardContent>
    </Card>
  );
};

const completeRegisSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(1, "Verifikasi password wajib diisi"),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Verifikasi password tidak sama",
      });
    }
  });

type CompleteRegisterFormValues = z.infer<typeof completeRegisSchema>;

type CompleteRegisterCardProps = {
  onSubmit?: (data: CompleteRegisterFormValues) => void;
  email: string;
};

type PasswordMeter = {
  color: string;
  label: "lemah" | "sedang" | "kuat";
  width: string;
};

const getPasswordMeter = (password: string): PasswordMeter | null => {
  if (!password) {
    return null;
  }

  const score = zxcvbn(password).score;

  if (score <= 1) {
    return {
      color: "#f05454",
      label: "lemah",
      width: "33%",
    };
  }

  if (score === 2) {
    return {
      color: "#f2cc24",
      label: "sedang",
      width: "66%",
    };
  }

  return {
    color: "#82ed58",
    label: "kuat",
    width: "100%",
  };
};

export const CompleteRegisterCard = ({
  onSubmit = () => {},
  email,
}: CompleteRegisterCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  return (
    <Card className="w-90 border border-forest rounded-md">
      <CardHeader>
        <CardTitle className="text-center">
          <Heading3 className="font-bold">Daftar</Heading3>
        </CardTitle>
        <CardDescription className="text-center">
          Daftar untuk email{" "}
          <span className="font-bold text-neon-green">
            riswan.dev@gmail.com
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Form
          id="complete-register-form"
          schema={completeRegisSchema}
          onSubmit={onSubmit}
        >
          {({ register, errors, watch }) => {
            const password = watch("password") ?? "";
            const passwordMeter = getPasswordMeter(password);

            return (
              <>
                <FormField label="nama" error={errors.name}>
                  <Input
                    placeholder="nama kamu"
                    className="rounded-md"
                    {...register("name")}
                  />
                </FormField>
                <PasswordFormField
                  label="password"
                  error={errors.password}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="masukkan password"
                    className="rounded-md"
                    {...register("password")}
                  />
                </PasswordFormField>
                {passwordMeter && (
                  <div className="-mt-2 mb-2">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-forest/15">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          backgroundColor: passwordMeter.color,
                          width: passwordMeter.width,
                        }}
                      />
                    </div>
                    <BodyText className="mt-2 text-xs">
                      Kekuatan password:{" "}
                      <span
                        className="font-semibold"
                        style={{ color: passwordMeter.color }}
                      >
                        {passwordMeter.label}
                      </span>
                    </BodyText>
                  </div>
                )}
                <PasswordFormField
                  label="verifikasi password"
                  error={errors.confirmPassword}
                  showPassword={showVerifyPassword}
                  setShowPassword={setShowVerifyPassword}
                >
                  <Input
                    type={showVerifyPassword ? "text" : "password"}
                    placeholder="ulangi password"
                    className="rounded-md"
                    {...register("confirmPassword")}
                  />
                </PasswordFormField>
              </>
            );
          }}
        </Form>
        <Button
          type="submit"
          form="complete-register-form"
          className="w-full rounded-md cursor-pointer"
        >
          Daftar
        </Button>
      </CardContent>
    </Card>
  );
};
