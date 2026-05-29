import type { StateCreator } from "zustand";
import type { AppStore, AuthState, AuthStoreSlice } from "./types";

export const initAuthState: AuthState = {
  email: "",
  isAuthenticated: false,
};

export const createAuthSlice: StateCreator<AppStore, [], [], AuthStoreSlice> = (
  set,
) => ({
  auth: {
    ...initAuthState,
    setAuth: (data) =>
      set((state) => ({
        auth: {
          ...state.auth,
          ...data,
        },
      })),
    clear: () => {
      set((state) => ({
        auth: {
          ...initAuthState,
          setAuth: state.auth.setAuth,
          clear: state.auth.clear,
        },
      }));
    },
  },
});
