import type { VaultItem } from "@/types/entity";
import {
  filterMenu,
  getSortQuery,
  type SortValue,
  type VaultApiParams,
} from "@/types/params";
import {
  ArchiveIcon,
  EllipsisIcon,
  ListFilterIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { BsKey } from "react-icons/bs";
import { useState, type ComponentType, type FormEvent } from "react";
import { useVaultDelete } from "../api/delete-item";
import { useArchive } from "../api/archive";
import { useSetFavorite } from "../api/set-favorite";
import { useGetItemsQuery } from "../api/get-items";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { VaultFilter } from "@/components/ui/popover/vault-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/chip/empty-state";
import { SkeletonLoading } from "@/components/effects/skeleton-loading";
import { AppPagination } from "@/components/ui/pagination/app-pagination";
import { BodyText } from "@/components/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditApiKey } from "./edit-api-key";
import { DetailApiKey } from "./detail-api-key";

type Menuitem = {
  key: "edit" | "favorite" | "archive" | "delete";
  label: string;
  icon: ComponentType<{ className?: string }>;
  destructive?: boolean;
};

const menuItems: Menuitem[] = [
  { key: "edit", label: "Ubah", icon: PencilIcon },
  { key: "favorite", label: "Favorit", icon: StarIcon },
  { key: "archive", label: "Arsip", icon: ArchiveIcon },
  { key: "delete", label: "Hapus", icon: Trash2Icon, destructive: true },
];

const LIMIT_PAGE = 10;
const DEFAULT_SORT_VALUE: SortValue = filterMenu[0].value;
const DEFAULT_SORT_BY = "created_at,desc";

export const ApiKeyList = () => {
  const [editingItem, setEditingItem] = useState<VaultItem | null>(null);
  const [detailItem, setDetailItem] = useState<VaultItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sortValue, setSortValue] = useState<SortValue>(DEFAULT_SORT_VALUE);

  const [params, setParams] = useState<VaultApiParams>({
    page: 1,
    limit: LIMIT_PAGE,
    sortBy: DEFAULT_SORT_BY,
    type: "apiKey",
  });

  const useVaultDeleteMutation = useVaultDelete();
  const useArchiveMutation = useArchive();
  const useSetFavoriteMutation = useSetFavorite();

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

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setParams((v) => {
      return {
        ...v,
        search: search,
      };
    });
  };

  const isLoadingList = items.isPending || items.isFetching;

  const actionMap = {
    edit: (v: VaultItem) => {
      setEditingItem(v);
    },
    favorite: (v: VaultItem) => {
      useSetFavoriteMutation.mutateAsync(v.id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["vault", "items"] });
          toast.success(`${v.title} | Berhasil ditambahkan ke favorite`);
        },
      });
    },
    archive: (v: VaultItem) => {
      useArchiveMutation.mutateAsync(v.id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["vault", "items"] });
          toast.success(`${v.title} | Arsipkan`);
        },
      });
    },
    delete: (v: VaultItem) => {
      useVaultDeleteMutation.mutateAsync(v.id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["vault", "items"] });
          toast.success(`${v.title} | Berhasil dihapus`);
        },
      });
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
              placeholder="cari key..."
              className="py-4.5 rounded-md"
            />
            <Button
              type="submit"
              className="py-4 px-6 rounded-md cursor-pointer"
            >
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
        <EditApiKey
          open={Boolean(editingItem)}
          vaultItem={editingItem}
          onOpenChange={(state) => {
            if (!state) setEditingItem(null);
          }}
        />

        <DetailApiKey
          open={Boolean(detailItem)}
          vaultItem={detailItem}
          onOpenChange={(state) => {
            if (!state) setDetailItem(null);
          }}
        />

        {items.isError ? (
          <EmptyState />
        ) : isLoadingList ? (
          <SkeletonLoading />
        ) : items.data?.data.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ul className="flex min-w-0 flex-col gap-4">
              {items.data?.data?.map((item) => (
                <li
                  key={item.id}
                  className="flex h-14 w-full min-w-0 items-center gap-4 rounded-md border border-forest p-4 hover:border-neon-green"
                >
                  <div
                    onClick={() => setDetailItem(item)}
                    className="cursor-pointer flex h-fit min-w-0 flex-1 items-center gap-4"
                  >
                    {item.iconURL ? (
                      <img
                        src={item.iconURL}
                        alt={item.title}
                        className="size-5 shrink-0 rounded-xs object-cover"
                      />
                    ) : (
                      <BsKey className="size-5 shrink-0" />
                    )}

                    <BodyText className="min-w-0 flex-1 truncate text-sm">
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

                    <DropdownMenuContent
                      align="end"
                      className="w-44 rounded-md"
                    >
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
          </>
        )}

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
          totalPages={items.data?.meta?.totalPages || 0}
        />
      </div>
    </>
  );
};
