"use client";

import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const genderData = [
  { genderKey: "genderMale", fill: "var(--chart-1)", visitors: 94_200 },
  { genderKey: "genderFemale", fill: "var(--chart-2)", visitors: 78_600 },
  { genderKey: "genderUnknown", fill: "var(--chart-3)", visitors: 20_300 },
];

export function AudienceGender() {
  const t = useTranslations("analytics");

  const chartConfig = {
    visitors: {
      label: t("chartVisitors"),
    },
    genderMale: {
      color: "var(--chart-1)",
      label: t("genderMale"),
    },
    genderFemale: {
      color: "var(--chart-2)",
      label: t("genderFemale"),
    },
    genderUnknown: {
      color: "var(--chart-3)",
      label: t("genderUnknown"),
    },
  } satisfies ChartConfig;

  const total = genderData.reduce((sum, item) => sum + item.visitors, 0);

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("audienceGender")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <PieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <>
                      <span className="font-medium font-mono text-foreground tabular-nums">
                        {Number(value).toLocaleString()}
                      </span>{" "}
                      <span className="text-muted-foreground">{t(String(name))}</span>
                    </>
                  )}
                />
              }
            />
            <Pie
              data={genderData}
              dataKey="visitors"
              innerRadius={50}
              outerRadius={80}
              nameKey="genderKey"
              strokeWidth={2}
              stroke="var(--background)"
            >
              {genderData.map((entry) => (
                <Cell key={entry.genderKey} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex w-full flex-col gap-2">
          {genderData.map((entry) => (
            <div className="flex items-center justify-between text-sm" key={entry.genderKey}>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="text-muted-foreground">{t(entry.genderKey)}</span>
              </div>
              <span className="tabular-nums">{((entry.visitors / total) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
