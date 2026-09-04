"use client";

import { Ellipsis } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TrafficSourceDatum = {
  label: string;
  source: string;
  sourceKey?: string;
  visitors: number;
};

const sourcesData: TrafficSourceDatum[] = [
  { label: "89.4k", sourceKey: "sourceOrganicSearch", source: "Organic Search", visitors: 89_400 },
  { label: "55.2k", sourceKey: "sourceDirect", source: "Direct", visitors: 55_200 },
  { label: "38.1k", sourceKey: "sourceSocial", source: "Social", visitors: 38_100 },
  { label: "30.4k", sourceKey: "sourceReferral", source: "Referral", visitors: 30_400 },
  { label: "22.7k", sourceKey: "sourcePaid", source: "Paid", visitors: 22_700 },
];

const campaignsData: TrafficSourceDatum[] = [
  { label: "16.8k", sourceKey: "campaignSpringLaunch", source: "Spring Launch", visitors: 16_800 },
  { label: "12.0k", sourceKey: "campaignNewsletter", source: "Newsletter", visitors: 12_000 },
  { label: "7.7k", sourceKey: "campaignRetargeting", source: "Retargeting", visitors: 7700 },
  { label: "5.9k", sourceKey: "campaignBrandSearch", source: "Brand Search", visitors: 5900 },
  { label: "4.3k", sourceKey: "campaignPartners", source: "Partners", visitors: 4300 },
];

const referrersData: TrafficSourceDatum[] = [
  { label: "18.4k", sourceKey: "referrerGoogle", source: "Google", visitors: 18_400 },
  { label: "8.9k", sourceKey: "referrerLinkedIn", source: "LinkedIn", visitors: 8900 },
  { label: "5.7k", sourceKey: "referrerProductHunt", source: "Product Hunt", visitors: 5700 },
  { label: "4.8k", sourceKey: "referrerGitHub", source: "GitHub", visitors: 4800 },
  { label: "3.6k", sourceKey: "referrerMedium", source: "Medium", visitors: 3600 },
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

function TrafficSourceBarChart({ data }: { data: TrafficSourceDatum[] }) {
  const t = useTranslations("analytics");
  const locale = useLocale();

  const chartConfig = {
    visitors: {
      color: "var(--chart-1)",
      label: t("chartVisitors"),
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 0,
          right: 48,
        }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <YAxis dataKey="source" hide tickLine={false} tickMargin={10} type="category" />
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
                    {item.payload?.sourceKey ? t(String(item.payload.sourceKey)) : String(item.payload?.source ?? "")}
                  </span>
                </>
              )}
            />
          }
        />
        <Bar barSize={40} dataKey="visitors" fill="var(--color-visitors)" fillOpacity={0.5} radius={8}>
          <LabelList
            className="fill-foreground"
            dataKey={data[0]?.sourceKey ? "sourceKey" : "source"}
            fontSize={14}
            formatter={(value) => (data[0]?.sourceKey ? t(String(value)) : value)}
            offset={12}
            position="insideLeft"
          />
          <LabelList content={renderValueLabel} dataKey="label" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function TopTrafficSources() {
  const t = useTranslations("analytics");

  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">{t("trafficSources")}</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs defaultValue="sources" className="flex flex-col gap-3">
          <TabsList className="w-full justify-start border-b px-2.5" variant="line">
            <TabsTrigger className="flex-none font-normal" value="sources">
              {t("tabSources")}
            </TabsTrigger>
            <TabsTrigger className="flex-none font-normal" value="campaigns">
              {t("tabCampaigns")}
            </TabsTrigger>
            <TabsTrigger className="flex-none font-normal" value="referrers">
              {t("tabReferrers")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="px-4">
            <TrafficSourceBarChart data={sourcesData} />
          </TabsContent>

          <TabsContent value="campaigns" className="px-4">
            <TrafficSourceBarChart data={campaignsData} />
          </TabsContent>
          <TabsContent value="referrers" className="px-4">
            <TrafficSourceBarChart data={referrersData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
