import argon2 from "argon2-browser/dist/argon2-bundled.min.js";

const DEFAULT_ARGON_HASH_LEN = 32;
const DEFAULT_ARGON_TIME = 3;
const DEFAULT_ARGON_MEMORY = 64 * 1024;
const DEFAULT_ARGON_PARALLELISM = 3;

export type ArgonOptions = {
  time?: number;
  mem?: number;
  parallelism?: number;
  hashLen?: number;
};

export async function hashArgon2id(
  password: string,
  salt: Uint8Array,
  options?: ArgonOptions,
) {
  const defaultOptions = {
    pass: password,
    salt: salt,
    //options
    hashLen: options?.hashLen ? options.hashLen : DEFAULT_ARGON_HASH_LEN,
    time: options?.time ? options.time : DEFAULT_ARGON_TIME,
    mem: options?.mem ? options.mem : DEFAULT_ARGON_MEMORY,
    parallelism: options?.parallelism
      ? options.parallelism
      : DEFAULT_ARGON_PARALLELISM,
    type: argon2.ArgonType.Argon2id,
  };

  return await argon2.hash(defaultOptions);
}

export async function verifyArgon2id(password: string, encoded: string) {
  try {
    return await argon2.verify({
      pass: password,
      encoded: encoded,
      type: argon2.ArgonType.Argon2id,
    });
  } catch {
    return false;
  }
}
