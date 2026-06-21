import { BodyText, Heading5 } from "@/components/typography";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useGetVaultQuery } from "@/lib/auth";
import {
  base64ToArrayBuffer,
  createHKDFBaseKey,
  decryptData,
  deriveVaultKey,
  unwrapDataEncryptionKey,
} from "@/lib/crypto/keys";
import { useAppStore } from "@/lib/store";

import type { VaultItem, VaultItemNote } from "@/types/entity";
import { useEffect, useState } from "react";
import { format, isValid } from "date-fns";

type DetailNoteProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  vaultItem: VaultItem | null;
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (!isValid(date)) return "-";

  return format(date, "yyyy-MM-dd hh:mm");
};

export const DetailNote = ({
  open,
  onOpenChange,
  vaultItem,
}: DetailNoteProps) => {
  const [item, setItem] = useState<VaultItemNote | null>(null);

  const appStore = useAppStore();

  const vaultConfig = useGetVaultQuery();

  useEffect(() => {
    const unwrapItem = async () => {
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
          base64ToArrayBuffer(vaultItem.ivCiphertext),
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

    unwrapItem();
  }, [vaultItem, appStore.appCrypto.masterKey, vaultConfig.data?.vaultKeySalt]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:w-fit max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto mb-8">
        <DialogHeader>
          <Heading5>Detail Catatan</Heading5>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">Judul</p>
          <BodyText className="text-sm wrap-break-word">{item?.title}</BodyText>

          <p className="text-sm text-gray-500">Description</p>
          <div className="max-h-65 overflow-y-auto">
            <BodyText className="text-sm wrap-break-word whitespace-pre-wrap">
              {item?.description}
            </BodyText>
          </div>

          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Dibuat</p>
              <BodyText className="text-sm">
                {formatDateTime(item?.createdAt)}
              </BodyText>
            </div>

            <div>
              <p className="text-sm text-gray-500">Diperbarui</p>
              <BodyText className="text-sm">
                {formatDateTime(item?.updatedAt)}
              </BodyText>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
