import type { User } from "@/types/entity";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

type UserAvatarProps = {
  user: User;
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
};

export const UserAvatar = ({
  user,
  size,
  className,
  onClick,
  isLoading,
}: UserAvatarProps) => {
  const initials = getInitials(user.name);
  const bgColor = stringToColors(user.name || "user");

  return (
    <Avatar className={className} size={size} onClick={onClick}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-neon-green" />
        </div>
      ) : (
        <>
          <AvatarImage src={user.imgURL ? user.imgURL : ""} alt="user avatar" />

          <AvatarFallback
            style={{ backgroundColor: bgColor }}
            className="text-white font-medium"
          >
            {initials}
          </AvatarFallback>
        </>
      )}
    </Avatar>
  );
};

function getInitials(name?: string) {
  if (!name) return "??";

  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
}

const colors = [
  "#F87171", // red
  "#60A5FA", // blue
  "#34D399", // green
  "#FBBF24", // yellow
  "#A78BFA", // purple
  "#FB923C", // orange
  "#2DD4BF", // teal
];

function stringToColors(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
