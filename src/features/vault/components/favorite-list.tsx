import { BodyText } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppPagination } from "@/components/ui/pagination/app-pagination";

import type { VaultItemPassword, VaultItemNote } from "@/types/entity";
import { NoteIcon } from "@phosphor-icons/react";
import {
  ArchiveIcon,
  CopyIcon,
  EllipsisIcon,
  GlobeLockIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { EditPassword } from "./edit-password";
import { EditNote } from "./edit-note";
import {
  VaultItemDetail,
  type VaultDetailItemByType,
} from "./detail-vault-item";

type FavoriteWebItem = VaultDetailItemByType["web"];
type FavoriteNoteItem = VaultDetailItemByType["note"];
type FavoriteVaultItem = FavoriteWebItem | FavoriteNoteItem;
type FavoriteVaultItemType = FavoriteVaultItem["type"];

type FavoriteAction =
  | "copy-password"
  | "edit"
  | "favorite"
  | "archive"
  | "delete";

type FavoriteMenuItem = {
  key: FavoriteAction;
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
};

type FavoriteTypeConfig = {
  fallbackIcon: ComponentType<{ className?: string }>;
  menuItems: FavoriteMenuItem[];
};

const commonFavoriteMenuItems: FavoriteMenuItem[] = [
  { key: "edit", label: "Ubah", icon: PencilIcon },
  { key: "favorite", label: "Hapus favorit", icon: StarIcon },
  { key: "archive", label: "Arsip", icon: ArchiveIcon },
  { key: "delete", label: "Hapus", icon: Trash2Icon, destructive: true },
];

const favoriteTypeConfig = {
  web: {
    fallbackIcon: GlobeLockIcon,
    menuItems: [
      { key: "copy-password", label: "Salin password", icon: CopyIcon },
      ...commonFavoriteMenuItems,
    ],
  },
  note: {
    fallbackIcon: NoteIcon,
    menuItems: commonFavoriteMenuItems,
  },
} satisfies Record<FavoriteVaultItemType, FavoriteTypeConfig>;

const dummyFavoriteList: FavoriteVaultItem[] = [
  {
    id: "web-1",
    type: "web",
    title: "Facebook",
    iconURL: "",
    url: "https://facebook.com",
    password: "facebook-password",
    description: "this is my facebook",
  },
  {
    id: "note-1",
    type: "note",
    title: "Recovery Code",
    description: "backup recovery code",
  },
  {
    id: "web-2",
    type: "web",
    title: "Google",
    iconURL: "",
    url: "https://google.com",
    password: "google-password",
    description: "primary google account",
  },
];

const isFavoriteWebItem = (item: FavoriteVaultItem): item is FavoriteWebItem =>
  item.type === "web";

const isFavoriteNoteItem = (
  item: FavoriteVaultItem,
): item is FavoriteNoteItem => item.type === "note";

export const FavoriteList = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(dummyFavoriteList);
  const [editingWebItem, setEditingWebItem] = useState<FavoriteWebItem | null>(
    null,
  );
  const [editingNoteItem, setEditingNoteItem] =
    useState<FavoriteNoteItem | null>(null);
  const [detailItem, setDetailItem] = useState<FavoriteVaultItem | null>(null);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log(err);
    }
  };

  const updateItem = (updatedItem: FavoriteVaultItem) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id && item.type === updatedItem.type
          ? updatedItem
          : item,
      ),
    );
  };

  const actionMap = {
    "copy-password": (item: FavoriteVaultItem) => {
      if (isFavoriteWebItem(item)) handleCopy(item.password ?? "");
    },
    edit: (item: FavoriteVaultItem) => {
      if (isFavoriteWebItem(item)) {
        setEditingWebItem(item);
        return;
      }

      if (isFavoriteNoteItem(item)) setEditingNoteItem(item);
    },
    favorite: (item: FavoriteVaultItem) => {
      void item;
    },
    archive: (item: FavoriteVaultItem) => {
      void item;
    },
    delete: (item: FavoriteVaultItem) => {
      void item;
    },
  } satisfies Record<FavoriteAction, (item: FavoriteVaultItem) => void>;

  return (
    <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden">
      <EditPassword
        open={Boolean(editingWebItem)}
        item={editingWebItem}
        onOpenChange={(state) => {
          if (!state) setEditingWebItem(null);
        }}
        onSubmit={(updatedItem) => {
          updateItem({ ...updatedItem, type: "web" });
        }}
      />

      <EditNote
        open={Boolean(editingNoteItem)}
        item={editingNoteItem}
        onOpenChange={(state) => {
          if (!state) setEditingNoteItem(null);
        }}
        onSubmit={(updatedItem) => {
          updateItem({ ...updatedItem, type: "note" });
        }}
      />

      <VaultItemDetail
        open={Boolean(detailItem)}
        item={detailItem}
        onOpenChange={(state) => {
          if (!state) setDetailItem(null);
        }}
      />

      <ul className="flex min-w-0 flex-col gap-4">
        {items.map((item) => {
          const config = favoriteTypeConfig[item.type];
          const Icon = config.fallbackIcon;

          return (
            <li
              key={`${item.type}-${item.id}`}
              className="flex h-14 w-full min-w-0 items-center gap-4 rounded-md border border-forest p-4 hover:border-neon-green"
            >
              <button
                type="button"
                onClick={() => setDetailItem(item)}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 bg-transparent p-0 text-left text-inherit"
              >
                {"iconURL" in item && item.iconURL ? (
                  <img
                    src={item.iconURL}
                    alt={item.title}
                    className="size-5 shrink-0 rounded-xs object-cover"
                  />
                ) : (
                  <Icon className="size-5 shrink-0" />
                )}

                <BodyText className="min-w-0 flex-1 truncate">
                  {item.title}
                </BodyText>
              </button>

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
                  {config.menuItems.map((menuItem) => {
                    const MenuIcon = menuItem.icon;

                    return (
                      <DropdownMenuItem
                        key={menuItem.key}
                        variant={
                          menuItem.destructive ? "destructive" : "default"
                        }
                        className="cursor-pointer gap-3 px-3 py-2 text-sm"
                        onClick={() => actionMap[menuItem.key](item)}
                      >
                        <MenuIcon className="size-4" />
                        <span>{menuItem.label}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        })}
      </ul>

      {/* <AppPagination */}
      {/*   page={page} */}
      {/*   onPageChange={(p) => { */}
      {/*     setPage(p); */}
      {/*   }} */}
      {/*   totalPages={10} */}
      {/* /> */}
    </div>
  );
};
