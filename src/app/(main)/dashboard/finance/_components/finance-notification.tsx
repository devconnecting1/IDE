"use client";

import { TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";

export function FinanceNotification() {
  const t = useTranslations("finance");

  return (
    <Item className="rounded-xl" variant="outline">
      <ItemMedia variant="icon">
        <TrendingUp />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{t("creditScoreUpdated")}</ItemTitle>
        <ItemDescription>{t("creditScoreDescription", { points: 14, score: 782 })}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          {t("viewDetails")}
        </Button>
      </ItemActions>
    </Item>
  );
}
