import { BodyText, Heading5 } from "@/components/typography";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { VaultItemLogin } from "@/types/api";
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type DetailLoginProps = {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  item: VaultItemLogin | null;
};

export const DetailLogin = ({ open, onOpenChange, item }: DetailLoginProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCopy, setIsCopy] = useState(false);

  if (!item) return null;

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
      <DialogContent className="sm:max-w-100 mb-8">
        <DialogHeader>
          <Heading5>Detail Login</Heading5>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-500">Judul</p>
          <BodyText className="text-sm">{item.title}</BodyText>

          <p className="text-sm text-gray-500">URL</p>
          <BodyText className="text-sm">{item.url}</BodyText>

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
              placeholder={item.password}
              type={`${isPasswordVisible ? "text" : "password"}`}
              value={item.password}
              className="bg-void border-0 focus-visible:ring-0  flex-1 text-white"
              readOnly
            />

            {!isCopy ? (
              <CopyIcon
                onClick={() => {
                  handleCopy(item.password ?? "");
                }}
                className="size-4 cursor-pointer"
              />
            ) : (
              <CheckIcon className="size-4 cursor-pointer" />
            )}
          </div>

          <p className="text-sm text-gray-500">Description</p>
          <div className="max-h-65 overflow-y-auto">
            <BodyText className="text-sm">{item.description}</BodyText>
          </div>

          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Dibuat</p>
              <BodyText className="text-sm">{item.createdAt}</BodyText>
            </div>

            <div>
              <p className="text-sm text-gray-500">Diperbarui</p>
              <BodyText className="text-sm">{item.updatedAt}</BodyText>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
