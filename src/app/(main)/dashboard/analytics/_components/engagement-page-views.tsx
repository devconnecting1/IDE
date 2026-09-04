"use client";

import { Ellipsis } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const pageViewData = [
  { date: "2026-07-01", views: 14_200 },
  { date: "2026-07-08", views: 16_800 },
  { date: "2026-07-15", views: 15_400 },
  { date: "2026-07-22", views: 18_200 },
  { date: "2026-07-29", views: 19_600 },
  { date: "2026-08-05", views: 17_800 },
  { date: "2026-08-12", views: 21_400 },
  { date: "2026-08-19", views: 20_200 },
  { date: "2026-08-26", views: 22_800 },
];

export function EngagementPageViews() {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const chartConfig = {
    views: {
      color: "var(--chart-1)",
      label: t("engViews"),
    },
  } satisfies ChartConfig;

  const formattedData = pageViewData.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(locale, { day: "2-digit", month: "short" }),
  }));

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("engPageViewsOverTime")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={formattedData} margin={{ bottom: 0, left: 0, right: 0, top: 8 }}>
            <defs>
              <linearGradient id="fillViews" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.28} />
                <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey="date" tickLine={false} tickMargin={10} />
            <YAxis axisLine={false} domain={[0, 25_000]} tickLine={false} tickMargin={6} width={40} />
            <ChartTooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
              content={<ChartTooltipContent />}
            />
            <Area
              dataKey="views"
              dot={false}
              fill="url(#fillViews)"
              stroke="var(--color-views)"
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
