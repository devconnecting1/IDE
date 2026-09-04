"use client";

import { Ellipsis } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const channelData = [
  { channel: "sourceOrganicSearch", visitors: 89_400, conversions: 2_680 },
  { channel: "sourceDirect", visitors: 55_200, conversions: 1_930 },
  { channel: "sourceSocial", visitors: 38_100, conversions: 760 },
  { channel: "sourceReferral", visitors: 30_400, conversions: 1_220 },
  { channel: "sourcePaid", visitors: 22_700, conversions: 1_140 },
  { channel: "channelEmail", visitors: 18_200, conversions: 910 },
  { channel: "channelAffiliates", visitors: 8_400, conversions: 420 },
];

export function AcquisitionChannelPerformance() {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const chartConfig = {
    visitors: {
      color: "var(--chart-1)",
      label: t("acqVisitors"),
    },
    conversions: {
      color: "var(--chart-2)",
      label: t("acqConversions"),
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("acqChannelPerformance")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={channelData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="channel"
              tickFormatter={(value) => t(String(value))}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={6} width={48} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => t(String(label))}
                  formatter={(value, name) => (
                    <>
                      <span className="font-medium font-mono text-foreground tabular-nums">
                        {Number(value).toLocaleString(locale)}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {name === "visitors" ? t("acqVisitors") : t("acqConversions")}
                      </span>
                    </>
                  )}
                />
              }
            />
            <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="conversions" fill="var(--color-conversions)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
