"use client";

import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Funnel, FunnelChart, LabelList } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";

import {
  actionItems,
  regionSalesData,
  resolveChartConfig,
  salesPipelineChartConfig,
  salesPipelineChartData,
} from "./crm.config";

export function OperationalCards() {
  const locale = useLocale();
  const t = useTranslations("crmV1");
  const totalSales = regionSalesData.reduce((sum, region) => sum + region.sales, 0);
  const pipelineConfig = resolveChartConfig(salesPipelineChartConfig, t);
  const pipelineData = salesPipelineChartData.map((row) => ({
    ...row,
    stage: row.labelKey ? t(row.labelKey) : row.stage,
  }));
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{t("salesPipeline")}</CardTitle>
        </CardHeader>
        <CardContent className="size-full">
          <ChartContainer config={pipelineConfig} className="size-full">
            <FunnelChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <Funnel className="stroke-2 stroke-card" dataKey="value" data={pipelineData}>
                <LabelList className="fill-foreground stroke-0" dataKey="stage" position="right" offset={10} />
                <LabelList className="fill-foreground stroke-0" dataKey="value" position="left" offset={10} />
              </Funnel>
            </FunnelChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">{t("leadsIncreased", { percent: 18.2 })}</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("salesByRegion")}</CardTitle>
          <CardDescription className="font-medium tabular-nums">
            {formatCurrency(totalSales, { noDecimals: true }, locale)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {regionSalesData.map((region) => (
              <div key={region.region} className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{t(region.labelKey)}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-sm tabular-nums">
                      {formatCurrency(region.sales, { noDecimals: true }, locale)}
                    </span>
                    <span
                      className={cn(
                        "font-medium text-xs tabular-nums",
                        region.isPositive ? "text-green-500" : "text-destructive",
                      )}
                    >
                      {region.growth}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={region.percentage} />
                  <span className="font-medium text-muted-foreground text-xs tabular-nums">{region.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between gap-1 text-muted-foreground text-xs">
            <span>{t("regionsTracked", { count: regionSalesData.length })}</span>
            <span>•</span>
            <span>{t("regionsGrowing", { count: regionSalesData.filter((r) => r.isPositive).length })}</span>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("actionItems")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {actionItems.map((item) => (
              <li key={item.id} className="space-y-2 rounded-md border px-3 py-2">
                <div className="flex items-center gap-2">
                  <Checkbox defaultChecked={item.checked} />
                  <span className="font-medium text-sm">{t(item.titleKey)}</span>
                  <span
                    className={cn(
                      "w-fit rounded-md px-2 py-1 font-medium text-xs",
                      item.priority === "High" && "bg-destructive/20 text-destructive",
                      item.priority === "Medium" && "bg-yellow-500/20 text-yellow-500",
                      item.priority === "Low" && "bg-green-500/20 text-green-500",
                    )}
                  >
                    {t(item.priorityLabelKey)}
                  </span>
                </div>
                <div className="font-medium text-muted-foreground text-xs">{t(item.descKey)}</div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground text-xs">{t(item.dueLabelKey)}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
