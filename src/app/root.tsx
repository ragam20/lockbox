import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { Outlet } from "react-router";

export const AppRoot = () => {
  return (
    <>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </>
  );
};

export const AuthRoot = () => {
  return <Outlet />;
};
