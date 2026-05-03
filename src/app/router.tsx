import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundaryRoute } from "./routes/error-boundary";
import { NotFoundRoute } from "./routes/not-found";
import { LandingRoute } from "./routes/landing";
import { paths } from "@/config/paths";
import { RegisterRoute } from "./routes/auth/register";
import { LoginRoute } from "./routes/auth/login";
import { VaultRoute } from "./routes/app/vaults/vault";
import { AccountRoute } from "./routes/app/archive";
import { ToolRoute } from "./routes/app/tool";
import { AppRoot } from "./root";

const createAppRouter = createBrowserRouter([
  {
    path: paths.landing.path,
    Component: LandingRoute,
    ErrorBoundary: ErrorBoundaryRoute,
  },
  {
    path: paths.auth.register.path,
    Component: RegisterRoute,
    ErrorBoundary: ErrorBoundaryRoute,
  },
  {
    path: paths.auth.login.path,
    Component: LoginRoute,
    ErrorBoundary: ErrorBoundaryRoute,
  },

  {
    path: paths.app.root.path,
    element: <AppRoot />,
    ErrorBoundary: ErrorBoundaryRoute,

    children: [
      {
        index: true,
        path: paths.app.vault.path,
        Component: VaultRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
      {
        path: paths.app.account.path,
        Component: AccountRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
      {
        path: paths.app.tool.path,
        Component: ToolRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
    ],
  },

  {
    path: "*",
    Component: NotFoundRoute,
    ErrorBoundary: ErrorBoundaryRoute,
  },
]);

export const AppRouter = () => {
  return (
    <>
      <RouterProvider router={createAppRouter} />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
};
