"use client";

import { format, subMonths } from "date-fns";
import { enUS, type Locale, ptBR } from "date-fns/locale";
import { BadgeDollarSign, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

import {
  leadsChartConfig,
  leadsChartData,
  proposalsChartConfig,
  proposalsChartData,
  resolveChartConfig,
  revenueChartConfig,
  revenueChartData,
} from "./crm.config";

const dateFnsLocales: Record<string, Locale> = { "pt-BR": ptBR, en: enUS };

export function OverviewCards() {
  const locale = useLocale();
  const t = useTranslations("crmV1");
  const dateFnsLocale = dateFnsLocales[locale] ?? enUS;
  const lastMonth = format(subMonths(new Date(), 1), "LLLL", { locale: dateFnsLocale });
  const leadsConfig = resolveChartConfig(leadsChartConfig, t);
  const proposalsConfig = resolveChartConfig(proposalsChartConfig, t);
  const revenueConfig = resolveChartConfig(revenueChartConfig, t);

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("newLeads")}</CardTitle>
          <CardDescription>{t("lastMonth")}</CardDescription>
        </CardHeader>
        <CardContent className="size-full">
          <ChartContainer className="size-full min-h-24" config={leadsConfig}>
            <BarChart accessibilityLayer data={leadsChartData} barSize={8}>
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => `${lastMonth}: ${label}`} />} />
              <Bar
                background={{ fill: "var(--color-background)", radius: 4, opacity: 0.07 }}
                dataKey="newLeads"
                stackId="a"
                fill="var(--color-newLeads)"
                radius={[0, 0, 0, 0]}
              />
              <Bar dataKey="disqualified" stackId="a" fill="var(--color-disqualified)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="font-semibold text-xl tabular-nums">635</span>
          <span className="font-medium text-green-500 text-sm">+54.6%</span>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden pb-0">
        <CardHeader>
          <CardTitle>{t("proposalsSent")}</CardTitle>
          <CardDescription>{t("lastMonth")}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ChartContainer className="size-full min-h-24" config={proposalsConfig}>
            <AreaChart
              data={proposalsChartData}
              margin={{
                left: 0,
                right: 0,
                top: 5,
              }}
            >
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip
                content={<ChartTooltipContent labelFormatter={(label) => `${lastMonth}: ${label}`} hideIndicator />}
              />
              <Area
                dataKey="proposalsSent"
                fill="var(--color-proposalsSent)"
                fillOpacity={0.05}
                stroke="var(--color-proposalsSent)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="w-fit rounded-lg bg-green-500/10 p-2">
            <Wallet className="size-5 text-green-500" />
          </div>
        </CardHeader>
        <CardContent className="flex size-full flex-col justify-between">
          <div className="space-y-1.5">
            <CardTitle>{t("revenue")}</CardTitle>
            <CardDescription>{t("last6Months")}</CardDescription>
          </div>
          <p className="font-medium text-2xl tabular-nums">{formatCurrency(56_650, {}, locale)}</p>
          <div className="w-fit rounded-md bg-green-500/10 px-2 py-1 font-medium text-green-500 text-xs">+22.2%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="w-fit rounded-lg bg-destructive/10 p-2">
            <BadgeDollarSign className="size-5 text-destructive" />
          </div>
        </CardHeader>
        <CardContent className="flex size-full flex-col justify-between">
          <div className="space-y-1.5">
            <CardTitle>{t("projectsWon")}</CardTitle>
            <CardDescription>{t("last6Months")}</CardDescription>
          </div>
          <p className="font-medium text-2xl tabular-nums">136</p>
          <div className="w-fit rounded-md bg-destructive/10 px-2 py-1 font-medium text-destructive text-xs">-2.5%</div>
        </CardContent>
      </Card>

      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>{t("revenueGrowth")}</CardTitle>
          <CardDescription>{t("ytd")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="h-24 w-full">
            <LineChart
              data={revenueChartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => format(new Date(String(label)), "MMM yyyy", { locale: dateFnsLocale })}
                  />
                }
              />
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="revenue"
                stroke="var(--color-revenue)"
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">{t("growthSinceLastYear", { percent: 35 })}</p>
        </CardFooter>
      </Card>
    </div>
  );
}
