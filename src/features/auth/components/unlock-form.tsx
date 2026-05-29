import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, PasswordFormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heading3 } from "@/components/typography";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  useLogin,
  useGetVaultQuery,
  useGetArgonConfigQuery,
  useGetUserQuery,
} from "@/lib/auth";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors/messages";
import { useAppStore } from "@/lib/store";
import { hashArgon2id } from "@/lib/crypto/argon-config";
import {
  createHKDFBaseKey,
  deriveAuthKey,
  generateAuthVerifier,
  base64ToArrayBuffer,
  base64ToUint8Array,
} from "@/lib/crypto/keys";
import { Navigate, useNavigate } from "react-router";
import { paths } from "@/config/paths";

const loginSchema = z.object({
  password: z.string(),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export const UnlockForm = () => {
  const navigate = useNavigate();
  const appStore = useAppStore();
  const [showPassword, setShowPassword] = useState(false);

  const argonConfigQuery = useGetArgonConfigQuery();
  const userQuery = useGetUserQuery();
  const vaultQuery = useGetVaultQuery();

  const loginMutation = useLogin();

  useEffect(() => {
    if (loginMutation.isSuccess) {
      toast.success("Berhasil membuka brangkas");
      return;
    }
  }, [loginMutation.isSuccess]);

  const onSubmitForm = async (data: LoginFormValues) => {
    if (
      argonConfigQuery.data === undefined ||
      userQuery.data === undefined ||
      vaultQuery.data === undefined
    ) {
      toast.error(
        "Terjadi kesalahan saat memuat konfigurasi. Silakan coba lagi.",
      );
      return;
    }

    const cfg = argonConfigQuery.data;

    const masterKeySalt = userQuery.data.masterKeySalt;
    const masterKey = await hashArgon2id(
      data.password,
      base64ToUint8Array(masterKeySalt),
      {
        time: cfg.iteration,
        parallelism: cfg.parallelism,
        mem: cfg.memory,
      },
    );

    const baseKey = await createHKDFBaseKey(masterKey.hash);

    const verifierSalt = userQuery.data.authVerifierSalt;
    const authKey = await deriveAuthKey(
      baseKey,
      base64ToArrayBuffer(verifierSalt),
    );
    const authVerifier = await generateAuthVerifier(authKey);

    appStore.appCrypto.setCrypto({
      masterKey: masterKey.hash,
    });

    loginMutation.mutateAsync({
      email: userQuery.data.email,
      verifier: authVerifier,
    });

    navigate(paths.app.root.path, { replace: true });
  };

  if (!appStore.auth.isAuthenticated) {
    return <Navigate to={paths.auth.otp.path} replace />;
  }

  const isLoading =
    argonConfigQuery.isPending || userQuery.isPending || vaultQuery.isPending;

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Card className="w-90 border border-forest rounded-md ">
      <CardHeader>
        <CardTitle className="text-center">
          <Heading3 className="font-bold">Masuk</Heading3>
          <CardDescription>
            Selamat datang {userQuery.data?.email}
          </CardDescription>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Form id="unlock-form" schema={loginSchema} onSubmit={onSubmitForm}>
          {({ register, errors }) => (
            <>
              <PasswordFormField
                label="Password"
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
            </>
          )}
        </Form>
        <Button
          loading={loginMutation.isPending}
          type="submit"
          form="unlock-form"
          className="w-full rounded-md cursor-pointer"
        >
          Submit
        </Button>

        {loginMutation.error && (
          <p className="my-4 text-red-600">
            {getErrorMessage(loginMutation.error.code)}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
