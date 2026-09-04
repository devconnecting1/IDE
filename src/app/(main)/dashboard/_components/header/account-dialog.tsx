"use client";

import Link from "next/link";

import { BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function AccountDialog() {
  const t = useTranslations("shell");

  return (
    <DropdownMenuItem asChild>
      <Link href="/dashboard/account">
        <BadgeCheck />
        {t("account")}
      </Link>
    </DropdownMenuItem>
  );
}
