import type { ISOStringFormat } from "date-fns";

export type BaseEntity = {
  id: number | string;
};

export type Entity<T> = T & BaseEntity;

export type User = Entity<{
  name: string;
  email: string;
  imgURL?: string | null;

  createdAt?: ISOStringFormat | string;
  updatedAt?: ISOStringFormat | string;
}>;

export type VaultItemLogin = Entity<{
  iconURL: string;
  title: string;
  url?: string;
  password?: string;
  description: string;
  createdAt?: ISOStringFormat | string;
  updatedAt?: ISOStringFormat | string;
}>;

export type VaultItemNote = Entity<{
  iconURL?: string;
  title: string;
  description: string;
  createdAt?: ISOStringFormat | string;
  updatedAt?: ISOStringFormat | string;
}>;
