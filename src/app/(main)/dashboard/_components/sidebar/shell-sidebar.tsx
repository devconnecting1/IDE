"use client";

import { usePathname } from "next/navigation";

import type { Sidebar } from "@/components/ui/sidebar";

import { AccountSidebar } from "./account-sidebar";
import { AppSidebar } from "./app-sidebar";

export function ShellSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard/account")) {
    return <AccountSidebar {...props} />;
  }

  return <AppSidebar {...props} />;
}
