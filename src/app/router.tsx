import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundaryRoute } from "./routes/error-boundary";
import { NotFoundRoute } from "./routes/not-found";
import { LandingRoute } from "./routes/landing";

const createAppRouter = createBrowserRouter([
  {
    path: "/landing",
    Component: LandingRoute,
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
