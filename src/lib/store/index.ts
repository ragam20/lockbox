import { create } from "zustand";
import type { AppStore } from "./types";
import { createAppCryptoSclice, initAppCryptoState } from "./app-crypto-store";
import { createAuthSlice, initAuthState } from "./auth-store";

export const useAppStore = create<AppStore>()((set, get, store) => ({
  ...createAppCryptoSclice(set, get, store),
  ...createAuthSlice(set, get, store),
  clearApp: () => {
    const state = get();

    set({
      auth: {
        ...initAuthState,
        setAuth: state.auth.setAuth,
        clear: state.auth.clear,
      },
      appCrypto: {
        ...initAppCryptoState,
        setCrypto: state.appCrypto.setCrypto,
        clear: state.appCrypto.clear,
      },
    });
  },
}));

export type { AppStore } from "./types";
