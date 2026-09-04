"use client";

import { useState } from "react";

import Link from "next/link";

import {
  BadgeCheck,
  Blocks,
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  CreditCard,
  Database,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  type LucideIcon,
  Mail,
  MessagesSquare,
  Plug,
  Settings,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { AccountContent } from "../../account/_components/account-content";

interface AccountNavItem {
  readonly id: string;
  readonly labelKey: string;
  readonly icon: LucideIcon;
  readonly descriptionKey?: string;
  readonly subItems?: readonly AccountNavItem[];
}

interface AccountNavCategory {
  readonly id: string;
  readonly labelKey: string;
  readonly items: readonly AccountNavItem[];
}

const NAV_CATEGORIES: readonly AccountNavCategory[] = [
  {
    id: "user",
    labelKey: "categoryUser",
    items: [
      { id: "experience", labelKey: "experience", icon: Briefcase },
      {
        id: "accounts",
        labelKey: "accounts",
        descriptionKey: "accountsDescription",
        icon: Mail,
        subItems: [
          { id: "emails", labelKey: "emails", icon: Mail },
          { id: "calendars", labelKey: "calendars", icon: Calendar },
        ],
      },
    ],
  },
  {
    id: "workspace",
    labelKey: "categoryWorkspace",
    items: [
      { id: "general", labelKey: "general", icon: Settings },
      { id: "data-model", labelKey: "dataModel", icon: Database },
      { id: "layout", labelKey: "layout", icon: LayoutGrid },
      { id: "members", labelKey: "members", icon: Users },
      { id: "billing", labelKey: "billing", icon: CreditCard },
      { id: "mcp-apis", labelKey: "mcpApis", icon: Plug },
      { id: "apps", labelKey: "apps", icon: Blocks },
      { id: "ai", labelKey: "ai", icon: Bot },
    ],
  },
  {
    id: "other",
    labelKey: "categoryOther",
    items: [
      { id: "community", labelKey: "community", icon: MessagesSquare },
      { id: "support", labelKey: "support", icon: LifeBuoy },
      { id: "documentation", labelKey: "documentation", icon: BookOpen },
      { id: "logout", labelKey: "logout", icon: LogOut },
    ],
  },
];

export function AccountDialog() {
  const t = useTranslations("shell");
  const tAccount = useTranslations("account");
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState("profile");

  if (isMobile) {
    return (
      <DropdownMenuItem asChild>
        <Link href="/dashboard/account">
          <BadgeCheck />
          {t("account")}
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <BadgeCheck />
          {t("account")}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="!gap-0 !p-0 sm:max-w-5xl">
        <div className="flex max-h-[85vh] flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <nav className="w-48 shrink-0 overflow-y-auto border-r py-2">
              <button
                type="button"
                onClick={() => setActiveSection("profile")}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-4 py-1.5 text-sm transition-colors",
                  activeSection === "profile"
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <BadgeCheck className="size-4 shrink-0" />
                <span className="truncate">{t("account")}</span>
              </button>
              <div className="mx-2 my-1.5 border-t" />
              {NAV_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <p className="px-4 py-1.5 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    {tAccount(category.labelKey)}
                  </p>
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    const hasSubItems = Boolean(item.subItems?.length);
                    return (
                      <div key={item.id}>
                        <button
                          type="button"
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-4 py-1.5 text-sm transition-colors",
                            isActive
                              ? "bg-accent font-medium text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                          )}
                        >
                          <Icon className="size-4 shrink-0" />
                          <span className="truncate">{tAccount(item.labelKey)}</span>
                        </button>
                        {hasSubItems &&
                          item.subItems?.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = activeSection === subItem.id;
                            return (
                              <button
                                key={subItem.id}
                                type="button"
                                onClick={() => setActiveSection(subItem.id)}
                                className={cn(
                                  "flex w-full items-center gap-2 rounded-md py-1.5 pr-4 pl-10 text-sm transition-colors",
                                  isSubActive
                                    ? "bg-accent font-medium text-accent-foreground"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                                )}
                              >
                                <SubIcon className="size-4 shrink-0" />
                                <span className="truncate">{tAccount(subItem.labelKey)}</span>
                              </button>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </nav>
            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              <AccountContent activeId={activeSection} dense />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
