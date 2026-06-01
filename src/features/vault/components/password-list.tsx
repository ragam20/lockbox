import { useState, type ComponentType, type FormEvent } from "react";
import type { VaultItem } from "@/types/entity";
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
  ListFilterIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { XIcon } from "@phosphor-icons/react";
import { AppPagination } from "@/components/ui/pagination/app-pagination";
import { EditPassword } from "./edit-password";
import { DetailPassword } from "./detail-password";
import { useVaultDelete } from "../api/delete-item";
import { filterMenu, getSortQuery, type SortValue, type VaultApiParams } from "@/types/params";
import { useGetItemsQuery } from "../api/get-items";
import { VaultFilter } from "@/components/ui/popover/vault-filter";
import { Input } from "@/components/ui/input";

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

const LIMIT_PAGE = 10;
const DEFAULT_SORT_VALUE: SortValue = filterMenu[0].value;
const DEFAULT_SORT_BY = "created_at";

export const PasswordList = () => {
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [detailItem, setDetailItem] = useState<VaultItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sortValue, setSortValue] = useState<SortValue>(DEFAULT_SORT_VALUE);

  const [params, setParams] = useState<VaultApiParams>({
    page: 1,
    limit: LIMIT_PAGE,
    sortBy: "created_at",
    type: "password",
  });

  const useVaultDeleteMutation = useVaultDelete();

  const items = useGetItemsQuery(params);

  const handleSortChange = (value: SortValue) => {
    setSortValue(value);

    const query = getSortQuery(value);

    setParams((current) => ({
      ...current,
      page: 1,
      sortBy: `${query.field},${query.order}`,
    }));
  };

  const handleResetFilter = () => {
    setSearch("");
    setSortValue(DEFAULT_SORT_VALUE);

    setParams((current) => {
      const nextParams = {
        ...current,
        page: 1,
        sortBy: DEFAULT_SORT_BY,
      };

      delete nextParams.search;

      return nextParams;
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setParams((v) => {
      return {
        ...v,
        search: search,
      };
    });
  };

  const actionMap = {
    copy: (v: VaultItem) => {
      handleCopy(v.title);
    },
    edit: (v: VaultItem) => {
      setEditingItem(v);
    },
    favorite: (v: VaultItem) => {
      void v;
    },
    archive: (v: VaultItem) => {
      void v;
    },
    delete: (v: VaultItem) => {
      useVaultDeleteMutation.mutateAsync(v.id);
    },
  } as const;

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <VaultFilter value={sortValue} onValueChange={handleSortChange}>
            <ListFilterIcon className="size-5 shrink-0 cursor-pointer" />
          </VaultFilter>
          <form onSubmit={handleSearch} className="flex min-w-0 flex-1 gap-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="cari login ..."
              className="py-4.5 rounded-md"
            />
            <Button type="submit" className="py-4 px-6 rounded-md cursor-pointer">
              Cari
            </Button>
          </form>
        </div>

        {search.trim().length > 0 && (
          <button
            type="button"
            onClick={handleResetFilter}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-forest px-3 py-1.5 text-sm text-white transition-colors hover:border-neon-green"
          >
            hapus filter
            <XIcon className="size-4 shrink-0" />
          </button>
        )}
      </div>

      <div className="mt-15 flex min-w-0 flex-col gap-6 overflow-x-hidden">
        <EditPassword
          open={Boolean(editingItem)}
          vaultItem={editingItem}
          onOpenChange={(state) => {
            if (!state) setEditingItem(null);
          }}
        />

        <DetailPassword
          open={Boolean(detailItem)}
          vaultItem={detailItem}
          onOpenChange={(state) => {
            if (!state) setDetailItem(null);
          }}
        />

        <ul key={"password-list"} className="flex min-w-0 flex-col gap-4">
          {items.data?.map((item) => (
            <li
              onClick={() => setDetailItem(item)}
              key={item.id}
              className="cursor-pointer flex h-14 w-full min-w-0 items-center gap-4 rounded-md border border-forest p-4 hover:border-neon-green"
            >
              <div className="flex h-fit min-w-0 flex-1 items-center gap-4">
                {item.iconURL ? (
                  <img
                    src={item.iconURL}
                    alt={item.title}
                    className="size-5 shrink-0 rounded-xs object-cover"
                  />
                ) : (
                  <GlobeLockIcon className="size-5 shrink-0" />
                )}

                <BodyText className="min-w-0 flex-1 truncate">
                  {item.title}
                </BodyText>
              </div>

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
                        variant={
                          menuItem.destructive ? "destructive" : "default"
                        }
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
          page={params.page}
          onPageChange={(p) => {
            setParams((v) => {
              return {
                ...v,
                page: p,
              };
            });
          }}
          totalPages={LIMIT_PAGE}
        />
      </div>
    </>
  );
};
