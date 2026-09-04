import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const NEXT_INTERVENTIONS = [
  {
    dealId: "OPP-489",
    priority: "Escalate",
    owner: "Leila Zhang",
    risk: 81,
    recommendationKey: "actionJoinCall",
  },
  {
    dealId: "OPP-475",
    priority: "Coach",
    owner: "Omar Ali",
    risk: 76,
    recommendationKey: "actionReviewStrategy",
  },
  {
    dealId: "OPP-447",
    priority: "Coach",
    owner: "Sofia Bautista",
    risk: 75,
    recommendationKey: "actionReviewStrategy",
  },
] as const;

const priorityLabelKey: Record<"Escalate" | "Coach" | "Reforecast", string> = {
  Escalate: "priorityEscalate",
  Coach: "priorityCoach",
  Reforecast: "priorityReforecast",
};

export async function ActionsManagerQueue() {
  const t = await getTranslations("analyticsV1");
  const locale = await getLocale();

  return (
    <Card className="h-full shadow-xs">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex h-full flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <StatCard label={t("statActionableDeals")} value="7" />
            <StatCard
              label={t("statRevenueInPlay")}
              value={formatCurrency(811000, { noDecimals: true }, locale)}
              mono
            />
            <StatCard label={t("statOwnersEngaged")} value="3" />
            <StatCard label={t("statMedianRisk")} value="72" mono />
          </div>

          <div className="space-y-2 rounded-md border bg-muted/20 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">{t("interventionMix")}</p>
              <Badge variant="outline" className="h-5 px-2 text-[11px] tabular-nums">
                {t("priorityEscalate")} {formatCurrency(174000, { noDecimals: true }, locale)}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">{t("priorityEscalate")}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {t("dealsPercentValue", {
                    count: 1,
                    percent: 14,
                    value: formatCurrency(174000, { noDecimals: true }, locale),
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">{t("priorityCoach")}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {t("dealsPercentValue", {
                    count: 4,
                    percent: 57,
                    value: formatCurrency(478000, { noDecimals: true }, locale),
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-md border bg-background/70 px-2.5 py-1.5">
                <span className="text-xs">{t("priorityReforecast")}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {t("dealsPercentValue", {
                    count: 2,
                    percent: 29,
                    value: formatCurrency(159000, { noDecimals: true }, locale),
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-md border bg-muted/20 px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs">{t("managerFocus")}</p>
              <span className="text-muted-foreground text-xs tabular-nums">{t("thisForecastCycle")}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2 rounded-md border bg-background/70 px-2.5 py-1.5">
                <span>{t("coachQueue")}</span>
                <span className="text-muted-foreground tabular-nums">
                  {t("dealsValue", { count: 4, value: formatCurrency(478000, { noDecimals: true }, locale) })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-md border bg-background/70 px-2.5 py-1.5">
                <span>{t("primaryOwner")}</span>
                <span className="text-muted-foreground tabular-nums">
                  {t("ownerDeals", { owner: "Leila Zhang", count: 3 })}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-md border bg-background/70 px-2.5 py-1.5">
                <span>{t("stalePipeline")}</span>
                <span className="text-muted-foreground tabular-nums">
                  {t("dealsValue", { count: 8, value: formatCurrency(1151000, { noDecimals: true }, locale) })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-muted-foreground text-xs">{t("nextInterventions")}</p>

            {NEXT_INTERVENTIONS.map((item) => (
              <div key={`${item.priority}-${item.dealId}`} className="space-y-1 rounded-md border px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">{item.dealId}</span>
                  <Badge variant="outline" className="h-5 px-2 text-[11px]">
                    {t(priorityLabelKey[item.priority])}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  {item.owner} · {t("riskSuffix", { risk: item.risk })}
                </p>
                <p className="text-xs">{t(item.recommendationKey)}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-2 rounded-md border bg-muted/20 px-3 py-2">
            <span className="text-muted-foreground text-xs">{t("noActionMonitor")}</span>
            <span className="font-medium text-xs tabular-nums">{t("dealsCount", { count: 3 })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border bg-muted/20 px-2.5 py-2">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className={mono ? "font-semibold text-base tabular-nums" : "font-semibold text-base"}>{value}</p>
    </div>
  );
}
