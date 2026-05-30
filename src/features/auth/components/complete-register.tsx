import { BodyText, Heading3, Heading4 } from "@/components/typography";
import { Button, SubmitButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, PasswordFormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import z from "zod";
import zxcvbn from "zxcvbn";
import { useGetRegisterSession } from "../api/get-register-session";
import { useRegister } from "../api/complete-register";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";
import { deriveRegistrationKey } from "@/lib/crypto/keys";
import { getArgonConfig } from "@/lib/auth";

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

type CompleteRegisterProps = {
  session: string;
};

export const CompleteRegister = ({ session }: CompleteRegisterProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const { email, verificationError, verficationLoading } =
    useGetRegisterSession(session);

  const registerMutation = useRegister();

  if (verficationLoading) {
    return (
      <div className="p-8 w-68 border border-forest rounded-md flex flex-col items-center gap-4 justify-center">
        <Heading4 className="text-center text-sm">
          Menunggu verifikasi...
        </Heading4>
        <LoaderCircle className="size-12 animate-spin" />
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="p-8 w-68 border border-forest rounded-md flex flex-col items-center gap-4 justify-center">
        <Heading4 className="text-center text-sm">
          Gagal mendaftar. Silakan daftar kembali!.
        </Heading4>
        <Button
          className="cursor-pointer"
          onClick={() => {
            navigate(paths.auth.register.path, { replace: true });
          }}
        >
          Kembali
        </Button>
      </div>
    );
  }

  if (registerMutation.isSuccess) {
    return (
      <div className="p-8 w-68 border border-forest rounded-md flex flex-col items-center gap-4 justify-center">
        <Heading4 className="text-center text-sm">
          Berhasil mendaftar. Silakan ke halaman login.
        </Heading4>
        <Button
          className="cursor-pointer"
          onClick={() => {
            navigate(paths.auth.otp.path, { replace: true });
          }}
        >
          Ke halaman login
        </Button>
      </div>
    );
  }

  const onHandleSubmit = async (data: CompleteRegisterFormValues) => {
    if (!email) {
      return;
    }

    if (data.password !== data.confirmPassword) {
      return;
    }
    let argonOptions:
      | { time: number; mem: number; parallelism: number }
      | undefined;

    try {
      const argonConfig = await getArgonConfig();

      argonOptions = {
        time: argonConfig.iteration,
        mem: argonConfig.memory,
        parallelism: argonConfig.parallelism,
      };
    } catch {
      argonOptions = undefined;
    }

    const registrationKey = await deriveRegistrationKey(
      data.password,
      argonOptions,
    );

    registerMutation.mutate({
      session: session,
      email: email,
      name: data.name,
      authVerifier: registrationKey.authVerifier,
      vaultKeySalt: registrationKey.vaultKeySalt,
      authVerifierSalt: registrationKey.authVerifierSalt,
      masterKeySalt: registrationKey.masterKeySalt,
    });
  };

  return (
    <Card className="w-90 border border-forest rounded-md">
      <CardHeader>
        <CardTitle className="text-center">
          <Heading3 className="font-bold">Daftar</Heading3>
        </CardTitle>
        <CardDescription className="text-center">
          Daftar untuk email{" "}
          <span className="font-bold text-neon-green">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Form
          id="complete-register-form"
          schema={completeRegisSchema}
          onSubmit={onHandleSubmit}
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
        <SubmitButton
          loading={registerMutation.isPending}
          type="submit"
          form="complete-register-form"
          className="w-full rounded-md cursor-pointer"
        >
          Daftar
        </SubmitButton>

        {registerMutation.error && (
          <p className="my-4 text-red-600">{registerMutation.error.message}</p>
        )}
      </CardContent>
    </Card>
  );
};
