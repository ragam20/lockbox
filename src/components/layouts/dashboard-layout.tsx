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
  UserIcon,
  ToolboxIcon,
} from "lucide-react";
import { useSidebar } from "../ui/sidebar-context";
import { Heading3 } from "../typography";
import { NavLink } from "react-router";

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
    href: paths.app.vault.getHref(),
    end: true,
  },
  {
    title: "Peralatan",
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
    <SidebarProvider className="relative">
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <SidebarTrigger className="absolute top-5 cursor-pointer" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export const AppSidebar = () => {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="group">
      <SidebarHeader className="p-4">
        <Heading3 className="group-data-[collapsible=icon]:hidden">
          <span className="text-neon-green">Lock</span>Box
        </Heading3>
      </SidebarHeader>
      <SidebarContent className="bg-void">
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
                      className={`
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
          <NavLink to={paths.app.account.getHref()}>
            {({ isActive }) => (
              <SidebarMenuButton
                tooltip={"akun"}
                className={`flex gap-3 cursor-pointer ${isActive ? "bg-dark-forest" : "bg-transparent"}`}
              >
                <UserIcon />
                Akun
              </SidebarMenuButton>
            )}
          </NavLink>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};
