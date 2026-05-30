import { UserAvatar } from "@/components/ui/avatar/user-avatar";
import { SubmitButton } from "@/components/ui/button";
import type { User } from "@/types/entity";
import { CameraIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useId, useState } from "react";

type SetAvatarProps = {
  user: User;
  onChange?: (file: File) => void;
};

export const SetAvatar = ({ user, onChange }: SetAvatarProps) => {
  const avatarInputId = useId();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const profileUser = {
    ...user,
    imgURL: avatarPreview ?? user.imgURL,
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    onChange?.(file);
  };

  return (
    <div className="relative mx-auto mb-8 size-36">
      <UserAvatar
        user={profileUser}
        className="size-full **:data-[slot=avatar-fallback]:text-4xl"
      />

      <input
        id={avatarInputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleAvatarChange}
      />

      <SubmitButton
        size="icon-sm"
        className="absolute right-2 bottom-2 rounded-full bg-void/90 text-white shadow-md hover:bg-forest"
        aria-label="Pilih foto profil"
      >
        <label htmlFor={avatarInputId} className="cursor-pointer">
          <CameraIcon className="size-4" />
        </label>
      </SubmitButton>
    </div>
  );
};
