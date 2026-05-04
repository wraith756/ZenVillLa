"use client";

import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

/* ---------------- Types ---------------- */

interface LayoutProps {
  children: ReactNode;
}

/* ---------------- Component ---------------- */

const Layout = ({ children }: LayoutProps) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();

  const router = useRouter();
  const pathname = usePathname();

  /* ---------------- Redirect Logic ---------------- */

  useEffect(() => {
    if (authLoading || !authUser) return;

    const role = authUser.userRole?.toLowerCase();

    // Redirect managers away from public routes
    if (
      role === "manager" &&
      (pathname === "/" || pathname.startsWith("/search"))
    ) {
      router.replace("/managers/properties");
    }
  }, [authUser, authLoading, pathname, router]);

  /* ---------------- Loading State ---------------- */

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-600">
        Loading...
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="h-full w-full">
      <Navbar />

      <main
        className="flex h-full w-full flex-col"
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
