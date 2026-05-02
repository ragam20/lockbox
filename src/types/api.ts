import type { ISOStringFormat } from "date-fns";

export type BaseEntity = {
  id: number | string;
};

export type Entity<T> = T & BaseEntity;

export type User = Entity<{
  name: string;
  email: string;
  imgURL?: string | null;

  createdAt?: ISOStringFormat;
  updatedAt?: ISOStringFormat;
}>;

export type VaultItemWeb = Entity<{
  iconURL: string;
  title: string;
  description: string;
  createdAt?: ISOStringFormat;
  updatedAt?: ISOStringFormat;
}>;
