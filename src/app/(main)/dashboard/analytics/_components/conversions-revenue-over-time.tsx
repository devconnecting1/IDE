"use client";

import { Ellipsis } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const revenueData = [
  { date: "2026-07-01", revenue: 4_800 },
  { date: "2026-07-08", revenue: 5_600 },
  { date: "2026-07-15", revenue: 5_200 },
  { date: "2026-07-22", revenue: 6_400 },
  { date: "2026-07-29", revenue: 7_200 },
  { date: "2026-08-05", revenue: 6_800 },
  { date: "2026-08-12", revenue: 7_800 },
  { date: "2026-08-19", revenue: 7_400 },
  { date: "2026-08-26", revenue: 8_200 },
];

export function ConversionsRevenueOverTime() {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const chartConfig = {
    revenue: {
      color: "var(--chart-2)",
      label: t("convRevenueLabel"),
    },
  } satisfies ChartConfig;

  const formattedData = revenueData.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(locale, { day: "2-digit", month: "short" }),
    formattedRevenue: new Intl.NumberFormat(locale, {
      currency: "USD",
      style: "currency",
      maximumFractionDigits: 0,
    }).format(item.revenue),
  }));

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("convRevenueOverTime")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={formattedData} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey="date" tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} tickLine={false} tickMargin={6} width={48} tickFormatter={(v) => `$${v / 1000}k`} />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-medium font-mono text-foreground tabular-nums">
                      {formattedData[0]?.formattedRevenue ? `$${Number(value).toLocaleString(locale)}` : value}
                    </span>
                  )}
                />
              }
            />
            <Area
              dataKey="revenue"
              dot={false}
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
