"use client";

import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const expenses = [
  {
    key: "housing",
    labelKey: "categoryHousing",
    amount: 1650,
  },
  {
    key: "utilities",
    labelKey: "categoryUtilities",
    amount: 420,
  },
  {
    key: "groceries",
    labelKey: "categoryGroceries",
    amount: 560,
  },
  {
    key: "transportation",
    labelKey: "categoryTransport",
    amount: 740,
  },
  {
    key: "subscriptions",
    labelKey: "categorySubscriptions",
    amount: 260,
  },
  {
    key: "healthcare",
    labelKey: "categoryHealthcare",
    amount: 390,
  },
  {
    key: "other",
    labelKey: "categoryOther",
    amount: 980,
  },
];

export function SpendingBreakdown() {
  const locale = useLocale();
  const t = useTranslations("financeV1");
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("spendingBreakdown")}</CardTitle>
        <CardDescription>{t("spendingBreakdownDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="font-medium text-2xl">{formatCurrency(total, { noDecimals: true }, locale)}</div>
          <div className="flex h-6 w-full overflow-hidden rounded-md">
            {expenses.map((item, index) => {
              const width = (item.amount / total) * 100;
              const alpha = Math.max(0.35, 1 - index * 0.08);

              return (
                <div
                  key={item.key}
                  className="h-full shrink-0 border-background border-l first:border-l-0"
                  style={{
                    width: `${width}%`,
                    background: `color-mix(in oklch, var(--primary) ${alpha * 100}%, transparent)`,
                  }}
                  title={`${t(item.labelKey)}: ${formatCurrency(item.amount, {}, locale)}`}
                />
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          {expenses.map((item, index) => {
            const pct = Math.round((item.amount / total) * 100);
            const alpha = Math.max(0.35, 1 - index * 0.08);

            return (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-sm"
                    style={{
                      background: `color-mix(in oklch, var(--primary) ${alpha * 100}%, transparent)`,
                    }}
                  />
                  <span className="text-muted-foreground text-sm">{t(item.labelKey)}</span>
                </div>

                <span className="font-medium text-sm tabular-nums">{pct}%</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
