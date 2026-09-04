"use client";

import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const funnelData = [
  { stepKey: "stepVisitors", count: 213_100 },
  { stepKey: "stepProductViews", count: 142_800 },
  { stepKey: "stepAddToCart", count: 48_600 },
  { stepKey: "stepCheckout", count: 22_400 },
  { stepKey: "stepPurchase", count: 8_420 },
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
      {Number(value).toLocaleString()}
    </text>
  );
}

export function ConversionsFunnel() {
  const t = useTranslations("analytics");

  const chartConfig = {
    count: {
      color: "var(--chart-1)",
      label: t("convConversions"),
    },
  } satisfies ChartConfig;

  const maxCount = funnelData[0].count;

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("convFunnel")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-4">
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart accessibilityLayer data={funnelData} layout="vertical" margin={{ left: 0, right: 48 }}>
            <CartesianGrid horizontal={false} vertical={false} />
            <YAxis dataKey="stepKey" hide tickLine={false} tickMargin={10} type="category" />
            <XAxis dataKey="count" hide type="number" domain={[0, maxCount]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  indicator="line"
                  formatter={(value, _name, item) => (
                    <>
                      <span className="font-medium font-mono text-foreground tabular-nums">
                        {Number(value).toLocaleString()}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {item.payload?.stepKey ? t(String(item.payload.stepKey)) : ""}
                      </span>
                    </>
                  )}
                />
              }
            />
            <Bar barSize={40} dataKey="count" fill="var(--color-count)" fillOpacity={0.5} radius={8}>
              <LabelList
                className="fill-foreground"
                dataKey="stepKey"
                fontSize={14}
                formatter={(value) => t(String(value))}
                offset={12}
                position="insideLeft"
              />
              <LabelList content={renderValueLabel} dataKey="count" />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
