import type { ISOStringFormat } from "date-fns";

export type BaseEntity = {
  id: number | string;
};

export type Entity<T> = T & BaseEntity;

export type User = Entity<{
  name: string;
  email: string;
  imgURL?: string | null;
  masterKeySalt: string;
  authVerifierSalt: string;

  createdAt?: ISOStringFormat | string;
  updatedAt?: ISOStringFormat | string;
}>;

export type Vault = Entity<{
  timeout: number;
  timeoutType: string;
  vaultKeySalt: string;

  createdAt?: ISOStringFormat | string;
  updatedAt?: ISOStringFormat | string;
}>;

export type ArgonConfig = Entity<{
  iteration: number;
  memory: number;
  parallelism: number;

  createdAt?: ISOStringFormat | string;
  updatedAt?: ISOStringFormat | string;
}>;

export type VaultItemPassword = Entity<{
  iconURL?: string;
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

export type VaultItem = {
  id: string;
  iconURL?: string;
  title: string;
  itemType: string;
  ivCiphertext: string;
  ciphertext: string;
  ivProtectionKey: string;
  protectionKey: string;

  createdAt?: ISOStringFormat | string;
  updatedAt?: ISOStringFormat | string;
};

export const VAULT_ITEM_TYPE = ["note", "password"] as const;
