"use client";

import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export function IncomeReliability() {
  const locale = useLocale();
  const t = useTranslations("financeV1");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("incomeReliability")}</CardTitle>
        <CardDescription>{t("incomeReliabilityDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="space-y-0.5">
          <p className="font-medium text-xl">{t("highReliability")}</p>
          <p className="text-muted-foreground text-xs">{t("basedOnLast6Months")}</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="space-y-0.5">
            <p className="font-medium text-lg">{t("fixedIncome")}</p>
            <p className="text-muted-foreground text-xs">{t("recurringPredictable")}</p>
          </div>
          <p className="font-medium text-lg">{formatCurrency(90000, { noDecimals: true }, locale)}</p>
        </div>
        <Separator />
        <div className="flex justify-between">
          <div className="space-y-0.5">
            <p className="font-medium text-lg">{t("variableIncome")}</p>
            <p className="text-muted-foreground text-xs">{t("fluctuatingSources")}</p>
          </div>
          <p className="font-medium text-lg">{formatCurrency(46500, { noDecimals: true }, locale)}</p>
        </div>
        <Separator />
        <p className="text-muted-foreground text-xs">{t("consistencyTrend", { value: t("stable") })}</p>
      </CardContent>
    </Card>
  );
}
