export type AppCryptoState = {
  masterKey: Uint8Array | null;
};

export type AppCryptoSlice = {
  appCrypto: AppCryptoState & {
    setCrypto: (data: Partial<AppCryptoState>) => void;
    clear: () => void;
  };
};

export type AuthState = {
  email: string;
  isAuthenticated: boolean;
};
export type AuthStoreSlice = {
  auth: {
    email: string;
    isAuthenticated: boolean;
    setAuth: (data: Partial<AuthState>) => void;
    clear: () => void;
  };
};

export type AppStore = AppCryptoSlice &
  AuthStoreSlice & {
    clearApp: () => void;
  };
