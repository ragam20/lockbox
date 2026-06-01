import { Heading5 } from "@/components/typography";
import { Button, SubmitButton } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form/form";
import { Input } from "@/components/ui/input";
import { useGetVaultQuery } from "@/lib/auth";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  createHKDFBaseKey,
  decryptData,
  deriveVaultKey,
  encryptData,
  randomDataEncryptionKey,
  uint8ToBase64,
  unwrapDataEncryptionKey,
  wrapDataEncryptionKey,
} from "@/lib/crypto/keys";
import { useAppStore } from "@/lib/store";
import type { VaultItem, VaultItemNote } from "@/types/entity";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useUpdateVault } from "../api/update-item";

const editNoteSchema = z.object({
  title: z.string(),
  description: z.string(),
});
type EditNoteValues = z.output<typeof editNoteSchema>;

type EditNoteProps = {
  open: boolean;
  vaultItem: VaultItem | null;
  onOpenChange: (state: boolean) => void;
};

export const EditNote = ({ open, vaultItem, onOpenChange }: EditNoteProps) => {
  const [item, setItem] = useState<VaultItemNote | null>(null);

  const appStore = useAppStore();
  const vaultConfig = useGetVaultQuery();

  const updateMutaton = useUpdateVault();

  useEffect(() => {
    const unWrapItem = async () => {
      if (
        vaultItem &&
        appStore.appCrypto.masterKey &&
        vaultConfig.data?.vaultKeySalt
      ) {
        const baseKey = await createHKDFBaseKey(appStore.appCrypto.masterKey);

        const vaultKey = await deriveVaultKey(
          baseKey,
          base64ToArrayBuffer(vaultConfig.data?.vaultKeySalt),
        );

        const unwrappedDEK = await unwrapDataEncryptionKey(
          vaultKey,
          base64ToArrayBuffer(vaultItem.ivProtectionKey),
          base64ToArrayBuffer(vaultItem.protectionKey),
        );

        const unwrappedData = await decryptData(
          unwrappedDEK,
          base64ToArrayBuffer(vaultItem.ivCipherText),
          base64ToArrayBuffer(vaultItem.ciphertext),
        );

        const plaintText = new TextDecoder().decode(unwrappedData);

        const dt = JSON.parse(plaintText);

        const itemNote: VaultItemNote = {
          id: vaultItem.id,
          title: vaultItem.title,
          description: dt.description,
          createdAt: vaultItem.createdAt,
          updatedAt: vaultItem.updatedAt,
        };

        setItem(itemNote);
      }
    };

    unWrapItem();
  }, [vaultItem, appStore.appCrypto.masterKey, vaultConfig.data?.vaultKeySalt]);

  const handleSubmit = async (data: EditNoteValues) => {
    setItem((v) => {
      if (!v) return null;

      return {
        ...v,
        title: data.title,
        description: data.description,
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
      description: data.description || "",
    };

    const ciphertext = await encryptData(dataEncryptionKey, JSON.stringify(dt));

    updateMutaton.mutateAsync(
      {
        id: item?.id,
        title: data.title,
        itemType: "note",
        ciphertext: arrayBufferToBase64(ciphertext.ciphertext),
        ivCipherText: arrayBufferToBase64(ciphertext.iv),
        ivProtectionKey: uint8ToBase64(encryptedDEK.iv),
        protectionKey: arrayBufferToBase64(encryptedDEK.wrappedKey),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );

    onOpenChange(false);
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <Heading5>Ubah Catatan</Heading5>
        </DialogHeader>

        <Form
          key={item.id}
          id="edit-note-id"
          className="my-4 flex flex-col"
          schema={editNoteSchema}
          defaultValues={{
            title: item.title,
            description: item.description ?? "",
          }}
          onSubmit={handleSubmit}
        >
          {({ register, errors }) => (
            <>
              <FormField label="Judul" error={errors.title}>
                <Input
                  className="py-5"
                  placeholder="masukan judul"
                  {...register("title")}
                />
              </FormField>

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
            form="edit-note-id"
            className="w-full cursor-pointer rounded-md xl:w-fit"
          >
            Simpan
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
