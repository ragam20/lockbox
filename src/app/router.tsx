import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundaryRoute } from "./routes/error-boundary";
import { NotFoundRoute } from "./routes/not-found";
import { LandingRoute } from "./routes/landing";
import { paths } from "@/config/paths";
import { RegisterRoute } from "./routes/auth/register";
import { LoginRoute } from "./routes/auth/login";

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
