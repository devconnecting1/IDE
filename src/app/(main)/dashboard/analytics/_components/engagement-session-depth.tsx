"use client";

import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const depthData = [
  { depthKey: "engDepth1Page", sessions: 42_400 },
  { depthKey: "engDepth2to3", sessions: 68_200 },
  { depthKey: "engDepth4to6", sessions: 52_800 },
  { depthKey: "engDepth7plus", sessions: 34_600 },
];

export function EngagementSessionDepth() {
  const t = useTranslations("analytics");

  const chartConfig = {
    sessions: {
      color: "var(--chart-2)",
      label: t("acqSessions"),
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("engSessionDepth")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={depthData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="depthKey"
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
            <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
