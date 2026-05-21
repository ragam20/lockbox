import { hashArgon2id } from "./argon-config";

type DeriveRegistrationKey = {
  masterKeySalt: string;

  authVerifier: string;
  authVerifierSalt: string;

  vaultKeySalt: string;
};
export async function deriveRegistrationKey(
  plainPassword: string,
): Promise<DeriveRegistrationKey> {
  const masterKeySalt = crypto.getRandomValues(new Uint8Array(16));
  const masterKey = await hashArgon2id(plainPassword, masterKeySalt);

  const baseKey = await createHKDFBaseKey(masterKey.hash);

  // auth key
  const authKeySalt = crypto.getRandomValues(new Uint8Array(16));
  const authKey = await deriveAuthKey(baseKey, authKeySalt.buffer);
  const authVerifier = await generateAuthVerifier(authKey);

  const vaultKeySalt = crypto.getRandomValues(new Uint8Array(16));

  return {
    masterKeySalt: uint8ToBase64(masterKeySalt),

    authVerifier: authVerifier,
    authVerifierSalt: uint8ToBase64(authKeySalt),

    vaultKeySalt: uint8ToBase64(vaultKeySalt),
  };
}

// vault key
export async function deriveVaultKey(
  baseKey: CryptoKey,
  salt: ArrayBuffer,
): Promise<CryptoKey> {
  return window.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      salt,
      info: new TextEncoder().encode("vault-key"),
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["wrapKey", "unwrapKey"],
  );
}

// auth key
export async function deriveAuthKey(baseKey: CryptoKey, salt: ArrayBuffer) {
  return window.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      salt,
      info: new TextEncoder().encode("auth-key"),
      hash: "SHA-256",
    },
    baseKey,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    false,
    ["sign", "verify"],
  );
}

// authVerifier
export async function generateAuthVerifier(
  authKey: CryptoKey,
): Promise<string> {
  const data = new TextEncoder().encode("auth");
  const signature = await crypto.subtle.sign(
    {
      name: "HMAC",
    },
    authKey,
    data,
  );

  return arrayBufferToBase64(signature);
}

// HKDF
export function createHKDFBaseKey(masterKey: BufferSource) {
  return crypto.subtle.importKey(
    "raw",
    toArrayBuffer(masterKey),
    { name: "HKDF" },
    false,
    ["deriveKey", "deriveBits"],
  );
}

export async function wrapDataEncryptionKey(dek: CryptoKey, kek: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const wrappedKey = await crypto.subtle.wrapKey(
    /**
        Kenapa raw?
        - artinya DEK di export sebagai raw AES bytes
        - lalu di encrypt oleh KEK (key encryption key)
    */
    "raw",
    dek,
    kek,
    {
      name: "AES-GCM",
      iv,
    },
  );

  return {
    iv,
    wrappedKey,
  };
}

export async function unwrapDataEncryptionKey(
  kek: CryptoKey,
  iv: ArrayBuffer,
  wrappedKey: ArrayBuffer,
) {
  return crypto.subtle.unwrapKey(
    "raw",
    wrappedKey,
    kek,
    {
      name: "AES-GCM",
      iv,
    },
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["wrapKey", "unwrapKey"],
  );
}

// AES256-GCM only for data
export async function decryptData(
  dek: CryptoKey,
  iv: ArrayBuffer,
  ciphertext: ArrayBuffer,
) {
  return await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    dek,
    ciphertext,
  );
}

type EncryptedDataResult = {
  iv: ArrayBuffer;
  ciphertext: ArrayBuffer;
};
// encrypt data with DEK
export async function encryptData(
  dek: CryptoKey,
  data: string,
): Promise<EncryptedDataResult> {
  const iv = randomArrayBuffer(16);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    dek,
    new TextEncoder().encode(data),
  );

  return {
    iv,
    ciphertext,
  };
}

export async function randomDataEncryptionKey() {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  );
}

type BufferSource = ArrayBuffer | Uint8Array;

function toArrayBuffer(data: BufferSource): ArrayBuffer {
  if (data instanceof ArrayBuffer) return data;
  return new Uint8Array(data).buffer;
}

export function randomArrayBuffer(length: number) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array.buffer;
}

export function stringToArrayBuffer(str: string): ArrayBuffer {
  return new TextEncoder().encode(str).buffer;
}

// ubah object -> string -> byte
export function encodeJSON(data: unknown): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(data));
}

export function uint8ToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}
