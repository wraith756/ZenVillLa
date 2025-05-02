"use client";

import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Building,
  FileText,
  Heart,
  Home,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { hover } from "framer-motion";
import Link from "next/link";

{
  /* <Menu color="#e45a5a" strokeWidth={1.75} absoluteStrokeWidth />; */
}
const AppSidebar = ({ userType }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();
  const navLink =
    userType === "manager"
      ? [
          { icon: Building, label: "properties", href: "/managers/properties" },
          {
            icon: FileText,
            label: "Applications",
            href: "/managers/Applications",
          },
          { icon: Settings, label: "Settings", href: "/managers/Settings" },
        ]
      : [
          { icon: Heart, label: "Favorites", href: "/tenants/Favorites" },
          {
            icon: FileText,
            label: "Applications",
            href: "/tenants/Applications",
          },
          { icon: Home, label: "Residences", href: "/tenants/Residences" },
          { icon: Settings, label: "Settings", href: "/tenants/Settings" },
        ];

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 bg-white shadow-lg "
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `cal(100vh-${NAVBAR_HEIGHT}px)`,
      }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "flex min-h-[56px] w-full items-center pt-3 mb-3",
                open ? "justify-between px-6" : "justify-center"
              )}
            >
              {open ? (
                <>
                  <h1 className="flex text-xl font-bold text-gray-800">
                    {userType === "manager" ? "Manager View" : "Renter View"}
                  </h1>

                  <button
                    className="hover:bg-gray-100 p-2 rounded-md"
                    onClick={() => toggleSidebar()}
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              ) : (
                <Menu
                  className="hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => toggleSidebar()}
                >
                  <X className="h-6 w-6 text-gray-600" />
                </Menu>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarContent>
          <SidebarMenu>
            {navLink.map((link) => {
              const isActive = pathname === link.href;
              return (
                <SidebarMenuItem key={link.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "flex items-center px-7 py-7",
                      isActive
                        ? "text-gray-100"
                        : "text-gray-600 hover:bg-gray-100",
                      open ? "text-blue-600" : "ml-[5px]"
                    )}
                  >
                    <Link href={link.href} className="w-full " scroll={false}>
                      <div className="flex items-center gap-3">
                        <link.icon
                          className={`h-5 w-5 ${
                            isActive ? "text-blue-600" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`font-medium${
                            isActive ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          {link.label}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </SidebarHeader>
    </Sidebar>
  );
};

export default AppSidebar;
