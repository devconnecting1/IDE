"use client";

import { useState } from "react";

import { Bot, Kanban, type LucideIcon, MessagesSquare, Network } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

interface EarlyAccessFeature {
  readonly id: string;
  readonly nameKey: string;
  readonly descriptionKey: string;
  readonly icon: LucideIcon;
  readonly enabled: boolean;
}

const features: readonly EarlyAccessFeature[] = [
  {
    id: "junction",
    nameKey: "featureJunctionRelations",
    descriptionKey: "featureJunctionRelationsDescription",
    icon: Network,
    enabled: true,
  },
  {
    id: "ai",
    nameKey: "featureAiAssist",
    descriptionKey: "featureAiAssistDescription",
    icon: Bot,
    enabled: false,
  },
  {
    id: "kanban",
    nameKey: "featureKanbanCharts",
    descriptionKey: "featureKanbanChartsDescription",
    icon: Kanban,
    enabled: true,
  },
];

export function CommunitySettings() {
  const t = useTranslations("account");
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(
    new Set(features.filter((feature) => feature.enabled).map((feature) => feature.id)),
  );
  const [isDirty, setIsDirty] = useState(false);

  function toggleFeature(id: string) {
    setIsDirty(true);
    setEnabledFeatures((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("earlyAccess")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("earlyAccessDescription")}</p>
        </CardContent>
        {features.map((feature) => {
          const Icon = feature.icon;
          const isEnabled = enabledFeatures.has(feature.id);
          return (
            <CardContent key={feature.id}>
              <Field orientation="responsive">
                <FieldContent>
                  <FieldLabel>{t(feature.nameKey)}</FieldLabel>
                  <FieldDescription>{t(feature.descriptionKey)}</FieldDescription>
                </FieldContent>
                <div className="flex items-center gap-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                    aria-label={t(feature.nameKey)}
                  />
                </div>
              </Field>
            </CardContent>
          );
        })}
      </Card>

      <Card>
        <CardContent>
          <h3 className="font-medium text-base">{t("feedback")}</h3>
          <p className="mt-1 text-muted-foreground text-sm">{t("feedbackDescription")}</p>
        </CardContent>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <MessagesSquare aria-hidden="true" className="size-4" />
            </span>
            <Button size="sm" variant="outline">
              {t("joinCommunity")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
