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
import { z } from "zod";
import { useCreateNote } from "../api/create-note";
import { useAppStore } from "@/lib/store";
import { useGetVaultQuery } from "@/lib/auth";
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
import { useEffect } from "react";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";

const createNoteSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});
type CreateNoteData = z.infer<typeof createNoteSchema>;

type CreateNoteProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
};

export const CreateNote = ({ open, onOpenChange }: CreateNoteProps) => {
  const appStore = useAppStore();
  const vaultConfig = useGetVaultQuery();
  const createNoteMutation = useCreateNote();

  useEffect(() => {
    if (createNoteMutation.isSuccess) {
      toast.success("Berhasil buat password baru");
      return;
    }

    if (createNoteMutation.isError) {
      toast.error("Gagal buat password");
      return;
    }
  }, [createNoteMutation.isSuccess, createNoteMutation.isError]);

  const handleInput = async (data: CreateNoteData) => {
    const dt = {
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

    createNoteMutation.mutateAsync(
      {
        title: data.title,
        itemType: "note",
        ciphertext: arrayBufferToBase64(ciphertext.ciphertext),
        ivCipherText: arrayBufferToBase64(ciphertext.iv),
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
          <Heading5>Catatan Baru</Heading5>
        </DialogHeader>
        <Form
          id="create-note-id"
          className="my-4 flex flex-col"
          onSubmit={handleInput}
          schema={createNoteSchema}
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
                  {...register("description")}
                  placeholder="tulis catatan"
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
            form="create-note-id"
            loading={createNoteMutation.isPending}
            className="w-full cursor-pointer rounded-md xl:w-fit"
          >
            Buat
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
