import { Heading5 } from "@/components/typography";
import { Button, SubmitButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Form, FormField, PasswordFormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/react-query";
import z from "zod";
import { useCreatePassword } from "../api/create-password";
import { toast } from "sonner";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  createHKDFBaseKey,
  deriveVaultKey,
  encryptData,
  randomDataEncryptionKey,
  uint8ToBase64,
  wrapDataEncryptionKey,
} from "@/lib/crypto/keys";
import { useAppStore } from "@/lib/store";
import { useGetVaultQuery } from "@/lib/auth";

const createPasswordSchema = z.object({
  title: z.string(),
  password: z.string(),
  url: z.string().refine((val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  }, "Invalid URL"),
  description: z.string().optional(),
});
type CreatePasswordData = z.infer<typeof createPasswordSchema>;

type CreateLoginProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
};

export const CreatePassword = ({ open, onOpenChange }: CreateLoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const appStore = useAppStore();
  const vaultConfig = useGetVaultQuery();
  const createPasswordMutation = useCreatePassword();

  useEffect(() => {
    if (createPasswordMutation.isSuccess) {
      toast.success("Berhasil buat password baru");
      return;
    }

    if (createPasswordMutation.isError) {
      toast.error("Gagal buat password");
      return;
    }
  }, [createPasswordMutation.isSuccess, createPasswordMutation.isError]);

  const handleInput = async (data: CreatePasswordData) => {
    const dt = {
      password: data.password,
      url: data.url,
      description: data.description,
    };

    if (!appStore.appCrypto.masterKey || !vaultConfig.data?.vaultKeySalt) {
      return;
    }

    const baseKey = await createHKDFBaseKey(appStore.appCrypto.masterKey);
    const vaultKey = await deriveVaultKey(
      baseKey,
      base64ToArrayBuffer(vaultConfig.data?.vaultKeySalt),
    );

    const dataEncryptionKey = await randomDataEncryptionKey();
    const encryptedDEK = await wrapDataEncryptionKey(
      dataEncryptionKey,
      vaultKey,
    );

    const ciphertext = await encryptData(dataEncryptionKey, JSON.stringify(dt));

    createPasswordMutation.mutateAsync(
      {
        title: data.title,
        itemType: "password",
        ivCipherText: arrayBufferToBase64(ciphertext.iv),
        ciphertext: arrayBufferToBase64(ciphertext.ciphertext),
        ivProtectionKey: uint8ToBase64(encryptedDEK.iv),
        protectionKey: arrayBufferToBase64(encryptedDEK.wrappedKey),
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["vault", "items"] });
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <Heading5>Password Baru</Heading5>
        </DialogHeader>

        <Form
          id="create-login-id"
          className="my-4 flex flex-col"
          schema={createPasswordSchema}
          onSubmit={handleInput}
        >
          {({ register, errors }) => (
            <>
              <FormField label="judul" error={errors.title}>
                <Input
                  className="py-5"
                  placeholder="contoh: facebook"
                  {...register("title")}
                />
              </FormField>

              <FormField label="url" error={errors.url}>
                <Input
                  className="py-5"
                  placeholder="https://www.example.com"
                  {...register("url")}
                />
              </FormField>

              <PasswordFormField
                label="password"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password123..."
                  className="py-5"
                  {...register("password")}
                />
              </PasswordFormField>

              <FormField label="Deskripsi" error={errors.description}>
                <textarea
                  placeholder="tulis catatan"
                  {...register("description")}
                  className="h-36 w-full rounded-md border border-input bg-transparent p-4 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                />
              </FormField>
            </>
          )}
        </Form>

        <DialogFooter className="flex-col items-center gap-4 sm:flex-col xl:flex-row xl:justify-end">
          <Button
            onClick={() => {
              onOpenChange(false);
            }}
            className="w-full cursor-pointer rounded-md bg-red-600 text-white hover:bg-red-800 xl:w-fit"
          >
            Batal
          </Button>
          <SubmitButton
            type="submit"
            form="create-login-id"
            loading={createPasswordMutation.isPending}
            className="w-full cursor-pointer rounded-md xl:w-fit"
          >
            Buat
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
