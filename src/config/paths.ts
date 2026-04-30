export const paths = {
  landing: {
    path: "/landing",
    getHref: () => "/landing",
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
    root: {
      path: "/app",
      getHref: () => "/app",
    },
    vault: {
      path: "",
      getHref: () => paths.app.root.path,
    },
    tool: {
      path: "tool",
      getHref: () => `${paths.app.root.getHref()}/${paths.app.tool.path}`,
    },
    account: {
      path: "account",
      getHref: () => `${paths.app.root.getHref()}/${paths.app.account.path}`,
    },
  },
};
