"use client";

import { Ellipsis } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const ageData = [
  { ageKey: "ageGroup18_24", visitors: 38_200 },
  { ageKey: "ageGroup25_34", visitors: 62_400 },
  { ageKey: "ageGroup35_44", visitors: 48_100 },
  { ageKey: "ageGroup45_54", visitors: 29_800 },
  { ageKey: "ageGroup55plus", visitors: 14_600 },
];

function renderValueLabel(props: LabelProps) {
  const { height, value, y } = props;

  return (
    <text
      className="fill-foreground"
      dominantBaseline="middle"
      dx={-6}
      fontSize={14}
      textAnchor="end"
      x="100%"
      y={Number(y) + Number(height) / 2}
    >
      {value}
    </text>
  );
}

export function AudienceDemographics() {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const chartConfig = {
    visitors: {
      color: "var(--chart-1)",
      label: t("chartVisitors"),
    },
  } satisfies ChartConfig;

  const formattedData = ageData.map((item) => ({
    ...item,
    label: item.visitors.toLocaleString(locale),
    visitors: item.visitors,
  }));

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("audienceAgeDistribution")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart accessibilityLayer data={formattedData} layout="vertical" margin={{ left: 0, right: 48 }}>
            <CartesianGrid horizontal={false} vertical={false} />
            <YAxis dataKey="ageKey" hide tickLine={false} tickMargin={10} type="category" />
            <XAxis dataKey="visitors" hide type="number" />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  indicator="line"
                  formatter={(value, _name, item) => (
                    <>
                      <span className="font-medium font-mono text-foreground tabular-nums">
                        {Number(value).toLocaleString(locale)}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {item.payload?.ageKey ? t(String(item.payload.ageKey)) : ""}
                      </span>
                    </>
                  )}
                />
              }
            />
            <Bar barSize={40} dataKey="visitors" fill="var(--color-visitors)" fillOpacity={0.5} radius={8}>
              <LabelList
                className="fill-foreground"
                dataKey="ageKey"
                fontSize={14}
                formatter={(value) => t(String(value))}
                offset={12}
                position="insideLeft"
              />
              <LabelList content={renderValueLabel} dataKey="label" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
