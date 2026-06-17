declare module "argon2-browser/dist/argon2-bundled.min.js" {
  export type ArgonType = 0 | 1 | 2;

  export type ArgonTypeMap = {
    readonly Argon2d: 0;
    readonly Argon2i: 1;
    readonly Argon2id: 2;
  };

  export type ArgonHashOptions = {
    pass: string | Uint8Array;
    salt: string | Uint8Array;
    time?: number;
    mem?: number;
    hashLen?: number;
    parallelism?: number;
    secret?: Uint8Array;
    ad?: Uint8Array;
    type?: ArgonType;
  };

  export type ArgonVerifyOptions = {
    pass: string | Uint8Array;
    encoded: string;
    secret?: Uint8Array;
    ad?: Uint8Array;
    type?: ArgonType;
  };

  export type ArgonHashResult = {
    hash: Uint8Array;
    hashHex: string;
    encoded: string;
  };

  export type ArgonVerifyResult = {
    message?: string;
    code?: number;
  };

  export type Argon2Browser = {
    readonly ArgonType: ArgonTypeMap;
    hash(options: ArgonHashOptions): Promise<ArgonHashResult>;
    verify(options: ArgonVerifyOptions): Promise<ArgonVerifyResult>;
    unloadRuntime(): void;
  };

  const argon2: Argon2Browser;

  export default argon2;
}
