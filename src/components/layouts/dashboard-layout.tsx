import { paths } from "@/config/paths";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import type React from "react";
import {
  type LucideProps,
  BookKeyIcon,
  ToolboxIcon,
  ChevronDownIcon,
  ArchiveIcon,
} from "lucide-react";
import { useSidebar } from "../ui/sidebar-context";
import { BodyText, Heading3 } from "../typography";
import { NavLink, useNavigate } from "react-router";
import { UserAvatar } from "../ui/avatar/user-avatar";
import { AvatarDropdown } from "../ui/popover/avatar-dropdown";
import { useGetUserQuery, useLogout } from "@/lib/auth";
import { useAppStore } from "@/lib/store";

type DashboardMenu = {
  title: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  href: string;
  end: boolean;
};

const dashboardMenus: DashboardMenu[] = [
  {
    title: "Brankas",
    icon: BookKeyIcon,
    href: paths.app.vault.path,
    end: true,
  },
  {
    title: "Alat",
    icon: ToolboxIcon,
    href: paths.app.tool.getHref(),
    end: false,
  },
];

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider className="relative max-w-full overflow-x-clip">
      <AppSidebar />
      <SidebarInset className="min-w-0 max-w-full overflow-x-clip">
        <SidebarTrigger className="absolute top-5 cursor-pointer" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export const AppSidebar = () => {
  const { isMobile, setOpenMobile } = useSidebar();
  const navigate = useNavigate();

  const userQuery = useGetUserQuery();
  const appStore = useAppStore();
  const { logout } = useLogout();

  return (
    <Sidebar collapsible="icon" className="group">
      <SidebarHeader className="p-4">
        <Heading3 className="group-data-[collapsible=icon]:hidden">
          <span className="text-neon-green">Lock</span>Box
        </Heading3>
      </SidebarHeader>
      <SidebarContent className="bg-void">
        <AvatarDropdown
          lock={() => {
            appStore.appCrypto.clear();
          }}
          accountSetting={() => {
            navigate(paths.app.accountSetting.path);
          }}
          logout={() => {
            logout();
            navigate(paths.landing.path, { replace: true });
          }}
        >
          <div className="flex gap-2 p-2 mb-4 cursor-pointer items-center w-full hover:bg-forest">
            <UserAvatar user={userQuery.data} />

            <BodyText className="flex-1 text-start truncate group-data-[state=collapsed] text-sm">
              {userQuery.data?.name}
            </BodyText>

            <ChevronDownIcon className="size-4" />
          </div>
        </AvatarDropdown>

        <SidebarMenu>
          {dashboardMenus.map((item) => {
            return (
              <SidebarMenuItem key={item.title} className="cursor-pointer">
                <NavLink
                  to={item.href}
                  end={item.end}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  {({ isActive }) => (
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`text-sm
                          ${isActive ? "bg-forest font-bold" : "bg-transparent"}  
                        `}
                    >
                      <div className="flex gap-3 items-center w-full">
                        <item.icon className="size-4" />
                        <p>{item.title}</p>
                      </div>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenuItem>
          <NavLink to={paths.app.archive.getHref()}>
            {({ isActive }) => (
              <SidebarMenuButton
                tooltip={"arsip"}
                className={`text-sm flex gap-3 cursor-pointer ${isActive ? "bg-dark-forest" : "bg-transparent"}`}
              >
                <ArchiveIcon />
                Arsip
              </SidebarMenuButton>
            )}
          </NavLink>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};
