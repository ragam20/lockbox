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
import { useGetVaultQuery } from "@/lib/auth";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  createHKDFBaseKey,
  deriveVaultKey,
  encryptData,
  randomDataEncryptionKey,
  wrapDataEncryptionKey,
} from "@/lib/crypto/keys";
import { queryClient } from "@/lib/react-query";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { useCreateApiKey } from "../api/create-api-key";

const createApiKeySchema = z.object({
  title: z.string().min(1, "Tidak boleh kosong"),
  key: z.string().min(1, "Tidak boleh kosong"),
  description: z.string().optional(),
});
type CreateApiKeyData = z.infer<typeof createApiKeySchema>;

type CreateApiKeyProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
};
export const CreateApiKey = ({ open, onOpenChange }: CreateApiKeyProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const appStore = useAppStore();
  const vaultConfig = useGetVaultQuery();
  const createApiKeyMutation = useCreateApiKey();

  useEffect(() => {
    if (createApiKeyMutation.isSuccess) {
      toast.success("Berhasil buat api key baru");
      return;
    }

    if (createApiKeyMutation.isError) {
      toast.error("Gagal buat api key");
      return;
    }
  }, [createApiKeyMutation.isSuccess, createApiKeyMutation.isError]);

  const handleInput = async (data: CreateApiKeyData) => {
    const dt = {
      key: data.key,
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

    createApiKeyMutation.mutateAsync(
      {
        title: data.title,
        itemType: "apiKey",
        ivCipherText: arrayBufferToBase64(ciphertext.iv),
        ciphertext: arrayBufferToBase64(ciphertext.ciphertext),
        ivProtectionKey: arrayBufferToBase64(encryptedDEK.iv),
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
          <Heading5>Api Key</Heading5>
        </DialogHeader>
        <Form
          id="create-api-key-id"
          className="my-4 flex flex-col"
          schema={createApiKeySchema}
          onSubmit={handleInput}
        >
          {({ register, errors }) => (
            <>
              <FormField label="nama" error={errors.title}>
                <Input
                  className="py-5"
                  placeholder="contoh: chatgpt"
                  {...register("title")}
                />
              </FormField>

              <PasswordFormField
                label="api key"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={errors.key}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Api...Key"
                  className="py-5"
                  {...register("key")}
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
            form="create-api-key-id"
            loading={createApiKeyMutation.isPending}
            className="w-full cursor-pointer rounded-md xl:w-fit"
          >
            Buat
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
