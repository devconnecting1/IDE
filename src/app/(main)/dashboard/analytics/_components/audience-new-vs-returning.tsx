"use client";

import { Ellipsis } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const visitorData = [
  { date: "2026-07-01", newVisitors: 1_820, returningVisitors: 1_240 },
  { date: "2026-07-08", newVisitors: 2_100, returningVisitors: 1_380 },
  { date: "2026-07-15", newVisitors: 1_960, returningVisitors: 1_520 },
  { date: "2026-07-22", newVisitors: 2_340, returningVisitors: 1_680 },
  { date: "2026-07-29", newVisitors: 2_520, returningVisitors: 1_840 },
  { date: "2026-08-05", newVisitors: 2_280, returningVisitors: 1_960 },
  { date: "2026-08-12", newVisitors: 2_680, returningVisitors: 2_120 },
  { date: "2026-08-19", newVisitors: 2_440, returningVisitors: 2_280 },
  { date: "2026-08-26", newVisitors: 2_860, returningVisitors: 2_440 },
];

export function AudienceNewVsReturning() {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const chartConfig = {
    newVisitors: {
      color: "var(--chart-1)",
      label: t("newVisitors"),
    },
    returningVisitors: {
      color: "var(--chart-3)",
      label: t("returningVisitors"),
    },
  } satisfies ChartConfig;

  const formattedData = visitorData.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(locale, { day: "2-digit", month: "short" }),
  }));

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("audienceNewVsReturning")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={formattedData} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="fillNew" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-newVisitors)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-newVisitors)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillReturning" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-returningVisitors)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-returningVisitors)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey="date" tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} domain={[0, 3_200]} tickLine={false} tickMargin={6} width={40} />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
              content={<ChartTooltipContent />}
            />
            <Area
              dataKey="newVisitors"
              dot={false}
              fill="url(#fillNew)"
              stroke="var(--color-newVisitors)"
              strokeWidth={2}
              type="monotone"
            />
            <Area
              dataKey="returningVisitors"
              dot={false}
              fill="url(#fillReturning)"
              stroke="var(--color-returningVisitors)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
