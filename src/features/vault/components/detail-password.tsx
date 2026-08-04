import { BodyText, Heading5 } from "@/components/typography";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetVaultQuery } from "@/lib/auth";
import {
  base64ToArrayBuffer,
  createHKDFBaseKey,
  decryptData,
  deriveVaultKey,
  unwrapDataEncryptionKey,
} from "@/lib/crypto/keys";
import { useAppStore } from "@/lib/store";
import type { VaultItem, VaultItemPassword } from "@/types/entity";
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { format, isValid } from "date-fns";

type DetailPasswordProps = {
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

export const DetailPassword = ({
  open,
  onOpenChange,
  vaultItem,
}: DetailPasswordProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [item, setItem] = useState<VaultItemPassword | null>(null);

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

        const itemPassword: VaultItemPassword = {
          id: vaultItem.id,
          title: vaultItem.title,
          password: dt.password,
          url: dt.url,
          description: dt.description,
          createdAt: vaultItem.createdAt,
          updatedAt: vaultItem.updatedAt,
        };

        setItem(itemPassword);
      }
    };

    unwrapItem();
  }, [vaultItem, appStore.appCrypto.masterKey, vaultConfig.data?.vaultKeySalt]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setIsCopy(true);

      toast.success("Berhasil di copy");

      setTimeout(() => {
        setIsCopy(false);
      }, 1700);
    } catch {
      toast.success("Gagal di copy");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:w-fit max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto mb-8">
        <DialogHeader>
          <Heading5 className="text-[20px] font-bold">Detail Password</Heading5>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">Judul</p>
          <BodyText className="text-sm wrap-break-word">{item?.title}</BodyText>

          <p className="text-sm text-gray-500">URL</p>
          <BodyText className="text-sm wrap-break-word">{item?.url}</BodyText>

          <div
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-gray-500">Password</p>
            {!isPasswordVisible ? (
              <EyeIcon className="size-4" />
            ) : (
              <EyeOffIcon className="size-4" />
            )}
          </div>
          <div className="flex justify-between items-center">
            <Input
              placeholder={item?.password}
              type={`${isPasswordVisible ? "text" : "password"}`}
              value={item?.password}
              className="bg-void border-0 focus-visible:ring-0  flex-1 text-white"
              readOnly
            />

            {!isCopy ? (
              <CopyIcon
                onClick={() => {
                  handleCopy(item?.password ?? "");
                }}
                className="size-4 cursor-pointer"
              />
            ) : (
              <CheckIcon className="size-4 cursor-pointer" />
            )}
          </div>

          <p className="text-sm text-gray-500">Description</p>
          <div className="max-h-65 overflow-y-auto">
            <BodyText className="text-sm break-words whitespace-pre-wrap">
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
