export const paths = {
  landing: {
    paths: "/",
    getHref: () => "/",
  },

  auth: {
    register: {
      paths: "/auth/register",
      getHref: (redirectTo: string | undefined | null) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    login: {
      paths: "/auth/login",
      getHref: (redirectTo: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo = ${encodeURIComponent(redirectTo)}` : ""}`,
    },
  },

  app: {
    root: {},
  },
};
