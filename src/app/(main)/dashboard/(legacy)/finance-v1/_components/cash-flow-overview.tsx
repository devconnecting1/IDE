"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const monthValues = [
  { income: 5900, expenses: -4200 },
  { income: 3800, expenses: -6100 },
  { income: 5200, expenses: -5600 },
  { income: 7100, expenses: -3200 },
  { income: 4500, expenses: -4400 },
  { income: 6100, expenses: -3600 },
  { income: 3300, expenses: -5200 },
  { income: 4300, expenses: -4000 },
  { income: 7200, expenses: -5800 },
  { income: 5600, expenses: -4600 },
  { income: 3600, expenses: -6400 },
  { income: 4700, expenses: -3400 },
];

export function CashFlowOverview() {
  const locale = useLocale();
  const t = useTranslations("financeV1");
  const chartData = monthValues.map((values, index) => ({
    month: new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(2026, index, 1)),
    ...values,
  }));
  const chartConfig = {
    income: {
      label: t("chartIncome"),
      color: "var(--chart-1)",
    },
    expenses: {
      label: t("chartExpenses"),
      color: "var(--chart-2)",
    },
  } as ChartConfig;
  const totalIncome = chartData.reduce((acc, item) => acc + item.income, 0);
  const totalExpenses = chartData.reduce((acc, item) => acc + Math.abs(item.expenses), 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("cashFlowOverview")}</CardTitle>
        <CardDescription>{t("cashFlowOverviewDescription")}</CardDescription>
        <CardAction>
          <Select defaultValue="this-year">
            <SelectTrigger size="sm" className="w-37">
              <SelectValue placeholder={t("selectPeriod")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="this-month">{t("periodThisMonth")}</SelectItem>
                <SelectItem value="last-6-months">{t("periodLast6Months")}</SelectItem>
                <SelectItem value="ytd">{t("periodYearToDate")}</SelectItem>
                <SelectItem value="this-year">{t("periodThisYear")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className="flex items-start justify-between gap-2 py-5 md:items-stretch md:gap-0">
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-chart-1">
              <ArrowDownLeft className="size-6 stroke-background" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">{t("chartIncome")}</p>
              <p className="font-medium tabular-nums">{formatCurrency(totalIncome, { noDecimals: true }, locale)}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-auto! self-stretch" />
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-chart-2">
              <ArrowUpRight className="size-6 stroke-background" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">{t("chartExpenses")}</p>
              <p className="font-medium tabular-nums">{formatCurrency(totalExpenses, { noDecimals: true }, locale)}</p>
            </div>
          </div>
        </div>
        <Separator />
        <ChartContainer className="max-h-72 w-full" config={chartConfig}>
          <BarChart
            stackOffset="sign"
            margin={{ left: -25, right: 0, top: 25, bottom: 0 }}
            accessibilityLayer
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const abs = Math.abs(value);
                const formatted = abs >= 1000 ? `${abs / 1000}k` : `${abs}`;
                return value < 0 ? `-${formatted}` : formatted;
              }}
              ticks={[-8000, -4000, 0, 4000, 8000]}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ReferenceLine y={0} stroke="var(--border)" />
            <Bar dataKey="income" stackId="a" fill={chartConfig.income.color} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" stackId="a" fill={chartConfig.expenses.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
