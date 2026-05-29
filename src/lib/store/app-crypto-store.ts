import type { StateCreator } from "zustand";
import type { AppCryptoSlice, AppCryptoState, AppStore } from "./types";

export const initAppCryptoState: AppCryptoState = {
  masterKey: null,
};

export const createAppCryptoSclice: StateCreator<
  AppStore,
  [],
  [],
  AppCryptoSlice
> = (set) => ({
  appCrypto: {
    ...initAppCryptoState,
    setCrypto: (data) =>
      set((state) => ({
        appCrypto: {
          ...state.appCrypto,
          ...data,
        },
      })),
    clear: () =>
      set((state) => ({
        appCrypto: {
          ...initAppCryptoState,

          setCrypto: state.appCrypto.setCrypto,
          clear: state.appCrypto.clear,
        },
      })),
  },
});
