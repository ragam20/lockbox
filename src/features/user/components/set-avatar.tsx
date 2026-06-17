import { UserAvatar } from "@/components/ui/avatar/user-avatar";
import { SubmitButton } from "@/components/ui/button";
import type { User } from "@/types/entity";
import { CameraIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { useSaveAvatarRequest } from "../api/save-avatar";
import { useRemoveAvatar } from "../api/remove-avatar";
import { useUploadAvatarPermission } from "../api/upload-avatar-permission";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useUploadAvatar } from "../api/upload-avatar";
import { queryClient } from "@/lib/react-query";
import { PhotoView } from "@/components/ui/dialog/photo-view";

type AvatarAction = "setAvatar" | "deleteAvatar";

type AvatarMenuItem = {
  key: AvatarAction;
  label: string;
  className: string;
};

const menuItem = [
  {
    key: "setAvatar",
    label: "Pilih Gambar",
    className: "cursor-pointer",
  },
  {
    key: "deleteAvatar",
    label: "Hapus Avatar",
    className: "text-red-400 cursor-pointer",
  },
] satisfies AvatarMenuItem[];

type SetAvatarProps = {
  user: User;
  onChange?: (file: File) => void;
};

export const SetAvatar = ({ user, onChange }: SetAvatarProps) => {
  const avatarInputId = useId();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarView, setAvatarView] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveAvatarMutation = useSaveAvatarRequest();
  const removeAvatarMutation = useRemoveAvatar();
  const uploadAvatarPermissionMutation = useUploadAvatarPermission();
  const uploadAvatarMutation = useUploadAvatar();

  const isLoading =
    saveAvatarMutation.isPending ||
    removeAvatarMutation.isPending ||
    uploadAvatarPermissionMutation.isPending ||
    uploadAvatarMutation.isPending;

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const permission = await uploadAvatarPermissionMutation.mutateAsync();

      const uploadResp = await uploadAvatarMutation.mutateAsync({
        upload_url: permission.uploadURL,
        file: file,
        api_key: permission.apiKey,
        public_id: permission.publicId,
        signature: permission.signature,
        timestamp: permission.timestamp,
      });

      await saveAvatarMutation.mutateAsync({
        imgURL: uploadResp.secure_url,
        publicImgId: uploadResp.public_id,
      });

      setAvatarPreview(URL.createObjectURL(file));
      onChange?.(file);

      await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    } catch {
      toast.error("Gagal upload gambar");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const actionMap = {
    setAvatar: () => fileInputRef.current?.click(),
    deleteAvatar: async () => {
      await removeAvatarMutation.mutateAsync(undefined, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
          toast.success("Berhasil hapus foto");
        },
      });
    },
  } as const;

  return (
    <div className="relative mx-auto mb-8 size-36">
      <PhotoView
        open={avatarView}
        setOpen={setAvatarView}
        url={user.imgURL ?? ""}
      />

      <UserAvatar
        isLoading={isLoading}
        onClick={isLoading ? undefined : () => setAvatarView(!avatarView)}
        user={user}
        className="cursor-pointer size-full **:data-[slot=avatar-fallback]:text-4xl"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SubmitButton
            disabled={isLoading}
            size="icon-sm"
            className="absolute right-2 bottom-2 rounded-full bg-void/90 text-white shadow-md hover:bg-forest"
            aria-label="Pilih foto profil"
          >
            <CameraIcon className="size-4" />
            <input
              ref={fileInputRef}
              id={avatarInputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </SubmitButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {menuItem.map((item) => {
            const action = actionMap[item.key];
            return (
              <DropdownMenuItem
                key={item.key}
                onClick={action}
                className={item.className}
              >
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
