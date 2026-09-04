"use client";

import { Coins } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export function NetWorth() {
  const locale = useLocale();
  const t = useTranslations("financeV1");
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <Coins className="size-5" />
            </span>
            {t("netWorth")}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <p className="font-medium text-xl tabular-nums">{formatCurrency(84250, { noDecimals: true }, locale)}</p>
            <span className="text-xs">
              {t("momChange", { amount: formatCurrency(3_680, { noDecimals: true }, locale) })}
            </span>
          </div>
          <p className="text-muted-foreground text-xs">{t("thisMonth")}</p>
        </div>

        <Separator />

        <p className="text-muted-foreground text-xs">{t("acrossAllLinkedAccounts")}</p>
      </CardContent>
    </Card>
  );
}
