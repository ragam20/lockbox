import type { VaultItemNote } from "@/types/entity";
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
import { EditNote } from "./edit-note";
import { Link } from "react-router";

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
  const [items, setItems] = useState(dummyNoteList);
  const [editingItem, setEditingItem] = useState<VaultItemNote | null>(null);

  const actionMap = {
    edit: (v: VaultItemNote) => {
      setEditingItem(v);
    },
    favorite: (_v: VaultItemNote) => {},
    archive: (_v: VaultItemNote) => {},
    delete: (_v: VaultItemNote) => {},
  } as const;

  return (
    <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden">
      <EditNote
        open={Boolean(editingItem)}
        item={editingItem}
        onOpenChange={(state) => {
          if (!state) setEditingItem(null);
        }}
        onSubmit={(updatedItem) => {
          setItems((currentItems) =>
            currentItems.map((item) =>
              item.id === updatedItem.id ? updatedItem : item,
            ),
          );
        }}
      />

      <ul className="flex min-w-0 flex-col gap-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex h-14 w-full min-w-0 items-center gap-4 rounded-md border border-forest p-4 hover:border-neon-green"
          >
            <Link to={""} className="flex min-w-0 flex-1 items-center gap-4">
              {item.iconURL ? (
                <img
                  src={item.iconURL}
                  alt={item.title}
                  className="size-5 shrink-0 rounded-xs object-cover"
                />
              ) : (
                <NoteIcon className="size-5 shrink-0" />
              )}

              <BodyText className="min-w-0 flex-1 truncate">
                {item.title}
              </BodyText>
            </Link>

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
