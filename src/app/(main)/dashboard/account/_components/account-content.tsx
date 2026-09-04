"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";

import { accountItems, useActiveSection } from "../../_components/sidebar/account-navigation";
import { AppsSettings } from "./apps-settings";
import { CommunitySettings } from "./community-settings";
import { ExperienceSettings } from "./experience-settings";
import { GeneralSettings } from "./general-settings";
import { LayoutSettings } from "./layout-settings";
import { MembersSettings } from "./members-settings";
import { ProfileSettings } from "./profile-settings";

export function AccountContent({ activeId, dense = false }: { readonly activeId?: string; readonly dense?: boolean }) {
  const t = useTranslations("account");
  const hashActiveId = useActiveSection();
  const resolvedId = activeId ?? hashActiveId;
  const active = accountItems.find((item) => item.id === resolvedId) ?? accountItems[0];
  const ActiveIcon = active.icon;
  const wrapper = dense ? "flex min-h-0 flex-1 flex-col" : "flex min-h-0 flex-1 flex-col px-4 md:px-6";

  let content: React.ReactNode;
  switch (active.id) {
    case "profile":
      content = <ProfileSettings />;
      break;
    case "experience":
      content = <ExperienceSettings />;
      break;
    case "general":
      content = <GeneralSettings />;
      break;
    case "members":
      content = <MembersSettings />;
      break;
    case "apps":
      content = <AppsSettings />;
      break;
    case "community":
      content = <CommunitySettings />;
      break;
    case "layout":
      content = <LayoutSettings />;
      break;
    default:
      content = (
        <Empty className="rounded-xl border">
          <EmptyMedia variant="icon">
            <ActiveIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyHeader>
            <h2 className="font-semibold text-lg">{t(active.labelKey)}</h2>
            {active.descriptionKey && <p className="text-muted-foreground text-sm">{t(active.descriptionKey)}</p>}
            <Badge className="border-primary/20 text-primary" variant="outline">
              {t("inDevelopmentTitle")}
            </Badge>
          </EmptyHeader>
          <EmptyContent>
            <EmptyDescription>{t("inDevelopmentDescription")}</EmptyDescription>
          </EmptyContent>
        </Empty>
      );
  }

  return <div className={wrapper}>{content}</div>;
}
