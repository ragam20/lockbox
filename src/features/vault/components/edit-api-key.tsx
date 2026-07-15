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
  base64ToArrayBuffer,
  createHKDFBaseKey,
  deriveVaultKey,
  encryptData,
  randomDataEncryptionKey,
  wrapDataEncryptionKey,
} from "@/lib/crypto/keys";
import { useAppStore } from "@/lib/store";
import type { VaultItem, VaultItemApiKey } from "@/types/entity";
import { Heading5 } from "lucide-react";
import { useEffect, useState } from "react";
import z from "zod";

const editApiKeySchema = z.object({
  title: z.string(),
  key: z.string().min(1, "Tidak boleh kosong"),
  description: z.string().optional(),
});
type EditApiKeyData = z.infer<typeof editApiKeySchema>;

type EditApiKeyProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  vaultItem: VaultItem | null;
};
export const DetailApiKey = ({
  open,
  onOpenChange,
  vaultItem,
}: EditApiKeyProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [item, setItem] = useState<VaultItemApiKey | null>(null);

  const appStore = useAppStore();
  const vaultConfig = useGetVaultQuery();

  useEffect(() => {}, []);

  const handleSubmit = async (data: EditApiKeyData) => {
    setItem((v) => {
      if (!v) return null;

      return {
        ...v,
        title: data.title,
        key: data.key,
        description: data.description || "",
      };
    });

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

    const dt = {
      key: data.key,
      description: data.description || "",
    };

    const ciphertext = await encryptData(dataEncryptionKey, JSON.stringify(dt));

    // update
  };

  if (!vaultItem) return null;

  return (
    <Dialog>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <Heading5>Ubah Password</Heading5>
        </DialogHeader>

        <Form
          key={item?.id}
          id="edit-api-key-id"
          className="my-4 flex flex-col"
          schema={editApiKeySchema}
          defaultValues={{
            title: item?.title,
            key: item?.key ?? "",
            description: item?.description ?? "",
          }}
          onSubmit={handleSubmit}
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

              <PasswordFormField
                label="password"
                error={errors.key}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              >
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password123..."
                  className="py-5"
                  {...register("key")}
                />
              </PasswordFormField>

              <FormField label="Deskripsi" error={errors.description}>
                <textarea
                  placeholder="tulis catatan"
                  className="h-36 w-full rounded-md border border-input bg-transparent p-4 outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  {...register("description")}
                />
              </FormField>
            </>
          )}
        </Form>

        <DialogFooter className="flex-col items-center gap-4 sm:flex-col xl:flex-row xl:justify-end">
          <Button
            type="button"
            onClick={() => {
              onOpenChange(false);
            }}
            className="w-full cursor-pointer rounded-md bg-red-600 text-white hover:bg-red-800 xl:w-fit"
          >
            Batal
          </Button>
          <SubmitButton
            type="submit"
            form="edit-api-key-id"
            className="w-full cursor-pointer rounded-md xl:w-fit"
          >
            Simpan
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
