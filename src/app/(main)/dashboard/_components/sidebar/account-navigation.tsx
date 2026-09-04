"use client";

import { useEffect, useState } from "react";

import {
  Blocks,
  BookOpen,
  Bot,
  Briefcase,
  Calendar,
  ChevronRight,
  CircleUser,
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

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export interface AccountItem {
  readonly id: string;
  readonly labelKey: string;
  readonly icon: LucideIcon;
  readonly descriptionKey?: string;
}

interface AccountSection extends AccountItem {
  readonly subItems?: readonly AccountItem[];
}

interface AccountCategory {
  readonly id: string;
  readonly labelKey: string;
  readonly sections: readonly AccountSection[];
}

const accountCategories: readonly AccountCategory[] = [
  {
    id: "user",
    labelKey: "categoryUser",
    sections: [
      { id: "profile", labelKey: "profile", icon: CircleUser },
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
    sections: [
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
    sections: [
      { id: "community", labelKey: "community", icon: MessagesSquare },
      { id: "support", labelKey: "support", icon: LifeBuoy },
      { id: "documentation", labelKey: "documentation", icon: BookOpen },
      { id: "logout", labelKey: "logout", icon: LogOut },
    ],
  },
];

export const accountItems: readonly AccountItem[] = accountCategories.flatMap((category) =>
  category.sections.flatMap((section) => (section.subItems ? [section, ...section.subItems] : [section])),
);

export function useActiveSection(): string {
  const [activeId, setActiveId] = useState("profile");

  useEffect(() => {
    function update() {
      const id = window.location.hash.replace(/^#/, "");
      setActiveId(accountItems.some((item) => item.id === id) ? id : "profile");
    }

    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return activeId;
}

function AccountNavLink({ section, isActive }: { readonly section: AccountItem; readonly isActive: boolean }) {
  const t = useTranslations("account");
  const Icon = section.icon;
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={t(section.labelKey)} isActive={isActive}>
        <a href={`#${section.id}`} aria-current={isActive ? "page" : undefined} onClick={() => setOpenMobile(false)}>
          <Icon />
          <span>{t(section.labelKey)}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function AccountNavCollapsible({
  section,
  isActive,
  activeId,
}: {
  readonly section: AccountSection;
  readonly isActive: boolean;
  readonly activeId: string;
}) {
  const t = useTranslations("account");
  const Icon = section.icon;
  const { setOpenMobile } = useSidebar();

  return (
    <Collapsible asChild defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t(section.labelKey)} isActive={isActive}>
            <Icon />
            <span>{t(section.labelKey)}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {section.subItems?.map((subItem) => {
              const SubIcon = subItem.icon;
              const isSubActive = activeId === subItem.id;
              return (
                <SidebarMenuSubItem key={subItem.id}>
                  <SidebarMenuSubButton asChild isActive={isSubActive}>
                    <a
                      href={`#${subItem.id}`}
                      aria-current={isSubActive ? "page" : undefined}
                      onClick={() => setOpenMobile(false)}
                    >
                      {SubIcon && <SubIcon />}
                      <span>{t(subItem.labelKey)}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function AccountNavDropdown({
  section,
  isActive,
  activeId,
}: {
  readonly section: AccountSection;
  readonly isActive: boolean;
  readonly activeId: string;
}) {
  const t = useTranslations("account");
  const Icon = section.icon;
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={t(section.labelKey)} isActive={isActive}>
            <Icon />
            <span>{t(section.labelKey)}</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={12} className="w-48">
          <DropdownMenuGroup>
            {section.subItems?.map((subItem) => {
              const SubIcon = subItem.icon;
              const isSubActive = activeId === subItem.id;
              return (
                <DropdownMenuItem key={subItem.id} asChild>
                  <a
                    href={`#${subItem.id}`}
                    aria-current={isSubActive ? "page" : undefined}
                    className="flex items-center gap-2"
                    onClick={() => setOpenMobile(false)}
                  >
                    {SubIcon && <SubIcon />}
                    <span>{t(subItem.labelKey)}</span>
                  </a>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}

export function AccountNav() {
  const t = useTranslations("account");
  const activeId = useActiveSection();
  const { state, isMobile } = useSidebar();
  const isCollapsedDesktop = state === "collapsed" && !isMobile;

  return (
    <>
      {accountCategories.map((category) => (
        <SidebarGroup key={category.id}>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
            {t(category.labelKey)}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {category.sections.map((section) => {
                const isActive = Boolean(
                  activeId === section.id || section.subItems?.some((subItem) => subItem.id === activeId),
                );
                if (section.subItems) {
                  return isCollapsedDesktop ? (
                    <AccountNavDropdown key={section.id} section={section} isActive={isActive} activeId={activeId} />
                  ) : (
                    <AccountNavCollapsible key={section.id} section={section} isActive={isActive} activeId={activeId} />
                  );
                }

                return <AccountNavLink key={section.id} section={section} isActive={activeId === section.id} />;
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
