export type VaultType = "note" | "password" | "all";

export type VaultApiParams = {
  page: number;
  limit: number;
  sortBy: string;
  type?: VaultType;
  archive?: boolean;
  search?: string;
};

export const sortMap = {
  newest: { field: "created_at", order: "desc" },
  oldest: { field: "created_at", order: "asc" },
  "a-z": { field: "title", order: "desc" },
  "z-a": { field: "title", order: "asc" },
} as const;

export type SortValue = keyof typeof sortMap;

export type filter = {
  title: string;
  value: SortValue;
};

export const filterMenu: filter[] = [
  { title: "Terbaru", value: "newest" },
  { title: "Terlama", value: "oldest" },
  { title: "A-Z", value: "a-z" },
  { title: "Z-A", value: "z-a" },
];

export const getSortQuery = (sort: SortValue) => {
  return sortMap[sort];
};
