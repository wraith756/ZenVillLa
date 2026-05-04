"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  /* ---------------- Redirect Logic ---------------- */

  useEffect(() => {
    if (!authUser || isLoading) return;

    const role = authUser.userRole?.toLowerCase();

    if (role === "manager" && pathname.startsWith("/tenants")) {
      router.replace("/managers/properties");
    }

    if (role === "tenant" && pathname.startsWith("/managers")) {
      router.replace("/tenants/favorites");
    }
  }, [authUser, isLoading, pathname, router]);

  /* ---------------- Loading ---------------- */

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (!authUser?.userRole) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Unauthorized
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />

        <main className="flex" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <Sidebar userType={authUser.userRole.toLowerCase()} />

          <section className="flex-grow transition-all duration-300">
            {children}
          </section>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
