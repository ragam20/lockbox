import { BodyText } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppPagination } from "@/components/ui/pagination/app-pagination";
import type { VaultItem } from "@/types/entity";
import { NoteIcon } from "@phosphor-icons/react";
import {
  EllipsisIcon,
  GlobeLockIcon,
  ListFilterIcon,
  RotateCcwIcon,
  Trash2Icon,
  XIcon,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { VaultItemDetail } from "@/features/vault/components/detail-vault-item";
import {
  filterMenu,
  getSortQuery,
  type SortValue,
  type VaultApiParams,
} from "@/types/params";
import { useGetItemsQuery } from "../api/get-items";
import { VaultFilter } from "@/components/ui/popover/vault-filter";
import { Input } from "@/components/ui/input";
import { useUnArchive } from "../api/unarchive";
import { useVaultDelete } from "../api/delete-item";
import { queryClient } from "@/lib/react-query";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/chip/empty-state";
import { SkeletonLoading } from "@/components/effects/skeleton-loading";

type ArchiveAction = "restore" | "delete";

type ArchiveMenuItem = {
  key: ArchiveAction;
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
};

const archiveMenuItems: ArchiveMenuItem[] = [
  { key: "restore", label: "Pulihkan", icon: RotateCcwIcon },
  { key: "delete", label: "Hapus", icon: Trash2Icon, destructive: true },
];

const archiveTypeConfig: Record<
  string,
  {
    fallbackIcon: LucideIcon;
  }
> = {
  password: {
    fallbackIcon: GlobeLockIcon,
  },
  note: {
    fallbackIcon: NoteIcon,
  },
};

const LIMIT_PAGE = 10;
const DEFAULT_SORT_VALUE: SortValue = filterMenu[0].value;
const DEFAULT_SORT_BY = "created_at,desc";

export const ArchiveList = () => {
  const [page, setPage] = useState(1);
  const [detailItem, setDetailItem] = useState<VaultItem | null>(null);
  const [search, setSearch] = useState<string>("");
  const [sortValue, setSortValue] = useState<SortValue>(DEFAULT_SORT_VALUE);

  const [params, setParams] = useState<VaultApiParams>({
    page: 1,
    limit: LIMIT_PAGE,
    sortBy: DEFAULT_SORT_BY,
    type: "all",
    archive: true,
  });

  const items = useGetItemsQuery(params);

  const useVaultDeleteMutation = useVaultDelete();
  const useUnArchiveMutation = useUnArchive();

  const actionMap = {
    restore: (item: VaultItem) => {
      useUnArchiveMutation.mutateAsync(item.id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["vault", "items"] });
          toast.success(`${item.title} | Dipulihkan`);
        },
      });
    },
    delete: (item: VaultItem) => {
      useVaultDeleteMutation.mutateAsync(item.id, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["vault", "items"] });
          toast.success(`${item.title} | Berhasil dihapus`);
        },
      });
    },
  } as const;
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
              placeholder="cari arsip ..."
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
        <VaultItemDetail
          open={Boolean(detailItem)}
          item={detailItem}
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
          <ul className="flex min-w-0 flex-col gap-4">
            {items.data?.data?.map((item) => {
              const config = archiveTypeConfig[item.itemType];
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

                    <DropdownMenuContent
                      align="end"
                      className="w-44 rounded-md"
                    >
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
        )}

        <AppPagination
          page={page}
          onPageChange={(p) => {
            setPage(p);
          }}
          totalPages={items.data?.meta.totalPages || 0}
        />
      </div>
    </div>
  );
};
