import type { VaultItemNote } from "@/types/api";
import { Button } from "@/components/ui/button";
import { BodyText } from "@/components/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveIcon,
  EllipsisIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { AppPagination } from "@/components/ui/pagination/app-pagination";
import { useState, type ComponentType } from "react";
import { NoteIcon } from "@phosphor-icons/react";

const dummyNoteList: VaultItemNote[] = [
  {
    id: "1",
    title: "My Dairy 1",
    description: "hi",
  },
  {
    id: "2",
    title: "My Dairy 2",
    description: "hi",
  },
  {
    id: "3",
    title: "My Dairy 3",
    description: "hi",
  },
  {
    id: "4",
    title: "My Dairy 4",
    description: "hi",
  },
  {
    id: "5",
    title: "My Dairy 5",
    description: "hi",
  },
];

type MenuItem = {
  key: "edit" | "favorite" | "archive" | "delete";
  label: string;
  icon: ComponentType<{ className?: string }>;
  destructive?: boolean;
};

const menuItems: MenuItem[] = [
  { key: "edit", label: "Ubah", icon: PencilIcon },
  { key: "favorite", label: "Favorit", icon: StarIcon },
  { key: "archive", label: "Arsip", icon: ArchiveIcon },
  { key: "delete", label: "Hapus", icon: Trash2Icon, destructive: true },
];

export const NotesList = () => {
  const [page, setPage] = useState(1);

  const actionMap = {
    edit: (v: VaultItemNote) => {},
    favorite: (v: VaultItemNote) => {},
    archive: (v: VaultItemNote) => {},
    delete: (v: VaultItemNote) => {},
  } as const;

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-4">
        {dummyNoteList.map((item) => (
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
              <NoteIcon className="size-5" />
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

      <AppPagination
        page={page}
        onPageChange={(p) => {
          setPage(p);
        }}
        totalPages={10}
      />
    </div>
  );
};
