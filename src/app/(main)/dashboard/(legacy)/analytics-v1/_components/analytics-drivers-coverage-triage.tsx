import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export async function DriversCoverageTriage() {
  const t = await getTranslations("analyticsV1");
  const locale = await getLocale();
  const cycleDaysLabel = t("cycleDays", { value: "-4" });

  const leverOptions = [
    {
      key: "deal",
      label: t("leverDeal"),
      value: t("weightedValue", { value: formatCurrency(72_133, { noDecimals: true }, locale) }),
      context: t("percentOfGap", { percent: "32%" }),
    },
    {
      key: "conversion",
      label: t("leverConversion"),
      value: t("monthlyValue", { value: formatCurrency(49_182, { noDecimals: true }, locale) }),
      context: t("percentOfGap", { percent: "22%" }),
    },
    {
      key: "cycle",
      label: t("leverCycle"),
      value: t("dailyValue", { value: formatCurrency(90_167, { noDecimals: true }, locale) }),
      context: t("percentOfGap", { percent: "40%" }),
    },
  ] as const;

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>{t("titleCoverage")}</CardTitle>
        <CardDescription>{t("descriptionCoverage")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="destructive" className="rounded-md font-medium">
            {t("atRisk")}
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            1.9x / 3.0x
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            {t("gapValue", { value: formatCurrency(222_930, { noDecimals: true }, locale) })}
          </Badge>
          <Badge variant="outline" className="font-medium tabular-nums">
            {t("dealsEta", { count: 4, days: 10 })}
          </Badge>
        </div>

        <p className="text-muted-foreground text-xs">{t("coverageBelowTarget")}</p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {leverOptions.map((lever) => (
            <div key={lever.key} className="space-y-1 rounded-md border bg-muted/20 px-2.5 py-2">
              <p className="text-muted-foreground text-xs">{lever.label}</p>
              <p className="font-semibold text-sm tabular-nums">{lever.value}</p>
              <p className="text-muted-foreground text-xs">{lever.context}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/20 px-3 py-2">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-muted-foreground">
              {t("ownerPrefix")} <span className="font-medium text-foreground">Leila Zhang</span>
            </span>
            <span className="text-muted-foreground">
              {t("focusPrefix")} <span className="text-foreground">{t("focusValue")}</span>
            </span>
            <span className="text-muted-foreground">
              {t("duePrefix")} <span className="text-foreground">{t("dueValue")}</span>
            </span>
          </div>
          <Button variant="secondary" size="sm" className="h-7 px-3 text-xs">
            {t("openTop5Deals")}
          </Button>
        </div>

        <div className="space-y-1 rounded-md border border-dashed bg-muted/10 px-3 py-2.5">
          <p className="text-muted-foreground text-xs">{t("fastestPath", { lever: cycleDaysLabel, percent: "40%" })}</p>
          <p className="text-muted-foreground text-xs">{t("prioritySequence", { driver: t("cycleTime") })}</p>
        </div>
      </CardContent>
    </Card>
  );
}
