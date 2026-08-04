import { BodyText } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppPagination } from "@/components/ui/pagination/app-pagination";
import { VaultFilter } from "@/components/ui/popover/vault-filter";
import { Input } from "@/components/ui/input";
import { NoteIcon, XIcon } from "@phosphor-icons/react";
import {
  ArchiveIcon,
  EllipsisIcon,
  GlobeLockIcon,
  ListFilterIcon,
  PencilIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import { useState, type ComponentType, type FormEvent } from "react";
import { EditPassword } from "./edit-password";
import { EditNote } from "./edit-note";
import { EditApiKey } from "./edit-api-key";
import { DetailApiKey } from "./detail-api-key";
import { VaultItemDetail } from "./detail-vault-item";
import type { VaultItem } from "@/types/entity";
import type { PaginationResponse } from "@/types/response";
import {
  filterMenu,
  getSortQuery,
  type SortValue,
  type VaultApiParams,
} from "@/types/params";
import { useVaultDelete } from "../api/delete-item";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { useArchive } from "../api/archive";
import { useDeleteFavorite } from "../api/delete-favorite";
import { useGetFavorites } from "../api/get-favorites";
import { EmptyState } from "@/components/ui/chip/empty-state";
import { SkeletonLoading } from "@/components/effects/skeleton-loading";
import { BsKey } from "react-icons/bs";

type FavoriteAction = "edit" | "favorite" | "archive" | "delete";

type FavoriteMenuItem = {
  key: FavoriteAction;
  label: string;
  icon: ComponentType<{ className?: string }>;
  destructive?: boolean;
};

const commonFavoriteMenuItems: FavoriteMenuItem[] = [
  { key: "edit", label: "Ubah", icon: PencilIcon },
  { key: "favorite", label: "Hapus favorit", icon: StarIcon },
  { key: "archive", label: "Arsip", icon: ArchiveIcon },
  { key: "delete", label: "Hapus", icon: Trash2Icon, destructive: true },
];

const favoriteTypeConfig: Record<
  string,
  {
    fallbackIcon: ComponentType<{ className?: string }>;
  }
> = {
  password: {
    fallbackIcon: GlobeLockIcon,
  },
  note: {
    fallbackIcon: NoteIcon,
  },
  apiKey: {
    fallbackIcon: BsKey,
  },
};

const LIMIT_PAGE = 10;
const DEFAULT_SORT_VALUE: SortValue = filterMenu[0].value;
const DEFAULT_SORT_BY = "created_at,desc";

export const FavoriteList = () => {
  const [search, setSearch] = useState<string>("");
  const [sortValue, setSortValue] = useState<SortValue>(DEFAULT_SORT_VALUE);
  const [editingPasswordItem, setEditingPasswordItem] =
    useState<VaultItem | null>(null);
  const [editingNoteItem, setEditingNoteItem] = useState<VaultItem | null>(
    null,
  );
  const [editingApiKeyItem, setEditingApiKeyItem] = useState<VaultItem | null>(
    null,
  );
  const [detailItem, setDetailItem] = useState<VaultItem | null>(null);

  const [params, setParams] = useState<VaultApiParams>({
    page: 1,
    limit: LIMIT_PAGE,
    sortBy: DEFAULT_SORT_BY,
    type: "all",
    favorite: true,
  });

  const items = useGetFavorites(params);

  const useVaultDeleteMutation = useVaultDelete();
  const useDeleteFavoriteMutation = useDeleteFavorite();
  const useArchiveMutation = useArchive();

  const removeFavoriteFromCache = (favoriteId: string) => {
    queryClient.setQueriesData<PaginationResponse<VaultItem[]>>(
      { queryKey: ["vault", "items", "favorites"] },
      (current) => {
        if (!current) return current;

        const data = current.data.filter(
          (favorite) => favorite.id !== favoriteId,
        );
        const totalItems = Math.max(0, current.meta.totalItems - 1);
        const totalPages =
          totalItems === 0 ? 0 : Math.ceil(totalItems / current.meta.limit);

        return {
          ...current,
          data,
          meta: {
            ...current.meta,
            totalItems,
            totalPages,
          },
        };
      },
    );
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setParams((v) => ({
      ...v,
      page: 1,
      search,
    }));
  };

  const isLoadingList = items.isPending || items.isFetching;

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

  const actionMap = {
    edit: (item: VaultItem) => {
      switch (item.itemType) {
        case "note":
          setEditingNoteItem(item);
          break;
        case "password":
          setEditingPasswordItem(item);
          break;
        case "apiKey":
          setEditingApiKeyItem(item);
          break;
        default:
          toast.error("item tidak ada!");
      }
    },
    favorite: (item: VaultItem) => {
      useDeleteFavoriteMutation.mutateAsync(item.id, {
        onSuccess: async () => {
          removeFavoriteFromCache(item.id);
          await queryClient.invalidateQueries({
            queryKey: ["vault", "items", "favorites"],
          });
          toast.success(`${item.title} | Berhasil dihapus dari favorite`);
        },
      });
    },
    archive: (item: VaultItem) => {
      useArchiveMutation.mutateAsync(item.id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["vault", "items", "favorites"],
          });
          toast.success(`${item.title} | Berhasil diarsipkan`);
        },
      });
    },
    delete: (item: VaultItem) => {
      useVaultDeleteMutation.mutateAsync(item.id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["vault", "items"] });
          await queryClient.invalidateQueries({
            queryKey: ["vault", "items", "favorites"],
          });
          toast.success(`${item.title} | Berhasil dihapus`);
        },
      });
    },
  } as const;

  return (
    <div className="m-8">
      <div className="flex flex-col gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <VaultFilter value={sortValue} onValueChange={handleSortChange}>
            <ListFilterIcon className="size-5 shrink-0 cursor-pointer" />
          </VaultFilter>
          <form onSubmit={handleSearch} className="flex min-w-0 flex-1 gap-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="cari favorite ..."
              className="rounded-md py-4.5"
            />
            <Button
              type="submit"
              className="cursor-pointer rounded-md px-6 py-4"
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

      <div className="mt-5 flex min-w-0 flex-col gap-6 overflow-x-hidden">
        <EditPassword
          open={Boolean(editingPasswordItem)}
          vaultItem={editingPasswordItem}
          onOpenChange={(state) => {
            if (!state) setEditingPasswordItem(null);
          }}
        />

        <EditNote
          open={Boolean(editingNoteItem)}
          vaultItem={editingNoteItem}
          onOpenChange={(state) => {
            if (!state) setEditingNoteItem(null);
          }}
        />

        <EditApiKey
          open={Boolean(editingApiKeyItem)}
          vaultItem={editingApiKeyItem}
          onOpenChange={(state) => {
            if (!state) setEditingApiKeyItem(null);
          }}
        />

        <>
          {detailItem?.itemType === "apiKey" ? (
            <DetailApiKey
              open={Boolean(detailItem)}
              vaultItem={detailItem}
              onOpenChange={(state) => {
                if (!state) setDetailItem(null);
              }}
            />
          ) : (
            <VaultItemDetail
              open={Boolean(detailItem)}
              item={detailItem}
              onOpenChange={(state) => {
                if (!state) setDetailItem(null);
              }}
            />
          )}
        </>

        {items.isError ? (
          <EmptyState />
        ) : isLoadingList ? (
          <SkeletonLoading />
        ) : items.data?.data.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ul className="flex min-w-0 flex-col gap-4">
              {items.data?.data?.map((item) => {
                const config = favoriteTypeConfig[item.itemType];
                const Icon = config.fallbackIcon;

                return (
                  <li
                    key={`${item.itemType}-${item.id}`}
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

                      <BodyText className="min-w-0 flex-1 truncate text-sm">
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

                      <DropdownMenuContent
                        align="end"
                        className="w-44 rounded-md"
                      >
                        {commonFavoriteMenuItems.map((menuItem) => {
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
          </>
        )}

        <AppPagination
          page={params.page}
          onPageChange={(p) => {
            setParams((v) => ({
              ...v,
              page: p,
            }));
          }}
          totalPages={items.data?.meta?.totalPages || 0}
        />
      </div>
    </div>
  );
};
