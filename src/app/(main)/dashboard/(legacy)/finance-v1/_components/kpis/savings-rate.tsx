"use client";

import { HandCoins } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SavingsRate() {
  const t = useTranslations("financeV1");
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <HandCoins className="size-5" />
            </span>
            {t("savingsRate")}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl tabular-nums">32%</p>
            <span className="text-xs">{t("savingsMomPercentChange")}</span>
          </div>
          <p className="text-muted-foreground text-xs">{t("thisMonthAfterExpenses")}</p>
        </div>

        <Separator />

        <p className="text-muted-foreground text-xs">{t("aboveAverage")}</p>
      </CardContent>
    </Card>
  );
}
