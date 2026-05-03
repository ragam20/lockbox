import type { ComponentType } from "react";
import type { VaultItemWeb } from "@/types/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BodyText } from "@/components/typography";
import {
  ArchiveIcon,
  CopyIcon,
  EllipsisIcon,
  GlobeLockIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { AppPagination } from "@/components/ui/pagination/app-pagination";

const dummyWebList: VaultItemWeb[] = [
  {
    id: "1",
    title: "Facebook",
    iconURL: "",
    description: "this is my facebook",
  },
  {
    id: "2",
    title: "Google",
    iconURL: "",
    description: "this is my facebook",
  },
  {
    id: "3",
    title: "Instagram",
    iconURL: "",
    description: "this is my facebook",
  },
];

type MenuItem = {
  key: "copy" | "edit" | "favorite" | "archive" | "delete";
  label: string;
  icon: ComponentType<{ className?: string }>;
  destructive?: boolean;
};

const menuItems: MenuItem[] = [
  { key: "copy", label: "Salin sandi", icon: CopyIcon },
  { key: "edit", label: "Ubah", icon: PencilIcon },
  { key: "favorite", label: "Favorit", icon: StarIcon },
  { key: "archive", label: "Arsip", icon: ArchiveIcon },
  { key: "delete", label: "Hapus", icon: Trash2Icon, destructive: true },
];

export const WebList = () => {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log(err);
    }
  };

  const actionMap = {
    copy: (v: VaultItemWeb) => {
      handleCopy(v.title);
    },
    edit: (v: VaultItemWeb) => {},
    favorite: (v: VaultItemWeb) => {},
    archive: (v: VaultItemWeb) => {},
    delete: (v: VaultItemWeb) => {},
  } as const;

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {dummyWebList.map((item) => (
          <li
            key={item.id}
            className="flex h-14 w-full items-center gap-4 rounded-md border border-forest p-4 hover:border-neon-green"
          >
            {item.iconURL ? (
              <img
                src={item.iconURL}
                alt={item.title}
                className="size-5 rounded-xs object-cover"
              />
            ) : (
              <GlobeLockIcon className="size-5" />
            )}

            <BodyText className="flex-1">{item.title}</BodyText>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer rounded-md"
                  aria-label={`Buka menu untuk ${item.title}`}
                >
                  <EllipsisIcon className="size-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44 rounded-md">
                {menuItems.map((menuItem) => {
                  const Icon = menuItem.icon;

                  return (
                    <DropdownMenuItem
                      key={menuItem.key}
                      variant={menuItem.destructive ? "destructive" : "default"}
                      className="cursor-pointer gap-3 px-3 py-2 text-sm"
                      onClick={() => actionMap[menuItem.key]?.(item)}
                    >
                      <Icon className="size-4" />
                      <span>{menuItem.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>

      <AppPagination page={1} onPageChange={() => {}} totalPages={10} />
    </div>
  );
};
