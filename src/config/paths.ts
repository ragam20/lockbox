export const paths = {
  landing: {
    path: "/landing",
    getHref: () => "/",
  },

  auth: {
    register: {
      path: "/auth/register",
      getHref: (redirectTo: string | undefined | null) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    login: {
      path: "/auth/login",
      getHref: (redirectTo: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo = ${encodeURIComponent(redirectTo)}` : ""}`,
    },
  },

  app: {
    root: {},
  },
};
