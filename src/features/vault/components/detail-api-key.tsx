import { BodyText, Heading5 } from "@/components/typography";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGetVaultQuery } from "@/lib/auth";
import { useAppStore } from "@/lib/store";
import type { VaultItem, VaultItemPassword } from "@/types/entity";
import { format, isValid } from "date-fns";
import { CopyIcon, EyeIcon, EyeOffIcon, CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);
  if (!isValid(date)) return "-";

  return format(date, "yyyy-MM-dd hh:mm");
};

type DetailApiKeyProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  vaultItem: VaultItem | null;
};
export const DetailApiKey = ({
  open,
  onOpenChange,
  vaultItem,
}: DetailApiKeyProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [item, setItem] = useState<VaultItemPassword | null>(null);

  const appStore = useAppStore();
  const vaultConfig = useGetVaultQuery();

  useEffect(() => {}, []);

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
      <DialogContent>
        <DialogHeader>
          <Heading5>Detail Api Key</Heading5>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">Judul</p>
          <BodyText className="text-sm wrap-break-word">{item?.title}</BodyText>

          <div
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-gray-500">Key</p>
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
