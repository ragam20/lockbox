import type React from "react";
import { useAppStore } from "./store";
import { Navigate } from "react-router";
import { paths } from "@/config/paths";
import { useGetUserQuery } from "./auth";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/effects/loading-screen";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const appStore = useAppStore();
  const userQuery = useGetUserQuery();

  useEffect(() => {
    if (userQuery.isSuccess) {
      appStore.auth.setAuth({
        email: userQuery.data.email,
        isAuthenticated: true,
      });
    }
  }, [appStore.auth, userQuery.data, userQuery.isSuccess]);

  if (userQuery.isPending) {
    return <LoadingScreen />;
  }

  if (userQuery.isSuccess) {
    return <Navigate to={paths.unlock.path} replace />;
  }

  return children;
};

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const appStore = useAppStore();
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get("redirectTo") || window.location.pathname;

  // const [showLoading, setShowLoading] = useState(true);
  //
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowLoading(false);
  //   }, 1500);
  //
  //   return () => clearTimeout(timer);
  // }, []);
  //
  // if (showLoading) {
  //   return <LoadingScreen />;
  // }

  if (appStore.appCrypto.masterKey === null) {
    return <Navigate to={paths.unlock.getHref(redirectTo)} replace />;
  }

  return children;
};
