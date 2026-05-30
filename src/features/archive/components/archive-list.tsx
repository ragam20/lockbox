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
  EllipsisIcon,
  GlobeLockIcon,
  RotateCcwIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import {
  VaultItemDetail,
  type VaultDetailItemByType,
} from "@/features/vault/components/detail-vault-item";

type ArchiveWebItem = VaultDetailItemByType["web"];
type ArchiveNoteItem = VaultDetailItemByType["note"];
type ArchiveVaultItem = ArchiveWebItem | ArchiveNoteItem;
type ArchiveVaultItemType = ArchiveVaultItem["type"];

type ArchiveAction = "restore" | "delete";

type ArchiveMenuItem = {
  key: ArchiveAction;
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
};

type ArchiveTypeConfig = {
  fallbackIcon: ComponentType<{ className?: string }>;
};

const archiveMenuItems: ArchiveMenuItem[] = [
  { key: "restore", label: "Pulihkan", icon: RotateCcwIcon },
  { key: "delete", label: "Hapus", icon: Trash2Icon, destructive: true },
];

const archiveTypeConfig = {
  web: {
    fallbackIcon: GlobeLockIcon,
  },
  note: {
    fallbackIcon: NoteIcon,
  },
} satisfies Record<ArchiveVaultItemType, ArchiveTypeConfig>;

const dummyArchiveList: ArchiveVaultItem[] = [
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

export const ArchiveList = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(dummyArchiveList);
  const [detailItem, setDetailItem] = useState<ArchiveVaultItem | null>(null);

  const removeItem = (selectedItem: ArchiveVaultItem) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.id !== selectedItem.id || item.type !== selectedItem.type,
      ),
    );
  };

  const actionMap = {
    restore: (item: ArchiveVaultItem) => {
      removeItem(item);
    },
    delete: (item: ArchiveVaultItem) => {
      removeItem(item);
    },
  } satisfies Record<ArchiveAction, (item: ArchiveVaultItem) => void>;

  return (
    <div className="flex min-w-0 flex-col gap-6 overflow-x-hidden">
      <VaultItemDetail
        open={Boolean(detailItem)}
        item={detailItem}
        onOpenChange={(state) => {
          if (!state) setDetailItem(null);
        }}
      />

      <ul className="flex min-w-0 flex-col gap-4">
        {items.map((item) => {
          const config = archiveTypeConfig[item.type];
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
                <DropdownMenuTrigger>
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
                  {archiveMenuItems.map((menuItem) => {
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
