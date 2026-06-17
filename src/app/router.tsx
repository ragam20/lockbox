import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundaryRoute } from "./routes/error-boundary";
import { NotFoundRoute } from "./routes/not-found";
import { LandingRoute } from "./routes/landing";
import { paths } from "@/config/paths";
import { RegisterRoute } from "./routes/auth/register";
import { UnlockRoute } from "./routes/auth/unlock";
import { VaultRoute } from "./routes/app/vaults/vault";
import { ToolRoute } from "./routes/app/tools/tool";
import { AppRoot, AuthRoot } from "./root";
import { AccountSettingRoute } from "./routes/app/user/account-setting";
import { ArchiveRoute } from "./routes/app/archive/archive-route";
import { PricingRoute } from "./routes/app/pricing/page";
import { CompleteRegisterRoute } from "./routes/auth/complete-register";
import { VerifyEmailRoute } from "./routes/auth/verify-email";
import { OtpRoute } from "./routes/auth/otp";
import { AuthLayout, ProtectedLayout } from "@/lib/guard-layout";

const createAppRouter = createBrowserRouter([
  {
    path: paths.landing.path,
    Component: LandingRoute,
    ErrorBoundary: ErrorBoundaryRoute,
  },
  {
    path: paths.auth.root.path,
    element: (
      <AuthLayout>
        <AuthRoot />
      </AuthLayout>
    ),
    ErrorBoundary: ErrorBoundaryRoute,

    children: [
      {
        path: paths.auth.register.path,
        Component: RegisterRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
      {
        path: paths.auth.register.complete.path,
        Component: CompleteRegisterRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
      {
        path: paths.auth.verifyEmail.path,
        Component: VerifyEmailRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
      {
        path: paths.auth.otp.path,
        Component: OtpRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
    ],
  },

  {
    path: paths.unlock.path,
    Component: UnlockRoute,
    ErrorBoundary: ErrorBoundaryRoute,
  },

  {
    path: paths.pricing.path,
    Component: PricingRoute,
    ErrorBoundary: ErrorBoundaryRoute,
  },

  {
    path: paths.app.root.path,
    element: (
      <ProtectedLayout>
        <AppRoot />
      </ProtectedLayout>
    ),
    ErrorBoundary: ErrorBoundaryRoute,

    children: [
      {
        index: true,
        path: paths.app.vault.path,
        Component: VaultRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
      {
        path: paths.app.accountSetting.path,
        Component: AccountSettingRoute,
        ErrorBoundary: ErrorBoundaryRoute,
      },
      {
        path: paths.app.archive.path,
        Component: ArchiveRoute,
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
