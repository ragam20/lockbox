import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";

const menuItemClassName =
  "cursor-pointer px-4 py-2 text-sm hover:bg-forest hover:text-white focus:bg-forest focus:text-white";

type AvatarDropdownProps = {
  accountSetting?: () => void;
  lock?: () => void;
  logout?: () => void;
  children?: React.ReactNode;
};

export const AvatarDropdown = ({
  accountSetting,
  lock,
  logout,
  children,
}: AvatarDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          onSelect={accountSetting}
          className={menuItemClassName}
        >
          Pengaturan akun
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={lock} className={menuItemClassName}>
          Kunci
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={logout} className={menuItemClassName}>
          Keluar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
