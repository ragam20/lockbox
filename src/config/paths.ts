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

  pricing: {
    path: "/pricing",
    getHref: () => paths.pricing.path,
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
    accountSetting: {
      path: "account-setting",
      getHref: () =>
        `${paths.app.root.getHref()}/${paths.app.accountSetting.path}`,
    },
    tool: {
      path: "tool",
      getHref: () => `${paths.app.root.getHref()}/${paths.app.tool.path}`,
    },
    archive: {
      path: "archive",
      getHref: () => `${paths.app.root.getHref()}/${paths.app.archive.path}`,
    },
  },
};
