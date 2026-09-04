"use client";

import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const deviceData = [
  { deviceKey: "deviceDesktop", visitors: 89_400 },
  { deviceKey: "deviceMobile", visitors: 72_100 },
  { deviceKey: "deviceTablet", visitors: 31_600 },
];

export function AudienceDevices() {
  const t = useTranslations("analytics");

  const chartConfig = {
    visitors: {
      color: "var(--chart-2)",
      label: t("chartVisitors"),
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("audienceDevices")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={deviceData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="deviceKey"
              tickFormatter={(value) => t(String(value))}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={6} width={40} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (
                    <span className="font-medium font-mono text-foreground tabular-nums">
                      {Number(value).toLocaleString()}
                    </span>
                  )}
                />
              }
            />
            <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
